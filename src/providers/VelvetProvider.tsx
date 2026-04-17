import { createMemo, ErrorBoundary, type JSX, type ParentProps, Show, untrack } from 'solid-js';

import { AuthProvider } from '~/auth/AuthProvider';
import ErrorFallback from '~/components/feedback/ErrorFallback/ErrorFallback';
import ToastProvider from '~/components/feedback/Toast/ToastProvider/ToastProvider';
import { I18nProvider, useI18n } from '~/i18n/I18nProvider';
import type { I18nDictionary, Locale } from '~/i18n/messages';
import { configureVelvet, getVelvetRuntimeConfig } from '~/providers/velvet-config';
import { getDefaultQueryClient, QueryClientContext } from '~/query/queryClientContext';
import type { CreateQueryClientOptions } from '~/query/types';
import { ThemeProvider } from '~/theme/ThemeProvider';

interface VelvetProviderProps extends ParentProps {
  themeStorageKey?: string;
  localeStorageKey?: string;
  initialLocale?: Locale;
  localeDictionaries?: Partial<Record<Locale, I18nDictionary>>;
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
      localeDictionaries: props.localeDictionaries,
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
      <I18nProvider initialLocale={props.initialLocale}>
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
