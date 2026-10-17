import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Dialog } from '../feedback/Dialog';
import { SearchInput } from '../forms/SearchInput';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { type ColorLabel, LABEL_COLORS } from './colorLabel';
import { ColorLabelChips } from './ColorLabelChips';
import styles from './ColorLabelSelectionDialog.module.css';
import { ColorLabelSelectionFooter } from './ColorLabelSelectionFooter';
import { ColorLabelSelectionMeta } from './ColorLabelSelectionMeta';
import { createColorLabelSelection } from './createColorLabelSelection';

export interface ColorLabelSelectionDialogProps {
  open: boolean;
  onClose?: () => void;
  labels: ColorLabel[];
  /** Currently assigned label ids — the draft resets to this on open */
  value?: string[];
  /** May return a Promise — the dialog locks while pending; on reject the selection is kept and `submitErrorText` shows inline. */
  onSubmit?: (ids: string[]) => void | Promise<void>;
  /** Enable inline creation. Return the new label (with id) to auto-select it. */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- creation callbacks may intentionally return no label, synchronously or asynchronously
  onCreate?: (draft: { name: string; color: string }) => ColorLabel | void | Promise<ColorLabel | void>;
  /** Receives the error `onSubmit` or `onCreate` rejected with. */
  onError?: (error: unknown) => void;
  /** Shows a "Manage labels" footer button */
  onManage?: () => void;
  /** Max labels per item; 1 = single choice */
  max?: number;
  /** @default localized "Labels" */
  title?: JSX.Element;
  description?: JSX.Element;
  /** @default localized "Apply" */
  submitLabel?: string;
  /** @default localized "Cancel" */
  cancelLabel?: string;
  /** @default auto — more than 7 labels or onCreate set */
  searchable?: boolean;
  /** Colours cycled for new labels. @default LABEL_COLORS */
  colors?: readonly string[];
  /** @default localized "No labels yet." */
  emptyText?: JSX.Element;
  /** Shown when `onSubmit` rejects. @default localized "Couldn’t apply labels — your selection is kept." */
  submitErrorText?: string;
  /** Shown when `onCreate` rejects. @default localized name ⇒ "Couldn’t create “name”." */
  createErrorText?: (name: string) => string;
}

/** Assign colour labels to one item: toggle chips (max 1 = single choice), search, inline create, and a draft that Apply commits. */
export const ColorLabelSelectionDialog = (props: ColorLabelSelectionDialogProps) => {
  const p = mergeProps({ colors: LABEL_COLORS } satisfies Partial<ColorLabelSelectionDialogProps>, props);
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.patterns.colorLabelSelectionDialog.title');
  const submitLabel = () => p.submitLabel ?? translate('velvet.common.apply');
  const cancelLabel = () => p.cancelLabel ?? translate('velvet.common.cancel');
  const emptyText = () => p.emptyText ?? translate('velvet.patterns.colorLabelSelectionDialog.emptyText');
  const submitErrorText = () =>
    p.submitErrorText ?? translate('velvet.patterns.colorLabelSelectionDialog.submitErrorText');
  const createErrorText = (name: string) =>
    p.createErrorText?.(name) ?? translate('velvet.patterns.colorLabelSelectionDialog.createErrorText', { name });
  const selection = createColorLabelSelection(p, { submitError: submitErrorText, createError: createErrorText });

  return (
    <Dialog
      open={p.open}
      onClose={selection.busy() ? undefined : p.onClose}
      dismissible={!selection.busy()}
      title={title()}
      description={p.description}
      size="sm"
      footerClass={styles.dialogFooter}
      footer={
        <ColorLabelSelectionFooter
          selection={selection}
          submitLabel={submitLabel()}
          cancelLabel={cancelLabel()}
          onClose={p.onClose}
          onManage={p.onManage}
        />
      }
    >
      <Show when={selection.showSearch()}>
        <div class={styles.clsPartSearch}>
          <SearchInput
            size="sm"
            inputRef={selection.searchRef}
            value={selection.query()}
            onValueChange={selection.setQuery}
            placeholder={
              p.onCreate
                ? translate('velvet.patterns.colorLabelSelectionDialog.searchOrCreate')
                : translate('velvet.patterns.colorLabelSelectionDialog.search')
            }
            aria-label={translate('velvet.patterns.colorLabelSelectionDialog.searchLabel')}
            disabled={selection.busy()}
            onKeyDown={selection.onSearchKeyDown}
          />
        </div>
      </Show>
      <ColorLabelSelectionMeta selection={selection} />
      <ColorLabelChips
        selection={selection}
        label={typeof p.title === 'string' ? p.title : translate('velvet.patterns.colorLabelSelectionDialog.title')}
        emptyText={emptyText()}
      />
      <Show when={selection.error()}>
        <Text as="div" variant="body-sm" tone="danger" class={styles.confirmPartErr} role="alert">
          <Glyph name="alert-circle" />
          {selection.error()}
        </Text>
      </Show>
    </Dialog>
  );
};
