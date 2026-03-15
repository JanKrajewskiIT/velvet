import type { ParentProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Marquee.module.css';

interface MarqueeProps extends ParentProps {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string;
}

const Marquee = (props: Props<MarqueeProps>) => {
  const speed = () => `${props.speed ?? 30}s`;
  const gap = () => props.gap ?? 'var(--spacing-xl)';
  const pauseOnHover = () => props.pauseOnHover ?? true;
  const isRight = () => props.direction === 'right';

  const wrapperClass = () => `${styles.marquee} ${pauseOnHover() ? styles.pauseOnHover : ''} ${props.class ?? ''}`;

  const trackClass = () => `${styles.track} ${isRight() ? styles.right : ''}`;

  const wrapperStyle = () => ({ '--speed': speed(), '--gap': gap() });

  return (
    <div class={wrapperClass()} style={wrapperStyle()}>
      <div class={trackClass()}>
        <div class={styles.content}>{props.children}</div>
        <div class={styles.content} aria-hidden="true">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
