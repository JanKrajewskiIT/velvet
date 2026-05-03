import type { JSX } from 'solid-js';
import { batch, createMemo, createSignal, For, Show, splitProps } from 'solid-js';

import Chip from '~/components/feedback/Chip/Chip';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Card from '../../surfaces/Card/Card';
import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import styles from './KanbanBoard.module.css';

export interface KanbanColumn {
  id: string;
  label: string;
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
}

const KanbanBoard = <T extends KanbanItemBase>(props: Props<KanbanBoardProps<T>>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['columns', 'items', 'onChange', 'renderCard', 'class']);
  const [draggingId, setDraggingId] = createSignal<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = createSignal<string | null>(null);

  const groupedItems = createMemo(() => {
    const map = new Map<string, T[]>();
    for (const column of local.columns) {
      map.set(column.id, []);
    }

    for (const item of local.items) {
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
    batch(() => {
      setDraggingId(null);
      setDragOverColumnId(null);
    });
  };

  const handleDragOverColumn = (columnId: string, e: DragEvent) => {
    e.preventDefault();
    setDragOverColumnId(columnId);
  };

  const handleDropColumn = (columnId: string, e: DragEvent) => {
    e.preventDefault();
    const itemId = draggingId();
    batch(() => {
      setDragOverColumnId(null);
      setDraggingId(null);
      if (!itemId) return;

      const moved = local.items.find((item) => item.id === itemId);
      if (!moved || moved.columnId === columnId) return;

      const next = local.items.map((item) => (item.id === itemId ? { ...item, columnId } : item));
      local.onChange(next);
    });
  };

  const defaultCard = (item: T) => (
    <div class={styles.cardContent}>
      <Text as="span" variant="labelMd">
        {item.title}
      </Text>
      <Show when={item.description}>
        <Text as="span" variant="caption" tone="muted">
          {item.description}
        </Text>
      </Show>
    </div>
  );

  return (
    <div {...rest} class={classNames(styles.board, local.class)}>
      <For each={local.columns}>
        {(column) => {
          const items = () => groupedItems().get(column.id) ?? [];

          return (
            <section
              class={styles.columnSection}
              onDragOver={(event) => handleDragOverColumn(column.id, event)}
              onDrop={(event) => handleDropColumn(column.id, event)}
            >
              <Card
                padding="none"
                class={classNames(styles.column, dragOverColumnId() === column.id && styles.columnDragOver)}
              >
                <header class={styles.columnHeader}>
                  <Heading as="h4" level={4}>
                    {column.label}
                  </Heading>
                  <Chip size="sm" variant="subtle" label={items().length.toString()} />
                </header>
                <div class={styles.columnBody}>
                  <Show
                    when={items().length > 0}
                    fallback={
                      <Text as="p" variant="caption" tone="muted" class={styles.empty}>
                        {ts('kanban.noCards')}
                      </Text>
                    }
                  >
                    <For each={items()}>
                      {(item) => (
                        <Card
                          as="article"
                          class={classNames(
                            styles.card,
                            styles.cardSurface,
                            draggingId() === item.id && styles.cardDragging,
                          )}
                          draggable
                          onDragStart={(event) => handleDragStart(item.id, event)}
                          onDragEnd={handleDragEnd}
                        >
                          {local.renderCard ? local.renderCard(item) : defaultCard(item)}
                        </Card>
                      )}
                    </For>
                  </Show>
                </div>
              </Card>
            </section>
          );
        }}
      </For>
    </div>
  );
};

export default KanbanBoard;
