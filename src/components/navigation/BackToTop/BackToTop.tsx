import { IoArrowUp } from 'solid-icons/io';
import { createEffect, createSignal, onCleanup } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ButtonBase from '../../inputs/shared/ButtonBase';
import styles from './BackToTop.module.css';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  ariaLabel?: string;
}

const BackToTop = (props: Props<BackToTopProps>) => {
  const [visible, setVisible] = createSignal(false);

  const threshold = () => props.threshold ?? 300;
  const smooth = () => props.smooth ?? true;
  const label = () => props.ariaLabel ?? 'Back to top';

  createEffect(() => {
    const onScroll = () => setVisible(window.scrollY >= threshold());

    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' });
  };

  return (
    <ButtonBase
      class={classNames(styles.button, visible() ? styles.visible : styles.hidden, props.class)}
      variant="primary"
      size="lg"
      iconOnly
      onClick={scrollToTop}
      aria-label={label()}
    >
      <IoArrowUp size={24} />
    </ButtonBase>
  );
};

export default BackToTop;
