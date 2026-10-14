import { createSignal, createUniqueId, For, type JSX, Show } from 'solid-js';

import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { isInteractiveTarget } from '../../utils/interactiveTarget';
import { IconButton } from '../actions/IconButton';
import { Count } from '../primitives/Count';
import { Dot } from '../primitives/Dot';
import { EmptyText } from '../primitives/EmptyText';
import { createKanbanMove } from './createKanbanMove';
import { KanbanCardBody } from './KanbanCardBody';
import type { KanbanCard, KanbanProps } from './kanbanTypes';

export type { KanbanCard, KanbanColumn, KanbanMove, KanbanProps } from './kanbanTypes';

interface DropTarget {
  column: string;
  index: number;
}

const DEFAULT_DOT_COLOR = 'var(--dv-8)';

/** Column task board. Drag & drop with a drop-position ghost, or keyboard: ↑↓ focus cards, Ctrl/⌘/Alt + ←→ move between columns, + ↑↓ reorder. Moves are announced. Controlled: you own cards. */
export const Kanban = (props: KanbanProps): JSX.Element => {
  const translate = useTranslate();
  const [dragId, setDragId] = createSignal<KanbanCard['id'] | null>(null);
  const [over, setOver] = createSignal<DropTarget | null>(null);
  const [announcement, setAnnouncement] = createSignal('');
  const helpId = `vui-kanban-help-${createUniqueId()}`;
  let board!: HTMLDivElement;

  const focusFrame = createFrameFocus(() => board);
  const cardsIn = (columnId: string) => props.cards.filter((c) => c.column === columnId);

  const movement = createKanbanMove(props, (card, column, at) => {
    setAnnouncement(
      translate('velvet.data.kanban.cardMoved', {
        card: typeof card.title === 'string' ? card.title : translate('velvet.data.kanban.cardFallback'),
        column: column.title,
        position: at + 1,
      }),
    );
    focusFrame(`[data-card="${CSS.escape(String(card.id))}"]`);
  });
  const move = movement.move;

  const onCardKey = (e: KeyboardEvent & { currentTarget: HTMLElement }, card: KanbanCard) => {
    if (props.disabled || e.defaultPrevented || e.target !== e.currentTarget) return;
    if (!(e.ctrlKey || e.metaKey || e.altKey)) {
      if (e.key === 'Enter') props.onCardClick?.(card);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const siblings = [...(e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[data-card]') ?? [])];
        siblings[siblings.indexOf(e.currentTarget) + (e.key === 'ArrowDown' ? 1 : -1)]?.focus();
      }
      return;
    }
    if (!movement.movable()) return;
    const columnIndex = props.columns.findIndex((x) => x.id === card.column);
    const siblings = cardsIn(card.column);
    const position = siblings.findIndex((x) => x.id === card.id);
    const previousColumn = props.columns[columnIndex - 1];
    const nextColumn = props.columns[columnIndex + 1];
    if (e.key === 'ArrowRight' && nextColumn) {
      e.preventDefault();
      move(card.id, nextColumn.id, position);
    } else if (e.key === 'ArrowLeft' && previousColumn) {
      e.preventDefault();
      move(card.id, previousColumn.id, position);
    } else if (e.key === 'ArrowUp' && position > 0) {
      e.preventDefault();
      move(card.id, card.column, position - 1);
    } else if (e.key === 'ArrowDown' && position < siblings.length - 1) {
      e.preventDefault();
      move(card.id, card.column, position + 1);
    }
  };

  const dropIndex = (e: DragEvent, columnEl: HTMLElement) => {
    const dragged = String(dragId());
    const cards = [...columnEl.querySelectorAll<HTMLElement>('[data-card]')].filter(
      (el) => el.dataset.card !== dragged,
    );
    const index = cards.findIndex((el) => {
      const rect = el.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });
    return index < 0 ? cards.length : index;
  };

  const endDrag = () => {
    setDragId(null);
    setOver(null);
  };

  return (
    <div
      ref={(element) => {
        board = element;
      }}
      class={cx('vui-kanban', props.class)}
      aria-busy={movement.pending() || undefined}
    >
      <span class="vui-sr-only" aria-live="assertive">
        {announcement()}
      </span>
      <Show when={movement.failed()}>
        <div class="vui-hint vui-hint--error" role="alert">
          {props.moveErrorText ?? translate('velvet.data.kanban.moveError')}
        </div>
      </Show>
      <For each={props.columns}>
        {(col) => {
          const list = () => cardsIn(col.id);
          const isOver = () => over()?.column === col.id;
          const overIndex = () => over()?.index ?? -1;
          const overLimit = () => col.limit != null && list().length > col.limit;
          const remaining = () => list().filter((c) => c.id !== dragId()).length;
          return (
            <section
              class={cx('vui-kanban__col', isOver() && 'vui-kanban__col--over')}
              aria-label={col.title}
              onDragOver={(e) => {
                if (dragId() == null) return;
                e.preventDefault();
                const index = dropIndex(e, e.currentTarget);
                if (!isOver() || overIndex() !== index) setOver({ column: col.id, index });
              }}
              onDragLeave={(e) => {
                const next = e.relatedTarget;
                if (!(next instanceof Node) || !e.currentTarget.contains(next)) setOver(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = dragId();
                if (id != null) move(id, col.id, dropIndex(e, e.currentTarget));
                endDrag();
              }}
            >
              <header class="vui-kanban__head">
                <Dot size="lg" class="vui-kanban__dot" style={{ '--tone': col.color ?? DEFAULT_DOT_COLOR }} />
                <span class="vui-kanban__title">{col.title}</span>
                <Count
                  tone="neutral"
                  showZero
                  value={col.limit != null ? `${list().length}/${col.limit}` : list().length}
                  class={cx('vui-kanban__count', overLimit() && 'vui-kanban__count--over')}
                />
                <Show when={props.onAddCard}>
                  {(onAdd) => (
                    <IconButton
                      icon="plus"
                      label={translate('velvet.data.kanban.addCard', { column: col.title })}
                      size="sm"
                      disabled={props.disabled}
                      onClick={() => onAdd()(col.id)}
                      style={{ 'margin-left': 'auto' }}
                    />
                  )}
                </Show>
              </header>
              <div
                class="vui-kanban__list"
                role="list"
                aria-label={translate('velvet.data.kanban.listLabel', { title: col.title, count: list().length })}
              >
                <For each={list()}>
                  {(card, i) => (
                    <>
                      <Show when={isOver() && overIndex() === i()}>
                        <div class="vui-kanban__ghost" />
                      </Show>
                      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- draggable card is a focusable item; keyboard moves and Enter are handled by onKeyDown */}
                      <article
                        role="listitem"
                        data-card={card.id}
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- each card is a keyboard-operable item (arrows move focus, modifiers move the card)
                        tabIndex={0}
                        draggable={movement.movable()}
                        class={cx('vui-kanban__card', dragId() === card.id && 'vui-kanban__card--drag')}
                        aria-roledescription={translate('velvet.data.kanban.cardRoleDescription')}
                        aria-describedby={helpId}
                        onDragStart={(e) => {
                          if (!movement.movable() || isInteractiveTarget(e.target, e.currentTarget)) {
                            e.preventDefault();
                            return;
                          }
                          setDragId(card.id);
                          if (!e.dataTransfer) return;
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', String(card.id));
                        }}
                        onDragEnd={endDrag}
                        onKeyDown={(e) => onCardKey(e, card)}
                        onClick={(event) => {
                          if (!props.disabled && !isInteractiveTarget(event.target, event.currentTarget))
                            props.onCardClick?.(card);
                        }}
                      >
                        <KanbanCardBody card={card} render={props.renderCard} />
                      </article>
                    </>
                  )}
                </For>
                <Show when={isOver() && overIndex() >= remaining()}>
                  <div class="vui-kanban__ghost" />
                </Show>
                <Show when={list().length === 0 && !isOver()}>
                  <EmptyText dashed class="vui-kanban__empty">
                    {translate('velvet.data.kanban.dropHere')}
                  </EmptyText>
                </Show>
              </div>
            </section>
          );
        }}
      </For>
      <span id={helpId} class="vui-sr-only">
        {translate('velvet.data.kanban.help')}
      </span>
    </div>
  );
};
