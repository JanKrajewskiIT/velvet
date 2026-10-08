import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import type { TimelineAction, TimelineItem } from './timelineTypes';

export interface TimelineActionsProps {
  item: TimelineItem;
  /** Id of the action whose inline confirmation is open on this item. */
  confirmingId: string | undefined;
  onActivate: (action: TimelineAction) => void;
}

/** The row-action buttons of one timeline event. */
export const TimelineActions = (props: TimelineActionsProps) => {
  const translate = useTranslate();
  return (
    <Show when={props.item.actions?.length}>
      <span
        class="vui-timeline__actions"
        role="group"
        aria-label={translate('velvet.data.timelineActions.actionsLabel')}
      >
        <For each={props.item.actions}>
          {(action) => (
            <button
              type="button"
              class={cx('vui-timeline__act', action.tone === 'danger' && 'vui-timeline__act--danger')}
              title={action.label}
              aria-label={
                typeof props.item.title === 'string'
                  ? translate('velvet.data.timelineActions.actionLabel', {
                      action: action.label,
                      title: props.item.title,
                    })
                  : action.label
              }
              disabled={action.disabled}
              aria-expanded={action.confirm ? props.confirmingId === action.id : undefined}
              onClick={() => props.onActivate(action)}
            >
              <Show when={action.icon} fallback={action.label}>
                {(icon) => <Glyph name={icon()} />}
              </Show>
            </button>
          )}
        </For>
      </span>
    </Show>
  );
};
