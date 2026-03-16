import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize, type ButtonVariant } from '../Button/Button';
import styles from './AffixButton.module.css';

interface AffixButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'prefix'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  badge?: string | number;
  children: JSX.Element;
  contentClass?: string;
  prefixClass?: string;
  bodyClass?: string;
  suffixClass?: string;
  badgeClass?: string;
}

const AffixButton = (props: Props<AffixButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'size',
    'prefix',
    'suffix',
    'badge',
    'children',
    'contentClass',
    'prefixClass',
    'bodyClass',
    'suffixClass',
    'badgeClass',
  ]);

  return (
    <Button {...rest} variant={local.variant} size={local.size} class={local.class}>
      <span class={classNames(styles.content, local.contentClass)}>
        <Show when={local.prefix}>
          <span class={classNames(styles.prefix, local.prefixClass)}>{local.prefix}</span>
        </Show>
        <span class={classNames(styles.body, local.bodyClass)}>{local.children}</span>
        <Show when={local.badge !== undefined}>
          <span class={classNames(styles.badge, local.badgeClass)}>{local.badge}</span>
        </Show>
        <Show when={local.suffix}>
          <span class={classNames(styles.suffix, local.suffixClass)}>{local.suffix}</span>
        </Show>
      </span>
    </Button>
  );
};

export default AffixButton;
