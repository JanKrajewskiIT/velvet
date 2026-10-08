import { For, mergeProps, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Polymorphic } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { Indicator } from '../primitives/Indicator';
import { glyphForState } from './filledGlyph';

export interface BottomNavItem {
  value: string;
  label: string;
  icon: string;
  href?: string;
  /** Number/short text → Count; true → Dot */
  badge?: number | string | boolean;
}

export interface BottomNavAction {
  label: string;
  /** @default 'plus' */
  icon?: string;
  onClick?: () => void;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: MouseEvent) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string, event: MouseEvent) => void;
  /** Elevated round centre button (e.g. Create). Inserted in the middle of items. */
  action?: BottomNavAction;
  /** @default true */
  fixed?: boolean;
  /** @default localized "Primary" */
  label?: string;
  class?: string;
}

const badgeParts = (badge: BottomNavItem['badge']): { count: number | string | null; dot: boolean } => {
  const count = typeof badge === 'number' || (typeof badge === 'string' && badge !== '') ? badge : null;
  return { count, dot: count === null && badge != null && badge !== false };
};

/**
 * Mobile tab bar: 3–5 destinations (icon + label, active = brand colour + filled icon twin when one exists) with an optional
 * elevated centre action. `fixed` pins it to the viewport bottom with safe-area padding. Hide Sidebar on mobile when using it.
 */
export const BottomNav = (props: BottomNavProps) => {
  const p = mergeProps({ fixed: true } satisfies Partial<BottomNavProps>, props);
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.navigation.bottomNav.label');
  const [current, setCurrent] = createControllable<string | undefined>({
    value: () => p.value,
    defaultValue: untrack(() => props.defaultValue ?? props.items[0]?.value),
  });
  const middle = () => (p.action ? Math.ceil(p.items.length / 2) : p.items.length);
  const before = () => p.items.slice(0, middle());
  const after = () => p.items.slice(middle());

  const renderItem = (item: BottomNavItem) => {
    const on = () => current() === item.value;
    const badge = () => badgeParts(item.badge);
    return (
      <Polymorphic
        tag={item.href ? 'a' : 'button'}
        href={item.href}
        type={item.href ? undefined : 'button'}
        aria-current={on() ? 'page' : undefined}
        class={cx('vui-bottomnav__item', on() && 'vui-bottomnav__item--on')}
        onClick={(e: MouseEvent) => {
          setCurrent(item.value);
          (p.onValueChange ?? p.onChange)?.(item.value, e);
        }}
      >
        <Indicator class="vui-bottomnav__icon" count={badge().count} dot={badge().dot}>
          <Glyph name={glyphForState(item.icon, on())} />
        </Indicator>
        <span class="vui-bottomnav__label">{item.label}</span>
      </Polymorphic>
    );
  };

  return (
    <nav aria-label={label()} class={cx('vui-bottomnav', p.fixed && 'vui-bottomnav--fixed', p.class)}>
      <For each={before()}>{renderItem}</For>
      <Show when={p.action}>
        {(action) => (
          <button
            type="button"
            class="vui-bottomnav__action"
            aria-label={action().label}
            onClick={() => action().onClick?.()}
          >
            <Glyph name={action().icon ?? 'plus'} />
          </button>
        )}
      </Show>
      <For each={after()}>{renderItem}</For>
    </nav>
  );
};
