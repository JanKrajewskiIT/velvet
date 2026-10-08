import { type JSX, Show } from 'solid-js';
import { CopyButton, Text } from '../../src';

export interface ExampleProps {
  title: string;
  /** Source shown under the preview and copyable. */
  code?: string;
  /** Lay the preview out as a column instead of a wrapping row. */
  stack?: boolean;
  children: JSX.Element;
}

export const Example = (props: ExampleProps) => {
  return (
    <section class="sc-example">
      <Text variant="label" as="h3">
        {props.title}
      </Text>
      <div class={props.stack ? 'sc-preview sc-preview--stack' : 'sc-preview'}>{props.children}</div>
      <Show when={props.code}>
        {(code) => (
          <div class="sc-code">
            <pre>
              <code>{code()}</code>
            </pre>
            <CopyButton value={code()} iconOnly variant="ghost" size="sm" label="Copy code" />
          </div>
        )}
      </Show>
    </section>
  );
};
