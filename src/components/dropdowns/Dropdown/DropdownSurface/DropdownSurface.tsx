import type { Accessor, JSX } from 'solid-js';
import { createMemo, Show, splitProps } from 'solid-js';

import Floating from '~/components/overlays/Floating/Floating';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import type { Placement } from '~/utils/floating/types';

import Surface from '../../../surfaces/Surface/Surface';
import styles from './DropdownSurface.module.css';

type Align = 'left' | 'right' | 'fullWidth';
type Origin = 'top' | 'topLeft';

export interface DropdownSurfaceProps extends DivCoreNativeProps {
  scrollable?: boolean;
  /** When false, render the surface inline without portal/positioning (caller positions it). */
  panel?: boolean;
  align?: Align;
  origin?: Origin;
  /** Anchor element accessor. Required when `panel` is true (default). */
  anchor?: Accessor<HTMLElement | undefined>;
  /** Whether the surface is open. Defaults to `true` for backwards compatibility. */
  open?: boolean;
  /** Distance from the trigger on the main axis. */
  offset?: number;
  ref?: JSX.HTMLAttributes<HTMLDivElement>['ref'];
}

const placementByAlign: Record<Align, Placement> = {
  left: 'bottom-start',
  right: 'bottom-end',
  fullWidth: 'bottom-start',
};

const originByValue: Record<Origin, string | undefined> = {
  top: styles.originTop,
  topLeft: styles.originTopLeft,
};

const DropdownSurface = (props: Props<DropdownSurfaceProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'scrollable',
    'panel',
    'align',
    'origin',
    'anchor',
    'open',
    'offset',
    'style',
    'ref',
    'children',
  ]);

  const surfaceClass = (): string =>
    classNames(
      styles.surface,
      originByValue[local.origin ?? 'top'],
      local.scrollable !== false && styles.scrollable,
      local.class,
    );

  const isInlinePanel = createMemo(() => local.panel === false);
  const align = createMemo<Align>(() => local.align ?? 'left');
  const placement = createMemo(() => placementByAlign[align()]);
  const isOpen = createMemo(() => (local.open ?? true) && Boolean(local.anchor?.()));

  return (
    <>
      <Show when={isInlinePanel}>
        <Surface
          {...rest}
          ref={local.ref}
          radius="md"
          elevation="popover"
          blur
          style={local.style}
          class={surfaceClass()}
        >
          {local.children}
        </Surface>
      </Show>
      <Show when={() => !isInlinePanel()}>
        <Floating
          anchor={() => local.anchor?.()}
          open={isOpen()}
          placement={placement()}
          offset={local.offset ?? 0}
          matchWidth={align() === 'fullWidth'}
          exposeAvailableSize
        >
          <Surface
            {...rest}
            ref={local.ref}
            radius="md"
            elevation="popover"
            blur
            style={local.style}
            class={surfaceClass()}
          >
            {local.children}
          </Surface>
        </Floating>
      </Show>
    </>
  );
};

export default DropdownSurface;
