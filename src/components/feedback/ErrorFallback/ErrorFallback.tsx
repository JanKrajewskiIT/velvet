import { splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';

import FallbackState from '../FallbackState/FallbackState';

interface ErrorFallbackOwnProps {
  label: string;
  description: string;
  onRetry: () => void;
}

const ErrorFallback = (props: Props<ErrorFallbackOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'onRetry']);

  return (
    <FallbackState
      {...rest}
      class={local.class}
      label={local.label}
      description={local.description}
      action={<Button onClick={local.onRetry} label={ts('error.retry')} />}
    />
  );
};

export default ErrorFallback;
