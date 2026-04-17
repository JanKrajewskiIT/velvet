import { splitProps } from 'solid-js';

import AuthGuard, { type AuthGuardProps } from '~/auth/AuthGuard';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Page.module.css';

export const Page = (props: Props<AuthGuardProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);

  const content = () => {
    if (!rest.roles) {
      return local.children;
    }

    return <AuthGuard {...rest}>{local.children}</AuthGuard>;
  };

  return <div class={classNames(styles.page, local.class)}>{content()}</div>;
};

export default Page;
