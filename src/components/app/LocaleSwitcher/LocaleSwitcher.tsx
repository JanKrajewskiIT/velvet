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
  const isSurface = () => props.variant === 'surface';

  return (
    <Button
      class={classNames(styles.button, isSurface() ? styles.surface : styles.navbar, props.class)}
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
