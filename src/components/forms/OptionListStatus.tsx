import { Index, type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Skeleton } from '../feedback/Skeleton';
import { EmptyText } from '../primitives/EmptyText';

const SKELETON_WIDTHS = [70, 55, 62] as const;

export interface OptionListStatusProps {
  loading: boolean;
  failed: boolean;
  /** The list has no rows to show. */
  empty: boolean;
  /** Row shown for an empty, settled list; omit to show none. */
  emptyText?: JSX.Element;
  /** @default localized "Couldn’t load options" */
  errorText?: JSX.Element;
  /** @default localized "Retry" */
  retryLabel?: string;
  onRetry: () => void;
}

/** Popup status lives outside the listbox so Retry remains a separate action. */
export const OptionListStatus = (props: OptionListStatusProps) => {
  const translate = useTranslate();
  const errorText = () => props.errorText ?? translate('velvet.forms.optionListStatus.errorText');
  const retryLabel = () => props.retryLabel ?? translate('velvet.common.retry');
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      <Show when={props.loading && props.empty}>
        <span class="vui-sr-only">{translate('velvet.common.loading')}</span>
        <Index each={SKELETON_WIDTHS}>
          {(width) => (
            <div class="vui-select__option" aria-hidden="true">
              <Skeleton width={`${width()}%`} />
            </div>
          )}
        </Index>
      </Show>
      <Show when={props.failed}>
        <EmptyText align="start" class="vui-select__empty vui-select__error">
          {errorText()}{' '}
          <Button variant="link" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onRetry()}>
            {retryLabel()}
          </Button>
        </EmptyText>
      </Show>
      <Show when={props.empty && !props.loading && !props.failed && props.emptyText}>
        <EmptyText align="start" class="vui-select__empty">
          {props.emptyText}
        </EmptyText>
      </Show>
    </div>
  );
};
