import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize } from '../Button/Button';
import styles from './LocaleSwitcher.module.css';

export type LocaleSwitcherVariant = 'surface' | 'navbar';

interface LocaleSwitcherProps {
  text: string;
  switchLabel: string;
  onSwitch: () => void;
  size?: ButtonSize;
  variant?: LocaleSwitcherVariant;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  const isNavbar = () => props.variant === 'navbar';

  return (
    <Button
      class={classNames(styles.base, isNavbar() && styles.navbar, props.class)}
      variant="ghost"
      size={props.size}
      onClick={props.onSwitch}
      aria-label={props.switchLabel}
      title={props.switchLabel}
    >
      <Text as="span" variant="labelMd" class={styles.label}>
        {props.text}
      </Text>
    </Button>
  );
};

export default LocaleSwitcher;
