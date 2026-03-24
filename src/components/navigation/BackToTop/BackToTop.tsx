import { IoArrowUp } from 'solid-icons/io';
import { createEffect, createSignal, onCleanup } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import RoundIconButton from '../../buttons/RoundIconButton/RoundIconButton';
import styles from './BackToTop.module.css';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  ariaLabel?: string;
  scrollRoot?: () => HTMLElement | null | undefined;
}

const BackToTop = (props: Props<BackToTopProps>) => {
  const [visible, setVisible] = createSignal(false);

  const threshold = () => props.threshold ?? 300;
  const smooth = () => props.smooth ?? true;
  const label = () => props.ariaLabel ?? 'Back to top';

  createEffect(() => {
    const root = props.scrollRoot?.() ?? null;
    const update = () => {
      if (root) {
        setVisible(root.scrollTop >= threshold());
      } else {
        setVisible(window.scrollY >= threshold());
      }
    };

    update();
    if (root) {
      root.addEventListener('scroll', update, { passive: true });
      onCleanup(() => root.removeEventListener('scroll', update));
    } else {
      window.addEventListener('scroll', update, { passive: true });
      onCleanup(() => window.removeEventListener('scroll', update));
    }
  });

  const scrollToTop = () => {
    const root = props.scrollRoot?.() ?? null;
    if (root) {
      root.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' });
    }
  };

  return (
    <RoundIconButton
      class={classNames(styles.button, visible() ? styles.visible : styles.hidden, props.class)}
      size="lg"
      elevation="popover"
      onClick={scrollToTop}
      title={label()}
      icon={<IoArrowUp size={24} />}
    />
  );
};

export default BackToTop;
