# CSS audit — raw sizes, `!important`, durations, focus

Generated from `components/bundle.css` (static scan, no rendering). It lists what the rules in `docs/rules.md` call off-limits so each item can be fixed or accepted on purpose. Nothing here was changed automatically: replacing a literal with a token that has the same value is not always the right token (a 16px checkbox box is not an icon), and sizes without a token need a design decision first.

## Summary

- Raw `px` in `height` / `width` / `min-*` / `font-size`: **251** declarations — 38 in decorative loaders (`.vui-ld*`, geometry ported 1:1, exempt in practice), **213** elsewhere.
- `!important`: **41** uses in 31 rules outside keyframes (6 inside `prefers-reduced-motion` blocks, which is the accepted use).
- Colour literals: 2, both in the colour-picker hue gradient (allowed by `rules.md`).
- Off-grid `padding` / `margin` / `gap`: 1 (`margin-left:26px` in `.vui-ld-shuffle`, a decorative loader).

## Raw sizes outside loaders, by value

| px | uses | token with the same value (check the meaning before using it) | example selectors |
|---|---|---|---|
| 24 | 14 | --size-icon-2xl · --size-avatar-xs · --control-height-xs | `.vui-codelabel--sm .vui-codelabel__mark`, `.vui-gates__ic` |
| 44 | 13 | --hit-target-min | `.vui-vlist__loading`, `.vui-tstep--sm .vui-tstep__ap`, `.vui-logo--xl` |
| 16 | 13 | --size-icon-md · --size-check-sm | `.vui-color__thumb,.vui-color__hthumb`, `.vui-prose__check` |
| 32 | 11 | --control-height-sm · --size-avatar-md · --size-icon-tile-sm | `.vui-color__preview`, `.vui-codelabel__mark` |
| 10 | 9 | — | `.vui-sep--dash`, `.vui-band__sw`, `.vui-dirb--sm` |
| 18 | 9 | --size-icon-lg · --size-check | `.vui-dstate__icon`, `.vui-dirb--sm`, `.vui-gates__ic` |
| 22 | 9 | — | `.vui-dirb`, `.vui-footer__brand--sm .vui-footer__mark` |
| 20 | 8 | --size-icon-xl | `.vui-handle`, `.vui-editcol__idx`, `.vui-xfer__ctrl` |
| 40 | 8 | --control-height-md · --size-avatar-lg · --row-height-sm | `.vui-upload__icon`, `.vui-loader--lg` |
| 52 | 7 | — (coarse-pointer lg height) | `.vui-otp__cell`, `.vui-tstep__arrow`, `.vui-tstep__val` |
| 1 | 6 | — | `.vui-sr-only`, `.vui-contrib__axis` |
| 64 | 6 | — | `.vui-switcher--tiles.vui-switcher--sm .vui`, `.vui-countdown--boxes .vui-countdown__num` |
| 12 | 6 | --size-icon-xs | `.vui-color__hue`, `.vui-skeleton`, `.vui-player__range::-webkit-slider-thumb` |
| 56 | 6 | --size-avatar-xl · --row-height-lg | `.vui-tstep__ap`, `.vui-lightbox__bar`, `.vui-lightbox__thumb` |
| 28 | 6 | --size-avatar-sm · --size-swatch · --control-height-inner | `.vui-logo--lg`, `.vui-acct__segbtn`, `.vui-log__search` |
| 36 | 6 | --control-height-inner-lg · --size-icon-tile-md | `.vui-dstate__icon`, `.vui-acct__item` |
| 26 | 5 | — | `.vui-phone__code`, `.vui-log__lvl`, `.vui-funnel__conv` |
| 11 | 5 | — | `.vui-metrics--sm .vui-metrics__l`, `.vui-heat__legend i` |
| 6 | 5 | — | `.vui-log__lvl::before`, `.vui-organizer__chip` |
| 4 | 4 | — | `.vui-cal__mark`, `.vui-player__range::-webkit-slider-runnabl` |
| 140 | 4 | — | `.vui-casc__col`, `.vui-cmpdlg__table tbody th`, `.vui-gantt__corner,.vui-gantt__labels` |
| 120 | 4 | — | `.vui-ce__box`, `.vui-kanban__col`, `.vui-log__search input` |
| 8 | 4 | — | `.vui-gantt__label i`, `.vui-gantt__today::before` |
| 3 | 3 | — | `.vui-surface--accent::before`, `.vui-vlist__item--selected::before`, `.vui-gantt__prog` |
| 88 | 3 | — | `textarea.vui-control__input`, `.vui-countdown--lg.vui-countdown--boxes .v` |
| 30 | 3 | — | `.vui-xfer__move`, `.vui-sidebar__toggle` |
| 14 | 3 | --size-icon-sm | `.vui-cal__day--today::after`, `.vui-band__sw`, `.vui-heat__months` |
| 48 | 3 | --control-height-lg · --row-height | `.vui-backtop`, `.vui-notif__foot` |
| 38 | 2 | — | `.vui-otp__cell`, `.vui-vtable__row--head` |
| 150 | 2 | — | `.vui-editcol__level`, `.vui-color__area` |
| 84 | 2 | — | `.vui-pager__select`, `.vui-organizer__day` |
| 5 | 2 | — | `.vui-split--horizontal>.vui-split__handle>`, `.vui-split--vertical>.vui-split__handle>.v` |
| 200 | 2 | — | `.vui-donut__legend`, `.vui-dfbar__search` |
| 2 | 2 | — | `.vui-gantt__today`, `.vui-player__btn--muted::after` |
| 72 | 2 | — | `.vui-player__vol:hover .vui-player__volume`, `.vui-areq__dbtn` |

