import { Index, type JSX, Show } from 'solid-js';

import { Separator } from '../primitives/Separator';
import type { CascaderNode } from './cascaderPaths';

export interface CascaderPathProps {
  path: readonly CascaderNode[];
  separator: string;
  /** Emphasise the last label (trigger text). */
  markLeaf?: boolean;
  /** Highlight the first match of this text in each string label. */
  query?: string;
}

const highlight = (label: JSX.Element, query: string | undefined): JSX.Element => {
  if (!query || typeof label !== 'string') return label;
  const at = label.toLowerCase().indexOf(query);
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark class="vui-casc__mark">{label.slice(at, at + query.length)}</mark>
      {label.slice(at + query.length)}
    </>
  );
};

/** Labels of a root-to-node path joined by a text separator. */
export const CascaderPath = (props: CascaderPathProps) => (
  <Index each={props.path}>
    {(node, index) => (
      <>
        <Show when={index > 0}>
          <Separator variant="text">{props.separator}</Separator>
        </Show>
        <span class={props.markLeaf && index === props.path.length - 1 ? 'vui-casc__leaf' : undefined}>
          {highlight(node().label, props.query)}
        </span>
      </>
    )}
  </Index>
);
