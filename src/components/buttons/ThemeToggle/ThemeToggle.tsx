import { AiFillMoon, AiFillSun } from 'solid-icons/ai';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import { useTheme } from '../../../theme/ThemeProvider';
import SegmentedControl from '../../switchers/SegmentedControl/SegmentedControl';
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
  const options = () => [
    { value: 'light', label: <AiFillSun class={styles.icon} />, ariaLabel: props.lightLabel },
    { value: 'dark', label: <AiFillMoon class={styles.icon} />, ariaLabel: props.darkLabel },
  ];

  return (
    <div
      class={`${styles.group} ${variantClass()} ${props.class ?? ''}`}
      role="group"
      aria-label={props.groupLabel ?? props.darkLabel}
    >
      <SegmentedControl
        class={classNames(styles.segmented)}
        options={options()}
        value={resolved()}
        onChange={(next) => setTheme(next as ThemeToggleVariant)}
        optionClass={styles.toggle}
        activeOptionClass={styles.selected}
        size="sm"
      />
    </div>
  );
};

export default ThemeToggle;
