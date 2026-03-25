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
  return (
    <FallbackState
      class={props.class}
      label={props.label}
      description={props.description}
      action={<Button onClick={props.onRetry} label={props.retryLabel} />}
    />
  );
};

export default ErrorFallback;
