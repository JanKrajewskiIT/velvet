import { createSignal, createUniqueId, onCleanup, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';

import Surface from '../../surfaces/Surface/Surface';
import Text from '../../typography/Text/Text';
import styles from './Tooltip.module.css';

interface TooltipOwnProps extends DivCoreNativeProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip = (props: Props<TooltipOwnProps>) => {
  const tooltipId = createUniqueId();
  const [local, rest] = splitProps(props, ['content', 'position', 'delay', 'children', 'class', 'aria-describedby']);
  const [isVisible, setIsVisible] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer) clearTimeout(timer);
  });

  const show = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => setIsVisible(true), local.delay || 200);
  };

  const hide = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  return (
    <div
      class={classNames(styles.tooltipContainer, local.class)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...rest}
      aria-describedby={joinAriaIds(local['aria-describedby'], isVisible() ? tooltipId : undefined)}
    >
      {local.children}
      <Show when={isVisible()}>
        <Surface
          id={tooltipId}
          role="tooltip"
          class={classNames(styles.tooltipContent, styles[local.position || 'top'])}
          tone="inverse"
          elevation="popover"
          radius="sm"
          border={false}
        >
          <Text as="span" variant="caption" tone="inverse">
            {local.content}
          </Text>
        </Surface>
      </Show>
    </div>
  );
};

export default Tooltip;
