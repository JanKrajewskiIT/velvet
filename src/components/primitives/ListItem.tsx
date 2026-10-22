import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { callHandler } from '../../utils/callHandler';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import styles from './ListItem.module.css';
import { Text } from './Text';
import type { TextVariant } from './typography';

const LIST_ITEM_CLASSES = {
  selected: styles.listItemVariantSelected,
  sm: styles.listItemVariantSm,
  top: styles.listItemVariantTop,
  action: styles.listItemVariantAction,
  disabled: styles.listItemVariantDisabled,
} as const;

export interface ListItemProps extends HtmlProps<HTMLElement, 'title' | 'onClick'> {
  /** Defaults to `a` (href), `button` (onClick) or `div`. `label` wraps a Checkbox so the whole row toggles it. */
  as?: 'div' | 'button' | 'a' | 'label' | 'li';
  leading?: JSX.Element;
  title?: JSX.Element;
  description?: JSX.Element;
  titleVariant?: TextVariant;
  descriptionVariant?: TextVariant;
  titleClass?: string;
  descriptionClass?: string;
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
    'titleVariant',
    'descriptionVariant',
    'titleClass',
    'descriptionClass',
    'meta',
    'trailing',
    'selected',
    'disabled',
    'size',
    'align',
    'clamp',
    'href',
    'onClick',
    'onKeyDown',
    'tabIndex',
    'class',
    'children',
  ]);

  // An interactive trailing slot (IconButton, Menu) cannot nest inside <button>, so the row becomes a div with button semantics.
  const nested = () => !local.as && !local.href && !!local.onClick && isPresent(local.trailing);
  const tag = () => local.as ?? (local.href ? 'a' : local.onClick && !nested() ? 'button' : 'div');
  const isAction = () => ['button', 'a', 'label'].includes(tag()) || nested();

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    callHandler(local.onKeyDown, e);
    if (e.defaultPrevented || !nested() || e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    if (!local.disabled && !e.repeat) e.currentTarget.click();
  };
  const onClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    if (local.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    callHandler(local.onClick, event);
  };

  return (
    <Polymorphic
      {...rest}
      tag={tag()}
      class={cx(
        styles.listItem,
        variantClass(LIST_ITEM_CLASSES, local.size),
        isAction() && styles.listItemVariantAction,
        local.selected && styles.listItemVariantSelected,
        local.align === 'start' && styles.listItemVariantTop,
        local.disabled && styles.listItemVariantDisabled,
        local.class,
      )}
      href={local.disabled ? undefined : local.href}
      type={tag() === 'button' ? 'button' : undefined}
      disabled={tag() === 'button' ? local.disabled : undefined}
      aria-disabled={tag() !== 'button' && local.disabled ? true : rest['aria-disabled']}
      aria-current={local.selected && tag() !== 'label' ? 'true' : rest['aria-current']}
      role={rest.role ?? (nested() ? 'button' : undefined)}
      tabIndex={local.disabled && isAction() ? -1 : (local.tabIndex ?? (nested() ? 0 : undefined))}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <Show when={isPresent(local.leading)}>
        <span class={styles.listItemPartLeading}>{local.leading}</span>
      </Show>
      <span class={styles.listItemPartMain}>
        <Show when={local.title != null}>
          <Text
            as="span"
            variant={local.titleVariant ?? 'body-sm'}
            tone="inherit"
            class={cx(styles.listItemPartTitle, local.titleClass)}
          >
            {local.title}
          </Text>
        </Show>
        <Show when={isPresent(local.description)}>
          <Text
            as="span"
            variant={local.descriptionVariant ?? 'caption'}
            tone="inherit"
            class={cx(
              styles.listItemPartDesc,
              local.clamp > 1 && styles.listItemPartDescVariantClamp,
              local.descriptionClass,
            )}
            style={local.clamp > 1 ? { '-webkit-line-clamp': local.clamp } : undefined}
          >
            {local.description}
          </Text>
        </Show>
        <Show when={isPresent(local.meta)}>
          <Text as="span" variant="overline" tone="inherit" class={styles.listItemPartMeta}>
            {local.meta}
          </Text>
        </Show>
        {local.children}
      </span>
      <Show when={isPresent(local.trailing)}>
        <Text as="span" variant="caption" tone="inherit" class={styles.listItemPartTrailing}>
          {local.trailing}
        </Text>
      </Show>
    </Polymorphic>
  );
};
