import { type JSX, onCleanup, onMount } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { cssLength } from '../data/cssLength';

export interface ChatThreadProps {
  children?: JSX.Element;
  /** CSS height — the thread scrolls inside it. A number is px. */
  height?: number | string;
  /** Accessible name of the log. @default localized "Conversation" */
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

/** Distance from the bottom, in px, within which the thread keeps following new content. */
const STICK_THRESHOLD = 48;

/** Scrolling role="log" container. Sticks to the bottom while new messages arrive unless the user has scrolled up to read. */
export const ChatThread = (props: ChatThreadProps) => {
  const translate = useTranslate();
  let thread!: HTMLDivElement;
  let stickToBottom = true;

  const follow = () => {
    if (stickToBottom) thread.scrollTop = thread.scrollHeight;
  };

  onMount(() => {
    follow();
    const observer = new MutationObserver(follow);
    observer.observe(thread, { childList: true, subtree: true, characterData: true });
    onCleanup(() => observer.disconnect());
  });

  return (
    <div
      ref={(element) => {
        thread = element;
      }}
      role="log"
      aria-label={props.label ?? translate('velvet.patterns.chatThread.label')}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable log region must be focusable so keyboard users can scroll it
      tabIndex={0}
      class={cx('vui-chatthread', props.class)}
      style={{ height: cssLength(props.height), ...props.style }}
      onScroll={() => {
        stickToBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < STICK_THRESHOLD;
      }}
    >
      {props.children}
    </div>
  );
};
