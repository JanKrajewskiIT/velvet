import type Props from '../../../models/Props';

import styles from './LocaleSwitcher.module.css';

interface LocaleSwitcherProps {
  locale: string;
  label: string;
  switchLabel: string;
  onSwitch: () => void;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  return (
    <button
      class={`${styles.button} ${props.class ?? ''}`}
      onClick={() => props.onSwitch()}
      aria-label={props.switchLabel}
      title={props.switchLabel}
    >
      <span class={styles.label}>{props.label}</span>
    </button>
  );
};

export default LocaleSwitcher;
