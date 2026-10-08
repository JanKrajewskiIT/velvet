import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';

export interface ListItemProps extends HtmlProps<HTMLElement, 'title' | 'onClick'> {
  /** Defaults to `a` (href), `button` (onClick) or `div`. `label` wraps a Checkbox so the whole row toggles it. */
  as?: 'div' | 'button' | 'a' | 'label' | 'li';
  leading?: JSX.Element;
  title?: JSX.Element;
  description?: JSX.Element;
  /** Third line — timestamp, size, source. */
  meta?: JSX.Element;
  trailing?: JSX.Element;
  selected?: boolean;
  disabled?: boolean;
  /** sm 40 · md 56 min-height. @default 'md' */
  size?: 'sm' | 'md';
  /** start = top-align leading/trailing for multi-line rows. @default 'center' */
  align?: 'center' | 'start';
  /** Description line clamp. @default 1 */
  clamp?: number;
  href?: string;
  onClick?: JSX.EventHandler<HTMLElement, MouseEvent>;
}

const isPresent = (slot: JSX.Element): boolean => slot != null && slot !== false;

/** One row: leading · title · description · meta · trailing. Interactive when it renders as button / a / label. */
export const ListItem = (props: ListItemProps) => {
  const merged = mergeProps({ size: 'md', align: 'center', clamp: 1 } satisfies ListItemProps, props);
  const [local, rest] = splitProps(merged, [
    'as',
    'leading',
    'title',
    'description',
    'meta',
    'trailing',
    'selected',
    'disabled',
    'size',
    'align',
    'clamp',
    'href',
    'onClick',
    'class',
    'children',
  ]);

  // An interactive trailing slot (IconButton, Menu) cannot nest inside <button>, so the row becomes a div with button semantics.
  const nested = () => !local.as && !local.href && !!local.onClick && isPresent(local.trailing);
  const tag = () => local.as ?? (local.href ? 'a' : local.onClick && !nested() ? 'button' : 'div');
  const isAction = () => ['button', 'a', 'label'].includes(tag()) || nested();

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    e.currentTarget.click();
  };

  return (
    <Polymorphic
      tag={tag()}
      class={cx(
        'vui-list-item',
        `vui-list-item--${local.size}`,
        isAction() && 'vui-list-item--action',
        local.selected && 'vui-list-item--selected',
        local.align === 'start' && 'vui-list-item--top',
        local.disabled && 'vui-list-item--disabled',
        local.class,
      )}
      href={local.href}
      type={tag() === 'button' ? 'button' : undefined}
      disabled={tag() === 'button' ? local.disabled : undefined}
      aria-disabled={tag() !== 'button' && local.disabled ? true : undefined}
      aria-current={local.selected && tag() !== 'label' ? 'true' : undefined}
      role={nested() ? 'button' : undefined}
      tabIndex={nested() ? (local.disabled ? -1 : 0) : undefined}
      onKeyDown={nested() ? onKeyDown : undefined}
      onClick={local.onClick}
      {...rest}
    >
      <Show when={isPresent(local.leading)}>
        <span class="vui-list-item__leading">{local.leading}</span>
      </Show>
      <span class="vui-list-item__main">
        <Show when={local.title != null}>
          <span class="vui-list-item__title">{local.title}</span>
        </Show>
        <Show when={isPresent(local.description)}>
          <span
            class={cx('vui-list-item__desc', local.clamp > 1 && 'vui-list-item__desc--clamp')}
            style={local.clamp > 1 ? { '-webkit-line-clamp': local.clamp } : undefined}
          >
            {local.description}
          </span>
        </Show>
        <Show when={isPresent(local.meta)}>
          <span class="vui-list-item__meta">{local.meta}</span>
        </Show>
        {local.children}
      </span>
      <Show when={isPresent(local.trailing)}>
        <span class="vui-list-item__trailing">{local.trailing}</span>
      </Show>
    </Polymorphic>
  );
};
