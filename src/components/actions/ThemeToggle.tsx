import type { I18nKey } from '@jankrajewskiit/i18n';
import { createSignal, For, type JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import {
  applyTheme,
  currentTheme,
  readThemePreference,
  THEME_PREFERENCES,
  type ThemePreference,
} from '../../theme/theme';
import { activeItemKey } from '../../utils/activeItem';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { ThemeMoonRings } from './ThemeMoonRings';
import { ThemeSunRings } from './ThemeSunRings';
import styles from './ThemeToggle.module.css';

const TT_CLASSES = {
  navbar: styles.ttVariantNavbar,
  dark: styles.ttVariantDark,
  sm: styles.ttVariantSm,
  seg: styles.ttVariantSeg,
} as const;

const THEME_LABEL_KEYS = {
  light: 'velvet.actions.themeToggle.light',
  dark: 'velvet.actions.themeToggle.dark',
  system: 'velvet.actions.themeToggle.system',
} as const satisfies Record<ThemePreference, I18nKey>;

export interface ThemeToggleProps {
  /** Controlled theme. Omit to drive the document theme directly. */
  value?: ThemePreference;
  onValueChange?: (theme: ThemePreference) => void;
  /** Alias of `onValueChange`. */
  onChange?: (theme: ThemePreference) => void;
  /** light (on light/neutral surfaces) · navbar (on brand fills) · dark (on dark or media surfaces). @default 'light' */
  variant?: 'light' | 'navbar' | 'dark';
  /** rings = overlapping filled rings (settings/hero) · segmented = compact pill with line icons (toolbars, headers). @default 'rings' */
  appearance?: 'rings' | 'segmented';
  /** Adds a third "System" option. @default true for segmented, false for rings */
  showSystem?: boolean;
  /** md = 32px rings, sm = 24px. @default 'md' */
  size?: 'sm' | 'md';
  /** @default localized "Light" */
  lightLabel?: string;
  /** @default localized "Dark" */
  darkLabel?: string;
  /** @default localized "System" */
  systemLabel?: string;
  /** Group label. @default localized "Color theme" */
  label?: string;
  class?: string;
}

/** Light/dark switch. Uncontrolled it sets `html[data-theme]` and persists the choice; pass `value` + `onValueChange` to control. */
export const ThemeToggle = (props: ThemeToggleProps) => {
  const p = mergeProps(
    { variant: 'light', appearance: 'rings', size: 'md' } satisfies Partial<ThemeToggleProps>,
    props,
  );
  const translate = useTranslate();
  const notify = (next: ThemePreference) => (p.onValueChange ?? p.onChange)?.(next);
  const withSystem = () => p.showSystem ?? p.appearance === 'segmented';
  const options = () => THEME_PREFERENCES.filter((t) => withSystem() || t !== 'system');
  const readDocumentTheme = (): ThemePreference =>
    withSystem() && readThemePreference() === 'system' ? 'system' : currentTheme();

  const [own, setOwn] = createSignal<ThemePreference>(readDocumentTheme());
  const [popped, setPopped] = createSignal<ThemePreference | null>(null);
  const controlled = () => p.value !== undefined;
  const theme = () => p.value ?? own();
  const tabStop = () =>
    activeItemKey(
      options(),
      theme(),
      (option) => option,
      () => true,
    );

  onMount(() => {
    const observer = new MutationObserver(() => {
      if (!controlled()) setOwn(readDocumentTheme());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    onCleanup(() => observer.disconnect());
  });

  const pick = (next: ThemePreference) => {
    if (next === theme()) return;
    setPopped(next);
    if (!controlled()) {
      applyTheme(next);
      setOwn(next);
    }
    notify(next);
  };

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
    if (!step || e.defaultPrevented) return;
    e.preventDefault();
    const list = options();
    const buttons = [...e.currentTarget.querySelectorAll('button')];
    const focused = buttons.findIndex((button) => button.contains(e.target));
    const at = focused < 0 ? list.findIndex((option) => option === tabStop()) : focused;
    const next = list[(at + step + list.length) % list.length];
    if (!next) return;
    pick(next);
    e.currentTarget.querySelector<HTMLElement>(`[data-set="${next}"]`)?.focus();
  };

  const segmented = () => p.appearance === 'segmented';
  const icon = (t: ThemePreference): JSX.Element => {
    if (t === 'system') return <Glyph name="monitor" />;
    if (segmented()) return <Glyph name={t === 'light' ? 'sun' : 'moon'} />;
    return t === 'light' ? <ThemeSunRings /> : <ThemeMoonRings />;
  };
  const labelOf = (t: ThemePreference) =>
    ({ light: p.lightLabel, dark: p.darkLabel, system: p.systemLabel })[t] ?? translate(THEME_LABEL_KEYS[t]);

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus is roving on the radio buttons, the group itself is not a tab stop
    <div
      role="radiogroup"
      aria-label={p.label ?? translate('velvet.actions.themeToggle.label')}
      class={cx(
        styles.tt,
        variantClass(TT_CLASSES, p.variant),
        segmented() && styles.ttVariantSeg,
        p.size === 'sm' && styles.ttVariantSm,
        p.class,
      )}
      onKeyDown={onKeyDown}
    >
      <For each={options()}>
        {(t) => (
          <button
            type="button"
            role="radio"
            data-set={t}
            class={cx(styles.ttPartBtn, popped() === t && styles.ttPartBtnVariantPop)}
            aria-checked={theme() === t}
            aria-label={labelOf(t)}
            title={labelOf(t)}
            tabIndex={tabStop() === t ? 0 : -1}
            onClick={() => pick(t)}
          >
            <span class={styles.ttPartIcon}>{icon(t)}</span>
          </button>
        )}
      </For>
    </div>
  );
};
