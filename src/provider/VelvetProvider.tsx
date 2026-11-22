import { AuthProvider, type OidcAuthConfig } from '@jankrajewskiit/auth';
import { defineDictionaries, type DictionaryNode, I18nProvider, type Locale } from '@jankrajewskiit/i18n';
import type { JSX } from '@solidjs/web';
import { type Accessor, Errored, onSettled, Show, untrack } from 'solid-js';

import { ErrorState } from '../components/feedback/ErrorState';
import { ToastProvider, type ToastProviderProps } from '../components/feedback/ToastProvider';
import { velvetMessages } from '../i18n';
import { initTheme } from '../theme/theme';
import { reportAsyncError } from '../utils/reportAsyncError';

export const LOCALE_STORAGE_KEY = 'vui-locale';

export interface VelvetProviderProps {
  /** Enables the shared Velvet Auth session. Changing the config object remounts the authenticated subtree. */
  authConfig?: OidcAuthConfig;
  /** Application dictionaries per locale; the library's own messages are composed first. Read once on mount. */
  messages?: Partial<Record<Locale, readonly DictionaryNode[]>>;
  initialLocale?: Locale;
  /** @default 'vui-locale' */
  localeStorageKey?: string;
  toasts?: Omit<ToastProviderProps, 'children'>;
  /** Replaces the default retry screen shown when rendering throws. */
  errorFallback?: (error: unknown, reset: () => void) => JSX.Element;
  /** Receives rendering failures once per boundary failure. The application owns redaction and reporting. */
  onError?: (error: unknown) => void;
  children?: JSX.Element;
}

/** App shell ownership: theme, translations, toasts, optional Velvet Auth and a rendering error boundary. */
export const VelvetProvider = (props: VelvetProviderProps) => {
  const dictionaries = untrack(() =>
    defineDictionaries({
      en: [velvetMessages.en, ...(props.messages?.en ?? [])],
      pl: [velvetMessages.pl, ...(props.messages?.pl ?? [])],
    }),
  );

  onSettled(initTheme);

  const fallback = (failure: Accessor<unknown>, reset: () => void) => {
    const error = failure();
    if (props.onError) props.onError(error);
    else reportAsyncError(error);
    return props.errorFallback?.(error, reset) ?? <ErrorState size="lg" onRetry={reset} />;
  };

  return (
    <I18nProvider
      dictionaries={dictionaries}
      initialLocale={props.initialLocale}
      storageKey={props.localeStorageKey ?? LOCALE_STORAGE_KEY}
    >
      <ToastProvider {...props.toasts}>
        <Errored fallback={fallback}>
          <Show when={props.authConfig} keyed fallback={props.children}>
            {(config) => <AuthProvider config={config}>{props.children}</AuthProvider>}
          </Show>
        </Errored>
      </ToastProvider>
    </I18nProvider>
  );
};
