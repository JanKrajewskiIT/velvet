import { createEffect, For, type JSX, mergeProps, on, onCleanup, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { scrollBehavior } from '../../utils/motion';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Anchor.module.css';
import { resolveScrollContainer, type ScrollContainer } from './scrollContainer';

export interface AnchorItem {
  /** Must match a heading/section id in the document. */
  id: string;
  label: JSX.Element;
  /** 1 = section, 2 = subsection (indented). @default 1 */
  level?: 1 | 2;
}

export interface AnchorProps {
  items: AnchorItem[];
  /** Scroll container: element, selector or accessor. Omit for the window. */
  container?: ScrollContainer;
  /** Distance from the container top at which a section counts as active. @default 24 */
  offset?: number;
  /** Controlled id of the active section. */
  activeId?: string;
  onValueChange?: (id: string) => void;
  /** Alias of `onValueChange`. */
  onChange?: (id: string) => void;
  /** nav aria-label. @default localized "On this page" */
  label?: string;
  /** Visible heading; null hides it. Defaults to label. */
  title?: JSX.Element | null;
  class?: string;
}

const SCROLL_LOCK_MS = 600;
const SCROLL_END_TOLERANCE_PX = 2;
/** Lands the heading just below the offset line instead of exactly on it. */
const SCROLL_LANDING_GAP_PX = 8;

/**
 * "On this page" table of contents. Highlights the section currently in view and smooth-scrolls to a section on click
 * (instant under reduced motion), moving focus to its heading. Works on the window or any scroll container.
 */
export const Anchor = (props: AnchorProps) => {
  const p = mergeProps({ offset: 24 } satisfies Partial<AnchorProps>, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.navigation.anchor.label');
  const [current, setCurrent] = createControllable<string | undefined>({
    value: () => p.activeId,
    defaultValue: untrack(() => props.items[0]?.id),
    onChange: (id) => {
      if (id !== undefined) (p.onValueChange ?? p.onChange)?.(id);
    },
  });
  const select = (id: string | undefined) => {
    if (id !== untrack(current)) setCurrent(id);
  };

  let lockedUntil = 0;

  createEffect(
    on([() => p.container, () => p.items, () => p.offset], () => {
      const container = resolveScrollContainer(p.container);
      const source: HTMLElement | Window = container ?? window;
      const sync = () => {
        if (Date.now() < lockedUntil) return;
        const items = p.items;
        const top = container ? container.getBoundingClientRect().top : 0;
        let id = items[0]?.id;
        for (const item of items) {
          const heading = document.getElementById(item.id);
          if (heading && heading.getBoundingClientRect().top - top <= p.offset + 1) id = item.id;
        }
        const atEnd = container
          ? container.scrollTop + container.clientHeight >= container.scrollHeight - SCROLL_END_TOLERANCE_PX
          : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - SCROLL_END_TOLERANCE_PX;
        const last = items[items.length - 1];
        if (atEnd && last) id = last.id;
        select(id);
      };
      sync();
      source.addEventListener('scroll', sync, { passive: true });
      onCleanup(() => source.removeEventListener('scroll', sync));
    }),
  );

  const goTo = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const heading = document.getElementById(id);
    if (!heading) return;
    const container = resolveScrollContainer(p.container);
    const behavior = scrollBehavior();
    if (container) {
      const delta = heading.getBoundingClientRect().top - container.getBoundingClientRect().top;
      container.scrollTo({ top: container.scrollTop + delta - p.offset + SCROLL_LANDING_GAP_PX, behavior });
    } else {
      window.scrollTo({
        top: window.scrollY + heading.getBoundingClientRect().top - p.offset + SCROLL_LANDING_GAP_PX,
        behavior,
      });
    }
    lockedUntil = Date.now() + SCROLL_LOCK_MS;
    select(id);
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };

  return (
    <nav class={cx(typographyClass('body'), styles.anchor, p.class)} aria-label={label()}>
      <Show when={p.title !== null}>
        <Text as="div" variant="section" tone="inherit" class={styles.anchorPartTitle}>
          {p.title || label()}
        </Text>
      </Show>
      <ul class={styles.anchorPartList}>
        <For each={p.items}>
          {(item) => (
            <li>
              <a
                href={`#${item.id}`}
                class={cx(
                  typographyClass((item.level ?? 1) > 1 ? 'caption' : 'body-sm'),
                  styles.anchorPartLink,
                  (item.level ?? 1) > 1 && styles.anchorPartLinkVariantSub,
                  item.id === current() && styles.anchorPartLinkVariantOn,
                )}
                aria-current={item.id === current() ? 'location' : undefined}
                onClick={(e) => goTo(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
};
