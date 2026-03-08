import { createSignal, JSX, Show, splitProps } from 'solid-js';

import styles from './Tooltip.module.css';

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  content: JSX.Element;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = (props: TooltipProps) => {
  const [local, rest] = splitProps(props, [
    'content',
    'position',
    'delay',
    'children',
    'class',
  ]);
  const [isVisible, setIsVisible] = createSignal(false);
  let timer: number | undefined;

  const show = () => {
    timer = window.setTimeout(() => setIsVisible(true), local.delay || 200);
  };

  const hide = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  return (
    <div
      class={`${styles.tooltipContainer} ${local.class || ''}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...rest}
    >
      {local.children}
      <Show when={isVisible()}>
        <div
          class={`${styles.tooltipContent} ${styles[local.position || 'top']}`}
        >
          {local.content}
        </div>
      </Show>
    </div>
  );
};