16 more values are used once each. Sizes with no token at all and several uses — **22, 30, 10, 52** — are the ones worth a decision: add a token, or move the component onto an existing one.

## `!important`

**specificity patch** — 21 rules (candidates to remove by raising specificity or reordering)

- `.vui-option__check-end` → `color:var(--fg-brand)!important`
- `.vui-select__check` → `color:var(--fg-brand)!important`
- `.vui-number__input` → `padding:0 var(--space-1)!important`
- `.vui-ratesum__row--active,.vui-ratesum__row--active:hover` → `background:var(--bg-selected)!important`
- `.vui-editcol__del:hover` → `color:var(--status-danger-fg)!important; background:var(--status-danger-bg)!important`
- `.vui-popover.vui-rangepop` → `left:var(--space-2)!important; right:var(--space-2)!important`
- `.vui-dtpop__slot--on,.vui-dtpop__slot--on:hover` → `background:var(--action-primary)!important`
- `.vui-casc__arrow` → `font-size:var(--size-icon-sm)!important`
- `.vui-stepper--horizontal .vui-step:not(.vui-step--current) .vui-step__` → `position:absolute!important`
- `.vui-navbar__micon` → `font-size:var(--type-h3-size)!important`
- `.vui-navbar__micon--node` → `background:none!important; -webkit-mask:none!important; mask:none!important`
- `.vui-table__empty` → `padding:var(--space-12) var(--space-4)!important`
- `.vui-grid__edit-ic` → `font-size:var(--type-overline-size)!important`
- `.vui-grid__row--sel>*,.vui-grid__row--sel:hover>*` → `background:var(--table-row-selected)!important`
- `.vui-colman__pin:disabled:not(.vui-colman__pin--on)` → `opacity:0!important`
- `.vui-grid-layout--fixed` → `grid-template-columns:minmax(0,1fr)!important`
- `.vui-chip__caret` → `font-size:var(--type-body-sm-size)!important`
- `.vui-cmdk__go` → `font-size:var(--type-body-size)!important; color:var(--fg-tertiary)!important`
- `.vui-radar__lg--off i` → `background:var(--border-strong)!important`
- `.vui-cmpdlg__best` → `color:var(--fg-primary)!important`
- `.vui-fchip__chev` → `font-size:var(--size-icon-xs)!important`

**motion off** — 5 rules (acceptable)

**utility (visually hidden)** — 2 rules (acceptable)

**layout utility** — 2 rules (acceptable)

**forced-colors focus ring** — 1 rule (`:focus-visible` with `Highlight`, deliberate, acceptable)

## Durations

Raw `ms` / `s` values in `transition` and `animation` outside keyframes. Infinite loops are excepted by `rules.md`; the rest are listed.

- infinite loops with a literal duration: 38 (excepted)
- finite animations / transitions with a literal duration: **21**

- `.vui-meter--shimmer .vui-meter__fill::after` — `vui-meter-sweep 1100ms var(--motion-progress) 1 forwards`
- `.vui-tt__btn` — `opacity 320ms ease,scale 520ms cubic-bezier(.34,1.56,.64,1),rotate 520ms cubic-bezier(.34,`
- `.vui-tt:not(.vui-tt--seg) .vui-tt__btn--pop[aria-checked="tr` — `vuiTtPop 620ms cubic-bezier(.34,1.3,.64,1) both`
- `.vui-tt:not(.vui-tt--seg) .vui-tt__btn--pop[aria-checked="tr` — `vuiTtSpin 620ms cubic-bezier(.34,1.3,.64,1) both`
- `.vui-tag.vui-taginput__tag--dupe` — `vui-shake .4s var(--ease-standard)`
- `.vui-loader--dots i:nth-child(2)` — `.15s`
- `.vui-loader--dots i:nth-child(3)` — `.3s`
- `.vui-loader--bars i:nth-child(2)` — `.1s`
- `.vui-loader--bars i:nth-child(3)` — `.2s`
- `.vui-loader--bars i:nth-child(4)` — `.3s`
- `.vui-loader--ring` — `1.6s`
- `.vui-chart__line` — `vui-draw 900ms var(--ease-emphasized) backwards`
- `.vui-chart__area` — `vui-fade-in 900ms var(--ease-standard) backwards`
- `.vui-gauge__fill` — `stroke-dasharray 700ms var(--ease-emphasized),stroke var(--motion-base)`
- `.vui-chat-typing i:nth-child(2)` — `.15s`
- `.vui-chat-typing i:nth-child(3)` — `.3s`

## Focus

26 rules set `outline:0`/`none` without a `:focus` style on the same class. Checked by hand:

- **Field inside a bordered shell** (the shell shows `:focus-within`): `.vui-control__input`, `.vui-taginput__input`, `.vui-areq__ta`, `.vui-ce__ta`, `.vui-cmt-compose__input`, `.vui-mde__input`, `.vui-prompt__input`, `.vui-rte__area`, `.vui-cmdk__search input`, `.vui-grid__input`.
- **Another class marks the focused item**: `.vui-grid__cell` (`--on`), `.vui-otp__cell` (`:focus`), `.vui-vtable__row` (`--focus`), `.vui-menu` / `.vui-menu__item` / `.vui-option` / `.vui-select__option` (`aria-activedescendant` + `--active`).
- **Container focused programmatically** (`tabindex="-1"`): `.vui-lightbox`, `.vui-sheet`, `.vui-tour__card`, `.vui-wizard__panel`, `.vui-grid`.
- **To look at in a browser** — listbox containers that rely on the highlighted option only: `.vui-xfer__list`, `.vui-casc__menu`, `.vui-tselect__tree`, `.vui-tselect__trigger`.
