import { IoCloseOutline } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import Chip from '../Chip/Chip';
import styles from './ClosableChip.module.css';

interface ClosableChipOwnProps {
  label: JSX.Element;
  onRemove: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

const ClosableChip = (props: Props<ClosableChipOwnProps>) => {
  const [local] = splitProps(props, ['label', 'onRemove', 'removeLabel', 'disabled', 'class']);

  return (
    <Chip variant="subtle" size="sm" class={local.class}>
      {local.label}
      <button
        type="button"
        class={styles.removeButton}
        aria-label={local.removeLabel ?? 'Remove'}
        disabled={local.disabled}
        onClick={() => local.onRemove()}
      >
        <IoCloseOutline />
      </button>
    </Chip>
  );
};

export default ClosableChip;
