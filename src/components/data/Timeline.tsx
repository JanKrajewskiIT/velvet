import { createSignal, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Glyph } from '../primitives/Glyph';
import { Marker } from '../primitives/Marker';
import { Rail } from '../primitives/Rail';
import { RailItem } from '../primitives/RailItem';
import { TimelineEntry } from './TimelineEntry';
import type { TimelineAction, TimelineItem } from './timelineTypes';

export interface TimelineProps {
  items: TimelineItem[];
  /** default = connecting rail + 32px markers (history, audit trail) · compact = no rail, 24px markers, one line per event. @default 'default' */
  variant?: 'default' | 'compact';
  /** Hairline between events. */
  divided?: boolean;
  /** Fallback handler for actions without onClick. */
  onAction?: (actionId: string, item: TimelineItem) => void | Promise<void>;
  /** Appends a dashed "Add event" row. */
  onAdd?: () => void;
  /** @default localized "Add event" */
  addLabel?: string;
  /** Text shown in the confirm row when an action fails. @default localized "That didn’t work — try again." */
  errorText?: string;
  /** Receives every failure of an action handler; the confirm row itself only shows `errorText`. */
  onError?: (error: unknown, action: TimelineAction, item: TimelineItem) => void;
  class?: string;
}

interface PendingConfirm {
  key: string | number;
  actionId: string;
}

/**
 * Vertical activity/history feed. Items can carry a badge, meta facts and actions (edit / add to calendar / delete);
 * actions with `confirm` ask inline first, and async handlers are awaited.
 */
export const Timeline = (props: TimelineProps) => {
  const merged = mergeProps({ variant: 'default' } satisfies Partial<TimelineProps>, props);
  const translate = useTranslate();
  const addLabel = () => merged.addLabel ?? translate('velvet.data.timeline.addLabel');
  const errorText = () => merged.errorText ?? translate('velvet.data.timeline.errorText');
  const [confirm, setConfirm] = createSignal<PendingConfirm>();
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  const compact = () => merged.variant === 'compact';

  const run = async (action: TimelineAction, item: TimelineItem) => {
    setBusy(true);
    setFailed(false);
    try {
      await (action.onClick ? action.onClick(item) : merged.onAction?.(action.id, item));
      setConfirm(undefined);
    } catch (error) {
      setFailed(true);
      merged.onError?.(error, action, item);
    } finally {
      setBusy(false);
    }
  };

  const activate = (action: TimelineAction, item: TimelineItem, key: string | number) => {
    if (!action.confirm) {
      void run(action, item);
      return;
    }
    const open = confirm();
    setFailed(false);
    setConfirm(open?.key === key && open.actionId === action.id ? undefined : { key, actionId: action.id });
  };

  const cancel = () => {
    setConfirm(undefined);
    setFailed(false);
  };

  return (
    <Rail
      size={compact() ? 'sm' : 'lg'}
      line={!compact()}
      class={cx(
        'vui-timeline',
        compact() && 'vui-timeline--compact',
        merged.divided && 'vui-timeline--divided',
        merged.class,
      )}
    >
      <For each={merged.items}>
        {(item, index) => {
          const key = () => item.id ?? index();
          const keyed = () => ({ ...item, id: key() });
          return (
            <TimelineEntry
              item={item}
              compact={compact()}
              confirmingId={confirm()?.key === key() ? confirm()?.actionId : undefined}
              busy={busy()}
              error={failed() ? errorText() : undefined}
              onActivate={(action) => activate(action, keyed(), key())}
              onCancel={cancel}
              onConfirm={(action) => void run(action, keyed())}
            />
          );
        }}
      </For>
      <Show when={merged.onAdd}>
        <RailItem class="vui-timeline__item vui-timeline__item--add">
          <Marker
            class="vui-timeline__marker"
            appearance="outline"
            size={compact() ? 'sm' : 'lg'}
            gap={!compact()}
            aria-hidden="true"
          >
            <Glyph name="plus" />
          </Marker>
          <div class="vui-timeline__body">
            <Button variant="dashed" size="sm" class="vui-timeline__addbtn" onClick={() => merged.onAdd?.()}>
              {addLabel()}
            </Button>
          </div>
        </RailItem>
      </Show>
    </Rail>
  );
};
