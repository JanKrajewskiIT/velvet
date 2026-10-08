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

/** Trailing rows of an option list: loading skeletons, the load error with a retry, or the empty message. */
export const OptionListStatus = (props: OptionListStatusProps) => {
  const translate = useTranslate();
  const errorText = () => props.errorText ?? translate('velvet.forms.optionListStatus.errorText');
  const retryLabel = () => props.retryLabel ?? translate('velvet.common.retry');
  return (
    <>
      <Show when={props.loading && props.empty}>
        <Index each={SKELETON_WIDTHS}>
          {(width) => (
            <li class="vui-select__option" aria-hidden="true">
              <Skeleton width={`${width()}%`} />
            </li>
          )}
        </Index>
      </Show>
      <Show when={props.failed}>
        <EmptyText as="li" align="start" class="vui-select__empty vui-select__error">
          {errorText()}{' '}
          <Button variant="link" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onRetry()}>
            {retryLabel()}
          </Button>
        </EmptyText>
      </Show>
      <Show when={props.empty && !props.loading && !props.failed && props.emptyText}>
        <EmptyText as="li" align="start" class="vui-select__empty">
          {props.emptyText}
        </EmptyText>
      </Show>
    </>
  );
};
