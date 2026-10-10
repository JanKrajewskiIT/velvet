import { handleAuthRedirectCallback } from '@jankrajewskiit/auth';
import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';

import { VelvetProvider, type VelvetProviderProps } from './VelvetProvider';

export interface MountVelvetAppOptions extends Omit<VelvetProviderProps, 'children'> {
  /** Element, or the id of the element, to render into. */
  root: string | HTMLElement;
  app: () => JSX.Element;
}

const resolveContainer = (root: string | HTMLElement): HTMLElement => {
  if (typeof root !== 'string') return root;
  const container = document.getElementById(root);
  if (!container) throw new Error(`mountVelvetApp: no element with id "${root}".`);
  return container;
};

/** Handles OIDC before mounting. Returns a disposer, or undefined when the callback starts navigation. Rejects on bootstrap failure. */
export const mountVelvetApp = async ({
  root,
  app,
  ...providerProps
}: MountVelvetAppOptions): Promise<(() => void) | undefined> => {
  if (providerProps.authConfig && (await handleAuthRedirectCallback(providerProps.authConfig))) return undefined;
  return render(() => <VelvetProvider {...providerProps}>{app()}</VelvetProvider>, resolveContainer(root));
};
