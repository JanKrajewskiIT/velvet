import { defineDictionaries, type DictionaryNode, I18nProvider, type Locale } from '@jankrajewskiit/i18n';
import { ErrorBoundary, type JSX, onCleanup, onMount, untrack } from 'solid-js';

import { ErrorState } from '../components/feedback/ErrorState';
import { ToastProvider, type ToastProviderProps } from '../components/feedback/ToastProvider';
import { velvetMessages } from '../i18n';
import { initTheme } from '../theme/theme';

export const LOCALE_STORAGE_KEY = 'vui-locale';

export interface VelvetProviderProps {
  /** Application dictionaries per locale; the library's own messages are composed first. Read once on mount. */
  messages?: Partial<Record<Locale, readonly DictionaryNode[]>>;
  initialLocale?: Locale;
  /** @default 'vui-locale' */
  localeStorageKey?: string;
  toasts?: Omit<ToastProviderProps, 'children'>;
  /** Replaces the default retry screen shown when rendering throws. */
  errorFallback?: (error: unknown, reset: () => void) => JSX.Element;
  children?: JSX.Element;
}

/** App shell providers in one place: theme sync, locale + translations, toasts and an error boundary with a retry screen. */
export const VelvetProvider = (props: VelvetProviderProps) => {
  const dictionaries = untrack(() =>
    defineDictionaries({
      en: [velvetMessages.en, ...(props.messages?.en ?? [])],
      pl: [velvetMessages.pl, ...(props.messages?.pl ?? [])],
    }),
  );

  onMount(() => onCleanup(initTheme()));

  const fallback = (error: unknown, reset: () => void) => {
    console.error(error);
    return props.errorFallback?.(error, reset) ?? <ErrorState size="lg" onRetry={reset} />;
  };

  return (
    <I18nProvider
      dictionaries={dictionaries}
      initialLocale={props.initialLocale}
      storageKey={props.localeStorageKey ?? LOCALE_STORAGE_KEY}
    >
      <ToastProvider {...props.toasts}>
        <ErrorBoundary fallback={fallback}>{props.children}</ErrorBoundary>
      </ToastProvider>
    </I18nProvider>
  );
};
