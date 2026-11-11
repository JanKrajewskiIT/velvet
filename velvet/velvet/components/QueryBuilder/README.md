Visual condition builder for segments, automations and advanced search: "Where Status is Active AND (Plan is Pro OR Seats > 10)". Operators follow the field type (narrow per field with `operators`); the combinator toggles on the second row of each group. Groups nest up to maxDepth. For quick faceted filtering use FilterBar; QueryBuilder is for saved, precise rules.

**Props.** The full contract is `QueryBuilderProps` in `components/index.d.ts`.

**Built from:** SectionLabel, Input, Select, Button, IconButton, CloseButton. **Also exports:** emptyQuery, clearQuery, describeQuery. **CSS:** `.vui-qb*`. **Preview:** `components/QueryBuilder/preview.html` (group Data).
