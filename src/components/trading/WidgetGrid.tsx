import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Text } from '../primitives/Text';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { createWidgetGrid } from './createWidgetGrid';
import styles from './WidgetGrid.module.css';
import { WidgetGridItem } from './WidgetGridItem';
import type { WidgetGridProps } from './widgetGridTypes';

export const WidgetGrid = (props: WidgetGridProps) => {
  const grid = createWidgetGrid(props);
  return (
    <div ref={grid.setRoot} class={cx(styles.root, props.class)} style={{ '--wgrid-cols': grid.columns() }}>
      <For each={grid.visible()}>{(id) => <WidgetGridItem grid={grid} id={id} />}</For>
      <Show when={props.editing && grid.layout().hidden.length}>
        <div class={styles.tray} role="group" aria-label={grid.label('hiddenTitle')}>
          <Text as="span" variant="body-sm" tone="secondary" class={styles.trayLabel}>
            {grid.label('hiddenTitle')}
          </Text>
          <For each={grid.layout().hidden}>
            {(id) => (
              <Button size="sm" variant="dashed" iconLeft="plus" data-widget-show={id} onClick={() => grid.show(id)}>
                {grid.named('show', id)}
              </Button>
            )}
          </For>
        </div>
      </Show>
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {grid.announcement()}
      </VisuallyHidden>
    </div>
  );
};
