export const THEME_STORAGE_KEY = 'vui-theme';

export const THEME_PREFERENCES = Object.freeze(['light', 'system', 'dark'] as const);

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

const isPreference = (value: unknown): value is ThemePreference => THEME_PREFERENCES.includes(value as ThemePreference);

const darkQuery = (): MediaQueryList | undefined =>
  typeof matchMedia === 'undefined' ? undefined : matchMedia('(prefers-color-scheme: dark)');

/** Storage can throw (private mode, blocked site data); the preference then simply is not persisted. */
export const readThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
};

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? (darkQuery()?.matches ? 'dark' : 'light') : preference;

/** The theme currently painted on `<html>`. */
export const currentTheme = (): ResolvedTheme =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** Paints the preference on `<html data-theme>` and persists it. */
export const applyTheme = (preference: ThemePreference): void => {
  document.documentElement.dataset.theme = resolveTheme(preference);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Not persisting is acceptable: the theme still applies for this page view.
  }
};

/** Applies the stored preference and keeps `<html>` in sync with OS changes and other tabs. Returns a disposer. */
export const initTheme = (): (() => void) => {
  const paint = () => {
    document.documentElement.dataset.theme = resolveTheme(readThemePreference());
  };
  paint();
  const query = darkQuery();
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) paint();
  };
  query?.addEventListener('change', paint);
  addEventListener('storage', onStorage);
  return () => {
    query?.removeEventListener('change', paint);
    removeEventListener('storage', onStorage);
  };
};
