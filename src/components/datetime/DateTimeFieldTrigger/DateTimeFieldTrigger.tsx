import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DateTimeFieldTrigger.module.css';

interface DateTimeFieldTriggerOwnProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  trigger: (triggerClass: string) => JSX.Element;
  children?: JSX.Element;
}

const DateTimeFieldTrigger = (props: Props<DateTimeFieldTriggerOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'open', 'trigger', 'children']);

  const triggerClass = () => classNames(local.open && styles.triggerOpen);

  return (
    <div {...rest} class={classNames(styles.root, local.open && styles.rootOpen, local.class)}>
      {local.trigger(triggerClass())}
      {local.children}
    </div>
  );
};

export default DateTimeFieldTrigger;
