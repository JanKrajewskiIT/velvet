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

/** Renders `app` inside `VelvetProvider`. Returns the function that unmounts it. */
export const mountVelvetApp = ({ root, app, ...providerProps }: MountVelvetAppOptions): (() => void) =>
  render(() => <VelvetProvider {...providerProps}>{app()}</VelvetProvider>, resolveContainer(root));
