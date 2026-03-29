import { FiEdit2, FiPlus, FiTrash2 } from 'solid-icons/fi';
import { createMemo, createSignal, For, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import EmptyState from '~/components/feedback/EmptyState/EmptyState';
import FormField from '~/components/forms/FormField/FormField';
import Input from '~/components/inputs/Input/Input';
import ConfirmAction from '~/components/overlays/ConfirmAction/ConfirmAction';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import ColorPicker from '~/components/pickers/ColorPicker/ColorPicker';
import Divider from '~/components/surfaces/Divider/Divider';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';

import styles from './ColorTagManagerDialog.module.css';

export interface ColorTag {
  id: string;
  name: string;
  color: string;
}

interface ColorTagManagerDialogProps {
  open: boolean;
  title: string;
  items: readonly ColorTag[];
  colors: readonly string[];
  nameLabel: string;
  colorLabel: string;
  emptyMessage: string;
  addLabel: string;
  editLabel: string;
  deleteLabel: string;
  saveLabel: string;
  cancelLabel: string;
  deleteConfirmLabel: string;
  deleteConfirmMessage: string;
  onClose: () => void;
  onCreate: (item: ColorTag) => void | Promise<void>;
  onUpdate: (item: ColorTag) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

const ColorTagManagerDialog = (props: Props<ColorTagManagerDialogProps>) => {
  const [showForm, setShowForm] = createSignal(false);
  const [editingTagId, setEditingTagId] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  const [color, setColor] = createSignal('');
  const [pending, setPending] = createSignal(false);

  const editingTag = createMemo(() => props.items.find((item) => item.id === editingTagId()) ?? null);
  const defaultColor = createMemo(() => props.colors[0] ?? '#3b82f6');

  const resetForm = () => {
    setShowForm(false);
    setEditingTagId(null);
    setName('');
    setColor(defaultColor());
  };

  const handleClose = () => {
    if (pending()) return;
    resetForm();
    props.onClose();
  };

  const handleAdd = () => {
    setShowForm(true);
    setEditingTagId(null);
    setName('');
    setColor(defaultColor());
  };

  const handleEdit = (item: ColorTag) => {
    setShowForm(true);
    setEditingTagId(item.id);
    setName(item.name);
    setColor(item.color);
  };

  const handleCancelForm = () => {
    if (pending()) return;
    resetForm();
  };

  const handleSave = async () => {
    const trimmedName = name().trim();
    if (!trimmedName) return;

    const editing = editingTag();
    const nextItem: ColorTag = editing
      ? { ...editing, name: trimmedName, color: color() || defaultColor() }
      : { id: crypto.randomUUID(), name: trimmedName, color: color() || defaultColor() };

    setPending(true);
    try {
      if (editing) {
        await props.onUpdate(nextItem);
      } else {
        await props.onCreate(nextItem);
      }
      resetForm();
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setPending(true);
    try {
      await props.onDelete(id);
      if (editingTagId() === id) {
        resetForm();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={props.open} onClose={handleClose} class={props.class}>
      <DialogTitle label={props.title} />
      <DialogBody>
        <div class={styles.content}>
          <Show when={props.items.length > 0} fallback={<EmptyState message={props.emptyMessage} />}>
            <div class={styles.list}>
              <For each={props.items}>
                {(item) => (
                  <ConfirmAction
                    label={props.deleteLabel}
                    message={props.deleteConfirmMessage}
                    confirmLabel={props.deleteConfirmLabel}
                    cancelLabel={props.cancelLabel}
                    variant="danger"
                    onConfirm={() => handleDelete(item.id)}
                  >
                    {({ openConfirm }) => (
                      <div class={styles.row}>
                        <span class={styles.dot} style={{ '--tag-color': item.color }} aria-hidden="true" />
                        <Text as="span" class={styles.name}>
                          {item.name}
                        </Text>
                        <div class={styles.actions}>
                          <IconButton
                            icon={FiEdit2}
                            label={props.editLabel}
                            size="sm"
                            disabled={pending()}
                            onClick={() => handleEdit(item)}
                          />
                          <IconButton
                            icon={FiTrash2}
                            label={props.deleteLabel}
                            size="sm"
                            variant="ghost"
                            disabled={pending()}
                            onClick={openConfirm}
                          />
                        </div>
                      </div>
                    )}
                  </ConfirmAction>
                )}
              </For>
            </div>
          </Show>

          <Show when={showForm()}>
            <Divider />
            <div class={styles.form}>
              <FormField label={props.nameLabel}>
                <Input value={name()} onInput={(event) => setName(event.currentTarget.value)} disabled={pending()} />
              </FormField>
              <FormField label={props.colorLabel}>
                <ColorPicker
                  colors={[...props.colors]}
                  value={color() || defaultColor()}
                  onChange={setColor}
                  disabled={pending()}
                />
              </FormField>
              <Show when={name().trim()}>
                <div class={styles.preview}>
                  <span class={styles.dot} style={{ '--tag-color': color() || defaultColor() }} aria-hidden="true" />
                  <Text as="span">{name().trim()}</Text>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </DialogBody>
      <DialogActions>
        <Show
          when={showForm()}
          fallback={
            <Button variant="dashed" disabled={pending()} onClick={handleAdd}>
              <FiPlus />
              {props.addLabel}
            </Button>
          }
        >
          <Button variant="ghost" label={props.cancelLabel} disabled={pending()} onClick={handleCancelForm} />
          <Button label={props.saveLabel} disabled={pending() || !name().trim()} onClick={() => void handleSave()} />
        </Show>
      </DialogActions>
    </Dialog>
  );
};

export type { ColorTagManagerDialogProps };
export default ColorTagManagerDialog;
