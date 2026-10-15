import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { FieldLabel } from '../primitives/FieldLabel';
import { Swatch } from '../primitives/Swatch';
import { Text } from '../primitives/Text';
import styles from './ColorLabelForm.module.css';
import type { LabelDraft } from './colorLabelManagerTypes';
import type { ColorLabelManagerController } from './createColorLabelManager';

export interface ColorLabelFormProps {
  draft: LabelDraft;
  colors: readonly string[];
  manager: ColorLabelManagerController;
}

/** Name + Color form for the label being added or edited. */
export const ColorLabelForm = (props: ColorLabelFormProps) => {
  const translate = useTranslate();
  return (
    <div class={styles.clmPartForm}>
      <div class={styles.field}>
        <FieldLabel htmlFor={props.manager.nameId}>
          {props.draft.id
            ? translate('velvet.patterns.colorLabelManager.rename')
            : translate('velvet.patterns.colorLabelManager.name')}
        </FieldLabel>
        <Control invalid={!!props.manager.nameError()}>
          <ControlInput
            ref={props.manager.nameInputRef}
            id={props.manager.nameId}
            placeholder={translate('velvet.patterns.colorLabelManager.namePlaceholder')}
            value={props.draft.name}
            onInput={(e) => props.manager.rename(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void props.manager.save().catch(reportAsyncError);
            }}
            aria-invalid={!!props.manager.nameError() || undefined}
          />
        </Control>
        <Show when={props.manager.nameError()}>
          <Text
            as="span"
            variant="caption"
            tone="inherit"
            class={cx(styles.hint, styles.hintVariantError)}
            role="alert"
          >
            {props.manager.nameError()}
          </Text>
        </Show>
      </div>
      <div class={styles.field}>
        <FieldLabel id={props.manager.colorId}>{translate('velvet.patterns.colorLabelManager.color')}</FieldLabel>
        <div class={styles.clmPartSwatches} role="radiogroup" aria-labelledby={props.manager.colorId}>
          <For each={props.colors}>
            {(color, index) => (
              <Swatch
                round
                color={color}
                role="radio"
                aria-checked={color === props.draft.color}
                aria-label={translate('velvet.patterns.colorLabelManager.colorOption', { index: index() + 1 })}
                class={styles.clmPartSw}
                onClick={() => props.manager.patchDraft({ color })}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
