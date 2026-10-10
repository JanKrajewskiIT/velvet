import type { I18nKey } from '@jankrajewskiit/i18n';
import { createSignal, onMount, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
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

/** Inline link editor anchored under the toolbar. Esc closes it without leaving the editor. */
export const RichTextLinkPopover = (props: RichTextLinkPopoverProps) => {
  const [root, setRoot] = createSignal<HTMLDivElement>();
  const wrap = () => root()?.closest<HTMLElement>('.vui-rte') ?? root();
  const floating = createFloating(
    () => true,
    () => wrap()?.querySelector('.vui-rte__bar') ?? wrap(),
    { matchWidth: true, offset: 0 },
  );
  createDismiss(
    () => true,
    () => props.onClose(),
    wrap,
    { refocus: false },
  );
  const focusInput = createFrameFocus(root);
  onMount(() => focusInput('input'));

  return (
    <div
      ref={(element) => {
        setRoot(element);
        floating.ref(element);
      }}
      style={floating.style()}
      class="vui-rte__link"
      role="dialog"
      aria-label={props.labels.dialog}
    >
      <div class="vui-rte__link-row">
        <Control size="sm" invalid={!!props.error} style={{ flex: 1 }} iconLeft="link">
          <input
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
