Dashboard the viewer arranges. Each widget has an order, a column span and a visibility; in `editing` mode every widget gets a bar with a drag grip and buttons (earlier, later, narrower, wider, hide), and hidden widgets wait in a tray to be shown again. Columns collapse to 2 below 1024px and to 1 below 768px.

**Use it** for overview pages that different people use differently. It is controlled: keep `layout` in your state or storage and save what `onLayoutChange` returns. The toggle for `editing` ("Customize" / "Done") lives in your page header.

**Built from** `IconButton`, `Button` (dashed), `Glyph`. Widget content is yours, usually a `Card` or `Stat`.

**Props.** The full contract is `WidgetGridProps` in `components/index.d.ts`.

- `widgets`: `{ id, title, span, content }`.
- `layout`: `{ order, hidden, spans }`; unknown ids are ignored, new widgets append.
- Keyboard: the bar buttons do everything drag does.

**Preview:** `components/WidgetGrid/preview.html`.
