import { AiFillMoon, AiFillSun } from 'solid-icons/ai';
import { createMemo, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import type { SegmentedControlOption } from '~/components/switchers/SegmentedControl/SegmentedControl';
import SegmentedControl from '~/components/switchers/SegmentedControl/SegmentedControl';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import { useTheme } from '~/theme/ThemeProvider';
import classNames from '~/utils/classNames';

import styles from './ThemeToggle.module.css';

export type ThemeToggleVariant = 'light' | 'navbar' | 'dark';

const variantClassByValue: Record<ThemeToggleVariant, string | undefined> = {
  light: styles.light,
  navbar: styles.navbar,
  dark: undefined,
};

interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
}

const ThemeToggle = (props: Props<ThemeToggleProps>) => {
  const { ts } = useI18n();
  const { resolved, setTheme } = useTheme();
  const [local, rest] = splitProps(props, ['class', 'variant']);
  const variantClass = createMemo(() => variantClassByValue[local.variant ?? 'light']);

  const options = createMemo<SegmentedControlOption[]>(() => [
    { value: 'light', label: <Icon icon={AiFillSun} class={styles.icon} />, ariaLabel: ts('theme.light') },
    { value: 'dark', label: <Icon icon={AiFillMoon} class={styles.icon} />, ariaLabel: ts('theme.dark') },
  ]);

  const handleThemeChange = (next: string) => {
    if (next === 'light' || next === 'dark') {
      setTheme(next);
    }
  };

  return (
    <div
      {...rest}
      class={classNames(styles.group, variantClass(), local.class)}
      role="group"
      aria-label={ts('theme.label')}
    >
      <SegmentedControl
        class={styles.segmented}
        options={options()}
        value={resolved()}
        onChange={handleThemeChange}
        optionClass={styles.toggle}
        activeOptionClass={styles.selected}
        indicator={false}
        size="sm"
      />
    </div>
  );
};

export default ThemeToggle;
