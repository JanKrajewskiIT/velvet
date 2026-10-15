import { For, type JSX, mergeProps, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { freezeRecords } from '../../utils/freezeRecords';
import { Glyph } from '../primitives/Glyph';
import { typographyClass } from '../primitives/typography';
import styles from './LocaleSwitcher.module.css';

export interface LocaleOption {
  value: string;
  /** Short text on the button, e.g. "PL". */
  label: string;
  /** Native name announced to screen readers, e.g. "Polski". */
  name: string;
}

export const DEFAULT_LOCALE_OPTIONS: readonly Readonly<LocaleOption>[] = freezeRecords([
  { value: 'pl', label: 'PL', name: 'Polski' },
  { value: 'en', label: 'EN', name: 'English' },
]);

export interface LocaleSwitcherProps {
  locales?: readonly LocaleOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (locale: string) => void;
  /** @default 'sm' */
  size?: 'sm' | 'md';
  /** Accessible group name. @default localized "Language" */
  label?: string;
  class?: string;
}

/** Compact language toggle with a sliding thumb; ←→ switch. For 4+ languages use Select. */
export const LocaleSwitcher = (props: LocaleSwitcherProps) => {
  const p = mergeProps({ locales: DEFAULT_LOCALE_OPTIONS, size: 'sm' } satisfies Partial<LocaleSwitcherProps>, props);
  const translate = useTranslate();
  const [current, setCurrent] = createControllable({
    value: () => p.value,
    defaultValue: untrack(() => props.defaultValue ?? p.locales[0]?.value ?? ''),
    onChange: (locale) => p.onChange?.(locale),
  });
  const index = () =>
    Math.max(
      0,
      p.locales.findIndex((l) => l.value === current()),
    );

  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (index() + step + p.locales.length) % p.locales.length;
    const nextLocale = p.locales[next];
    if (!nextLocale) return;
    setCurrent(nextLocale.value);
    e.currentTarget.querySelectorAll('button')[next]?.focus();
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus is roving on the radio buttons, the group itself is not a tab stop
    <div
      role="radiogroup"
      aria-label={p.label ?? translate('velvet.actions.localeSwitcher.label')}
      class={cx(styles.locale, p.size === 'md' && styles.localeVariantMd, p.class)}
      style={{ '--n': p.locales.length, '--i': index() }}
      onKeyDown={onKeyDown}
    >
      <span class={styles.localePartThumb} aria-hidden="true" />
      <Glyph name="languages" class={styles.localePartIc} />
      <For each={p.locales}>
        {(locale) => (
          <button
            type="button"
            role="radio"
            aria-checked={locale.value === current()}
            aria-label={locale.name}
            lang={locale.value}
            tabIndex={locale.value === current() ? 0 : -1}
            class={cx(
              typographyClass('label-sm'),
              styles.localePartOpt,
              locale.value === current() && styles.localePartOptVariantOn,
            )}
            onClick={() => setCurrent(locale.value)}
          >
            {locale.label}
          </button>
        )}
      </For>
    </div>
  );
};
