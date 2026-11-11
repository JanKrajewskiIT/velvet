import { createEffect, createMemo, createSignal } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import type { WidgetGridLabels, WidgetGridLayout, WidgetGridProps, WidgetGridResolvedLayout } from './widgetGridTypes';

export const createWidgetGrid = (props: WidgetGridProps) => {
  const translate = useTranslate();
  const [root, setRoot] = createSignal<HTMLDivElement>();
  const [drag, setDrag] = createSignal<string>();
  const [announcement, setAnnouncement] = createSignal('');
  const focus = createFrameFocus(root);
  const [raw, setRaw] = createControllable<WidgetGridLayout>({ value: () => props.layout, defaultValue: {} });
  const widgets = createMemo(() => {
    const result = new Map(props.widgets.map((widget) => [widget.id, widget]));
    if (
      result.size !== props.widgets.length ||
      props.widgets.some((widget) => typeof widget.id !== 'string' || widget.id === '')
    ) {
      throw new RangeError('WidgetGrid widgets require unique non-empty string ids.');
    }
    return result;
  });
  const columns = () => {
    const value = props.columns ?? 3;
    if (![2, 3, 4].includes(value)) throw new RangeError('WidgetGrid columns must be 2, 3 or 4.');
    return value;
  };
  const clampSpan = (span: number) => (Number.isFinite(span) ? Math.max(1, Math.min(columns(), Math.floor(span))) : 1);
  const layout = createMemo((): WidgetGridResolvedLayout => {
    const source = raw();
    const known = widgets();
    const order = [...new Set([...(source.order ?? []), ...known.keys()])].filter((id) => known.has(id));
    const hidden = [...new Set(source.hidden ?? [])].filter((id) => known.has(id));
    const spans = Object.fromEntries(
      Object.entries(source.spans ?? {})
        .filter(([id]) => known.has(id))
        .map(([id, span]) => [id, clampSpan(span)]),
    );
    return { order, hidden, spans };
  });
  const visible = createMemo(() => layout().order.filter((id) => !layout().hidden.includes(id)));
  const label = (key: keyof WidgetGridLabels) => props.labels?.[key] ?? translate(`velvet.trading.widgetGrid.${key}`);
  const named = (key: keyof WidgetGridLabels, id: string) =>
    translate('velvet.trading.widgetGrid.namedAction', { action: label(key), title: widgets().get(id)?.title ?? id });
  const span = (id: string) => {
    const { spans } = layout();
    return clampSpan((Object.hasOwn(spans, id) ? spans[id] : widgets().get(id)?.span) ?? 1);
  };
  const emit = (patch: Partial<WidgetGridResolvedLayout>) => {
    if (!props.editing) return;
    const next = { ...layout(), ...patch };
    setRaw(next);
    props.onLayoutChange?.(next);
  };
  const focusWidget = (id: string) =>
    focus(`:scope > [data-widget-id="${CSS.escape(id)}"] > [data-widget-controls] > button:not(:disabled)`);
  const announceMove = (id: string, position: number) =>
    setAnnouncement(
      translate('velvet.trading.widgetGrid.moved', { title: widgets().get(id)?.title ?? id, position: position + 1 }),
    );
  const move = (id: string, direction: -1 | 1) => {
    if (!props.editing) return;
    const at = visible().indexOf(id);
    const target = visible()[at + direction];
    if (at < 0 || !target) return;
    const order = [...layout().order];
    const left = order.indexOf(id),
      right = order.indexOf(target);
    order[left] = target;
    order[right] = id;
    emit({ order });
    focusWidget(id);
    announceMove(id, at + direction);
  };
  const drop = (target: string) => {
    const source = drag();
    setDrag(undefined);
    if (!props.editing || !source || source === target || !visible().includes(source) || !visible().includes(target))
      return;
    const order = layout().order.filter((id) => id !== source);
    order.splice(order.indexOf(target), 0, source);
    emit({ order });
    focusWidget(source);
    announceMove(source, order.filter((id) => !layout().hidden.includes(id)).indexOf(source));
  };
  const hide = (id: string) => {
    if (!props.editing || !visible().includes(id)) return;
    const index = visible().indexOf(id);
    const next = visible()[index + 1] ?? visible()[index - 1];
    emit({ hidden: [...layout().hidden, id] });
    if (next) focusWidget(next);
    else focus(`[data-widget-show="${CSS.escape(id)}"]`);
    setAnnouncement(named('hide', id));
  };
  const show = (id: string) => {
    if (!props.editing || !layout().hidden.includes(id)) return;
    emit({ hidden: layout().hidden.filter((key) => key !== id) });
    focusWidget(id);
    setAnnouncement(named('show', id));
  };
  createEffect(() => {
    if (!props.editing || (drag() && !widgets().has(drag() ?? ''))) setDrag(undefined);
  });
  return {
    props,
    root,
    setRoot,
    drag,
    setDrag,
    layout,
    visible,
    widgets,
    columns,
    span,
    label,
    named,
    announcement,
    move,
    drop,
    hide,
    show,
    resize: (id: string, direction: -1 | 1) =>
      emit({ spans: { ...layout().spans, [id]: clampSpan(span(id) + direction) } }),
  };
};

export type WidgetGridController = ReturnType<typeof createWidgetGrid>;
