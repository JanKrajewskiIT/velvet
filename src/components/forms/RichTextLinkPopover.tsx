import type { I18nKey } from '@jankrajewskiit/i18n';
import { type JSX, Show } from 'solid-js';

import { Button } from '../actions/Button';
import { Control } from '../primitives/Control';

export interface RichTextLinkLabels {
  dialog: string;
  address: string;
  placeholder: string;
  apply: string;
  remove: string;
  cancel: string;
  invalid: string;
}

export const resolveLinkLabels = (
  overrides: Partial<RichTextLinkLabels> | undefined,
  translate: (key: I18nKey) => string,
): RichTextLinkLabels => ({
  dialog: overrides?.dialog ?? translate('velvet.forms.richTextLinkPopover.dialog'),
  address: overrides?.address ?? translate('velvet.forms.richTextLinkPopover.address'),
  placeholder: overrides?.placeholder ?? translate('velvet.forms.richTextLinkPopover.placeholder'),
  apply: overrides?.apply ?? translate('velvet.common.apply'),
  remove: overrides?.remove ?? translate('velvet.forms.richTextLinkPopover.remove'),
  cancel: overrides?.cancel ?? translate('velvet.common.cancel'),
  invalid: overrides?.invalid ?? translate('velvet.forms.richTextLinkPopover.invalid'),
});

export interface RichTextLinkPopoverProps {
  href: string;
  error?: string;
  /** The caret or selection is already inside a link. */
  existing: boolean;
  labels: RichTextLinkLabels;
  onHrefChange: (href: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onClose: () => void;
}

const focusInput = (input: HTMLInputElement) => queueMicrotask(() => input.focus());

/** Inline link editor anchored under the toolbar. Esc closes it without leaving the editor. */
export const RichTextLinkPopover = (props: RichTextLinkPopoverProps) => {
  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    props.onClose();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- only intercepts Escape bubbling from the dialog's own inputs
    <div class="vui-rte__link" role="dialog" aria-label={props.labels.dialog} onKeyDown={onKeyDown}>
      <div class="vui-rte__link-row">
        <Control size="sm" invalid={!!props.error} style={{ flex: 1 }} iconLeft="link">
          <input
            ref={focusInput}
            class="vui-control__input"
            value={props.href}
            placeholder={props.labels.placeholder}
            aria-label={props.labels.address}
            aria-invalid={!!props.error || undefined}
            onInput={(event) => props.onHrefChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              props.onApply();
            }}
          />
        </Control>
        <Button size="sm" onClick={() => props.onApply()}>
          {props.labels.apply}
        </Button>
      </div>
      <Show when={props.error}>
        {(message) => (
          <span class="vui-hint vui-hint--error" role="alert">
            {message()}
          </span>
        )}
      </Show>
      <div class="vui-rte__link-row vui-rte__link-foot">
        <Show when={props.existing}>
          <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => props.onRemove()}>
            {props.labels.remove}
          </Button>
        </Show>
        <Button variant="ghost" size="sm" style={{ 'margin-left': 'auto' }} onClick={() => props.onClose()}>
          {props.labels.cancel}
        </Button>
      </div>
    </div>
  );
};
