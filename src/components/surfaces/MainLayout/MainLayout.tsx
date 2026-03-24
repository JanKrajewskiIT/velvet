import { type JSX, type ParentProps, splitProps, Suspense } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import LoadingContainer from '../../feedback/LoadingContainer/LoadingContainer';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  navbar?: JSX.Element;
  footer?: JSX.Element;
}

const MainLayout = (props: ParentProps<Props<MainLayoutProps>>) => {
  const [local, rest] = splitProps(props, ['navbar', 'footer', 'children', 'class']);

  return (
    <div {...rest} class={classNames(styles.layout, local.class)}>
      {local.navbar}
      <main class={styles.main}>
        <div class={styles.container}>
          <Suspense fallback={<LoadingContainer />}>{local.children}</Suspense>
        </div>
      </main>
      {local.footer}
    </div>
  );
};

export default MainLayout;
