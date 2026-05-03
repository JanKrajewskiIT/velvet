import { FiEdit2, FiPlus, FiTrash2 } from 'solid-icons/fi';
import { batch, createMemo, createSignal, For, Show } from 'solid-js';

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
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';

import styles from './ColorLabelManagerDialog.module.css';

export interface ColorLabel {
  id: string;
  name: string;
  color: string;
}

interface ColorLabelManagerDialogProps {
  open: boolean;
  label: string;
  items: readonly ColorLabel[];
  colors: readonly string[];
  onClose: () => void;
  onCreate: (item: ColorLabel) => void | Promise<void>;
  onUpdate: (item: ColorLabel) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

const ColorLabelManagerDialog = (props: Props<ColorLabelManagerDialogProps>) => {
  const { ts } = useI18n();
  const [showForm, setShowForm] = createSignal(false);
  const [editingTagId, setEditingTagId] = createSignal<string | null>(null);
  const [name, setName] = createSignal('');
  const [color, setColor] = createSignal('');
  const [pending, setPending] = createSignal(false);

  const editingTag = createMemo(() => props.items.find((item) => item.id === editingTagId()) ?? null);
  const defaultColor = createMemo(() => props.colors[0] ?? '#3b82f6');

  const resetForm = () => {
    batch(() => {
      setShowForm(false);
      setEditingTagId(null);
      setName('');
      setColor(defaultColor());
    });
  };

  const handleClose = () => {
    if (pending()) return;
    resetForm();
    props.onClose();
  };

  const handleAdd = () => {
    batch(() => {
      setShowForm(true);
      setEditingTagId(null);
      setName('');
      setColor(defaultColor());
    });
  };

  const handleEdit = (item: ColorLabel) => {
    batch(() => {
      setShowForm(true);
      setEditingTagId(item.id);
      setName(item.name);
      setColor(item.color);
    });
  };

  const handleCancelForm = () => {
    if (pending()) return;
    resetForm();
  };

  const handleSave = async () => {
    const trimmedName = name().trim();
    if (!trimmedName) return;

    const editing = editingTag();
    const nextItem: ColorLabel = editing
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

  const handleNameInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    setName(event.currentTarget.value);
  };
  const handleSaveClick = () => {
    void handleSave();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} class={props.class}>
      <DialogTitle label={props.label} />
      <DialogBody>
        <div class={styles.content}>
          <Show when={props.items.length > 0} fallback={<EmptyState message={ts('colorLabel.empty')} />}>
            <div class={styles.list}>
              <For each={props.items}>
                {(item) => (
                  <ConfirmAction
                    label={ts('common.delete')}
                    message={ts('colorLabel.deleteConfirmMessage')}
                    confirmLabel={ts('colorLabel.deleteConfirm')}
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
                            label={ts('common.edit')}
                            size="sm"
                            disabled={pending()}
                            onClick={() => handleEdit(item)}
                          />
                          <IconButton
                            icon={FiTrash2}
                            label={ts('common.delete')}
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
              <FormField label={ts('colorLabel.name')}>
                <Input value={name()} onInput={handleNameInput} disabled={pending()} />
              </FormField>
              <FormField label={ts('colorLabel.color')}>
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
              {ts('common.add')}
            </Button>
          }
        >
          <Button variant="ghost" label={ts('common.cancel')} disabled={pending()} onClick={handleCancelForm} />
          <Button label={ts('common.save')} disabled={pending() || !name().trim()} onClick={handleSaveClick} />
        </Show>
      </DialogActions>
    </Dialog>
  );
};

export type { ColorLabelManagerDialogProps };
export default ColorLabelManagerDialog;
