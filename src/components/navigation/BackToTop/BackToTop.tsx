import { IoArrowUp } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, onCleanup, splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import RoundIconButton from '../../buttons/RoundIconButton/RoundIconButton';
import styles from './BackToTop.module.css';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  scrollRoot?: () => HTMLElement | null | undefined;
}

const BackToTop = (props: Props<BackToTopProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'threshold', 'smooth', 'scrollRoot']);
  const [visible, setVisible] = createSignal(false);

  const threshold = createMemo(() => local.threshold ?? 300);
  const smooth = createMemo(() => local.smooth ?? true);

  createEffect(() => {
    const root = local.scrollRoot?.() ?? null;
    let rafId: number | undefined;

    const update = () => {
      if (root) {
        setVisible(root.scrollTop >= threshold());
      } else {
        setVisible(window.scrollY >= threshold());
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== undefined) return;
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        update();
      });
    };

    update();
    if (root) {
      root.addEventListener('scroll', scheduleUpdate, { passive: true });
      onCleanup(() => {
        if (rafId !== undefined) cancelAnimationFrame(rafId);
        root.removeEventListener('scroll', scheduleUpdate);
      });
    } else {
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
      onCleanup(() => {
        if (rafId !== undefined) cancelAnimationFrame(rafId);
        window.removeEventListener('scroll', scheduleUpdate);
      });
    }
  });

  const scrollToTop = () => {
    const root = local.scrollRoot?.() ?? null;
    if (root) {
      root.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: smooth() ? 'smooth' : 'auto' });
    }
  };

  return (
    <RoundIconButton
      {...rest}
      class={classNames(styles.button, visible() ? styles.visible : styles.hidden, local.class)}
      size="lg"
      elevation="popover"
      onClick={scrollToTop}
      label={ts('backToTop.label')}
      icon={IoArrowUp}
      iconSize="lg"
    />
  );
};

export default BackToTop;
