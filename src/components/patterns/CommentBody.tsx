import { For, Show } from 'solid-js';

const MENTION = /(@[\p{L}][\p{L}\d._-]*)/u;

export interface CommentBodyProps {
  text: string;
}

/** Plain-text comment body; `@mentions` are highlighted. */
export const CommentBody = (props: CommentBodyProps) => {
  const parts = () => props.text.split(MENTION);
  return (
    <div class="vui-cmt__body">
      <For each={parts()}>
        {(part, index) => (
          <Show when={index() % 2} fallback={part}>
            <span class="vui-mark vui-mark--mention">{part}</span>
          </Show>
        )}
      </For>
    </div>
  );
};
