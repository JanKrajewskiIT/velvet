import { IoCloseOutline } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import styles from './EditableChip.module.css';

interface EditableChipOwnProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
  label: string;
  onRemove: () => void;
  removeLabel?: string;
}

const EditableChip = (props: Props<EditableChipOwnProps>) => {
  const [local, rest] = splitProps(props, ['label', 'onRemove', 'removeLabel', 'class']);

  return (
    <span {...rest} class={classNames(styles.chip, local.class)}>
      {local.label}
      <IconButton
        icon={<IoCloseOutline />}
        title={local.removeLabel ?? 'Remove'}
        class={styles.removeButton}
        onClick={() => local.onRemove()}
        size="sm"
      />
    </span>
  );
};

export default EditableChip;
