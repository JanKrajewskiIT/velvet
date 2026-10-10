import { createEffect, createSignal, mergeProps, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { Avatar } from '../data/Avatar';
import { authorName, authorSrc, type CommentAuthor } from './commentTree';

const MAX_HEIGHT_PX = 240;

export interface CommentComposerProps {
  user?: string | CommentAuthor;
  placeholder: string;
  initial?: string;
  submitLabel: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  /** Smaller avatar — used for replies. */
  small?: boolean;
}

/** Auto-growing textarea with send / cancel actions. ⌘↵ sends, Esc cancels. */
export const CommentComposer = (props: CommentComposerProps) => {
  const p = mergeProps({ initial: '' } satisfies Partial<CommentComposerProps>, props);
  const translate = useTranslate();
  const [text, setText] = createSignal(p.initial);
  let input!: HTMLTextAreaElement;

  createEffect(() => {
    text();
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, MAX_HEIGHT_PX)}px`;
  });
  onMount(() => {
    if (!p.autoFocus) return;
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  });

  const send = () => {
    const trimmed = text().trim();
    if (!trimmed) return;
    p.onSubmit(trimmed);
    setText('');
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    } else if (e.key === 'Escape' && p.onCancel) {
      e.preventDefault();
      p.onCancel();
    }
  };

  return (
    <div class="vui-cmt-compose">
      <Show when={p.user}>
        {(user) => <Avatar name={authorName(user())} src={authorSrc(user())} size={p.small ? 'xs' : 'sm'} />}
      </Show>
      <div class="vui-cmt-compose__box">
        <textarea
          ref={(element) => {
            input = element;
          }}
          rows={1}
          class="vui-cmt-compose__input"
          placeholder={p.placeholder}
          aria-label={p.placeholder}
          value={text()}
          onInput={(e) => setText(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <div class="vui-cmt-compose__foot">
          <span class="vui-cmt-compose__hint">
            {p.onCancel
              ? translate('velvet.patterns.commentComposer.hintSendCancel')
              : translate('velvet.patterns.commentComposer.hintSend')}
          </span>
          <Show when={p.onCancel}>
            <Button variant="ghost" size="sm" onClick={() => p.onCancel?.()}>
              {translate('velvet.common.cancel')}
            </Button>
          </Show>
          <Button size="sm" disabled={!text().trim()} onClick={send}>
            {p.submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
