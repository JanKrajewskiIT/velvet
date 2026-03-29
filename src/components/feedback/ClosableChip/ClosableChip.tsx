import { IoCloseOutline } from 'solid-icons/io';
import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import Chip from '../Chip/Chip';
import styles from './ClosableChip.module.css';

interface ClosableChipOwnProps {
  label: string;
  onRemove: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

const DEFAULT_REMOVE_LABEL = 'Remove';

const ClosableChip = (props: Props<ClosableChipOwnProps>) => {
  const [local] = splitProps(props, ['label', 'onRemove', 'removeLabel', 'disabled', 'class']);
  const removeButtonLabel = createMemo(() => local.removeLabel ?? DEFAULT_REMOVE_LABEL);

  return (
    <Chip
      variant="subtle"
      size="sm"
      class={local.class}
      label={local.label}
      endAdornment={
        <button
          type="button"
          class={styles.removeButton}
          aria-label={removeButtonLabel()}
          disabled={local.disabled}
          onClick={() => local.onRemove()}
        >
          <IoCloseOutline />
        </button>
      }
    />
  );
};

export default ClosableChip;
