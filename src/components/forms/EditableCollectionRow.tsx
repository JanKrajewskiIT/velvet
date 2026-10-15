import { type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Handle } from '../primitives/Handle';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import type { CollectionDrag } from './createCollectionDrag';
import type { CollectionRows } from './createCollectionRows';
import styles from './EditableCollectionRow.module.css';
import type { EditableItem, EditableReorder } from './editableItem';
import { Rating } from './Rating';
import { Select } from './Select';

export interface EditableCollectionRowProps {
  item: EditableItem;
  index: number;
  rows: CollectionRows;
  drag: CollectionDrag;
  reorder: EditableReorder;
  required: boolean;
  requiredText?: string;
  placeholder?: string;
  levels?: ReadonlyArray<string>;
  levelLabel?: string;
  weighted: boolean;
  maxWeight: number;
}

export const EditableCollectionRow = (props: EditableCollectionRowProps): JSX.Element => {
  const translate = useTranslate();
  const invalid = () => props.required && props.rows.touched().has(props.item.id) && !props.item.text.trim();

  return (
    <li
      class={cx(
        styles.editcolPartRow,
        props.drag.dragIndex() === props.index && styles.editcolPartRowVariantDrag,
        props.drag.overIndex() === props.index &&
          props.drag.dragIndex() !== undefined &&
          props.drag.dragIndex() !== props.index &&
          styles.editcolPartRowVariantOver,
        invalid() && styles.editcolPartRowVariantInvalid,
      )}
      onDragOver={(event) => props.drag.onRowDragOver(event, props.index)}
      onDrop={(event) => props.drag.onRowDrop(event, props.index)}
    >
      <Show
        when={props.reorder === 'drag'}
        fallback={
          <Text as="span" variant="kbd" tone="inherit" class={styles.editcolPartIdx} aria-hidden="true">
            {props.index + 1}
          </Text>
        }
      >
        <Handle
          class="vui-editcol__grip"
          data-vui-collection-grip
          draggable
          label={translate('velvet.forms.editableCollection.reorderItem', { index: props.index + 1 })}
          title={translate('velvet.forms.editableCollection.reorderHint')}
          onDragStart={(event) => props.drag.onDragStart(event, props.index)}
          onDragEnd={props.drag.endDrag}
          onKeyDown={(event) => props.rows.onGripKeyDown(event, props.index)}
        />
      </Show>
      <input
        data-vui-collection-input
        class={cx(styles.editcolPartInput, typographyClass('body'))}
        value={props.item.text}
        placeholder={props.placeholder ?? translate('velvet.forms.editableCollection.placeholder')}
        aria-label={translate('velvet.forms.editableCollection.itemLabel', { index: props.index + 1 })}
        aria-invalid={invalid() || undefined}
        onInput={(event) => props.rows.patch(props.item.id, { text: event.currentTarget.value })}
        onBlur={() => props.rows.markTouched(props.item.id)}
      />
      <Show when={props.levels}>
        {(levels) => (
          <div class={styles.editcolPartLevel}>
            <Select
              size="sm"
              aria-label={translate('velvet.forms.editableCollection.levelForItem', {
                level: props.levelLabel ?? translate('velvet.forms.editableCollection.levelLabel'),
                index: props.index + 1,
              })}
              options={levels()}
              value={props.item.level ?? ''}
              onValueChange={(level) => props.rows.patch(props.item.id, { level })}
            />
          </div>
        )}
      </Show>
      <Show when={props.weighted}>
        <Rating
          size="sm"
          max={props.maxWeight}
          value={props.item.weight ?? 0}
          label={translate('velvet.forms.editableCollection.importanceLabel', { index: props.index + 1 })}
          onValueChange={(weight) => props.rows.patch(props.item.id, { weight })}
        />
      </Show>
      <span class={styles.editcolPartTools}>
        <Show when={props.reorder === 'buttons'}>
          <IconButton
            icon="arrow-up"
            label={translate('velvet.forms.editableCollection.moveUp')}
            size="sm"
            disabled={props.index === 0}
            onClick={() => props.rows.moveItem(props.index, props.index - 1)}
          />
          <IconButton
            icon="arrow-down"
            label={translate('velvet.forms.editableCollection.moveDown')}
            size="sm"
            disabled={props.index === props.rows.items().length - 1}
            onClick={() => props.rows.moveItem(props.index, props.index + 1)}
          />
        </Show>
        <IconButton
          class={styles.editcolPartDel}
          icon="trash-2"
          label={translate('velvet.forms.editableCollection.removeItem', { index: props.index + 1 })}
          size="sm"
          onClick={() => props.rows.removeItem(props.item.id)}
        />
      </span>
      <Show when={invalid()}>
        <Text as="div" variant="overline" tone="inherit" class={styles.editcolPartErr} role="alert">
          {props.requiredText ?? translate('velvet.forms.editableCollection.requiredText')}
        </Text>
      </Show>
    </li>
  );
};
