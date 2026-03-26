import { AiFillMoon, AiFillSun } from 'solid-icons/ai';
import { createMemo } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import type { SegmentedControlOption } from '~/components/switchers/SegmentedControl/SegmentedControl';
import SegmentedControl from '~/components/switchers/SegmentedControl/SegmentedControl';
import type Props from '~/models/Props';
import { useTheme } from '~/theme/ThemeProvider';
import classNames from '~/utils/classNames';

import styles from './ThemeToggle.module.css';

export type ThemeToggleVariant = 'light' | 'navbar' | 'dark';

interface ThemeToggleProps {
  lightLabel: string;
  darkLabel: string;
  groupLabel?: string;
  variant?: ThemeToggleVariant;
}

const ThemeToggle = (props: Props<ThemeToggleProps>) => {
  const { resolved, setTheme } = useTheme();
  const variantClass = () => {
    const variant = props.variant ?? 'light';
    if (variant === 'dark') return styles.navbar;
    return styles[variant];
  };

  const options = createMemo<SegmentedControlOption[]>(() => [
    { value: 'light', label: <Icon icon={AiFillSun} class={styles.icon} />, ariaLabel: props.lightLabel },
    { value: 'dark', label: <Icon icon={AiFillMoon} class={styles.icon} />, ariaLabel: props.darkLabel },
  ]);

  const handleThemeChange = (next: string) => {
    if (next === 'light' || next === 'dark') {
      setTheme(next);
    }
  };

  return (
    <div
      class={classNames(styles.group, variantClass(), props.class)}
      role="group"
      aria-label={props.groupLabel ?? props.darkLabel}
    >
      <SegmentedControl
        class={styles.segmented}
        options={options()}
        value={resolved()}
        onChange={handleThemeChange}
        optionClass={styles.toggle}
        activeOptionClass={styles.selected}
        size="sm"
      />
    </div>
  );
};

export default ThemeToggle;
