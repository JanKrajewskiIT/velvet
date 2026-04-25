import type { Accessor, JSX } from 'solid-js';
import { createMemo, mergeProps, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import useFloating from '~/hooks/useFloating';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import flip from '~/utils/floating/middleware/flip';
import matchWidth from '~/utils/floating/middleware/matchWidth';
import offsetMiddleware from '~/utils/floating/middleware/offset';
import shift from '~/utils/floating/middleware/shift';
import size from '~/utils/floating/middleware/size';
import type { Middleware, Placement, ReferenceElement } from '~/utils/floating/types';

import styles from './Floating.module.css';

export interface FloatingProps extends DivCoreNativeProps {
  /** Reference (anchor) element accessor. May be a real HTMLElement or a virtual element. */
  anchor: Accessor<ReferenceElement | undefined | null>;
  /** Whether the floating element is open / mounted. */
  open: boolean;
  /** Preferred placement. Defaults to 'bottom-start'. */
  placement?: Placement;
  /** Distance from the reference element on the main axis. */
  offset?: number;
  /** Viewport padding used by flip / shift / size. */
  padding?: number;
  /** Match the reference element width via inline `width` style. */
  matchWidth?: boolean;
  /** Expose `--available-height` / `--available-width` CSS vars based on viewport space. */
  exposeAvailableSize?: boolean;
  /** Subscribe to per-frame position checks (helpful with transforms / virtual elements). */
  animationFrame?: boolean;
  /** Additional middleware appended after the defaults. */
  extraMiddleware?: Middleware[];
  ref?: JSX.HTMLAttributes<HTMLDivElement>['ref'];
}

/**
 * Floating primitive: portals its children to document.body, positions them with
 * the floating engine (flip/shift/size), and re-positions on scroll/resize/element resize.
 *
 * - Always uses `position: fixed` via translate3d for sub-pixel transforms.
 * - Exposes `data-placement` on the root for arrow/animation styling.
 * - Adds `var(--z-floating)` z-index unless caller overrides via class.
 */
const Floating = (rawProps: Props<FloatingProps>) => {
  const defaultPlacement: Placement = 'bottom-start';
  const props = mergeProps({ placement: defaultPlacement }, rawProps);
  const [local, rest] = splitProps(props, [
    'anchor',
    'open',
    'placement',
    'offset',
    'padding',
    'matchWidth',
    'exposeAvailableSize',
    'animationFrame',
    'extraMiddleware',
    'class',
    'style',
    'ref',
    'children',
  ]);

  const middleware = createMemo(() => {
    const padding = local.padding ?? 8;
    const list: Middleware[] = [
      offsetMiddleware(local.offset ?? 0),
      flip({ padding }),
      shift({ padding }),
      size({ padding }),
    ];
    if (local.matchWidth) list.push(matchWidth());
    if (local.extraMiddleware) list.push(...local.extraMiddleware);
    return list;
  });

  const placementAccessor = (): Placement => local.placement;

  const floating = useFloating({
    reference: () => local.anchor() ?? undefined,
    open: () => local.open,
    placement: placementAccessor,
    middleware,
    animationFrame: () => local.animationFrame,
  });

  const composedStyle = (): JSX.CSSProperties => {
    const data = floating.middlewareData();
    const base = floating.floatingStyle();
    const extra: JSX.CSSProperties = {};
    if (local.matchWidth && data.matchWidth) {
      extra.width = `${data.matchWidth.width}px`;
    }
    if (local.exposeAvailableSize && data.size) {
      (extra as Record<string, string>)['--available-height'] = `${data.size.availableHeight}px`;
      (extra as Record<string, string>)['--available-width'] = `${data.size.availableWidth}px`;
    }
    if (data.arrow) {
      if (data.arrow.x !== undefined) (extra as Record<string, string>)['--arrow-x'] = `${data.arrow.x}px`;
      if (data.arrow.y !== undefined) (extra as Record<string, string>)['--arrow-y'] = `${data.arrow.y}px`;
    }
    return { ...base, ...extra, ...(local.style as JSX.CSSProperties) };
  };

  const setRef = (el: HTMLDivElement): void => {
    floating.setFloating(el);
    const r = local.ref;
    if (typeof r === 'function') r(el);
  };

  return (
    <Show when={local.open}>
      <Portal mount={typeof document !== 'undefined' ? document.body : undefined}>
        <div
          {...rest}
          ref={(el) => setRef(el)}
          data-placement={floating.placement()}
          class={classNames(styles.floating, local.class)}
          style={composedStyle()}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

export default Floating;
