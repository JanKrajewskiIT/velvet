import type { I18nKey } from '@jankrajewskiit/i18n';
import { createSignal, onMount, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import { classSelector } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { Text } from '../primitives/Text';
import styles from './RichTextLinkPopover.module.css';

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
  const wrap = () => root()?.closest<HTMLElement>(classSelector(styles.rte)) ?? root();
  const floating = createFloating(
    () => true,
    () => wrap()?.querySelector(classSelector(styles.rtePartBar)) ?? wrap(),
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
      class={styles.rtePartLink}
      role="dialog"
      aria-label={props.labels.dialog}
    >
      <div class={styles.rtePartLinkRow}>
        <Control size="sm" invalid={!!props.error} style={{ flex: 1 }} iconLeft="link">
          <ControlInput
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
          <Text
            as="span"
            variant="caption"
            tone="inherit"
            class={cx(styles.hint, styles.hintVariantError)}
            role="alert"
          >
            {message()}
          </Text>
        )}
      </Show>
      <div class={cx(styles.rtePartLinkRow, styles.rtePartLinkFoot)}>
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
