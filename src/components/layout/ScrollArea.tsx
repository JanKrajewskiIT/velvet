import { createEffect, createSignal, type JSX, mergeProps, on, onCleanup, onMount, Show, splitProps } from 'solid-js';

import { assignRef } from '../../utils/assignRef';
import { callHandler } from '../../utils/callHandler';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { lengthValue } from './space';

const EDGE_THRESHOLD_PX = 1;
const FADE_SIZE = '28px';
const AXIS = { vertical: 'y', horizontal: 'x', both: 'both' } as const;

interface ScrollEdges {
  start: boolean;
  end: boolean;
}

const sameEdges = (a: ScrollEdges, b: ScrollEdges): boolean => a.start === b.start && a.end === b.end;

export interface ScrollAreaProps extends HtmlProps<HTMLDivElement> {
  maxHeight?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  /** horizontal lays children in a non-wrapping row. @default 'vertical' */
  orientation?: keyof typeof AXIS;
  /** Fade the edge where content continues. @default true */
  fade?: boolean;
  /** Makes it a labelled region — set when the area holds meaningful content. */
  label?: string;
}

/** Scroll container with a themed scrollbar and edge fades that appear only where content continues. */
export const ScrollArea = (props: ScrollAreaProps) => {
  const merged = mergeProps({ orientation: 'vertical', fade: true } satisfies ScrollAreaProps, props);
  const [local, rest] = splitProps(merged, [
    'maxHeight',
    'height',
    'maxWidth',
    'orientation',
    'fade',
    'label',
    'class',
    'style',
    'children',
    'onScroll',
    'ref',
    'tabIndex',
  ]);
  let area!: HTMLDivElement;
  const [edges, setEdges] = createSignal<ScrollEdges>({ start: false, end: false }, { equals: sameEdges });
  const horizontal = () => local.orientation === 'horizontal';

  const measure = () => {
    const position = horizontal() ? area.scrollLeft : area.scrollTop;
    const max = horizontal() ? area.scrollWidth - area.clientWidth : area.scrollHeight - area.clientHeight;
    setEdges({ start: position > EDGE_THRESHOLD_PX, end: position < max - EDGE_THRESHOLD_PX });
  };

  onMount(() => {
    measure();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    const observe = () => {
      observer?.disconnect();
      observer?.observe(area);
      for (const child of area.children) observer?.observe(child);
      schedule();
    };
    const mutations = new MutationObserver(observe);
    mutations.observe(area, { childList: true, subtree: true, characterData: true, attributes: true });
    observe();
    createEffect(on(() => local.orientation, schedule));
    onCleanup(() => {
      observer?.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
    });
  });

  const fadeSize = (visible: boolean) => (local.fade && visible ? FADE_SIZE : '0px');
  const style = (): JSX.CSSProperties => ({
    'max-height': lengthValue(local.maxHeight),
    height: lengthValue(local.height),
    'max-width': lengthValue(local.maxWidth),
    '--_fs': fadeSize(edges().start),
    '--_fe': fadeSize(edges().end),
    ...local.style,
  });

  return (
    <div
      {...rest}
      ref={(element) => {
        area = element;
        assignRef(local.ref, element);
      }}
      onScroll={(event) => {
        measure();
        callHandler(local.onScroll, event);
      }}
      tabIndex={local.tabIndex ?? 0}
      role={local.label ? 'region' : undefined}
      aria-label={local.label}
      class={cx('vui-scroll', `vui-scroll--${AXIS[local.orientation]}`, local.class)}
      style={style()}
    >
      <Show when={horizontal()} fallback={local.children}>
        <div class="vui-scroll__track">{local.children}</div>
      </Show>
    </div>
  );
};
