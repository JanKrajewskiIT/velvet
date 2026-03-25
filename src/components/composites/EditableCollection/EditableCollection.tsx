import type { JSX } from 'solid-js';
import { createSignal, For } from 'solid-js';

import Button, { type ButtonVariant } from '~/components/buttons/Button/Button';
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
  addLabel: string;
  confirmLabel: string;
  confirmMessage: string;
  confirmActionLabel: string;
  cancelLabel: string;
  confirmVariant?: 'danger' | 'primary';
  addButtonVariant?: ButtonVariant;
  listClass?: string;
  itemClass?: string;
  addButtonClass?: string;
}

const EditableCollection = <T,>(props: Props<EditableCollectionProps<T>>) => {
  const [deleteId, setDeleteId] = createSignal<string | null>(null);

  const handleConfirmDelete = () => {
    const id = deleteId();
    if (!id) return;
    props.onRemove(id);
    setDeleteId(null);
  };

  return (
    <div class={classNames(styles.list, props.listClass, props.class)}>
      <For each={props.items}>
        {(item) => (
          <div class={classNames(styles.item, props.itemClass)}>
            {props.renderItem(item, {
              requestRemove: () => {
                setDeleteId(props.getId(item));
              },
            })}
          </div>
        )}
      </For>
      <Button
        class={classNames(styles.addButton, props.addButtonClass)}
        variant={props.addButtonVariant ?? 'ghost'}
        onClick={props.onAdd}
      >
        {props.addLabel}
      </Button>
      <ConfirmDialog
        open={deleteId() !== null}
        label={props.confirmLabel}
        message={props.confirmMessage}
        confirmLabel={props.confirmActionLabel}
        cancelLabel={props.cancelLabel}
        variant={props.confirmVariant ?? 'danger'}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};

export default EditableCollection;
