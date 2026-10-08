import { createEffect, createSignal, For, Index, type JSX, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Glyph } from '../primitives/Glyph';

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
    <div class={cx('vui-hnav', props.class)} onKeyDown={onKeyDown}>
      <div class="vui-hnav__head">
        <Show when={path().length > 0} fallback={<span style={{ width: '4px' }} />}>
          <IconButton icon="arrow-left" label={labels().back} size="sm" onClick={() => back()} />
        </Show>
        <nav aria-label={labels().path} class="vui-hnav__path">
          <button type="button" class="vui-hnav__crumb" disabled={path().length === 0} onClick={() => back(0)}>
            {rootLabel()}
          </button>
          <For each={path()}>
            {(node, k) => (
              <>
                <Glyph name="chevron-right" />
                <button
                  type="button"
                  class="vui-hnav__crumb"
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
          <ul ref={list} class={cx('vui-hnav__list', direction() > 0 ? 'vui-hnav__list--in' : 'vui-hnav__list--out')}>
            <Index each={level()}>
              {(node) => (
                <li>
                  <button
                    type="button"
                    class={cx('vui-hnav__item', props.value === node().id && 'vui-hnav__item--sel')}
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
                    <span class="vui-hnav__label">
                      {node().label}
                      <Show when={node().description}>
                        <span class="vui-hnav__desc">{node().description}</span>
                      </Show>
                    </span>
                    <Show
                      when={node().children?.length}
                      fallback={
                        <Show when={props.value === node().id}>
                          <Glyph name="check" class="vui-hnav__go" />
                        </Show>
                      }
                    >
                      <span class="vui-hnav__count">{node().children?.length}</span>
                      <Glyph name="chevron-right" class="vui-hnav__go" />
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
