import { AiFillMoon, AiFillSun } from 'solid-icons/ai';

import type Props from '~/models/Props';

import { useTheme } from '../../../theme/ThemeProvider';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  lightLabel: string;
  darkLabel: string;
  groupLabel?: string;
}

const ThemeToggle = (props: Props<ThemeToggleProps>) => {
  const { resolved, setTheme } = useTheme();

  const handleLight = () => {
    setTheme('light');
  };
  const handleDark = () => {
    setTheme('dark');
  };

  return (
    <div
      class={`${styles.group} ${props.class ?? ''}`}
      role="group"
      aria-label={props.groupLabel ?? props.darkLabel}
    >
      <button
        class={`${styles.toggle} ${resolved() === 'light' ? styles.selected : ''}`}
        onClick={handleLight}
        aria-label={props.lightLabel}
        aria-pressed={resolved() === 'light'}
      >
        <AiFillSun class={styles.icon} />
      </button>
      <button
        class={`${styles.toggle} ${resolved() === 'dark' ? styles.selected : ''}`}
        onClick={handleDark}
        aria-label={props.darkLabel}
        aria-pressed={resolved() === 'dark'}
      >
        <AiFillMoon class={styles.icon} />
      </button>
    </div>
  );
};

export default ThemeToggle;
