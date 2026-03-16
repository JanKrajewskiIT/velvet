import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import Button, { type ButtonSize } from '../Button/Button';
import styles from './LocaleSwitcher.module.css';

export type LocaleSwitcherVariant = 'navbar' | 'surface';

interface LocaleSwitcherProps {
  text: string;
  switchLabel: string;
  onSwitch: () => void;
  variant?: LocaleSwitcherVariant;
  size?: ButtonSize;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  return (
    <Button
      class={classNames(styles.button, props.variant !== 'surface' && styles.navbar, props.class)}
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
