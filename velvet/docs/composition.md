# Composition rules

A new component **assembles atoms** — it never re-declares background/border/shadow/typography.

| Need | Use |
|---|---|
| Any container | `Surface` / `Card` |
| Input shell | `Field` (+ `FieldLabel`, `FieldHint`) + `Control` |
| List row | `Option` / `ListItem` |
| Round step / event badge · line between | `Marker` · `Rail` |
| Tinted glyph box | `IconTile` |
| Person / series | `Avatar` (`color="auto"`) |
| Status point · number pill | `Dot` · `Count` |
| Status chip | `Badge` |
| Filter / keyword / removable chip | `Tag` |
| One-of-N track | `Segmented` (+ `SegmentedItem`) |
| Bar · task progress · ring | `Meter` · `Progress` · `ProgressRing` |
| Group heading · weekday header | `SectionLabel` · `Weekday` |
| Close ×  | `CloseButton` |
| Loading | `Spinner` / `Button loading` / `Skeleton` |
| Icons | `Glyph` / `renderIcon()` — never raw `<i class="vui-icon">` in JSX |

## Container hierarchy
```
Surface      ← paints bg · border · radius · elevation · padding · tone (--surface-*)
├─ Card      ← Surface + header/body/footer (--card-*)
│   └─ FeatureCard · FlipCard · Stat · ScoreCard · QuestionCard  (Card + interior only)
├─ StructuredCard ← Surface + media/scrim/hairline regions
└─ Floating panels (Popover · Menu · Toast · Dialog · BottomSheet) ← Surface layers
```
Derived cards pass Card/Surface props through; their CSS styles only `> .vui-card__body` interiors.

## Picking look-alikes
- Tabs swap panels · OptionSwitcher = required value · ChipGroup filters · MenuChip filters with many values
- Tooltip hover text · Popover click, rich · Menu actions
- Dialog decisions · Dialog `placement="right"` side tasks · BottomSheet mobile
- Table read-mostly · DataGrid editing · VirtualTable huge lists
- Skeleton shape known · Progress % known · Spinner otherwise
- Not separate components: HoverCard = `Popover openOn="hover"`; RangeSlider = `Slider value={[lo,hi]}`; Drawer = `Dialog placement`; Combobox = `Autocomplete`; Image = `MediaFrame`.
