import { createSignal, createUniqueId, onCleanup, Show, splitProps } from 'solid-js';

import Floating from '~/components/overlays/Floating/Floating';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';
import arrow from '~/utils/floating/middleware/arrow';
import type { Placement } from '~/utils/floating/types';

import Surface from '../../surfaces/Surface/Surface';
import Text from '../../typography/Text/Text';
import styles from './Tooltip.module.css';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipOwnProps extends DivCoreNativeProps {
  content: string;
  position?: TooltipPosition;
}

const placementByPosition: Record<TooltipPosition, Placement> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

const TOOLTIP_OFFSET = 8;

const Tooltip = (props: Props<TooltipOwnProps>) => {
  const tooltipId = createUniqueId();
  const [local, rest] = splitProps(props, ['content', 'position', 'children', 'class', 'aria-describedby']);
  const [isVisible, setIsVisible] = createSignal(false);
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement | undefined>(undefined);
  const [arrowRef, setArrowRef] = createSignal<HTMLSpanElement | undefined>(undefined);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer) clearTimeout(timer);
  });

  const show = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => setIsVisible(true), 200);
  };

  const hide = (): void => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const middleware = () => [arrow({ element: () => arrowRef() })];

  return (
    <div
      class={classNames(styles.tooltipContainer, local.class)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      ref={setContainerRef}
      {...rest}
      aria-describedby={joinAriaIds(local['aria-describedby'], isVisible() ? tooltipId : undefined)}
    >
      {local.children}
      <Show when={isVisible()}>
        <Floating
          anchor={containerRef}
          open={isVisible()}
          placement={placementByPosition[local.position ?? 'top']}
          offset={TOOLTIP_OFFSET}
          padding={8}
          extraMiddleware={middleware()}
          class={styles.floatingHost}
        >
          <Surface
            id={tooltipId}
            role="tooltip"
            class={styles.tooltipContent}
            tone="inverse"
            elevation="popover"
            radius="sm"
            border={false}
          >
            <Text as="span" variant="caption" tone="inverse">
              {local.content}
            </Text>
            <span ref={setArrowRef} class={styles.arrow} aria-hidden="true" />
          </Surface>
        </Floating>
      </Show>
    </div>
  );
};

export default Tooltip;
