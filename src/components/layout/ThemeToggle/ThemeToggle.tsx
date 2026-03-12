import { AiFillMoon, AiFillSun } from 'solid-icons/ai';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import { useTheme } from '../../../theme/ThemeProvider';
import ButtonBase from '../../inputs/shared/ButtonBase';
import styles from './ThemeToggle.module.css';

export type ThemeToggleVariant = 'light' | 'dark';

interface ThemeToggleProps {
  lightLabel: string;
  darkLabel: string;
  groupLabel?: string;
  variant?: ThemeToggleVariant;
}

const ThemeToggle = (props: Props<ThemeToggleProps>) => {
  const { resolved, setTheme } = useTheme();
  const variantClass = () => (props.variant === 'light' ? styles.light : '');

  const handleLight = () => {
    setTheme('light');
  };
  const handleDark = () => {
    setTheme('dark');
  };

  return (
    <div
      class={`${styles.group} ${variantClass()} ${props.class ?? ''}`}
      role="group"
      aria-label={props.groupLabel ?? props.darkLabel}
    >
      <ButtonBase
        class={classNames(styles.toggle, resolved() === 'light' && styles.selected)}
        variant="subtle"
        size="sm"
        iconOnly
        onClick={handleLight}
        aria-label={props.lightLabel}
        aria-pressed={resolved() === 'light'}
      >
        <AiFillSun class={styles.icon} />
      </ButtonBase>
      <ButtonBase
        class={classNames(styles.toggle, resolved() === 'dark' && styles.selected)}
        variant="subtle"
        size="sm"
        iconOnly
        onClick={handleDark}
        aria-label={props.darkLabel}
        aria-pressed={resolved() === 'dark'}
      >
        <AiFillMoon class={styles.icon} />
      </ButtonBase>
    </div>
  );
};

export default ThemeToggle;
