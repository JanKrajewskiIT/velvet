import { children, type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { FIELD_ERROR_ANNOUNCEMENTS, type FieldErrorAnnouncementProps } from './fieldErrorAnnouncement';
import styles from './FieldFeedback.module.css';
import { FieldHint } from './FieldHint';
import { Text } from './Text';

export interface FieldFeedbackProps extends FieldErrorAnnouncementProps {
  readonly hintId: string;
  readonly errorId: string;
  readonly hint?: JSX.Element;
  readonly error?: JSX.Element;
  readonly reserveSpace?: boolean;
  readonly children?: JSX.Element;
}

/** Keeps the error status mounted independently of hint text and layout reservation. */
export const FieldFeedback = (props: FieldFeedbackProps) => {
  const accessory = children(() => props.children);
  const announcement = () => props['data-field-error-announcement'] ?? FIELD_ERROR_ANNOUNCEMENTS.polite;
  const silent = () => announcement() === FIELD_ERROR_ANNOUNCEMENTS.none;
  const empty = () => !props.error && !props.hint && !props.reserveSpace && !accessory.toArray().length;
  return (
    <div
      class={cx(
        styles.feedback,
        props.reserveSpace && styles.feedbackVariantLane,
        empty() && styles.feedbackVariantEmpty,
      )}
    >
      <div class={styles.message}>
        <Show when={!props.error && props.hint}>{(hint) => <FieldHint id={props.hintId}>{hint()}</FieldHint>}</Show>
        <Text
          as="span"
          id={props.errorId}
          variant="caption"
          tone="inherit"
          role={silent() ? undefined : 'status'}
          aria-live={silent() ? 'off' : 'polite'}
          aria-atomic="true"
          class={cx(styles.error, !!props.error && styles.errorVariantPresent)}
        >
          {props.error}
        </Text>
      </div>
      {accessory()}
    </div>
  );
};
