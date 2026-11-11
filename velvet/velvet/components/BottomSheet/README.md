Mobile-first panel sliding up from the bottom. Drag the grabber down (or flick) to dismiss; Esc and backdrop tap also close. Respects safe-area insets. Focus stays inside while open and returns to the trigger on close; the page behind does not scroll.

**Props.** The full contract is `BottomSheetProps` in `components/index.d.ts`.

- `open` (required): `boolean`
- `onClose`: `() => void`
- `title`: `ReactNode`
- `description`: `ReactNode`
- `footer`: `ReactNode`
- `children`: `ReactNode`

**CSS:** `.vui-sheet-backdrop*`. **Preview:** `components/BottomSheet/preview.html` (group Overlays).
