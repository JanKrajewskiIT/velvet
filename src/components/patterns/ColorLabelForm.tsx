import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Control } from '../primitives/Control';
import { FieldLabel } from '../primitives/FieldLabel';
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
    <div class="vui-clm__form">
      <div class="vui-field">
        <FieldLabel htmlFor={props.manager.nameId}>
          {props.draft.id
            ? translate('velvet.patterns.colorLabelManager.rename')
            : translate('velvet.patterns.colorLabelManager.name')}
        </FieldLabel>
        <Control invalid={!!props.manager.nameError()}>
          <input
            ref={props.manager.nameInputRef}
            id={props.manager.nameId}
            class="vui-control__input"
            placeholder={translate('velvet.patterns.colorLabelManager.namePlaceholder')}
            value={props.draft.name}
            onInput={(e) => props.manager.rename(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void props.manager.save();
            }}
            aria-invalid={!!props.manager.nameError() || undefined}
          />
        </Control>
        <Show when={props.manager.nameError()}>
          <span class="vui-hint vui-hint--error" role="alert">
            {props.manager.nameError()}
          </span>
        </Show>
      </div>
      <div class="vui-field">
        <FieldLabel id={props.manager.colorId}>{translate('velvet.patterns.colorLabelManager.color')}</FieldLabel>
        <div class="vui-clm__swatches" role="radiogroup" aria-labelledby={props.manager.colorId}>
          <For each={props.colors}>
            {(color, index) => (
              <button
                type="button"
                role="radio"
                aria-checked={color === props.draft.color}
                aria-label={translate('velvet.patterns.colorLabelManager.colorOption', { index: index() + 1 })}
                class="vui-clm__sw"
                style={{ background: color }}
                onClick={() => props.manager.patchDraft({ color })}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
