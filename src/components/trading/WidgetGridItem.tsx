import { Show } from 'solid-js';

import { IconButton } from '../actions/IconButton';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import type { WidgetGridController } from './createWidgetGrid';
import styles from './WidgetGridItem.module.css';

export const WidgetGridItem = (props: { grid: WidgetGridController; id: string }) => {
  const widget = () => props.grid.widgets().get(props.id);
  const index = () => props.grid.visible().indexOf(props.id);
  return (
    <section
      class={styles.item}
      data-widget-id={props.id}
      data-span={props.grid.span(props.id)}
      data-editing={props.grid.props.editing || undefined}
      data-dragging={props.grid.drag() === props.id ? '' : undefined}
      aria-label={widget()?.title}
      draggable={props.grid.props.editing || undefined}
      onDragStart={(event) => {
        if (event.target !== event.currentTarget) return;
        if (!props.grid.props.editing) {
          event.preventDefault();
          return;
        }
        event.stopPropagation();
        props.grid.setDrag(props.id);
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', props.id);
          event.dataTransfer.effectAllowed = 'move';
        }
      }}
      onDragEnd={(event) => {
        if (event.target === event.currentTarget) props.grid.setDrag(undefined);
      }}
      onDragOver={(event) => {
        if (!props.grid.props.editing || !props.grid.drag()) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        if (!props.grid.props.editing || !props.grid.drag()) return;
        event.preventDefault();
        event.stopPropagation();
        props.grid.drop(props.id);
      }}
    >
      <Show when={props.grid.props.editing}>
        <div class={styles.bar} data-widget-controls>
          <span class={styles.grip} aria-hidden="true" title={props.grid.label('drag')}>
            <Glyph name="grip-vertical" />
          </span>
          <Text as="span" variant="label" class={styles.name}>
            {widget()?.title}
          </Text>
          <IconButton
            size="xs"
            icon="arrow-left"
            label={props.grid.named('earlier', props.id)}
            disabled={index() === 0}
            onClick={() => props.grid.move(props.id, -1)}
          />
          <IconButton
            size="xs"
            icon="arrow-right"
            label={props.grid.named('later', props.id)}
            disabled={index() === props.grid.visible().length - 1}
            onClick={() => props.grid.move(props.id, 1)}
          />
          <IconButton
            size="xs"
            icon="minus"
            label={props.grid.named('narrower', props.id)}
            disabled={props.grid.span(props.id) <= 1}
            onClick={() => props.grid.resize(props.id, -1)}
          />
          <IconButton
            size="xs"
            icon="plus"
            label={props.grid.named('wider', props.id)}
            disabled={props.grid.span(props.id) >= props.grid.columns()}
            onClick={() => props.grid.resize(props.id, 1)}
          />
          <IconButton
            size="xs"
            icon="eye-off"
            label={props.grid.named('hide', props.id)}
            onClick={() => props.grid.hide(props.id)}
          />
        </div>
      </Show>
      <div class={styles.content}>{widget()?.content}</div>
    </section>
  );
};
