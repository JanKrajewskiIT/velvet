import { createMemo, ErrorBoundary, type JSX, type ParentProps, Show, untrack } from 'solid-js';

import { AuthProvider } from '~/auth/AuthProvider';
import ErrorFallback from '~/components/feedback/ErrorFallback/ErrorFallback';
import ToastProvider from '~/components/feedback/Toast/ToastProvider/ToastProvider';
import type { ComposedDictionaries } from '~/i18n/defineDictionary';
import { I18nProvider, useI18n } from '~/i18n/I18nProvider';
import type { Locale } from '~/i18n/types';
import { configureVelvet, getVelvetRuntimeConfig } from '~/providers/velvet-config';
import { getDefaultQueryClient, QueryClientContext } from '~/query/queryClientContext';
import type { CreateQueryClientOptions } from '~/query/types';
import { ThemeProvider } from '~/theme/ThemeProvider';

interface VelvetProviderProps extends ParentProps {
  themeStorageKey?: string;
  localeStorageKey?: string;
  initialLocale?: Locale;
  /**
   * Composed locale dictionaries produced by `defineDictionaries`.
   *
   * When omitted, the provider uses VelvetUi's foundation dictionary only,
   * which is sufficient for primitive components but will not contain
   * data-domain or app-specific keys.
   */
  dictionaries?: ComposedDictionaries;
  queryDefaults?: CreateQueryClientOptions;
  errorFallback?: JSX.Element;
}

const DefaultErrorFallback = (props: { error: unknown; reset: () => void }) => {
  const { ts } = useI18n();

  const description = createMemo(() =>
    props.error instanceof Error && props.error.message ? props.error.message : ts('error.description'),
  );

  return <ErrorFallback label={ts('error.title')} description={description()} onRetry={props.reset} />;
};

const VelvetProvider = (props: VelvetProviderProps) => {
  untrack(() =>
    configureVelvet({
      themeStorageKey: props.themeStorageKey,
      localeStorageKey: props.localeStorageKey,
      queryClientOptions: props.queryDefaults,
    }),
  );

  const config = getVelvetRuntimeConfig();

  const renderErrorFallback = (error: unknown, reset: () => void) => {
    if (props.errorFallback) {
      return props.errorFallback;
    }

    return <DefaultErrorFallback error={error} reset={reset} />;
  };

  return (
    <ThemeProvider>
      <I18nProvider initialLocale={props.initialLocale} dictionaries={props.dictionaries}>
        <QueryClientContext.Provider value={getDefaultQueryClient()}>
          <Show
            when={config.authConfig}
            fallback={
              <ToastProvider>
                <ErrorBoundary fallback={renderErrorFallback}>{props.children}</ErrorBoundary>
              </ToastProvider>
            }
          >
            {(authConfig) => (
              <AuthProvider config={authConfig()}>
                <ToastProvider>
                  <ErrorBoundary fallback={renderErrorFallback}>{props.children}</ErrorBoundary>
                </ToastProvider>
              </AuthProvider>
            )}
          </Show>
        </QueryClientContext.Provider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export type { VelvetProviderProps };
export default VelvetProvider;
