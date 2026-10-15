import { For, type JSX } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { ThemePreference } from '../../theme/theme';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './NavbarAccountTheme.module.css';

const THEME_ICONS = { light: 'sun', dark: 'moon', system: 'monitor' } as const;
const ACCOUNT_THEMES = Object.freeze(['light', 'dark', 'system'] as const satisfies readonly ThemePreference[]);
const KEY_DIRECTION: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };

export interface NavbarAccountThemeProps {
  value?: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}

export const NavbarAccountTheme = (props: NavbarAccountThemeProps) => {
  const translate = useTranslate();
  const selected = () => props.value ?? 'system';
  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    const direction = KEY_DIRECTION[event.key];
    if (direction === undefined) return;
    event.preventDefault();
    const buttons = [...(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const index = buttons.indexOf(event.currentTarget);
    const next = (index + direction + ACCOUNT_THEMES.length) % ACCOUNT_THEMES.length;
    const value = ACCOUNT_THEMES[next];
    if (value) {
      props.onChange(value);
      buttons[next]?.focus();
    }
  };

  return (
    <div class={cx(styles.acctPartRow, typographyClass('body-sm'))}>
      <Text as="span" variant="body-sm" tone="inherit">
        {translate('velvet.actions.themeToggle.label')}
      </Text>
      <div class={styles.acctPartSeg} role="radiogroup" aria-label={translate('velvet.actions.themeToggle.label')}>
        <For each={ACCOUNT_THEMES}>
          {(theme) => (
            <button
              type="button"
              role="radio"
              class={styles.acctPartSegbtn}
              aria-checked={selected() === theme}
              tabIndex={selected() === theme ? 0 : -1}
              aria-label={translate(`velvet.actions.themeToggle.${theme}`)}
              title={translate(`velvet.actions.themeToggle.${theme}`)}
              onKeyDown={onKeyDown}
              onClick={() => props.onChange(theme)}
            >
              <Glyph name={THEME_ICONS[theme]} />
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
