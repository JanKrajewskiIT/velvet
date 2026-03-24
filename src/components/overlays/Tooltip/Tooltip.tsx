import { createSignal, createUniqueId, type JSX, onCleanup, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './Tooltip.module.css';

interface TooltipOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  contentClass?: string;
}

const Tooltip = (props: Props<TooltipOwnProps>) => {
  const tooltipId = createUniqueId();
  const [local, rest] = splitProps(props, ['content', 'position', 'delay', 'children', 'class', 'contentClass']);
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
      aria-describedby={isVisible() ? tooltipId : undefined}
      {...rest}
    >
      {local.children}
      <Show when={isVisible()}>
        <div
          id={tooltipId}
          role="tooltip"
          class={classNames(styles.tooltipContent, styles[local.position || 'top'], local.contentClass)}
        >
          <Text as="span" variant="caption" tone="inverse">
            {local.content}
          </Text>
        </div>
      </Show>
    </div>
  );
};

export default Tooltip;
