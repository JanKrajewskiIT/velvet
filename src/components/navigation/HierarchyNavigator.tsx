import { createEffect, createSignal, For, Index, type JSX, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './HierarchyNavigator.module.css';

export interface HierarchyNode {
  id: string;
  label: JSX.Element;
  description?: JSX.Element;
  icon?: string;
  children?: HierarchyNode[];
}

export interface HierarchyNavigatorLabels {
  /** Back button name. */
  back: string;
  /** Path landmark name. */
  path: string;
}

export interface HierarchyNavigatorProps {
  data: HierarchyNode[];
  /** Selected leaf id */
  value?: string | null;
  onSelect?: (id: string, node: HierarchyNode, path: HierarchyNode[]) => void;
  /** @default localized "All" */
  rootLabel?: string;
  labels?: Partial<HierarchyNavigatorLabels>;
  class?: string;
}

const hasChildren = (node: HierarchyNode): node is HierarchyNode & { children: HierarchyNode[] } =>
  (node.children?.length ?? 0) > 0;

/**
 * Drill-down picker for deep taxonomies (category → subcategory → item) in a narrow space — one level at a time, path crumbs on top,
 * → / ← (or Backspace) drill in / out. Leaves select. Use TreeView when users need to see several levels at once.
 */
export const HierarchyNavigator = (props: HierarchyNavigatorProps) => {
  const translate = useTranslate();
  const labels = (): HierarchyNavigatorLabels => ({
    back: props.labels?.back ?? translate('velvet.common.back'),
    path: props.labels?.path ?? translate('velvet.navigation.hierarchyNavigator.path'),
  });
  const rootLabel = () => props.rootLabel ?? translate('velvet.navigation.hierarchyNavigator.rootLabel');
  const [path, setPath] = createSignal<HierarchyNode[]>([]);
  const [direction, setDirection] = createSignal<1 | -1>(1);
  const level = (): HierarchyNode[] => path().at(-1)?.children ?? props.data;

  let list: HTMLUListElement | undefined;
  createEffect(
    on(
      () => path().length,
      () => list?.querySelector('button')?.focus({ preventScroll: true }),
      { defer: true },
    ),
  );

  const into = (node: HierarchyNode) => {
    setDirection(1);
    setPath([...path(), node]);
  };
  const back = (depth = path().length - 1) => {
    setDirection(-1);
    setPath(path().slice(0, depth));
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const leavesLevel = e.key === 'ArrowLeft' || e.key === 'Backspace';
    if (leavesLevel && path().length > 0 && e.target instanceof HTMLButtonElement) {
      e.preventDefault();
      back();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keydown only bubbles up from the level buttons to drill out with ← / Backspace
    <div class={cx(styles.hnav, props.class)} onKeyDown={onKeyDown}>
      <div class={styles.hnavPartHead}>
        <Show when={path().length > 0} fallback={<span style={{ width: '4px' }} />}>
          <IconButton icon="arrow-left" label={labels().back} size="sm" onClick={() => back()} />
        </Show>
        <nav aria-label={labels().path} class={cx(styles.hnavPartPath, typographyClass('body-sm'))}>
          <button
            type="button"
            class={cx(styles.hnavPartCrumb, typographyClass('label'))}
            disabled={path().length === 0}
            onClick={() => back(0)}
          >
            {rootLabel()}
          </button>
          <For each={path()}>
            {(node, k) => (
              <>
                <Glyph name="chevron-right" />
                <button
                  type="button"
                  class={cx(styles.hnavPartCrumb, typographyClass('label'))}
                  disabled={k() === path().length - 1}
                  onClick={() => back(k() + 1)}
                >
                  {node.label}
                </button>
              </>
            )}
          </For>
        </nav>
      </div>
      <Show when={[path().length]} keyed>
        {(_depth) => (
          <ul
            ref={(element) => {
              list = element;
            }}
            class={cx(
              styles.hnavPartList,
              direction() > 0 ? styles.hnavPartListVariantIn : styles.hnavPartListVariantOut,
            )}
          >
            <Index each={level()}>
              {(node) => (
                <li>
                  <button
                    type="button"
                    class={cx(
                      typographyClass('body'),
                      styles.hnavPartItem,
                      props.value === node().id && styles.hnavPartItemVariantSel,
                    )}
                    aria-current={props.value === node().id || undefined}
                    onClick={() =>
                      hasChildren(node()) ? into(node()) : props.onSelect?.(node().id, node(), [...path(), node()])
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' && hasChildren(node())) {
                        e.preventDefault();
                        into(node());
                      }
                    }}
                  >
                    <Show when={node().icon}>{(icon) => <Glyph name={icon()} />}</Show>
                    <Text as="span" variant="label" tone="inherit" class={styles.hnavPartLabel}>
                      {node().label}
                      <Show when={node().description}>
                        <Text as="span" variant="caption" tone="inherit" class={styles.hnavPartDesc}>
                          {node().description}
                        </Text>
                      </Show>
                    </Text>
                    <Show
                      when={node().children?.length}
                      fallback={
                        <Show when={props.value === node().id}>
                          <Glyph name="check" class={styles.hnavPartGo} />
                        </Show>
                      }
                    >
                      <Text as="span" variant="kbd" tone="inherit" class={styles.hnavPartCount}>
                        {node().children?.length}
                      </Text>
                      <Glyph name="chevron-right" class={styles.hnavPartGo} />
                    </Show>
                  </button>
                </li>
              )}
            </Index>
          </ul>
        )}
      </Show>
    </div>
  );
};
