import { createEffect, createMemo, createUniqueId, For, type JSX, mergeProps, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { scrollBehavior } from '../../utils/motion';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './ErrorSummary.module.css';

/** Keeps the target field clear of sticky headers after the jump. */
const SCROLL_OFFSET_PX = 120;

export interface ErrorSummaryItem {
  /** Id of the field's input. */
  id: string;
  message: string;
}

export interface ErrorSummaryProps {
  errors: ReadonlyArray<ErrorSummaryItem>;
  /** @default localized "There are N problems to fix" */
  title?: JSX.Element;
  /** Move focus to the summary when the list changes. @default true */
  focusOnShow?: boolean;
  class?: string;
}

const jumpToField = (event: MouseEvent, id: string) => {
  event.preventDefault();
  const field = document.getElementById(id);
  if (!field) return;
  field.focus({ preventScroll: true });
  window.scrollTo({
    top: field.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX,
    behavior: scrollBehavior(),
  });
};

/** Submit-time error summary: takes focus when errors appear and lists each problem as a link that focuses its field. Put it at the top of the form. */
export const ErrorSummary = (props: ErrorSummaryProps) => {
  const p = mergeProps({ focusOnShow: true } satisfies Partial<ErrorSummaryProps>, props);
  const translate = useTranslate();
  const titleId = createUniqueId();
  const signature = createMemo(() => p.errors.map((error) => `${error.id}\u0000${error.message}`).join('\u0001'));
  let root: HTMLDivElement | undefined;

  createEffect(
    on(signature, () => {
      if (p.focusOnShow && p.errors.length > 0) root?.focus({ preventScroll: true });
    }),
  );

  return (
    <Show when={p.errors.length > 0}>
      <div
        ref={(element) => {
          root = element;
        }}
        tabIndex={-1}
        role="alert"
        aria-labelledby={titleId}
        class={cx(styles.errsum, p.class)}
      >
        <div class={cx(styles.errsumPartHead, typographyClass('label-sm'))}>
          <Glyph name="circle-x" />
          <Text as="span" variant="label" tone="inherit" id={titleId}>
            {p.title ?? translate('velvet.forms.errorSummary.title', { count: p.errors.length })}
          </Text>
        </div>
        <ul class={cx(styles.errsumPartList, typographyClass('body-sm'))}>
          <For each={p.errors}>
            {(error) => (
              <li>
                <a href={`#${error.id}`} onClick={(event) => jumpToField(event, error.id)}>
                  {error.message}
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
};
