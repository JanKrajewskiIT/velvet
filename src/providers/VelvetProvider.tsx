import { createMemo, ErrorBoundary, type JSX, type ParentProps } from 'solid-js';

import { AuthProvider } from '~/auth/AuthProvider';
import type { OidcAuthConfig } from '~/auth/oidc';
import ErrorFallback from '~/components/feedback/ErrorFallback/ErrorFallback';
import ToastProvider from '~/components/feedback/Toast/ToastProvider/ToastProvider';
import { I18nProvider, useI18n } from '~/i18n/I18nProvider';
import type { I18nDictionary, Locale } from '~/i18n/messages';
import { QueryClientProvider, type QueryClientProviderProps } from '~/query/QueryClientProvider';
import { ThemeProvider } from '~/theme/ThemeProvider';

interface VelvetProviderProps extends ParentProps {
  themeStorageKey?: string;
  localeStorageKey?: string;
  initialLocale?: Locale;
  localeDictionaries?: Partial<Record<Locale, I18nDictionary>>;
  authConfig: OidcAuthConfig;
  query?: Omit<QueryClientProviderProps, 'children'>;
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
  const renderErrorFallback = (error: unknown, reset: () => void) => {
    if (props.errorFallback) {
      return props.errorFallback;
    }

    return <DefaultErrorFallback error={error} reset={reset} />;
  };

  return (
    <ThemeProvider storageKey={props.themeStorageKey}>
      <I18nProvider
        storageKey={props.localeStorageKey}
        initialLocale={props.initialLocale}
        dictionaries={props.localeDictionaries}
      >
        <QueryClientProvider client={props.query?.client} options={props.query?.options}>
          <AuthProvider config={props.authConfig}>
            <ToastProvider>
              <ErrorBoundary fallback={renderErrorFallback}>{props.children}</ErrorBoundary>
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export type { VelvetProviderProps };
export default VelvetProvider;
