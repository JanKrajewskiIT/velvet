import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { type StateSize, StateTile, type StateTone } from './StateTile';

export interface EmptyStateProps extends HtmlProps<HTMLDivElement, 'title'> {
  /** Icon name; `null` hides the icon circle. @default 'inbox' */
  icon?: string | null;
  title?: JSX.Element;
  description?: JSX.Element;
  actions?: JSX.Element;
  /** sm = inline (card, table, list) · md = section · lg = whole page. @default 'md' */
  size?: StateSize;
  /** Icon circle colour. @default 'brand' */
  tone?: StateTone;
  /** Extra content under the actions. */
  children?: JSX.Element;
}

/** No-data placeholder: tinted icon circle + title + description + actions (use size="sm" buttons). Always offer the next action. */
export const EmptyState = (props: EmptyStateProps) => {
  const merged = mergeProps({ icon: 'inbox', size: 'md', tone: 'brand' } satisfies EmptyStateProps, props);
  const [local, rest] = splitProps(merged, [
    'icon',
    'title',
    'description',
    'actions',
    'size',
    'tone',
    'class',
    'children',
  ]);
  const title = children(() => local.title);
  const description = children(() => local.description);
  const actions = children(() => local.actions);
  const extra = children(() => local.children);

  return (
    <div {...rest} class={cx('vui-empty', `vui-empty--${local.size}`, `vui-tone--${local.tone}`, local.class)}>
      <Show when={local.icon}>{(icon) => <StateTile icon={icon()} size={local.size} tone={local.tone} />}</Show>
      <div class="vui-empty__text">
        <Show when={title()}>
          <div class="vui-empty__title">{title()}</div>
        </Show>
        <Show when={description()}>
          <div class="vui-empty__desc">{description()}</div>
        </Show>
      </div>
      <Show when={actions()}>
        <div class="vui-empty__actions">{actions()}</div>
      </Show>
      <Show when={extra()}>
        <div class="vui-status-page__extra">{extra()}</div>
      </Show>
    </div>
  );
};
