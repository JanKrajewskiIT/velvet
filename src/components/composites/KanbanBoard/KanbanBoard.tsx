import type { JSX } from 'solid-js';
import { createMemo, createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './KanbanBoard.module.css';

export interface KanbanColumn {
  id: string;
  title: string;
}

export interface KanbanItemBase {
  id: string;
  columnId: string;
  title: string;
  description?: string;
}

interface KanbanBoardProps<T extends KanbanItemBase> {
  columns: KanbanColumn[];
  items: T[];
  onChange: (items: T[]) => void;
  renderCard?: (item: T) => JSX.Element;
  emptyLabel?: string;
}

const KanbanBoard = <T extends KanbanItemBase>(props: Props<KanbanBoardProps<T>>) => {
  const [draggingId, setDraggingId] = createSignal<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = createSignal<string | null>(null);

  const groupedItems = createMemo(() => {
    const map = new Map<string, T[]>();
    for (const column of props.columns) {
      map.set(column.id, []);
    }

    for (const item of props.items) {
      if (!map.has(item.columnId)) {
        map.set(item.columnId, []);
      }
      map.get(item.columnId)?.push(item);
    }
    return map;
  });

  const handleDragStart = (itemId: string, e: DragEvent) => {
    setDraggingId(itemId);
    e.dataTransfer?.setData('text/plain', itemId);
    e.dataTransfer?.setDragImage(e.currentTarget ? (e.currentTarget as Element) : new Image(), 10, 10);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverColumnId(null);
  };

  const handleDragOverColumn = (columnId: string, e: DragEvent) => {
    e.preventDefault();
    setDragOverColumnId(columnId);
  };

  const handleDropColumn = (columnId: string, e: DragEvent) => {
    e.preventDefault();
    const itemId = draggingId();
    setDragOverColumnId(null);
    setDraggingId(null);
    if (!itemId) return;

    const moved = props.items.find((item) => item.id === itemId);
    if (!moved || moved.columnId === columnId) return;

    const next = props.items.map((item) => (item.id === itemId ? { ...item, columnId } : item));
    props.onChange(next);
  };

  const defaultCard = (item: T) => (
    <div class={styles.cardContent}>
      <strong class={styles.cardTitle}>{item.title}</strong>
      <Show when={item.description}>
        <span class={styles.cardDescription}>{item.description}</span>
      </Show>
    </div>
  );

  return (
    <div class={classNames(styles.board, props.class)}>
      <For each={props.columns}>
        {(column) => {
          const items = () => groupedItems().get(column.id) ?? [];

          return (
            <section
              class={classNames(styles.column, dragOverColumnId() === column.id && styles.columnDragOver)}
              onDragOver={(e) => handleDragOverColumn(column.id, e)}
              onDrop={(e) => handleDropColumn(column.id, e)}
            >
              <header class={styles.columnHeader}>
                <h4 class={styles.columnTitle}>{column.title}</h4>
                <span class={styles.columnCount}>{items().length}</span>
              </header>
              <div class={styles.columnBody}>
                <Show
                  when={items().length > 0}
                  fallback={<div class={styles.empty}>{props.emptyLabel ?? 'No cards'}</div>}
                >
                  <For each={items()}>
                    {(item) => (
                      <article
                        class={classNames(styles.card, draggingId() === item.id && styles.cardDragging)}
                        draggable
                        onDragStart={(e) => handleDragStart(item.id, e)}
                        onDragEnd={handleDragEnd}
                      >
                        {props.renderCard ? props.renderCard(item) : defaultCard(item)}
                      </article>
                    )}
                  </For>
                </Show>
              </div>
            </section>
          );
        }}
      </For>
    </div>
  );
};

export default KanbanBoard;
