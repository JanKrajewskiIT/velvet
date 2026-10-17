import { type JSX, Show } from 'solid-js';

import { Badge } from '../display/Badge';
import { Text } from '../primitives/Text';
import styles from './KanbanCardBody.module.css';
import type { KanbanCard } from './kanbanTypes';

interface KanbanCardBodyProps {
  card: KanbanCard;
  render: ((card: KanbanCard) => JSX.Element) | undefined;
}

export const KanbanCardBody = (props: KanbanCardBodyProps) => (
  <Show
    when={props.render}
    keyed
    fallback={
      <>
        <Show when={props.card.tag}>
          <Badge size="sm" tone={props.card.tagTone ?? 'neutral'}>
            {props.card.tag}
          </Badge>
        </Show>
        <Text as="div" variant="label" tone="primary" class={styles.kanbanPartCtitle}>
          {props.card.title}
        </Text>
        <Show when={props.card.meta || props.card.assignee}>
          <div class={styles.kanbanPartCfoot}>
            <Text as="span" variant="caption" tone="tertiary" class={styles.kanbanPartMeta}>
              {props.card.meta}
            </Text>
            {props.card.assignee}
          </div>
        </Show>
      </>
    }
  >
    {(render) => render(props.card)}
  </Show>
);
