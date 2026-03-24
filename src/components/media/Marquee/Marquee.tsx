import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Marquee.module.css';

interface MarqueeOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: JSX.Element;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string;
}

const Marquee = (props: Props<MarqueeOwnProps>) => {
  const [local, rest] = splitProps(props, ['children', 'speed', 'direction', 'pauseOnHover', 'gap', 'class']);

  const speed = () => `${local.speed ?? 30}s`;
  const gap = () => local.gap ?? 'var(--spacing-xl)';
  const pauseOnHover = () => local.pauseOnHover ?? true;
  const isRight = () => local.direction === 'right';

  const wrapperStyle = () => ({ '--speed': speed(), '--gap': gap() });

  return (
    <div
      {...rest}
      class={classNames(styles.marquee, pauseOnHover() && styles.pauseOnHover, local.class)}
      style={wrapperStyle()}
    >
      <div class={classNames(styles.track, isRight() && styles.right)}>
        <div class={styles.content}>{local.children}</div>
        <div class={styles.content} aria-hidden="true">
          {local.children}
        </div>
      </div>
    </div>
  );
};

export type { MarqueeOwnProps };
export default Marquee;
