import { createMemo, ErrorBoundary, type JSX, type ParentProps } from 'solid-js';

import type { OidcAuthConfig } from '~/auth/AuthProvider';
import { AuthProvider } from '~/auth/AuthProvider';
import ErrorFallback from '~/components/feedback/ErrorFallback/ErrorFallback';
import ToastProvider from '~/components/feedback/Toast/ToastProvider/ToastProvider';
import { I18nProvider, useI18n } from '~/i18n/I18nProvider';
import type { Locale } from '~/i18n/messages';
import { QueryClientProvider, type QueryClientProviderProps } from '~/query/QueryClientProvider';
import { ThemeProvider } from '~/theme/ThemeProvider';

interface VelvetProviderProps extends ParentProps {
  themeStorageKey?: string;
  localeStorageKey?: string;
  initialLocale?: Locale;
  authConfig: OidcAuthConfig;
  query?: Omit<QueryClientProviderProps, 'children'>;
  errorFallback?: JSX.Element;
}

const DefaultErrorFallback = (props: { error: unknown; reset: () => void }) => {
  const { t } = useI18n();

  const description = createMemo(() =>
    props.error instanceof Error && props.error.message ? props.error.message : t('error.description')
  );

  return (
    <ErrorFallback
      label={t('error.title')}
      description={description()}
      retryLabel={t('error.retry')}
      onRetry={props.reset}
    />
  );
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
      <I18nProvider storageKey={props.localeStorageKey} initialLocale={props.initialLocale}>
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
