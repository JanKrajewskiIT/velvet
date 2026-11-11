Page navigation with truncation (1 … 4 5 6 … 20). Optional "1–20 of 243" range and rows-per-page select. compact = "Page 3 of 12" (auto under 640px for full).

Use the default variant with `total` and `pageSize` for a table footer, or `variant="compact"` with `pageCount` where space is tight.

```jsx
<Pagination page={page} onPageChange={setPage} total={243}
            pageSize={pageSize} pageSizeOptions={[10, 20, 50]} onPageSizeChange={setPageSize} />

<Pagination variant="compact" pageCount={12} defaultPage={3} />
```

**Props.** The full contract is `PaginationProps` in `components/index.d.ts`.

**Built from:** Glyph, Select. **Also exports:** pageRange. **CSS:** `.vui-pager*`. **Preview:** `components/Pagination/preview.html` (group Wayfinding).
