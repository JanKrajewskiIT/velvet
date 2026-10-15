import { Index, type JSX, Show } from 'solid-js';

import { Separator } from '../primitives/Separator';
import { Text } from '../primitives/Text';
import styles from './CascaderPath.module.css';
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
      <mark class={styles.cascPartMark}>{label.slice(at, at + query.length)}</mark>
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
        <Text as="span" variant={props.markLeaf && index === props.path.length - 1 ? 'label' : 'body'} tone="inherit">
          {highlight(node().label, props.query)}
        </Text>
      </>
    )}
  </Index>
);
