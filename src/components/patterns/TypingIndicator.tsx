import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';

export interface TypingIndicatorProps {
  /** @default localized "Assistant is typing" */
  label?: string;
  class?: string;
}

/** Three bouncing dots — "assistant is typing". */
export const TypingIndicator = (props: TypingIndicatorProps) => {
  const translate = useTranslate();
  return (
    <span
      class={cx('vui-chat-typing', props.class)}
      role="status"
      aria-label={props.label ?? translate('velvet.patterns.typingIndicator.label')}
    >
      <i />
      <i />
      <i />
    </span>
  );
};
