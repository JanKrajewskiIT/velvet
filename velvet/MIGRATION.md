# Migrating an app from the old Finance-flavoured API to the neutral one

This file lives outside the design system on purpose: the design system no longer carries any domain vocabulary,
so the mapping from your domain words to the neutral props belongs in the app.

## DirectionBadge
| Before | After |
|---|---|
| `direction="LONG"` / `"BUY"` / `"ADD"` | `direction="up"` and pass the text: `<DirectionBadge direction="up">LONG</DirectionBadge>` |
| `direction="SHORT"` / `"SELL"` / `"TRIM"` | `direction="down"` |
| `direction="WAIT"` / `"HOLD"` | `direction="flat"` (icon is now `minus` for every flat badge; it was `clock` / `pause`) |
| `direction="NO_TRADE"` / `"SKIP"` | `direction="muted"` |
| the text was the `direction` string, upper-cased in JS | the text is `children` (default Up / Down / Flat / None); upper-casing is done by CSS |

A tiny map in the app is enough: `const SIDE = { LONG: 'up', BUY: 'up', ADD: 'up', SHORT: 'down', SELL: 'down', TRIM: 'down', WAIT: 'flat', HOLD: 'flat', NO_TRADE: 'muted', SKIP: 'muted' }`.

## EnvironmentBar
| Before | After |
|---|---|
| `environment="research" \| "replay" \| "shadow"` | `tone="neutral"` + `label` |
| `environment="paper"` (default) | `tone="info"` (default) + `label` |
| `environment="demo"` | `tone="warning"` + `label` |
| `environment="live"` | `tone="danger"` + `label` (danger is the solid fill) |
| default chip texts (`PAPER`, `LIVE · REAL FUNDS` …) | none: pass `label`; without it the chip shows the tone name |
| `onKill`, `killLabel` ("Kill Switch"), `killDisabled` | `onStop`, `stopLabel` ("Stop"), `stopDisabled` |

## NewsItem
`tickers` → `tags`, `onTickerClick` → `onTagClick` (CSS class `vui-news__tickers` → `vui-news__tags`).

## Tokens and attributes
| Before | After |
|---|---|
| `data-market-colors="standard" \| "inverted" \| "cvd"` | `data-trend-colors="…"` |
| `--market-up-*`, `--market-down-*`, `--market-flat-*` (`fg` · `solid` · `bg`) | `--trend-up-*`, `--trend-down-*`, `--trend-flat-*` |
| `--mkt-gain-*`, `--mkt-loss-*` | `--trend-pos-*`, `--trend-neg-*` |
| `--market-band`, `--market-band-edge`, `--market-median` | `--chart-band`, `--chart-band-edge`, `--chart-median` |
| `--env-research-*`, `--env-paper-*`, `--env-demo-*`, `--env-live-*` | `--env-neutral-*`, `--env-info-*`, `--env-warning-*`, `--env-danger-*` |

## Renamed components
| Before | After |
|---|---|
| `PriceChange` | `Delta` (same props; `format="bp"` is gone — use `unit=" bp"`; CSS `.vui-pc*` → `.vui-delta*`) |
| `InstrumentLabel` | `CodeLabel` (`symbol` → `code`, `exchange` → `tag`; CSS `.vui-inst*` → `.vui-codelabel*`, `__sym` → `__code`, `__ex` → `__tag`) |

## New place, same API
`Money`, `Delta`, `ValueShift`, `ContributionBar` are in Data viz; `DirectionBadge`, `CodeLabel`, `NewsItem` in Display; `EnvironmentBar` in Feedback. Props and behaviour are as before except for the lists above.


## Patterns and Cards: domain components made neutral
| Before | After |
|---|---|
| `AtsAnalysisPanel` (types `AtsResult`, `AtsCategory`, `AtsRecommendation`, `AtsSeverity`, props `AtsAnalysisPanelProps`) | `AnalysisReport` (`ReportResult`, `ReportCategory`, `ReportRecommendation`, `ReportSeverity`, `AnalysisReportProps`); CSS `.vui-ats*` → `.vui-report*` |
| `FlashcardSetup`, `FlashcardSession`, `FlashcardSummary` | `PracticeSetup`, `PracticeSession`, `PracticeSummary` |
| `FlashDeck`, `Flashcard`, `FlashResult` | `PracticeCollection`, `PracticeCard`, `PracticeResult` |
| `<FlashcardSetup decks={…} />`, `onStart({ deck, … })` | `<PracticeSetup collections={…} />`, `onStart({ collection, … })` |
| CSS `.vui-fc-*` (`__decks`, `-deck`) | `.vui-practice-*` (`__collections`, `-collection`) |
| `AnalysisSource.kind`: `cv`, `job`, `notes`, `transcript`, `profile`, `company`, `portfolio`, `other` | `document`, `notes`, `transcript`, `profile`, `organization`, `link`, `other` (cv and job → `document`, company → `organization`, portfolio → `link`) |

`QuestionCard`, `ScoreCard`, `FlipCard`, `AiResultPanel`, `PricingTable` keep their names and props; only descriptions and sample data changed.

## Sections (Library groups) after the regrouping
Charts · Metrics (were Data viz) · Navigation · Wayfinding · Feedback · Progress · Overlays (+ label and import dialogs) · Data (+ `FilterBar`, `DualFilterBar`, `QueryBuilder`) · Planning (+ `CalendarOrganizer`) · Patterns (conversation and AI).

## Leftover folders to delete in the design system (the tool cannot delete)
- `project/components/PriceChange/`
- `project/components/InstrumentLabel/`
- `project/components/FlashcardSetup/`
Each holds only a one-line `README.md` and `preview.html`. `docs/sync-sections.mjs` lists them until they are gone; the generated `api/` pages for the old names disappear on the next save in the app.

## (older note) Leftover files
- `project/components/PriceChange/` (`README.md`, `preview.html` — now one-line stubs)
- `project/components/InstrumentLabel/` (`README.md`, `preview.html` — now one-line stubs)
- `docs/sync-sections.mjs` reports both until they are gone; `api/components/PriceChange.md` and `api/components/InstrumentLabel.md` are generated and disappear on the next save/build.
