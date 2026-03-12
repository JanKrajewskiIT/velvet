import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../inputs/Button/Button';
import styles from './LocaleSwitcher.module.css';

export type LocaleSwitcherVariant = 'navbar' | 'surface';

interface LocaleSwitcherProps {
  label: string;
  switchLabel: string;
  onSwitch: () => void;
  variant?: LocaleSwitcherVariant;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  const variantClass = () => (props.variant === 'surface' ? styles.surface : '');

  return (
    <Button
      class={classNames(styles.button, variantClass(), props.class)}
      variant="ghost"
      onClick={() => props.onSwitch()}
      aria-label={props.switchLabel}
      title={props.switchLabel}
    >
      <span class={styles.label}>{props.label}</span>
    </Button>
  );
};

export default LocaleSwitcher;
