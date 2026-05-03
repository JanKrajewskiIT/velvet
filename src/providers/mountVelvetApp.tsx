import { handleAuthRedirectCallback } from '@jankrajewskiit/auth';
import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import type { VelvetConfigInput } from '~/providers/velvet-config';
import VelvetProvider, { type VelvetProviderProps } from '~/providers/VelvetProvider';

interface MountVelvetAppOptions {
  root: string | HTMLElement;
  app: () => JSX.Element;
  config: VelvetConfigInput;
  errorFallback?: VelvetProviderProps['errorFallback'];
}

const mountVelvetApp = async (options: MountVelvetAppOptions): Promise<void> => {
  const navigationHandled = options.config.authConfig
    ? await handleAuthRedirectCallback(options.config.authConfig).catch(() => false)
    : false;
  if (navigationHandled) {
    return;
  }

  const root = typeof options.root === 'string' ? document.getElementById(options.root) : options.root;
  if (!root) {
    throw new Error('Root element not found');
  }

  render(
    () => (
      <VelvetProvider config={options.config} errorFallback={options.errorFallback}>
        {options.app()}
      </VelvetProvider>
    ),
    root,
  );
};

export type { MountVelvetAppOptions };
export { mountVelvetApp };
