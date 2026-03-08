import { type JSX, type ParentProps, Suspense } from 'solid-js';

import type Props from '../../../models/Props';
import LoadingContainer from '../../common/LoadingContainer/LoadingContainer';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  navbar?: JSX.Element;
  footer?: JSX.Element;
}

const MainLayout = (props: ParentProps<Props<MainLayoutProps>>) => {
  return (
    <div class={`${styles.layout} ${props.class ?? ''}`}>
      {props.navbar}
      <main class={styles.main}>
        <div class={styles.container}>
          <Suspense fallback={<LoadingContainer />}>{props.children}</Suspense>
          {props.footer}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
