import { type JSX, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ListItemCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ListItem.module.css';

interface ListItemOwnProps extends Omit<ListItemCoreNativeProps, 'onClick'> {
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
        <span class={styles.icon}>{local.icon}</span>
      </Show>
      <span class={styles.content}>
        <Text as="span" variant="bodyMd">
          {local.label}
        </Text>
        <Show when={local.secondary}>
          <Text as="span" variant="caption" tone="muted">
            {local.secondary}
          </Text>
        </Show>
      </span>
      <Show when={local.action}>
        <span class={styles.action}>{local.action}</span>
      </Show>
    </>
  );

  return (
    <li class={classNames(styles.listItem, local.class)} {...rest}>
      <Show when={local.onClick} fallback={<div class={styles.inner}>{content()}</div>}>
        {(handler) => (
          <Button class={styles.innerButton} variant="subtle" size="md" onClick={handler()}>
            <span class={styles.innerContent}>{content()}</span>
          </Button>
        )}
      </Show>
    </li>
  );
};

export default ListItem;
