import { IoCloseOutline } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './EditableChip.module.css';

interface EditableChipOwnProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
  label: string;
  onRemove: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

const EditableChip = (props: Props<EditableChipOwnProps>) => {
  const [local, rest] = splitProps(props, ['label', 'onRemove', 'removeLabel', 'disabled', 'class']);

  return (
    <span {...rest} class={classNames(styles.chip, local.class)}>
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
    </span>
  );
};

export default EditableChip;
