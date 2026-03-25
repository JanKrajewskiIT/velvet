import { IoCloseOutline } from 'solid-icons/io';
import { splitProps } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';

import Chip from '../Chip/Chip';
import styles from './ClosableChip.module.css';

interface ClosableChipOwnProps {
  label: string;
  onRemove: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

const ClosableChip = (props: Props<ClosableChipOwnProps>) => {
  const { t } = useI18n();
  const [local] = splitProps(props, ['label', 'onRemove', 'removeLabel', 'disabled', 'class']);

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
          aria-label={local.removeLabel ?? t('common.remove')}
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
