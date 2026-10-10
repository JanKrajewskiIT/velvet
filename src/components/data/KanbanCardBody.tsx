import { type JSX, Show } from 'solid-js';

import { Badge } from '../display/Badge';
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
        <div class="vui-kanban__ctitle">{props.card.title}</div>
        <Show when={props.card.meta || props.card.assignee}>
          <div class="vui-kanban__cfoot">
            <span class="vui-kanban__meta">{props.card.meta}</span>
            {props.card.assignee}
          </div>
        </Show>
      </>
    }
  >
    {(render) => render(props.card)}
  </Show>
);
