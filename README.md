# VelvetUi

SolidJS component library and design system.

Documentation: [Recron project docs](https://docs.bluebraces.online/projects/velvet-ui/).

## Field error announcements

`Field` keeps a separate error status mounted before errors change. Controls composed with `Field`, plus `OtpInput`, `RangeInput` and `MarkdownEditor`, announce subsequent error changes politely by default. Hints remain ordinary descriptions. Empty error regions do not reserve layout space; `reserveHint` controls only space reservation. Initial errors remain visible and associated with the control.

Pass `data-field-error-announcement="none"` to the control when an application-owned summary or announcer presents that error. This disables automatic error speech while retaining the visible message, invalid state and `aria-describedby` association. Omit the attribute, or use `"polite"`, for independent field announcements. The shared options and type are exported as `FIELD_ERROR_ANNOUNCEMENTS` and `FieldErrorAnnouncement`.

Custom controls can compose `FieldFeedback` with distinct `hintId` and `errorId` values. Point `aria-describedby` to the error only while it has content, otherwise to the hint while present. Character counts have their own description id. `FieldHint` itself does not announce changes automatically, including when its `lane` option is enabled.

## Tabs and code regions

Give `Tabs` an `aria-label` or `aria-labelledby`, especially when a view contains multiple tablists. `activation="manual"` keeps Arrow, Home and End navigation separate from activation by Enter, Space or click. Leaving the tablist resets its entry tab stop to the selected tab without moving focus. Automatic activation remains the default.

`PageHeader` forwards `tabActivation` and `tabsLabel` to its section tabs. Both are optional for compatibility; applications should supply a localized name and choose manual activation for panels that load data.

`CodeSnippet` accepts a localized `label`, falling back to `title` and then the library's localized code label. Without variants, its focusable code block is a named `region`. With nonempty `tabs`, the named tablist controls a focusable `tabpanel` labelled by the selected variant. Empty variant lists use the plain code region.
