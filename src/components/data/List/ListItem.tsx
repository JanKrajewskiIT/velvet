import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import styles from './ListItem.module.css';

interface ListItemOwnProps extends Omit<JSX.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  icon?: JSX.Element;
  secondary?: JSX.Element;
  action?: JSX.Element;
  children: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

const ListItem = (props: Props<ListItemOwnProps>) => {
  const [local, rest] = splitProps(props, ['icon', 'secondary', 'action', 'children', 'onClick', 'class']);

  const content = () => (
    <>
      <Show when={local.icon}>
        <div class={styles.icon}>{local.icon}</div>
      </Show>
      <div class={styles.content}>
        <span class={styles.primary}>{local.children}</span>
        <Show when={local.secondary}>
          <span class={styles.secondary}>{local.secondary}</span>
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
