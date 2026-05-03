import { AuthProvider } from '@jankrajewskiit/auth';
import { createMemo, ErrorBoundary, type JSX, type ParentProps, Show } from 'solid-js';

import ErrorFallback from '~/components/feedback/ErrorFallback/ErrorFallback';
import ToastProvider from '~/components/feedback/Toast/ToastProvider/ToastProvider';
import { I18nProvider, useI18n } from '~/i18n';
import { VELVET_LOCALE_STORAGE_KEY, type VelvetConfigInput } from '~/providers/velvet-config';
import { ThemeProvider } from '~/theme/ThemeProvider';

interface VelvetProviderProps extends ParentProps {
  config: VelvetConfigInput;
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

  const content = () => (
    <ToastProvider>
      <ErrorBoundary fallback={renderErrorFallback}>{props.children}</ErrorBoundary>
    </ToastProvider>
  );

  return (
    <ThemeProvider>
      <I18nProvider
        initialLocale={props.config.initialLocale}
        storageKey={VELVET_LOCALE_STORAGE_KEY}
        dictionaries={props.config.dictionaries}
      >
        <Show when={props.config.authConfig} fallback={content()}>
          {(authConfig) => <AuthProvider config={authConfig()}>{content()}</AuthProvider>}
        </Show>
      </I18nProvider>
    </ThemeProvider>
  );
};

export type { VelvetProviderProps };
export default VelvetProvider;
