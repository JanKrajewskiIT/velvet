import type { JSX, ParentProps } from 'solid-js';

import type Props from '~/models/Props';

import ButtonBase from '../../inputs/shared/ButtonBase';
import styles from './Collapsible.module.css';

interface CollapsibleProps {
  open: boolean;
  onToggle: () => void;
  trigger: JSX.Element;
}

const Collapsible = (props: ParentProps<Props<CollapsibleProps>>) => {
  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <ButtonBase class={styles.trigger} onClick={() => props.onToggle()} aria-expanded={props.open}>
        {props.trigger}
      </ButtonBase>
      <div class={`${styles.content} ${props.open ? styles.contentOpen : ''}`}>
        <div class={styles.inner}>{props.children}</div>
      </div>
    </div>
  );
};

export default Collapsible;
