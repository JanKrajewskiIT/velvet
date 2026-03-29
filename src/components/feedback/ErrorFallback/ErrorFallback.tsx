import { splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import type Props from '~/models/Props';

import FallbackState from '../FallbackState/FallbackState';

interface ErrorFallbackOwnProps {
  label: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

const ErrorFallback = (props: Props<ErrorFallbackOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'retryLabel', 'onRetry']);

  return (
    <FallbackState
      {...rest}
      class={local.class}
      label={local.label}
      description={local.description}
      action={<Button onClick={local.onRetry} label={local.retryLabel} />}
    />
  );
};

export default ErrorFallback;
