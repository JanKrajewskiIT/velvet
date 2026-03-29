import type { JSX } from 'solid-js';
import { onMount } from 'solid-js';

import type Props from '~/models/Props';

export interface AuthRedirectProps {
  onRedirect: () => void | Promise<void>;
  fallback?: JSX.Element;
}

const AuthRedirect = (props: Props<AuthRedirectProps>) => {
  onMount(() => {
    const onRedirect = props.onRedirect;

    Promise.resolve()
      .then(() => onRedirect())
      .catch(() => undefined);
  });

  return <>{props.fallback ?? null}</>;
};

export default AuthRedirect;
