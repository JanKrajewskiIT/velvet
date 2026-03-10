import type Props from '~/models/Props';

import styles from './JsonDisplay.module.css';

interface JsonDisplayProps {
  data: unknown;
}

const JsonDisplay = (props: Props<JsonDisplayProps>) => {
  return (
    <div class={`${styles.container} ${props.class ?? ''}`}>
      <pre class={styles.pre}>{JSON.stringify(props.data, null, 2)}</pre>
    </div>
  );
};

export default JsonDisplay;
