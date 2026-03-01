import { IoChevronDown } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createSignal } from 'solid-js';

import type Props from '../../../models/Props';

import styles from './SectionCard.module.css';

interface SectionCardProps {
  title: string;
  defaultOpen?: boolean;
  children: JSX.Element;
}

const SectionCard = (props: Props<SectionCardProps>) => {
  const [open, setOpen] = createSignal(props.defaultOpen ?? false);

  return (
    <div class={`${styles.card} ${props.class ?? ''}`}>
      <button
        type="button"
        class={styles.header}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open()}
      >
        <div class={styles.headerLeft}>
          <span class={styles.title}>{props.title}</span>
        </div>
        <IoChevronDown
          class={`${styles.chevron} ${open() ? styles.chevronOpen : ''}`}
        />
      </button>
      <div
        class={`${styles.bodyWrapper} ${open() ? styles.bodyWrapperOpen : ''}`}
      >
        <div class={styles.bodyInner}>
          <div class={styles.body}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
