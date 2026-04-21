import { type JSX, type ParentProps, Show, splitProps, Suspense } from 'solid-js';

import { useAuth } from '~/auth/AuthProvider';
import PageLoader from '~/components/loaders/PageLoader/PageLoader';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MainLayout.module.css';

interface MainLayoutProps {
  navbar?: JSX.Element;
  footer?: JSX.Element;
}

const MainLayout = (props: ParentProps<Props<MainLayoutProps>>) => {
  const [local, rest] = splitProps(props, ['navbar', 'footer', 'children', 'class']);
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div {...rest} class={classNames(styles.layout, local.class)}>
      <Show when={isAuthenticated() || isLoading()}>
        {local.navbar}
        <main class={styles.main}>
          <div class={styles.container}>
            <Suspense fallback={<PageLoader />}>{local.children}</Suspense>
          </div>
        </main>
        {local.footer}
      </Show>
    </div>
  );
};

export default MainLayout;
