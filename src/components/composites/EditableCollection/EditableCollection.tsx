import type { JSX } from 'solid-js';
import { createSignal, For } from 'solid-js';

import Button, { type ButtonVariant } from '~/components/buttons/Button/Button';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ConfirmDialog from '../../overlays/ConfirmDialog/ConfirmDialog';
import styles from './EditableCollection.module.css';

export interface EditableCollectionRenderContext {
  requestRemove: () => void;
}

export interface EditableCollectionProps<T> {
  items: readonly T[];
  getId: (item: T) => string;
  renderItem: (item: T, context: EditableCollectionRenderContext) => JSX.Element;
  onAdd: () => void;
  onRemove: (id: string) => void;
  confirmVariant?: 'danger' | 'primary';
  addButtonVariant?: ButtonVariant;
}

const EditableCollection = <T,>(props: Props<EditableCollectionProps<T>>) => {
  const { ts } = useI18n();
  const [deleteId, setDeleteId] = createSignal<string | null>(null);

  const handleConfirmDelete = () => {
    const id = deleteId();
    if (!id) return;
    props.onRemove(id);
    setDeleteId(null);
  };

  return (
    <div class={classNames(styles.list, props.class)}>
      <For each={props.items}>
        {(item) => (
          <div class={styles.item}>
            {props.renderItem(item, {
              requestRemove: () => {
                setDeleteId(props.getId(item));
              },
            })}
          </div>
        )}
      </For>
      <Button class={styles.addButton} variant={props.addButtonVariant ?? 'ghost'} onClick={props.onAdd}>
        {ts('common.add')}
      </Button>
      <ConfirmDialog
        open={deleteId() !== null}
        label={ts('common.confirm')}
        message={ts('editableCollection.deleteConfirmMessage')}
        confirmLabel={ts('common.delete')}
        variant={props.confirmVariant ?? 'danger'}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default EditableCollection;
