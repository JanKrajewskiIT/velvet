import type { I18nKey } from '@jankrajewskiit/i18n';
import { createEffect, createSignal, createUniqueId, For, type JSX, mergeProps, on, Show, untrack } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
import { buttonClass } from './buttonClass';
import {
  buildGoogleCalendarUrl,
  buildIcs,
  buildOutlookCalendarUrl,
  type CalendarEventDetails,
  isValidEvent,
} from './calendarEvent';

const OBJECT_URL_REVOKE_DELAY_MS = 1000;
const MENU_ITEM = '[role=menuitem]';

export type CalendarProvider = 'google' | 'outlook' | 'ics';

const downloadIcs = (event: CalendarEventDetails): void => {
  const url = URL.createObjectURL(new Blob([buildIcs(event)], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(event.title || 'event').replace(/[^\w-]+/gu, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_REVOKE_DELAY_MS);
};

const PROVIDERS: Record<
  CalendarProvider,
  { labelKey: I18nKey; icon: string; external: boolean; go: (event: CalendarEventDetails) => void }
> = {
  google: {
    labelKey: 'velvet.actions.calendarEventButton.providers.google',
    icon: 'calendar',
    external: true,
    go: (e) => window.open(buildGoogleCalendarUrl(e), '_blank', 'noopener'),
  },
  outlook: {
    labelKey: 'velvet.actions.calendarEventButton.providers.outlook',
    icon: 'mail',
    external: true,
    go: (e) => window.open(buildOutlookCalendarUrl(e), '_blank', 'noopener'),
  },
  ics: {
    labelKey: 'velvet.actions.calendarEventButton.providers.ics',
    icon: 'download',
    external: false,
    go: downloadIcs,
  },
};

export const CALENDAR_PROVIDERS = Object.keys(PROVIDERS) as CalendarProvider[];

export interface CalendarEventButtonProps {
  event: CalendarEventDetails;
  /** One provider renders a plain button; several render a menu. @default all providers */
  providers?: CalendarProvider[];
  /** @default localized "Add to calendar" */
  label?: string;
  /** @default 'secondary' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  /** Controlled "already added" state. */
  added?: boolean;
  /** @default localized "In calendar" */
  addedLabel?: string;
  onAdd?: (provider: CalendarProvider) => void;
  disabled?: boolean;
  class?: string;
}

/** "Add to calendar" for interviews, deadlines and meetings. Flips to a ✓ state after adding. Disabled when `start` is missing or invalid. */
export const CalendarEventButton = (props: CalendarEventButtonProps) => {
  const p = mergeProps(
    { providers: CALENDAR_PROVIDERS, variant: 'secondary', size: 'md' } satisfies Partial<CalendarEventButtonProps>,
    props,
  );
  const translate = useTranslate();
  const label = () => p.label ?? translate('velvet.actions.calendarEventButton.label');
  const [open, setOpen] = createSignal(false);
  const [done, setDone] = createSignal(untrack(() => !!p.added));
  const [root, setRoot] = createSignal<HTMLSpanElement>();
  const menuId = createUniqueId();

  createEffect(
    on(
      () => p.added,
      (added) => setDone(!!added),
      { defer: true },
    ),
  );
  createDismiss(open, () => setOpen(false), root, { refocus: 'button' });
  createEffect(() => {
    if (!open()) return;
    requestAnimationFrame(() => root()?.querySelector<HTMLElement>(MENU_ITEM)?.focus());
  });

  const single = () => p.providers.length === 1;
  const text = () => (done() ? (p.addedLabel ?? translate('velvet.actions.calendarEventButton.added')) : label());

  const pick = (provider: CalendarProvider) => {
    PROVIDERS[provider].go(p.event);
    setOpen(false);
    setDone(true);
    p.onAdd?.(provider);
  };

  const onMenuKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (e.key === 'Tab') setOpen(false);
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>(MENU_ITEM)];
    const at = items.indexOf(document.activeElement as HTMLElement);
    items[(at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <span ref={setRoot} class={cx('vui-calbtn', p.class)}>
      <button
        type="button"
        class={cx(buttonClass({ variant: p.variant, size: p.size, icon: p.iconOnly }), done() && 'vui-calbtn--done')}
        disabled={p.disabled || !isValidEvent(p.event)}
        aria-haspopup={single() ? undefined : 'menu'}
        aria-expanded={single() ? undefined : open()}
        aria-controls={single() ? undefined : menuId}
        aria-label={p.iconOnly ? text() : undefined}
        title={p.iconOnly ? text() : undefined}
        onClick={() => {
          const [only] = p.providers;
          if (single() && only) pick(only);
          else setOpen(!open());
        }}
      >
        <Glyph name={done() ? 'check' : 'calendar-plus'} />
        <Show when={!p.iconOnly}>
          {text()}
          <Show when={!single()}>
            <Chevron open={open()} class="vui-calbtn__chev" />
          </Show>
        </Show>
      </button>
      <Show when={open()}>
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus is roving on the menuitems, the menu container is not a tab stop */}
        <div id={menuId} role="menu" class="vui-calbtn__menu" aria-label={label()} onKeyDown={onMenuKeyDown}>
          <For each={p.providers}>
            {(provider) => (
              <button type="button" role="menuitem" class="vui-calbtn__item" onClick={() => pick(provider)}>
                <Glyph name={PROVIDERS[provider].icon} />
                {translate(PROVIDERS[provider].labelKey)}
                <Show when={PROVIDERS[provider].external}>
                  <Glyph name="external-link" class="vui-calbtn__ext" />
                </Show>
              </button>
            )}
          </For>
        </div>
      </Show>
    </span>
  );
};
