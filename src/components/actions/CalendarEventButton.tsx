import type { I18nKey } from '@jankrajewskiit/i18n';
import { createSignal, createUniqueId, For, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createMenuNavigation } from '../../hooks/createMenuNavigation';
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

export const CALENDAR_PROVIDERS: readonly CalendarProvider[] = Object.freeze(
  Object.keys(PROVIDERS) as CalendarProvider[],
);

export interface CalendarEventButtonProps {
  event: CalendarEventDetails;
  /** One provider renders a plain button; several render a menu. @default all providers */
  providers?: readonly CalendarProvider[];
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
  const [done, setDone] = createControllable({ value: () => p.added, defaultValue: false });
  const [root, setRoot] = createSignal<HTMLSpanElement>();
  const menuId = createUniqueId();

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) root()?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
  };
  const menu = createMenuNavigation(root, () => p.providers.length, close);
  const openMenu = (last = false) => {
    setOpen(true);
    menu.focus(last ? p.providers.length - 1 : 0);
  };
  createDismiss(open, () => close(false), root, { refocus: 'button' });
  const floating = createFloating(open, root);
  const single = () => p.providers.length === 1;
  const text = () => (done() ? (p.addedLabel ?? translate('velvet.actions.calendarEventButton.added')) : label());

  const pick = (provider: CalendarProvider) => {
    PROVIDERS[provider].go(p.event);
    close(true);
    setDone(true);
    p.onAdd?.(provider);
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
          else if (open()) close(false);
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (single() || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
          event.preventDefault();
          openMenu(event.key === 'ArrowUp');
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
        <div
          ref={floating.ref}
          style={floating.style()}
          id={menuId}
          role="menu"
          class="vui-calbtn__menu"
          aria-label={label()}
          onKeyDown={menu.onKeyDown}
        >
          <For each={p.providers}>
            {(provider, index) => (
              <button
                type="button"
                role="menuitem"
                tabIndex={index() === menu.active() ? 0 : -1}
                onFocus={() => menu.onFocus(index())}
                class="vui-calbtn__item"
                onClick={() => pick(provider)}
              >
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
