import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import Text from '../../typography/Text/Text';
import styles from './ListItem.module.css';

interface ListItemOwnProps extends Omit<JSX.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  icon?: JSX.Element;
  secondary?: string;
  action?: JSX.Element;
  label: string;
  children?: never;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

const ListItem = (props: Props<ListItemOwnProps>) => {
  const [local, rest] = splitProps(props, ['icon', 'secondary', 'action', 'label', 'onClick', 'class']);

  const content = () => (
    <>
      <Show when={local.icon}>
        <div class={styles.icon}>{local.icon}</div>
      </Show>
      <div class={styles.content}>
        <Text as="span" variant="labelMd" tone="secondary" class={styles.primary}>
          {local.label}
        </Text>
        <Show when={local.secondary}>
          <Text as="span" variant="caption" tone="muted" class={styles.secondary}>
            {local.secondary}
          </Text>
        </Show>
      </div>
      <Show when={local.action}>
        <div class={styles.action}>{local.action}</div>
      </Show>
    </>
  );

  return (
    <li class={classNames(styles.listItem, local.class)} {...rest}>
      <Show when={local.onClick} fallback={<div class={styles.inner}>{content()}</div>}>
        {(handler) => (
          <Button class={styles.innerButton} variant="subtle" size="md" onClick={handler()}>
            {content()}
          </Button>
        )}
      </Show>
    </li>
  );
};

export default ListItem;
