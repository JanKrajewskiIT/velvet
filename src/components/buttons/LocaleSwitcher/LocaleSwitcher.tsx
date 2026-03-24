import type Props from '~/models/Props';

import Button, { type ButtonOwnProps, type ButtonVariant } from '../Button/Button';

interface LocaleSwitcherProps extends Pick<ButtonOwnProps, 'size' | 'class'> {
  text: string;
  variant?: ButtonVariant;
  switchLabel: string;
  onSwitch: () => void;
}

const LocaleSwitcher = (props: Props<LocaleSwitcherProps>) => {
  return (
    <Button
      class={props.class}
      style={{ width: '60px' }}
      variant={props.variant}
      size={props.size}
      onClick={props.onSwitch}
      aria-label={props.switchLabel}
      title={props.switchLabel}
    >
      {props.text}
    </Button>
  );
};

export default LocaleSwitcher;
