# Localization Key Catalog

Status: Source-backed message inventory for `src/i18n/en.ts` and `src/i18n/pl.ts` in baseline 3.1.3. It lists all source dictionary leaf keys/placeholders. Under `USER-DEC-009`, target translation-key names and dictionary API may be redesigned; preserve every message meaning, interpolation datum and locale behavior.

## Keys

- `common`: `add`, `all`, `apply`, `back`, `cancel`, `clear`, `close`, `confirm`, `copy`, `copied`, `copyFailed`, `default`, `delete`, `dismiss`, `edit`, `end`, `exportJson`, `field`, `finish`, `importJson`, `loading`, `logIn`, `logOut`, `match`, `menuOptions`, `moveDown`, `moveUp`, `next`, `noData`, `notSet`, `noItems`, `noOptions`, `none`, `notifications`, `operator`, `pagination`, `persisted`, `pin`, `previous`, `queryBuilder`, `remove`, `save`, `saveChanges`, `search`, `searchEllipsis`, `selectEllipsis`, `selected`, `skip`, `start`, `today`, `value`
- `error`: `title`, `description`, `retry`
- `accessDenied`: `unauthorized.title`, `unauthorized.description`, `forbidden.title`, `forbidden.description`, `goHome`
- `notFound`: `title`, `description`, `goHome`, `suggestions`
- `dir`: `left`, `right`
- `time`: `hhmm`
- `date`: `yyyymmdd`
- `calendar`: `label`, `rangeLabel`, `prevMonth`, `nextMonth`, `day.mo`, `day.tu`, `day.we`, `day.th`, `day.fr`, `day.sa`, `day.su`
- `speedDial`: `actions`, `open`, `close`
- `dropdown`: `openMenu`
- `accordion`: `toggleSection`, `toggleSectionWithLabel`
- `datetime`: `openDatePicker`, `openTimePicker`, `timeOptions`, `startDate`, `endDate`
- `notification`: `markAllRead`, `markRead`, `clearAll`, `empty`
- `table`: `filterRows`, `result`, `results`, `pageOf`
- `multiselect`: `selectOptions`
- `alert`: `close`
- Loader status keys: `bikeLoader.loading`, `bouncingDotsLoader.loading`, `concentricPulseLoader.loading`, `cornerPulseLoader.loading`, `dualPlaneSpinner.loading`, `ellipsisLoader.loading`, `equalizerLoader.loading`, `honeycombLoader.loading`, `jellyTriangleLoader.loading`, `orbitSquaresLoader.loading`, `pageLoader.loading`, `pulseRingLoader.loading`, `rippleDotsLoader.loading`, `shapeTrailLoader.loading`, `shuffleGridLoader.loading`, `spinner.loading`
- `inlineEditable`: `clickEdit`, `editValue`, `inputLabel`
- `number`: `decrease`, `increase`
- `search`: `clear`
- `otp`: `group`, `digit`
- `password`: `show`, `hide`
- `richText`: `editor`, `placeholder`, `list`, `link`, `linkPlaceholder`, `unlink`, `clear`
- `sidebar`: `expand`, `collapse`, `navigation`, `searchItems`, `onlyBadges`, `noMatches`, `broaderHint`, `componentCategories`
- `navbar`: `navigation`, `toggleMenu`
- `tabs`: `tabList`
- `backToTop`: `label`
- `lightbox`: `imageViewer`
- `avatar`: `label`
- `breadcrumbs`: `label`, `showAll`
- `carousel`: `previousSlide`, `nextSlide`, `goToSlide`
- `rangeSlider`: `minimum`, `maximum`
- `kanban`: `noCards`
- `commandPalette`: `searchCommands`, `open`, `label`, `results`, `noResults`, `navigate`, `select`, `escToClose`
- `transfer`: `available`, `selected`, `selectItem`, `moveSelectedRight`, `moveAllRight`, `moveSelectedLeft`, `moveAllLeft`
- `locale`: `switchLanguage`
- `scheduler`: `agenda`, `addEvent`, `eventTitle`, `descriptionOptional`, `noEventsForDay`, `move`, `resizeEnd`, `moveEvent`, `resizeEventEnd`, `deleteEvent`, `deleteEventMessage`
- `filterBar`: `clearAll`
- `tree`: `loading`, `toggleNode`
- `rating`: `valueOf`
- `resizablePanel`: `resizePanels`
- `theme`: `light`, `dark`, `label`
- `flashcard`: `revealHint`, `answer`, `iKnow`, `iDontKnow`, `quit`, `known`, `unknown`, `total`, `restart`
- `practiceSetup`: `category`, `count`, `allCategories`
- `banner`: `close`
- `analysis`: `categories`, `inputPlaceholder`, `recommendations`, `score`, `analyze`
- `comparison`: `compare`, `selectToCompare`
- `dualFilterBar`: `filterGroup`, `sortGroup`
- `editableCollection`: `deleteConfirmMessage`
- `colorLabel`: `name`, `color`, `empty`, `deleteConfirm`, `deleteConfirmMessage`

## Interpolation Parameters

| Key | Required parameters |
|---|---|
| `accordion.toggleSectionWithLabel` | `label` |
| `table.pageOf` | `current`, `total` |
| `otp.digit` | `index` |
| `carousel.goToSlide` | `index` |
| `transfer.selectItem` | `label` |
| `scheduler.moveEvent` | `title` |
| `scheduler.resizeEventEnd` | `title` |
| `tree.toggleNode` | `label` |
| `rating.valueOf` | `index`, `max` |

## Provider Contract

- `SOURCE-I18N-001`: English dictionary is the source shape for the typed Polish dictionary in this baseline; replacement may use a different schema if every message is still covered in both locales.
- `SOURCE-I18N-002`: Source provider/dictionary helpers and types come from `@jankrajewskiit/i18n` 2.0.9. `VelvetProvider` supplies initial locale, source storage key `velvet-locale`, and optional composed dictionaries. Replacement helper names and key spellings may differ; consumer dictionary composition and locale switching semantics remain.
- `GAP-I18N-003`: Exact locale detection, fallback, dictionary composition/override precedence, missing-key behavior and storage failure behavior are owned by the shared package and not independently verified here. Reusing the pinned dependency preserves those details; replacing it requires new consumer-facing acceptance evidence.