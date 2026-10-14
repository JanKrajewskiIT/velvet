import { createSignal, type JSX, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { cssLength } from '../data/cssLength';

export interface ChatThreadProps {
  children?: JSX.Element;
  /** CSS height — the thread scrolls inside it. A number is px. */
  height?: number | string;
  /** Accessible name of the log. @default localized "Conversation" */
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
  jumpToLatestLabel?: string;
}

/** Distance from the bottom, in px, within which the thread keeps following new content. */
const STICK_THRESHOLD = 48;

/** Scrolling role="log" container. Sticks to the bottom while new messages arrive unless the user has scrolled up to read. */
export const ChatThread = (props: ChatThreadProps) => {
  const translate = useTranslate();
  let thread!: HTMLDivElement;
  const [following, setFollowing] = createSignal(true);

  const follow = () => {
    if (following()) thread.scrollTop = thread.scrollHeight;
  };

  onMount(() => {
    follow();
    let frame = 0;
    const schedule = () => {
      frame ||= requestAnimationFrame(() => {
        frame = 0;
        follow();
      });
    };
    const resizing = new ResizeObserver(schedule);
    const observeChildren = () => {
      resizing.disconnect();
      resizing.observe(thread);
      for (const child of thread.children) resizing.observe(child);
      schedule();
    };
    const observer = new MutationObserver(observeChildren);
    observeChildren();
    observer.observe(thread, { childList: true, subtree: true, characterData: true });
    onCleanup(() => {
      observer.disconnect();
      resizing.disconnect();
      cancelAnimationFrame(frame);
    });
  });

  return (
    <>
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
          setFollowing(thread.scrollHeight - thread.scrollTop - thread.clientHeight < STICK_THRESHOLD);
        }}
      >
        {props.children}
      </div>
      <Show when={!following()}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setFollowing(true);
            follow();
          }}
        >
          {props.jumpToLatestLabel ?? translate('velvet.patterns.chatThread.jumpToLatest')}
        </Button>
      </Show>
    </>
  );
};
