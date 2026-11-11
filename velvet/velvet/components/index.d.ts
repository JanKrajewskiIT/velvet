import * as React from 'react';

// Accordion/Accordion.d.ts
export interface AccordionItem { value?: string; title: React.ReactNode; subtitle?: React.ReactNode; icon?: string; meta?: React.ReactNode; content: React.ReactNode; disabled?: boolean; /** elevated: 3px tone stripe on the left + tone glow when open */ tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' }
/** Collapsible sections (FAQ, settings groups). Animated height, ↑↓ Home End between headers; closed panels are hidden from focus and screen readers. */
export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several open. @default false */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (open: string[]) => void;
  /** separated = cards with gaps · flush = dividers only · elevated = larger cards, hover lift, brand glow + border when open, gradient separator (legacy VelvetUi look). @default 'separated' */
  variant?: 'separated' | 'flush' | 'elevated';
  /** Gap between items (separated / elevated). */
  gap?: 'sm' | 'md' | 'lg';
  /** Staggered fade-up entrance (40ms per item). @default true for elevated */
  animated?: boolean;
  className?: string;
}
export declare function Accordion(props: AccordionProps): JSX.Element;

// AiResultPanel/AiResultPanel.d.ts
/** Surface for a structured (non-chat) model answer: provenance header (model · time), optional score ring with auto tone, headline, summary, titled finding lists in a responsive grid, numbered sources, disclaimer, and a footer with Copy (plain text), Regenerate, Helpful? Yes / No and token / cost meta. status: streaming shows skeletons (or the partial content + a writing line); error shows an inline alert with Retry. Always show what produced the result and what it cost. */
export interface AiSection { title: string; icon?: string; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'; items: React.ReactNode[] }
export interface AiSource { label: string; href?: string; detail?: string }
export interface AiResultPanelProps {
  /** @default 'AI analysis' */
  title?: string;
  model?: string;
  elapsed?: string;
  /** @default 'done' */
  status?: 'streaming' | 'done' | 'error';
  error?: React.ReactNode;
  score?: number;
  /** @default 100 */
  scoreMax?: number;
  /** Default: ≥75% success, ≥50% warning, else danger */
  scoreTone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  headline?: React.ReactNode;
  subline?: React.ReactNode;
  summary?: React.ReactNode;
  sections?: AiSection[];
  sources?: AiSource[];
  tokens?: number;
  /** Preformatted, e.g. "$0.0021" */
  cost?: string;
  /** Pass '' to hide */
  disclaimer?: string;
  onRegenerate?: () => void;
  /** Shows Helpful? Yes / No; null when un-voted */
  onFeedback?: (v: 'up' | 'down' | null) => void;
  feedback?: 'up' | 'down' | null;
  onCopy?: (text: string) => void;
  className?: string;
}
export declare function AiResultPanel(props: AiResultPanelProps): JSX.Element;

// Alert/Alert.d.ts
/** Inline message inside content — form errors, plan limits, contextual tips. danger/warning announce as role=alert. */
export interface AlertProps {
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons under the text */
  action?: React.ReactNode;
  onClose?: () => void;
  /** Icon name; null hides */
  icon?: string | null;
  /** soft = tinted fill · outline = border + raised surface · solid = strong fill. @default 'soft' */
  variant?: 'soft' | 'outline' | 'solid';
  className?: string;
}
export declare function Alert(props: AlertProps): JSX.Element;
/** Full-width strip at the top of the page/app — system status, trial ending, maintenance. One at a time. */
export interface BannerProps {
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  icon?: string | null;
  sticky?: boolean;
  className?: string;
}
export declare function Banner(props: BannerProps): JSX.Element;

// AnalysisRequest/AnalysisRequest.d.ts
export interface AnalysisSource {
  id: string;
  label: string;
  /** Picks the icon: document · notes · transcript · profile · organization · link · other */
  kind?: 'document' | 'notes' | 'transcript' | 'profile' | 'organization' | 'link' | 'other';
  icon?: string;
  /** e.g. "proposal_v2.pdf · 2 pages" */
  detail?: React.ReactNode;
  /** @default 'ready' */
  status?: 'ready' | 'missing' | 'loading' | 'error';
  error?: string;
  /** Shows Add / Replace for missing / error sources */
  onAttach?: () => void;
}
export interface AnalysisType { id: string; label: string; description?: string; icon?: string; /** Source ids that must be included for this type */ requires?: string[] }
export interface AnalysisRunPayload { analysis: string; sources: string[]; instructions: string; depth: string }
/**
 * Compose and send an AI analysis request from several pieces of context — e.g. a proposal, a brief and reviewer notes.
 * Pick an analysis type (each can require sources), include / exclude sources, add free-text focus and depth, then Run.
 * Run is blocked with a reason ("Needs: Brief") until requirements are met. onRun may return a Promise; set
 * status="running" + steps/step to show progress, then render <AnalysisReport> (or AiResultPanel) with the result.
 */
export interface AnalysisRequestProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  sources: AnalysisSource[];
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  analyses?: AnalysisType[];
  analysis?: string;
  defaultAnalysis?: string;
  onAnalysisChange?: (id: string) => void;
  instructions?: string;
  defaultInstructions?: string;
  onInstructionsChange?: (v: string) => void;
  instructionsPlaceholder?: string;
  depth?: string;
  /** @default 'standard' */
  defaultDepth?: string;
  onDepthChange?: (id: string) => void;
  /** @default quick · standard · deep */
  depths?: { id: string; label: string; hint?: string }[];
  /** @default 'idle' */
  status?: 'idle' | 'running';
  /** Progress labels while running, e.g. ['Reading proposal', 'Matching requirements', 'Scoring'] */
  steps?: string[];
  /** Index of the current step */
  step?: number;
  error?: React.ReactNode;
  onRun?: (payload: AnalysisRunPayload) => void | Promise<void>;
  onCancel?: () => void;
  runLabel?: string;
  /** Provenance chip, e.g. "Claude · EU" */
  model?: string;
  /** Footer note, e.g. "≈ 4k tokens · 1 credit" */
  estimate?: React.ReactNode;
  className?: string;
}
export declare function AnalysisRequest(props: AnalysisRequestProps): JSX.Element;

// Anchor/Anchor.d.ts
export interface AnchorItem { id: string; label: React.ReactNode; /** 1 = section, 2 = subsection (indented). @default 1 */ level?: 1 | 2; }
/**
 * "On this page" table of contents. Highlights the section currently in view and smooth-scrolls to a section on click
 * (instant under reduced motion), moving focus to its heading. Works on the window or any scroll container.
 */
export interface AnchorProps {
  /** Each id must match a heading/section id in the document */
  items: AnchorItem[];
  /** Scroll container: ref, element or selector. Omit for the window. */
  container?: React.RefObject<HTMLElement> | HTMLElement | string;
  /** Distance from the container top at which a section counts as active. @default 24 */
  offset?: number;
  activeId?: string;
  onChange?: (id: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (id: string) => void;
  /** nav aria-label. @default 'On this page' */
  label?: string;
  /** Visible heading; null hides it. Defaults to label. */
  title?: React.ReactNode | null;
  className?: string;
}
export declare function Anchor(props: AnchorProps): JSX.Element;

// AnalysisReport/AnalysisReport.d.ts
export type ReportSeverity = 'critical' | 'warning' | 'suggestion';
export interface ReportCategory { label: string; /** 0–100; non-finite → 0 */ score: number; /** Shown as ×weight */ weight?: number; note?: React.ReactNode }
export interface ReportRecommendation { severity: ReportSeverity; title: React.ReactNode; message?: React.ReactNode; /** Quote from the source that supports the finding */ evidence?: { quote: string; source?: string } }
export interface ReportResult {
  /** Overall 0–100 */
  score: number;
  /** One-line headline, e.g. "Strong on delivery, light on long-term support" */
  verdict?: React.ReactNode;
  summary?: React.ReactNode;
  categories?: ReportCategory[];
  keywords?: { matched?: string[]; partial?: string[]; missing?: string[] };
  strengths?: React.ReactNode[];
  gaps?: React.ReactNode[];
  recommendations?: ReportRecommendation[];
}
export interface ScoreBand { min: number; label: string; short: string; tone: 'success' | 'brand' | 'warning' | 'danger' }
/**
 * Result of a scored analysis — e.g. a submission checked against a brief. Score ring with band (≥86 Excellent · ≥71 Strong · ≥51 Partial · else Weak —
 * same thresholds as the legacy VelvetUi panel), verdict + summary, weighted category bars, keyword coverage (found / partial / missing),
 * strengths vs gaps, and recommendations sorted critical → warning → suggestion with optional evidence quotes. Footer: copy as text,
 * export, re-run, accuracy feedback. Pair with <AnalysisRequest> for the input side.
 */
export interface AnalysisReportProps {
  /** @default 'done' */
  status?: 'empty' | 'loading' | 'done' | 'error';
  result?: ReportResult | null;
  /** e.g. the name of what was analysed */
  subject?: React.ReactNode;
  /** e.g. what it was compared with */
  target?: React.ReactNode;
  title?: string;
  model?: string;
  generatedAt?: string;
  /** Loading progress labels + current index */
  steps?: string[];
  step?: number;
  error?: React.ReactNode;
  onRetry?: () => void;
  onRerun?: () => void;
  onExport?: () => void;
  onFeedback?: (v: 'up' | 'down' | null) => void;
  /** Override thresholds / labels */
  bands?: ScoreBand[];
  disclaimer?: React.ReactNode;
  className?: string;
}
export declare function AnalysisReport(props: AnalysisReportProps): JSX.Element;
export declare const SCORE_BANDS: ScoreBand[];
export declare function scoreBand(score: number, bands?: ScoreBand[]): ScoreBand;

// AudioPlayer/AudioPlayer.d.ts
/**
 * Audio row — play button, title / artist, waveform scrubber, time, speed and mute. The waveform is a role="slider":
 * click or drag to seek, ← → 5 s, PgUp / PgDn 15 s, Home / End, Space plays. Pass real peaks (0–1) from your backend;
 * without them a stable decorative waveform is derived from the title. Voice notes, podcasts, meeting recordings.
 */
export interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  /** Square artwork, 56 px */
  cover?: string;
  /** Amplitudes 0–1, any length — resampled to `bars` */
  peaks?: number[];
  /** @default 72 */
  bars?: number;
  /** @default [1, 1.25, 1.5, 2, 0.75] */
  rates?: number[];
  /** sm = compact voice-note row. @default 'md' */
  size?: 'sm' | 'md';
  className?: string;
}
export declare function AudioPlayer(props: AudioPlayerProps): JSX.Element;

// AuthButton/AuthButton.d.ts
/** Session toggle: primary "Sign in" when signed out, secondary "Sign out" when signed in; icon swaps with a small spin. Handlers may be async (spinner); a rejected handler shows the error state (alert icon, danger edge, message announced + in the tooltip) until the next click. Session/roles live in the app — pass state in. */
export interface AuthButtonProps {
  signedIn: boolean;
  onSignIn?: () => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
  /** @default 'Sign in' */
  signInLabel?: string;
  /** @default 'Sign out' */
  signOutLabel?: string;
  /** Session still resolving: disabled, spinner, "Checking session…" */
  initializing?: boolean;
  /** An auth action started elsewhere is in flight (redirect, popup) */
  pending?: boolean;
  /** Last sign-in/out error from the app; clicking retries */
  error?: string | null;
  iconOnly?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function AuthButton(props: AuthButtonProps): JSX.Element;

// Autocomplete/Autocomplete.d.ts
export interface AutocompleteOption { value: string; label: string; description?: string; icon?: string }
/** Type-to-filter single select (combobox). Local options or async loadOptions (debounced 250ms, skeleton + error/retry). Esc reverts the text, blur without a pick restores the selection unless allowCustom. */
export interface AutocompleteProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  options?: Array<string | AutocompleteOption>;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string | null) => void;
  /** Server search — return options for the query */
  loadOptions?: (query: string) => Promise<Array<string | AutocompleteOption>>;
  placeholder?: string;
  emptyText?: string;
  /** Accept free text as the value ("Use “…”") */
  allowCustom?: boolean;
  /** @default 'search' */
  iconLeft?: string | null;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function Autocomplete(props: AutocompleteProps): JSX.Element;

// Avatar/Avatar.d.ts
/** Initials or image avatar with optional presence dot. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  initials?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'brand' | 'neutral';
  /** Solid fill (any CSS colour, e.g. var(--dv-3)) with on-colour initials — series / person colour coding.
   *  'auto' = stable --dv-1…8 hue hashed from name — companies / people in lists get a consistent colour without storing one. */
  color?: 'auto' | (string & {});
  /** Custom content (icon, node) instead of image / initials */
  children?: React.ReactNode;
  /** Presence indicator, bottom-right */
  status?: 'online' | 'away' | 'busy' | 'offline';
}
export declare function Avatar(props: AvatarProps): JSX.Element;
export interface AvatarGroupProps { children?: React.ReactNode; className?: string }
export declare function AvatarGroup(props: AvatarGroupProps): JSX.Element;

// BackToTop/BackToTop.d.ts
/** Floating "scroll to top" that appears after the threshold, with a ring showing scroll progress. Respects reduced motion. */
export interface BackToTopProps {
  /** Scroll container (selector or ref). Defaults to the window. */
  target?: string | React.RefObject<HTMLElement>;
  /** px scrolled before it appears. @default 400 */
  threshold?: number;
  label?: string;
  /** fixed = viewport corner · static = place it yourself. @default 'fixed' */
  position?: 'fixed' | 'static';
  className?: string;
}
export declare function BackToTop(props: BackToTopProps): JSX.Element;

// Badge/Badge.d.ts
/** Small non-interactive status or count label. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** @default 'soft' */
  variant?: 'soft' | 'solid' | 'outline';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot */
  dot?: boolean;
  /** Pulsing dot — live / streaming / analysing states. Use with dot. Static under reduced motion. */
  pulse?: boolean;
  /** Leading glyph (ignored when dot is set) */
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;

// BarChart/BarChart.d.ts
export interface ChartSeries { key: string; label: string; /** Defaults to --dv-N in order */ color?: string }
/** Vertical bar chart (grouped or stacked). Hover or focus + ←→ to read each group; tooltip shows every series. Responsive to container width. Colours come from the data-viz palette. */
export interface BarChartProps {
  /** [{ label: 'Mon', value: 12 }] or one key per series */
  data: Array<{ label: string; [key: string]: any }>;
  /** @default [{ key: 'value' }] */
  series?: ChartSeries[];
  /** px. @default 240 */
  height?: number;
  stacked?: boolean;
  /** Axis + tooltip formatter. @default compact (1.2k) */
  format?: (v: number) => string;
  /** Accessible name */
  label?: string;
  /** Default: shown for 2+ series */
  showLegend?: boolean;
  className?: string;
}
export declare function BarChart(props: BarChartProps): JSX.Element;

// BottomNav/BottomNav.d.ts
export interface BottomNavItem { value: string; label: string; icon: string; href?: string; /** Number/short text → Count; true → Dot */ badge?: number | string | boolean }
/** Mobile tab bar: 3–5 destinations (icon + label, active = brand colour + filled icon twin when one exists: home, bell, user, folder, bookmark, heart, message-square, star) with an optional elevated centre action. fixed pins it to the viewport bottom with safe-area padding. Hide Sidebar on mobile when using it. */
export interface BottomNavProps {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: any) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string, e: any) => void;
  /** Elevated round centre button (e.g. Create). Inserted in the middle of items. */
  action?: { label: string; icon?: string; onClick?: () => void };
  /** @default true */
  fixed?: boolean;
  label?: string;
  className?: string;
}
export declare function BottomNav(props: BottomNavProps): JSX.Element;

// BottomSheet/BottomSheet.d.ts
/** Mobile-first panel sliding up from the bottom. Drag the grabber down (or flick) to dismiss; Esc and backdrop tap also close. Respects safe-area insets. */
export interface BottomSheetProps { open: boolean; onClose?: () => void; title?: React.ReactNode; description?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode; className?: string }
export declare function BottomSheet(props: BottomSheetProps): JSX.Element | null;

// BrandLogo/BrandLogo.d.ts
/** Brand mark. brand="recron" = Recron "R" signet (circuit-node stem) + "ecron" wordmark, ported from Recron's brand-logo spec and recoloured with Velvet tokens: signet --action-primary, wordmark --fg-primary (both theme-aware); tone="inverse" = all --on-color-fg for brand fills (Navbar tone="brand"). Recron clear-space: 0.5× logo height each side; min digital height 32px. brand="quantcore" = QuantCore "Q" signet + "uantcore" wordmark, same rules and colouring as recron. brand="velvet" = type-only placeholder "velvet/ui". */
export interface BrandLogoProps {
  /** @default 'velvet' */
  brand?: 'velvet' | 'recron' | 'quantcore';
  /** lockup = signet + wordmark. 'wordmark' applies to velvet only. @default 'lockup' */
  variant?: 'lockup' | 'wordmark' | 'mark';
  /** @default 'default' */
  tone?: 'default' | 'inverse';
  /** Preset or px. Recron / QuantCore: logo height (sm 24 · md 32 · lg 48 · xl 64). Velvet: wordmark font size. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Velvet only: soft brand elevation under the mark. @default true */
  glow?: boolean;
  /** Accessible name. @default brand name */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function BrandLogo(props: BrandLogoProps): JSX.Element;

// Breadcrumb/Breadcrumb.d.ts
export interface BreadcrumbItem { label: React.ReactNode; href?: string; onClick?: (e: any) => void; icon?: string }
/** Location trail. Last item is the current page (not a link). Beyond maxItems the middle collapses into a "…" menu. */
export interface BreadcrumbProps { items: BreadcrumbItem[]; /** @default 4 */ maxItems?: number; className?: string }
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;

// Button/Button.d.ts
/**
 * Primary action trigger. One primary per view; secondary/ghost for the rest.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. `dashed` = low-key "+ Add …" affordance; with `block` it becomes the add-row at the end of a list/table. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'link' | 'dashed';
  /** @default 'md' (40px; 44px on touch) */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Velvet icon name (e.g. "plus") or a node */
  iconLeft?: string | React.ReactNode;
  iconRight?: string | React.ReactNode;
  /** Shows spinner and disables */
  loading?: boolean;
  /** Full width */
  block?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

// ButtonGroup/ButtonGroup.d.ts
/**
 * Groups related Buttons / IconButtons. attached (default) joins them into one segmented control with shared borders —
 * toolbars, split buttons, pagination steppers. attached={false} spaces them with --space-2 — dialog footers, action rows.
 * For a single choice among options use OptionSwitcher or Tabs, not ButtonGroup.
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default true */
  attached?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Applied to every child that doesn't set its own */
  size?: 'sm' | 'md' | 'lg';
  /** aria-label for the group */
  label?: string;
  children?: React.ReactNode;
}
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;

// Calendar/Calendar.d.ts
export interface DateRange { start: Date | null; end: Date | null }
/** Month grid. single or range (hover previews the range). Keyboard: arrows = day/week, PageUp/Down = month (Shift = year), Home/End = week edges, Enter selects. Weeks start Monday by default. */
export interface CalendarProps {
  /** @default 'single' */
  mode?: 'single' | 'range';
  value?: Date | null | DateRange;
  defaultValue?: Date | null | DateRange;
  onChange?: (value: any) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: any) => void;
  /** Side-by-side months (range pickers use 2). @default 1 */
  months?: number;
  /** Controlled visible month */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** Dot under days with events: array of dates or predicate */
  marks?: Date[] | ((date: Date) => boolean);
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** Intl locale for month/weekday names. @default 'en-US' */
  locale?: string;
  className?: string;
}
export declare function Calendar(props: CalendarProps): JSX.Element;
export declare function fmtDate(d: Date | null, locale?: string, opts?: Intl.DateTimeFormatOptions): string;
export declare function sameDay(a: Date | null, b: Date | null): boolean;
export declare function addDays(d: Date, n: number): Date;
export declare function addMonths(d: Date, n: number): Date;
export declare function startOfDay(d: Date): Date;

// CalendarEventButton/CalendarEventButton.d.ts
export interface CalendarEventDetails {
  id?: string;
  title: string;
  /** Date or ISO / local "YYYY-MM-DD" / "YYYY-MM-DDTHH:mm" — local strings are read in the user's time zone */
  start: Date | string;
  end?: Date | string;
  /** Used when end is omitted. @default 60 (or one day when allDay) */
  durationMinutes?: number;
  allDay?: boolean;
  description?: string;
  location?: string;
}
/**
 * "Add to calendar" for reviews, deadlines, meetings. One provider = plain button; several = menu (Google · Outlook.com · .ics download
 * for Apple Calendar / anything else). After adding it flips to a ✓ "In calendar" state (or pass added). Disabled when start is missing/invalid.
 */
export interface CalendarEventButtonProps {
  event: CalendarEventDetails;
  /** @default ['google', 'outlook', 'ics'] */
  providers?: ('google' | 'outlook' | 'ics')[];
  /** @default 'Add to calendar' */
  label?: string;
  /** @default 'secondary' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  /** Controlled "already added" state */
  added?: boolean;
  /** @default 'In calendar' */
  addedLabel?: string;
  onAdd?: (provider: 'google' | 'outlook' | 'ics') => void;
  disabled?: boolean;
  className?: string;
}
export declare function CalendarEventButton(props: CalendarEventButtonProps): JSX.Element;
export declare function buildGoogleCalendarUrl(event: CalendarEventDetails): string;
export declare function buildOutlookCalendarUrl(event: CalendarEventDetails): string;
/** RFC 5545 VCALENDAR text */
export declare function buildIcs(event: CalendarEventDetails): string;

// CalendarOrganizer/CalendarOrganizer.d.ts
export interface OrganizerEvent { id: string | number; date: Date | string; title: string; /** "09:30" — sorts the day */ time?: string; location?: string; color?: string }
/** Month planner: day grid with event chips (+N more) beside a detail panel for the selected day, with quick add and delete (inline Cancel / Delete confirm by default). Arrow keys move between days; Today / prev / next. Stacks under 820px. */
export interface CalendarOrganizerProps { events: OrganizerEvent[]; /** Enables add + delete */ onEventsChange?: (events: OrganizerEvent[]) => void; onEventClick?: (e: OrganizerEvent) => void; defaultMonth?: Date; /** Selected day (controlled) */ selected?: Date | string; defaultSelected?: Date; onSelectedChange?: (day: Date) => void; /** Ask before deleting. @default true */ confirmDelete?: boolean; weekStartsOn?: number; locale?: string; /** Chips per cell. @default 2 */ maxChips?: number; className?: string }
export declare function CalendarOrganizer(props: CalendarOrganizerProps): JSX.Element;

// Card/Card.d.ts
/**
 * Content container = Surface + regions (header · body · footer) and their padding. Nothing else.
 * Paint, hue, behaviour and state are Surface props passed straight through — see Surface for their meaning.
 * Media, scrim and hairline-divided regions → StructuredCard.
 * Built on Card: FeatureCard · FlipCard · Stat · ScoreCard · QuestionCard.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right slot — usually IconButtons */
  actions?: React.ReactNode;
  /** Tinted footer bar — usually Buttons */
  footer?: React.ReactNode;
  /** @default 'end' */
  footerAlign?: 'start' | 'end' | 'between';
  /** Region padding from --card-pad-*. @default 'md' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Surface pass-through */
  as?: SurfaceProps['as'];
  variant?: SurfaceProps['variant'];
  tone?: SurfaceProps['tone'];
  accent?: SurfaceProps['accent'];
  hoverable?: SurfaceProps['hoverable'];
  interactive?: SurfaceProps['interactive'];
  tonal?: SurfaceProps['tonal'];
  reveal?: SurfaceProps['reveal'];
  selected?: SurfaceProps['selected'];
  clip?: SurfaceProps['clip'];
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;

// Carousel/Carousel.d.ts
/** Horizontal slider: arrows, dots, swipe/drag, ←→ keys. Off-screen slides are inert. Autoplay pauses on hover/focus and is disabled under reduced motion. */
export interface CarouselProps {
  slides: React.ReactNode[];
  /** Slides visible at once. @default 1 */
  perView?: number;
  /** px. @default 16 */
  gap?: number;
  loop?: boolean;
  /** ms between slides; 0 = off */
  autoplay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  label?: string;
  className?: string;
}
export declare function Carousel(props: CarouselProps): JSX.Element;

// Cascader/Cascader.d.ts
export interface CascaderNode { id: string; label: React.ReactNode; icon?: string; meta?: React.ReactNode; disabled?: boolean; children?: CascaderNode[] }
/** Single-path hierarchical pick shown as side-by-side columns (region → country → city). Value is the id of the picked node; the trigger shows the full path. Use TreeSelect for multi-select or deep/uneven trees. Keys: ↑↓ in a column · → into child column · ← back · Enter pick · Esc close. */
export interface CascaderProps {
  label?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  data: CascaderNode[];
  value?: string | null;
  defaultValue?: string | null;
  /** id of the picked node + the full node path from the root */
  onChange?: (id: string, path: CascaderNode[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (id: string, path: CascaderNode[]) => void;
  placeholder?: string;
  /** Path separator in the trigger. @default '/' */
  separator?: string;
  /** Allow committing a parent (not only leaves). @default false */
  changeOnSelect?: boolean;
  /** Open child columns on hover instead of click. @default 'click' */
  expandTrigger?: 'click' | 'hover';
  /** Search across all leaf paths. @default false */
  searchable?: boolean;
  /** Show only the last label in the trigger. @default false */
  displayLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}
export declare function Cascader(props: CascaderProps): JSX.Element;

// CellStack/CellStack.d.ts
/** Two-line table cell: primary value over a muted secondary line. Use for ID + timestamp, name + meta, price + fill. */
export interface CellStackProps extends React.HTMLAttributes<HTMLSpanElement> {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  /** Primary in JetBrains Mono with tabular figures (IDs, symbols, numbers) */
  mono?: boolean;
  secondaryMono?: boolean;
  /** @default true */
  strong?: boolean;
  /** Right-align (numeric columns) */
  align?: 'left' | 'right';
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}
export declare function CellStack(props: CellStackProps): JSX.Element;

// ChatMessage/ChatMessage.d.ts
/**
 * One turn in an AI / support conversation. user = right-aligned brand-tinted bubble · assistant = avatar + plain text with Copy / Regenerate / 👍👎 tools · system = centred note.
 * streaming shows a blinking caret (or TypingIndicator while the body is still empty); error renders an inline alert with Retry. Compose inside ChatThread, with PromptInput below.
 */
export interface ChatMessageProps {
  /** @default 'assistant' */
  role?: 'user' | 'assistant' | 'system';
  author?: React.ReactNode;
  /** Replaces the default sparkles avatar (assistant only) */
  avatar?: React.ReactNode;
  time?: React.ReactNode;
  /** Plain text — also what Copy puts on the clipboard. Use children for rich content (Markdown, code). */
  content?: string;
  children?: React.ReactNode;
  /** Still generating — caret, tools hidden */
  streaming?: boolean;
  /** true = default message, or your own text */
  error?: boolean | React.ReactNode;
  /** Shows Regenerate (and Retry on error) */
  onRetry?: () => void;
  onCopy?: (text: string) => void;
  feedback?: 'up' | 'down' | null;
  /** Shows 👍 / 👎 toggles */
  onFeedback?: (value: 'up' | 'down' | null) => void;
  /** Numbered citation chips under the answer */
  sources?: Array<{ title: string; href?: string }>;
  /** Extra tools after the built-in ones */
  actions?: React.ReactNode;
  className?: string;
}
export declare function ChatMessage(props: ChatMessageProps): JSX.Element;
/** Scrolling role="log" container. Sticks to the bottom while new messages arrive unless the user has scrolled up to read. */
export interface ChatThreadProps { children?: React.ReactNode; /** CSS height — the thread scrolls inside it */ height?: number | string; label?: string; className?: string; style?: React.CSSProperties }
export declare function ChatThread(props: ChatThreadProps): JSX.Element;
/** Three bouncing dots — "assistant is typing". */
export interface TypingIndicatorProps { label?: string; className?: string }
export declare function TypingIndicator(props: TypingIndicatorProps): JSX.Element;

// Checkbox/Checkbox.d.ts
/** Checkbox for multi-select and consent. Supports indeterminate. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** Secondary line under the label */
  description?: string;
  /** Mixed state for parent rows */
  indeterminate?: boolean;
  /** sm = 16px box for dense rows. @default 'md' */
  size?: 'sm' | 'md';
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;

// Checkmark/Checkmark.d.ts
/** Atom. The check / indeterminate / radio glyph box, for rows that aren't native inputs (MultiSelect, TransferList). Native inputs use Checkbox / Radio. */
export interface CheckmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  checked?: boolean;
  /** Wins over checked */
  indeterminate?: boolean;
  /** Round, dot glyph */
  radio?: boolean;
  /** Circular box with a tick — selectable cards and source rows (not a radio: still multi-select). */
  round?: boolean;
  /** sm 16px · md 18px. @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
}
export declare function Checkmark(props: CheckmarkProps): JSX.Element;

// Chevron/Chevron.d.ts
/**
 * Atom. Disclosure arrow for anything that opens: Select, Accordion, nav groups, menu triggers, Cascader.
 * `open` rotates it (down → up, right → down) with --dur-base. Decorative — the host carries aria-expanded.
 */
export interface ChevronProps extends React.HTMLAttributes<HTMLElement> {
  /** Resting direction. down = dropdowns/accordions · right = nested navigation. @default 'down' */
  direction?: 'down' | 'right' | 'left' | 'up';
  /** Rotated "open" state */
  open?: boolean;
}
export declare function Chevron(props: ChevronProps): JSX.Element;

// Chip/Chip.d.ts
/**
 * Selectable pill — one option of a filter / tag set. ChipGroup, DualFilterBar and FilterBar render it.
 * Selected chips gain a check (springs in) and brand tint. For a removable token use Tag; for a menu trigger use MenuChip.
 */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pressed state. Omit for a plain action chip (no aria-pressed). */
  selected?: boolean;
  /** Leading glyph — hidden while the check shows */
  icon?: string | React.ReactNode;
  /** Trailing count pill */
  count?: number | string;
  /** Spring-in check on select. @default true */
  check?: boolean;
  /** Label colour — leading swatch that fills with a check when selected; tints border/ground. Any CSS colour. */
  color?: string;
  /** Dashed outline — the "create new" chip at the end of a set */
  dashed?: boolean;
  /** sm 28 · md 32. @default 'md' */
  size?: 'sm' | 'md';
  /** 'radio' / 'checkbox' switch aria-pressed to aria-checked */
  role?: string;
}
export declare function Chip(props: ChipProps): JSX.Element;

// ChipGroup/ChipGroup.d.ts
export interface ChipOption { value: string; label: React.ReactNode; count?: number; icon?: string; disabled?: boolean }
/** Toggle chips for tagging and filtering. Multi-select by default (value: string[]); multiple=false gives a deselectable single choice (value: string | null). Selected chips gain a check and brand tint. For a required single choice use OptionSwitcher. */
export interface ChipGroupProps {
  options: Array<string | ChipOption>;
  value?: string[] | string | null;
  defaultValue?: string[] | string | null;
  onValueChange?: (value: any) => void;
  /** @default true */
  multiple?: boolean;
  size?: 'sm' | 'md';
  /** Accessible group name */
  label?: string;
  className?: string;
}
export declare function ChipGroup(props: ChipGroupProps): JSX.Element;

// CloseButton/CloseButton.d.ts
/**
 * Atom. The one "×" control: closes, dismisses, removes, clears. Always a real control with an accessible name.
 * button = ghost icon button (Dialog, Toast, Alert) · field = clear inside a Control (SearchInput, pickers) · tag = remove inside a Tag/chip · bare = no skin, host class only.
 */
export interface CloseButtonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** @default 'button' */
  variant?: 'button' | 'field' | 'tag' | 'bare';
  /** Only for variant="button". @default 'sm' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Accessible name — say what goes away: "Remove Design", "Clear search". @default 'Close' */
  label?: string;
  /** Glyph name. @default 'x' */
  icon?: string;
  /** span = for use inside another button (selectable Tag); keeps keyboard Enter/Space and stops propagation. @default 'button' */
  as?: 'button' | 'span';
  disabled?: boolean;
  onClick?: (e: React.SyntheticEvent) => void;
}
export declare function CloseButton(props: CloseButtonProps): JSX.Element;

// CodeEditor/CodeEditor.d.ts
/** Lightweight editable code field: line numbers, Tab indents, syntax colouring for YAML-like DSLs and Python/JS (keys, keywords, functions, strings, numbers, comments). Uses the --code-* tokens like CodeSnippet. Not a full IDE. */
export interface CodeEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Shown as a tag next to the label */
  language?: string;
  /** Visible lines when maxHeight is not set. @default 12 */
  rows?: number;
  maxHeight?: number | string;
  readOnly?: boolean;
  /** @default true */
  lineNumbers?: boolean;
  /** @default true */
  highlight?: boolean;
}
export declare function CodeEditor(props: CodeEditorProps): JSX.Element;
export declare function highlightCode(source: string): string;

// CodeSnippet/CodeSnippet.d.ts
/** Code block with lightweight highlighting (js/jsx/ts/html/css/bash), line numbers, copy button (announced), optional language tabs. Always dark, in both themes. */
export interface CodeSnippetProps {
  code?: string;
  /** @default 'jsx' */
  language?: string;
  title?: string;
  /** Multiple variants — npm / yarn / pnpm */
  tabs?: Array<{ label: string; code: string; language?: string }>;
  showLineNumbers?: boolean;
  /** px. @default 320 */
  maxHeight?: number;
  wrap?: boolean;
  className?: string;
}
export declare function CodeSnippet(props: CodeSnippetProps): JSX.Element;

// ColorLabelManager/ColorLabelManager.d.ts
export interface ColorLabel { id: string; name: string; color: string; /** Items using it — shown and mentioned on delete */ count?: number }
/** Compact dialog (sm) listing labels as dot + name with edit / delete icon buttons. Edit and "Add label" open a Name + Color form at the bottom (footer switches to Cancel / Save). Delete confirms inline under the row. Duplicate names are rejected. Colours default to the data-viz palette. */
export interface ColorLabelManagerProps { open: boolean; onClose?: () => void; labels: ColorLabel[]; /** May return a Promise — Save / Delete lock while pending; on reject the form stays open and the error shows inline. */ onChange?: (labels: ColorLabel[]) => void | Promise<void>; colors?: string[]; title?: string }
export declare function ColorLabelManager(props: ColorLabelManagerProps): JSX.Element;
export declare const LABEL_COLORS: string[];

// ColorLabelSelectionDialog/ColorLabelSelectionDialog.d.ts
/**
 * Assign colour labels to one item (contact, task, file). Chips toggle on/off (max=1 → single choice, radio semantics);
 * search appears for long lists or when onCreate is set, and "Create “…”" adds a new label inline (Enter). Works on a draft:
 * Apply is disabled until the selection changes; onSubmit may return a Promise — dialog locks while pending, on reject the
 * selection is kept and the error shows inline. Pair with ColorLabelManager via onManage for rename / recolour / delete.
 */
export interface ColorLabelSelectionDialogProps {
  open: boolean;
  onClose?: () => void;
  labels: ColorLabel[];
  /** Currently assigned label ids — the draft resets to this on open */
  value?: string[];
  onSubmit?: (ids: string[]) => void | Promise<void>;
  /** Enable inline creation. Return the new label (with id) to auto-select it. */
  onCreate?: (draft: { name: string; color: string }) => ColorLabel | void | Promise<ColorLabel | void>;
  /** Shows a "Manage labels" footer button */
  onManage?: () => void;
  /** Max labels per item; 1 = single choice */
  max?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** @default 'Apply' */
  submitLabel?: string;
  cancelLabel?: string;
  /** @default auto — more than 7 labels or onCreate set */
  searchable?: boolean;
  /** Colours cycled for new labels. @default LABEL_COLORS */
  colors?: string[];
  emptyText?: React.ReactNode;
}
export declare function ColorLabelSelectionDialog(props: ColorLabelSelectionDialogProps): JSX.Element;

// ColorPicker/ColorPicker.d.ts
/** Colour field → popover with saturation/brightness area, hue strip, hex input and preset swatches. Area and hue are keyboard sliders (arrows, Shift ×10). inline renders the panel directly. */
export interface ColorPickerProps {
  label?: string;
  /** Hex, e.g. "#8b0036" */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (hex: string) => void;
  /** Preset hexes. Defaults to brand + data-viz hues. [] hides. */
  swatches?: string[];
  inline?: boolean;
  /** full = area + hue + hex + presets · swatches = curated swatch grid only (selected ring + check) with a "Selected" value chip. @default 'full' */
  variant?: 'full' | 'swatches';
  /** swatches variant: show the Selected value chip. @default true */
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}
export declare function ColorPicker(props: ColorPickerProps): JSX.Element;
export declare function hexToHsv(hex: string): { h: number; s: number; v: number } | null;
export declare function hsvToHex(hsv: { h: number; s: number; v: number }): string;

// ColumnManager/ColumnManager.d.ts
export interface ManagedColumn { key: string; label: React.ReactNode; /** Start hidden when false. @default true */ visible?: boolean; /** Start pinned */ pin?: 'left' | 'right'; /** Can't be hidden, moved or unpinned (e.g. Name) — shorthand for the three flags below = false */ locked?: boolean; /** @default true */ hideable?: boolean; /** @default true */ pinnable?: boolean; /** @default true */ movable?: boolean; }
export interface ColumnState { key: string; visible: boolean; pin: 'left' | 'right' | null; }
/**
 * Table column settings: visibility (switch), order (drag the grip, or focus it and press ↑/↓ — moves cross section
 * boundaries), and freezing (pin button). The last visible column can't be switched off. Any number of columns can be pinned; sections are Pinned left · Columns ·
 * Pinned right (right appears with pinRight or when a column is already pinned right). Search appears past 8 columns.
 * Usually inside a Popover opened from a "Columns" button in the Table toolbar. Feed Table with ApplyColumns(columns, state)
 * — it orders left → middle → right and sets each column's pin so Table makes it sticky.
 */
export interface ColumnManagerProps {
  /** Source columns in their default order */
  columns: ManagedColumn[];
  value?: ColumnState[];
  defaultValue?: ColumnState[];
  onChange?: (state: ColumnState[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (state: ColumnState[]) => void;
  /** What Reset restores. @default the columns' own visible/pin */
  resetValue?: ColumnState[];
  /** @default 'Columns' */
  title?: string;
  /** Offer a "Pinned right" section (actions, totals). @default false */
  pinRight?: boolean;
  /** Cap on pinned columns — pins beyond it are disabled with a hint */
  maxPinned?: number;
  /** Defaults to on when there are more than 8 columns */
  searchable?: boolean;
  className?: string;
}
export declare function ColumnManager(props: ColumnManagerProps): JSX.Element;
/** Visible columns in display order (left pins → middle → right pins), each with pin set */
export declare function ApplyColumns<T extends { key: string }>(columns: T[], state: ColumnState[]): (T & { pin?: 'left' | 'right' })[];

// ColumnResize/ColumnResize.d.ts
/** Atom. Column-width handle for a header cell's right edge: drag, ←/→ (keyboard), double-click to reset. Table and DataGrid use it. Place inside a position:relative header cell. */
export interface ColumnResizeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onResize'> {
  /** Accessible name, e.g. "Resize Name" */
  label: string;
  /** Current width in px (falls back to the measured cell) */
  width?: number;
  /** @default 64 */
  min?: number;
  /** Keyboard step in px. @default 16 */
  step?: number;
  onResize?: (width: number) => void;
  /** Double-click — usually clears the custom width */
  onReset?: () => void;
}
export declare function ColumnResize(props: ColumnResizeProps): JSX.Element;

// CommandPalette/CommandPalette.d.ts
export interface CommandItem { id?: string; label: string; icon?: string; description?: string; shortcut?: string; /** Extra search terms */ keywords?: string[]; onSelect?: () => void }
export interface CommandGroup { label: string; items: CommandItem[] }
/** ⌘K palette: fuzzy-filtered, grouped results with match highlight; ↑↓ Enter Esc. Pair with SearchTrigger (it owns the ⌘K hotkey). */
export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}
export declare function CommandPalette(props: CommandPaletteProps): JSX.Element | null;

// CommentThread/CommentThread.d.ts
/** Discussion attached to one object (contact, document, ticket). One nesting level on purpose — replying to a reply joins the same thread and prefills @mention. Like, reply, edit / delete own comments (inline confirm; a deleted parent with replies stays as a placeholder). Long threads collapse after collapseAfter replies. Composer auto-grows; ⌘↵ sends, Esc cancels. Body is plain text — @mentions are highlighted. Manages its own state from comments; listen with onChange or the per-action callbacks. */
export interface CommentAuthor { name: string; src?: string }
export interface Comment {
  id: string | number;
  author: string | CommentAuthor;
  /** Display time, e.g. "2h" */
  time?: string;
  datetime?: string;
  body: string;
  /** Small badge after the name, e.g. "Reviewer" */
  role?: string;
  edited?: boolean;
  likes?: number;
  liked?: boolean;
  deleted?: boolean;
  replies?: Comment[];
}
export interface CommentThreadProps {
  comments?: Comment[];
  /** Full tree after any change */
  onChange?: (comments: Comment[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (comments: Comment[]) => void;
  onSubmit?: (body: string, parentId: string | number | null) => void;
  onEdit?: (id: string | number, body: string) => void;
  onDelete?: (id: string | number) => void;
  onLike?: (id: string | number, liked: boolean) => void;
  /** Author of new comments; comments by this name get Edit / Delete. @default 'You' */
  currentUser?: string | CommentAuthor;
  canEdit?: (c: Comment) => boolean;
  /** Replies shown before "Show N more". @default 2 */
  collapseAfter?: number;
  /** Heading; pass '' to hide. @default 'Comments' */
  title?: string;
  placeholder?: string;
  emptyText?: string;
  /** Time label for new comments. @default 'Just now' */
  nowLabel?: string;
  className?: string;
}
export declare function CommentThread(props: CommentThreadProps): JSX.Element;

// ChartLegend/ChartLegend.d.ts
export interface ChartLegendItem {
  /** Defaults to label */
  key?: string;
  label: React.ReactNode;
  /** Swatch colour — a --dv-* token or any CSS colour */
  color?: string;
  /** @default 'dot' */
  swatch?: 'dot' | 'band';
  /** Round marker instead of a square dot */
  round?: boolean;
  /** layout="list": value column */
  valueLabel?: React.ReactNode;
  /** layout="list": share column */
  shareLabel?: React.ReactNode;
}
/** One key for every chart. onToggle turns each key into an aria-pressed button (hidden keys in `off`). */
export interface ChartLegendProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onToggle'> {
  items: ChartLegendItem[];
  /** @default 'inline' */
  layout?: 'inline' | 'list';
  off?: string[];
  onToggle?: (item: ChartLegendItem) => void;
  /** layout="list": hover / focus of a visible key; null on leave */
  onHover?: (item: ChartLegendItem | null) => void;
}
export declare function ChartLegend(props: ChartLegendProps): JSX.Element;

// ChartTooltip/ChartTooltip.d.ts
export interface ChartTooltipRow {
  key?: string;
  label: React.ReactNode;
  value: React.ReactNode;
  color?: string;
  /** @default 'dot' */
  swatch?: 'dot' | 'band';
}
/** Floating read-out inside a chart plot: title + one row per series. */
export interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plot coordinate (number) or '%' string */
  x: number | string;
  y: number | string;
  /** With a numeric x: keep the tooltip `edge` px from both sides of a plot this wide */
  width?: number;
  /** @default 70 */
  edge?: number;
  title?: React.ReactNode;
  rows?: ChartTooltipRow[];
  /** role="status" (polite). false = aria-hidden. @default true */
  live?: boolean;
}
export declare function ChartTooltip(props: ChartTooltipProps): JSX.Element;

// ComparisonBar/ComparisonBar.d.ts
export interface ComparisonItem {
  id: string;
  label: string;
  description?: string;
  /** Initials / <img>; defaults to initials of label */
  avatar?: React.ReactNode;
  /** Series colour; defaults to --dv-N in order (same as RadarChart) */
  color?: string;
  /** Headline score shown in the column header */
  score?: React.ReactNode;
  /** Radar values keyed by axis key, 0–100 */
  scores?: Record<string, number>;
}
/**
 * Selection tray for "pick 2–4 things, then compare" (contacts, proposals, plans). Slides up from the bottom when something is selected
 * (floating) or sits inline. Shows removable chips, empty slots up to min, a live hint ("Select 1 more…", "Compare up to 4…") and
 * Compare — disabled outside min…max.
 */
export interface ComparisonBarProps {
  items: ComparisonItem[];
  /** @default 2 */
  min?: number;
  /** @default 4 */
  max?: number;
  onRemove?: (id: string) => void;
  onClear?: () => void;
  onCompare?: () => void;
  compareLabel?: string;
  /** Singular / plural noun for the button. @default ['item', 'items'] */
  noun?: [string, string];
  /** Fixed to the viewport bottom, centred. @default true */
  floating?: boolean;
  className?: string;
}
export declare function ComparisonBar(props: ComparisonBarProps): JSX.Element;
export interface ComparisonRow {
  label: string;
  hint?: string;
  values: (string | number | null)[];
  /** Star the best value(s) — numeric rows only; ties for everyone are not starred */
  best?: 'max' | 'min';
  format?: (v: string | number | null) => React.ReactNode;
}
/**
 * Side-by-side comparison in a dialog: colour-keyed column headers, RadarChart across axes (≥3 axes with item.scores),
 * criteria table with best-value stars, and an optional AI insights block (generate on demand).
 */
export interface ComparisonDialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: ComparisonItem[];
  axes?: { key: string; label: string }[];
  rows?: ComparisonRow[];
  /** Rendered insights (e.g. <Markdown>) — replaces the generate prompt */
  insights?: React.ReactNode;
  onGenerateInsights?: () => void;
  /** @default 'idle' */
  insightsStatus?: 'idle' | 'loading';
  insightsLabel?: string;
  /** @default 'done' */
  status?: 'loading' | 'done' | 'error';
  error?: React.ReactNode;
  onRetry?: () => void;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}
export declare function ComparisonDialog(props: ComparisonDialogProps): JSX.Element;

// ConfirmDialog/ConfirmDialog.d.ts
/** Second-thought dialog. primary for routine confirmations, danger for destructive (warning icon, red button, focus starts on Cancel). requireText gates irreversible actions behind typing a name. onConfirm may be async — spinner, dialog locked meanwhile, double submit blocked; if it rejects the dialog stays open with the error message inline. Prefer Toast undo for reversible actions. */
export interface ConfirmDialogProps {
  open: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'primary' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  /** e.g. the workspace name */
  requireText?: string;
  children?: React.ReactNode;
}
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element;
/** Trigger + ConfirmDialog in one — owns open state; closes after onConfirm resolves. For lists of repeated destructive actions. */
export interface ConfirmActionProps extends Omit<ConfirmDialogProps, 'open' | 'onCancel'> { trigger: React.ReactNode }
export declare function ConfirmAction(props: ConfirmActionProps): JSX.Element;

// ContextMenu/ContextMenu.d.ts
/** Right-click (or Shift+F10 / Menu key) menu for a region. Opens at the pointer, clamps to the viewport, closes on scroll/outside click. Always duplicate critical actions somewhere visible — context menus are undiscoverable. */
export interface ContextMenuProps {
  items: MenuItem[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** The region that responds to right-click */
  children?: React.ReactNode;
}
export declare function ContextMenu(props: ContextMenuProps): JSX.Element;

// ContributionBar/ContributionBar.d.ts
export interface ContributionItem { label: React.ReactNode; value: number }
/** Diverging bars from a zero axis — how much each factor adds to or takes from a total. Keeps the sign (Meter does not). */
export interface ContributionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ContributionItem[];
  /** Scale max (absolute). Defaults to the largest |value| */
  max?: number;
  unit?: string;
  digits?: number;
  /** BCP 47 locale for the values, e.g. 'pl-PL'. @default 'en-US' */
  locale?: string;
  /** Sort by |value| descending */
  sort?: boolean;
  /** Label column width. @default 180 */
  labelWidth?: number | string;
}
export declare function ContributionBar(props: ContributionBarProps): JSX.Element;

// Control/Control.d.ts
/**
 * Atom. The bordered field shell — height, border, radius, hover, focus ring, invalid/disabled/read-only states and
 * leading/trailing adornments. Put a native element with className "vui-control__input" inside.
 * Input, Textarea, Select trigger, NumberInput, PasswordInput, SearchInput and picker triggers all share it.
 */
export interface ControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** Height from --control-height-sm/md/lg (density- and pointer-aware). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Auto height for textarea */
  multiline?: boolean;
  /** Velvet icon name or node, inside the left edge */
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Text affix, e.g. "https://" or "€" */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Trailing slot for inline buttons (clear, reveal, stepper) */
  end?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Control(props: ControlProps): JSX.Element;

// CopyButton/CopyButton.d.ts
/** Copies text to the clipboard; icon morphs copy → check for 1.6s and the result is announced. */
export interface CopyButtonProps { value: string | (() => string); label?: string; copiedLabel?: string; iconOnly?: boolean; variant?: 'primary' | 'secondary' | 'soft' | 'ghost'; size?: 'sm' | 'md' | 'lg'; onCopy?: (value: string) => void; className?: string }
export declare function CopyButton(props: CopyButtonProps): JSX.Element;
/** Read-only value + copy button — API keys, invite links, IDs. Selects all on focus. */
export interface CopyFieldProps { value: string; label?: string; /** @default true */ mono?: boolean; className?: string }
export declare function CopyField(props: CopyFieldProps): JSX.Element;

// Count/Count.d.ts
/**
 * Atom. Numeric pill for unread counts, tab/chip totals, cart items. Grid-centred with tabular figures so 1, 9 and 99+ all sit dead centre.
 * Inline next to a label, or anchored to an icon/avatar via Indicator. Tokens: --count-*.
 */
export interface CountProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number | string;
  /** Above this, shows "max+". @default 99 */
  max?: number;
  /** brand (solid, default) · danger · success · inverse · neutral (subtle) · soft (brand tint). @default 'brand' */
  tone?: 'brand' | 'danger' | 'success' | 'inverse' | 'neutral' | 'soft';
  /** sm 16 · md 20 · lg 24. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render when value is 0. @default false */
  showZero?: boolean;
  /** Spring in on mount — use with key={value} to pop on change */
  pop?: boolean;
  /** Accessible text, e.g. "3 unread" */
  label?: string;
}
export declare function Count(props: CountProps): JSX.Element | null;

// Countdown/Countdown.d.ts
/** Live countdown to a date — launches, sales, auction ends. Digits tick with a small drop animation; screen readers get one summary label (not per-second chatter). */
export interface CountdownProps {
  to: Date | string | number;
  onComplete?: () => void;
  /** @default ['days','hours','minutes','seconds'] */
  units?: Array<'days' | 'hours' | 'minutes' | 'seconds'>;
  labels?: Partial<Record<'days' | 'hours' | 'minutes' | 'seconds', string>>;
  /** boxes = tiles with labels · inline = 02:14:09 */
  variant?: 'boxes' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function Countdown(props: CountdownProps): JSX.Element;

// DataGrid/DataGrid.d.ts
export interface GridColumn<T = any> {
  key: string;
  label: React.ReactNode;
  /** px, resizable by dragging the header edge. @default 160 */
  width?: number;
  /** Resize limits in px. @default min 64 */
  minWidth?: number;
  maxWidth?: number;
  /** number = right-aligned, tabular, parsed on edit */
  type?: 'text' | 'number';
  editable?: boolean;
  /** Edit with a select */
  options?: string[];
  format?: (value: any) => React.ReactNode;
  render?: (row: T) => React.ReactNode;
  /** Start pinned (frozen) to the left */
  pin?: 'left';
  /** Start hidden (re-enable in Columns) */
  hidden?: boolean;
  /** Can't be hidden / moved / unpinned in Columns (shorthand for the three flags below = false) */
  locked?: boolean;
  /** @default true */
  hideable?: boolean;
  /** @default true */
  pinnable?: boolean;
  /** @default true */
  movable?: boolean;
}
/** Everything about how the grid is viewed — never the records or the selection. Plain JSON: safe to persist on the app side. */
export interface GridView {
  search: string;
  query: QueryGroup | null;
  sort: { key: string; dir: 'asc' | 'desc' } | null;
  /** Order, visibility and pin per column */
  columns: ColumnState[];
  /** Only columns the user resized */
  widths: Record<string, number>;
}
/**
 * Advanced data grid. Spreadsheet core: single active cell, arrows / Home / End / PageUp/Down, Enter / F2 / typing edits,
 * Enter commits ↓, Tab →, Esc cancels, ⌘C copies; sortable headers, resizable columns, sticky header.
 * Optional layers, each one prop: toolbar search (searchable), Filters popover with a QueryBuilder (filterFields),
 * Columns popover with ColumnManager — show/hide, reorder, freeze (columnManager), Export (onExport; null = CSV download),
 * row checkboxes with select-all + bulk bar (selectable, bulkActions; Space toggles), expandable detail rows (renderDetail; Enter on a
 * read-only cell toggles), frozen columns with a shadow on horizontal scroll, "Showing X of Y" footer.
 * View state (search, filters, sort, column order/visibility/pins, widths) is one GridView object — uncontrolled (defaultView) or
 * controlled (view + onViewChange); "Reset view" appears once it differs from the default. Saved views are reconciled to the current
 * columns (unknown keys dropped, new columns appended, widths clamped, ≥1 column always visible). Persisting views is the app's job.
 * Server data: manualFiltering / manualSorting keep the UI but skip local filtering/sorting — fetch, paginate and show loading yourself.
 * Use Table for simple read-only lists.
 */
export interface DataGridProps<T = any> {
  columns: GridColumn<T>[];
  rows: T[];
  /** Unique, stable record key — required to stay correct when rows are replaced, inserted or reordered (warns on missing/duplicate keys). @default 'id' */
  rowKey?: string;
  /** Controlled view state */
  view?: GridView;
  /** Initial (and reset) view; partial/saved views are reconciled to the columns */
  defaultView?: Partial<GridView>;
  onViewChange?: (view: GridView) => void;
  /** Search + Filters only update the view; rows are shown as given (server-side filtering) */
  manualFiltering?: boolean;
  /** Header sort only updates the view; rows are shown as given (server-side sorting) */
  manualSorting?: boolean;
  /** Total for the footer "of Y" when rows is one page of a larger set */
  rowCount?: number;
  onRowsChange?: (rows: T[], change: { row: any; key: string; value: any }) => void;
  /** Scroll area height in px. @default 360 */
  height?: number;
  /** Pin the first column when no column sets pin. @default true */
  stickyFirst?: boolean;
  /** @default true */
  rowNumbers?: boolean;
  selectable?: boolean;
  /** Selected row keys (controlled) */
  selected?: Array<string | number>;
  onSelectionChange?: (keys: Array<string | number>) => void;
  /** Buttons shown in the toolbar while rows are selected */
  bulkActions?: (rows: T[]) => React.ReactNode;
  /** Expandable detail panel under a row */
  renderDetail?: (row: T) => React.ReactNode;
  /** Free-text filter across visible columns */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Enables the Filters popover (QueryBuilder) */
  filterFields?: QueryField[];
  /** Enables the Columns popover (ColumnManager) */
  columnManager?: boolean;
  /** Shows Export. Pass null for a built-in CSV download of the current view. */
  onExport?: ((rows: T[], columns: GridColumn<T>[]) => void) | null;
  /** Extra toolbar nodes on the right */
  toolbarEnd?: React.ReactNode;
  /** true = "Showing X of Y"; a node adds it on the right */
  footer?: boolean | React.ReactNode;
  className?: string;
}
export declare function DataGrid<T = any>(props: DataGridProps<T>): JSX.Element;
/** The view a grid starts from (column defaults, empty search/filters, no sort). */
export declare function defaultGridView(columns: GridColumn[], opts?: { stickyFirst?: boolean; filterFields?: QueryField[] }): GridView;
/** Fit a saved or imported view onto the current columns. Use before trusting persisted JSON. */
export declare function reconcileGridView(view: unknown, columns: GridColumn[], opts?: { stickyFirst?: boolean; filterFields?: QueryField[] }): GridView;

// DataState/DataState.d.ts
/** Data freshness / availability. Distinguishes "nothing happened" (empty) from "we could not check" (unavailable/partial). Unavailable data is never shown as zero. */
export interface DataStateProps extends React.HTMLAttributes<HTMLElement> {
  state?: 'fresh' | 'delayed' | 'stale' | 'partial' | 'unavailable' | 'empty';
  /** Override the default title */
  label?: React.ReactNode;
  /** Reason, shown in block variant */
  detail?: React.ReactNode;
  /** Provider / feed, e.g. "Reports API · daily" */
  source?: React.ReactNode;
  /** Observation time, e.g. "14:32:07" */
  asOf?: React.ReactNode;
  /** inline = dot + text (headers, cells) · block = placeholder for a whole panel. @default 'inline' */
  variant?: 'inline' | 'block';
  /** Block only — the EmptyState size it is drawn at (md = tile + centred text, sm = one row). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  action?: React.ReactNode;
}
export declare function DataState(props: DataStateProps): JSX.Element;

// DatePicker/DatePicker.d.ts
/** Date field → calendar popover. Today / Clear in the footer, Esc closes and refocuses. Compact: the field is a button, no free typing. */
export interface DatePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (date: Date | null) => void;
  /** @default 'Select date' */
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: number;
  /** Custom field text */
  format?: (date: Date) => string;
  /** @default true */
  clearable?: boolean;
  /** Popover alignment */
  align?: 'start' | 'end';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Start with the popover open (docs, onboarding) */
  defaultOpen?: boolean;
  id?: string;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;
export interface RangePreset { label: string; range: () => DateRange }
/** Range field → popover with presets column + two months (one under 720px). Changes are a draft until Apply; footer shows the span in days. */
export interface DateRangePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Defaults: Today, Last 7 / 30 days, This / Last month, This year. [] hides the column. */
  presets?: RangePreset[];
  placeholder?: string;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: number;
  align?: 'start' | 'end';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  defaultOpen?: boolean;
  id?: string;
}
export declare function DateRangePicker(props: DateRangePickerProps): JSX.Element;
export declare const DEFAULT_RANGE_PRESETS: RangePreset[];
/** Time field: type freely ("930", "9:30", "9.30pm") or pick from a step list. Value is always "HH:MM" 24h. */
export interface TimePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** "HH:MM" 24h */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (time: string | null) => void;
  /** List step in minutes. @default 15 */
  step?: number;
  /** @default '00:00' */
  min?: string;
  /** @default '23:59' */
  max?: string;
  /** Display as 9:30 AM. @default false */
  hour12?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}
export declare function TimePicker(props: TimePickerProps): JSX.Element;
export declare function parseTime(input: string): string | null;

// DateTimePicker/DateTimePicker.d.ts
/**
 * One field for a moment in time — meetings, deadlines, scheduled sends. Popover pairs the Calendar with a time column
 * (step list, auto-scrolled to the current pick); changes are a draft until Apply; "Now" jumps to the next step.
 * Times outside min/max are disabled. Use DatePicker when time doesn't matter, TimePicker for a time on its own.
 */
export interface DateTimePickerProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  /** Earliest selectable moment (date and time) */
  min?: Date;
  max?: Date;
  /** Minutes between time slots. @default 30 */
  step?: number;
  /** @default false */
  hour12?: boolean;
  locale?: string;
  weekStartsOn?: number;
  /** @default true */
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  defaultOpen?: boolean;
  align?: 'start' | 'end';
  id?: string;
}
export declare function DateTimePicker(props: DateTimePickerProps): JSX.Element;

// DescriptionList/DescriptionList.d.ts
export interface DescriptionItem { term: React.ReactNode; description?: React.ReactNode; hint?: React.ReactNode; /** Monospace value (IDs, keys) */ mono?: boolean; /** grid layout: columns to span */ span?: number }
/** Key–value details (record pages, invoices, settings summary). row = label left / value right, divided · grid = label over value in N columns. Missing values show an em dash. */
export interface DescriptionListProps { items: DescriptionItem[]; /** @default 'row' */ layout?: 'row' | 'grid'; /** grid only. @default 2 */ columns?: number; className?: string }
export declare function DescriptionList(props: DescriptionListProps): JSX.Element;

// Dialog/Dialog.d.ts
/** Modal dialog or side drawer. Traps focus, restores it on close, Esc + backdrop click dismiss. Becomes a bottom sheet under 640px (center placement). */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** center = modal · right / left = full-height drawer sliding from that edge */
  placement?: 'center' | 'right' | 'left';
  dismissible?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;

// DiffViewer/DiffViewer.d.ts
/**
 * Line diff of two texts on the code surface (same bar and palette as CodeSnippet). Unified or split view, old / new line numbers,
 * word-level highlights inside changed lines, unchanged runs folded to `context` lines with "Show N unchanged lines".
 * For config changes, document revisions, AI edit suggestions, audit trails. Fine up to a few thousand lines.
 */
export interface DiffViewerProps {
  oldText: string;
  newText: string;
  /** Shown in the bar */
  filename?: string;
  mode?: 'unified' | 'split';
  /** @default 'unified' */
  defaultMode?: 'unified' | 'split';
  onModeChange?: (mode: 'unified' | 'split') => void;
  /** Unchanged lines kept around each change. @default 3 */
  context?: number;
  className?: string;
}
export declare function DiffViewer(props: DiffViewerProps): JSX.Element;
export interface DiffRow { t: 'eq' | 'add' | 'del'; o?: number; n?: number; text: string; parts?: Array<[string, boolean]> }
/** The line + word diff DiffViewer renders — reuse for your own summaries. */
export declare function diffLines(oldText: string, newText: string): DiffRow[];

// DirectionBadge/DirectionBadge.d.ts
/** Direction label in trend colours — up, down, flat or muted. The text is yours (children); it defaults to Up / Down / Flat / None. */
export interface DirectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'flat' */
  direction?: 'up' | 'down' | 'flat' | 'muted';
  /** Extra text after a divider, e.g. "x2" */
  suffix?: React.ReactNode;
  icon?: boolean;
  /** @default 'solid' */
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'sm' | 'md';
}
export declare function DirectionBadge(props: DirectionBadgeProps): JSX.Element;

// Divider/Divider.d.ts
/** Hairline separator, optionally with a centered label ("or"). */
export interface DividerProps {
  label?: React.ReactNode;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
export declare function Divider(props: DividerProps): JSX.Element;

// DonutChart/DonutChart.d.ts
/** Part-to-whole donut with interactive legend: click an entry to exclude it and recut the rest (at least one stays); hover a segment or entry to see its share in the centre. Max ~6 slices — group the tail as "Other". */
export interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  /** px. @default 180 */
  size?: number;
  /** @default 22 */
  thickness?: number;
  format?: (v: number) => string;
  /** @default 'Total' */
  centerLabel?: string;
  label?: string;
  className?: string;
}
export declare function DonutChart(props: DonutChartProps): JSX.Element;

// Dot/Dot.d.ts
/**
 * Atom. Small round status / presence / category marker. Used by Badge, Avatar presence, legends, error hints.
 * Status colour never alone — pair with a label.
 */
export interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'neutral' */
  tone?: Tone;
  /** sm 5px · md 6px · lg 8px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Soft ping for live states */
  pulse?: boolean;
  /** 2px surface-coloured ring — for dots overlapping avatars */
  ring?: boolean;
  /** Accessible name when the dot stands alone; otherwise hidden from AT */
  label?: string;
}
export declare function Dot(props: DotProps): JSX.Element;

// DropdownButton/DropdownButton.d.ts
/** With onClick: split button — main action + chevron menu of alternatives ("Save" · Save as draft / Save & publish). Without onClick: a single button that opens the menu. */
export interface DropdownButtonProps {
  children?: React.ReactNode;
  /** Main action. Omit for a plain menu button. */
  onClick?: () => void;
  items: MenuItem[];
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string | React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  /** aria-label of the chevron. @default 'More options' */
  menuLabel?: string;
  className?: string;
}
export declare function DropdownButton(props: DropdownButtonProps): JSX.Element;

// DualFilterBar/DualFilterBar.d.ts
type Opt = string | { value: string; label: string; count?: number; icon?: string };
/** One toolbar, two independent chip groups: multi-select filters (with counts + Clear) | single-choice sort. Optional search and live result count. Wraps on narrow screens. */
export interface DualFilterBarProps {
  filters: Opt[];
  filterValue?: string[];
  defaultFilterValue?: string[];
  onFilterChange?: (values: string[]) => void;
  sorts: Opt[];
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  /** Shows a search field when onSearchChange is set */
  search?: string;
  onSearchChange?: (q: string) => void;
  /** Result count, right-aligned */
  count?: number;
  filterLabel?: string;
  sortLabel?: string;
  /** full = labelled groups + search + count · simple = one compact pill track with two chip groups and a divider (no search/count/labels). @default 'full' */
  variant?: 'full' | 'simple';
  className?: string;
}
export declare function DualFilterBar(props: DualFilterBarProps): JSX.Element;

// EditableCollection/EditableCollection.d.ts
export interface EditableItem { id: string | number; text: string; /** One of levels, when levels is set */ level?: string; /** 1–maxWeight, when weighted */ weight?: number }
/** Repeatable editable rows — skills with a level, job requirements, checklist, agenda. Each row: drag grip (or ↑↓ on the focused grip) · always-visible text input · optional level select · optional importance stars · delete. Empty rows show "can't be empty" after blur. Dashed full-width Add focuses the new row. Header with title + live count. */
export interface EditableCollectionProps {
  items?: EditableItem[];
  defaultItems?: EditableItem[];
  onItemsChange?: (items: EditableItem[]) => void;
  /** Header title */
  title?: React.ReactNode;
  /** Live item count in the header. @default true when title is set */
  showCount?: boolean;
  /** Count text, e.g. n => n + ' pozycje'. @default 'N items' */
  countLabel?: (n: number) => React.ReactNode;
  /** Per-row select (e.g. Basic / Intermediate / Advanced / Expert) */
  levels?: string[];
  /** @default 'Level' */
  levelLabel?: string;
  /** Importance stars per row. @default false */
  weighted?: boolean;
  /** @default 5 */
  maxWeight?: number;
  /** drag = grip handle (+ ↑↓ keys on it) · buttons = up / down icon buttons. @default 'drag' */
  reorder?: 'drag' | 'buttons';
  /** Flag empty rows after blur. @default true */
  required?: boolean;
  requiredText?: string;
  /** Input placeholder. @default 'Name' */
  placeholder?: string;
  /** @default 'Add item' */
  addLabel?: string;
  /** Text of a freshly added row. @default '' */
  newItemText?: string;
  emptyText?: React.ReactNode;
  /** Hides Add at this length */
  maxItems?: number;
  /** Accessible list name */
  label?: string;
  className?: string;
}
export declare function EditableCollection(props: EditableCollectionProps): JSX.Element;

// EmptyState/EmptyState.d.ts
export type StateTone = 'brand' | 'danger' | 'warning' | 'info' | 'success' | 'neutral';
/** No-data placeholder: tinted icon circle + title + description + actions (use size="sm" buttons). sm = inline (card, table, list) · md = section · lg = whole page. Always offer the next action. */
export interface EmptyStateProps { icon?: string | null; title?: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; size?: 'sm' | 'md' | 'lg'; /** Icon circle colour. @default 'brand' */ tone?: StateTone; className?: string; /** Extra content under the actions */ children?: React.ReactNode }
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
/** Failed-to-load placeholder with Retry and optional collapsible technical details. */
export interface ErrorStateProps { title?: React.ReactNode; description?: React.ReactNode; onRetry?: () => void; retryLabel?: string; /** Error text / stack, hidden behind "Show details" */ details?: string; /** Defaults to the danger tone icon (`circle-x`) */ icon?: string; size?: 'sm' | 'md' | 'lg'; className?: string }
export declare function ErrorState(props: ErrorStateProps): JSX.Element;
/**
 * The end of a page or flow — errors (404 / 403 / 500 / offline) and outcomes (success / warning / info, e.g. "Payment received").
 * Same layout as EmptyState. size lg = full page with a code watermark; md / sm = inside a section, card or dialog, error code as an
 * "Error 404" overline. Default copy + tone per status — override title/description. children = details under the actions (receipt, error id).
 * Use EmptyState for "nothing here yet", ErrorState for a section that failed to load.
 */
export interface StatusPageProps {
  /** Error code or outcome. @default 404 */
  code?: 404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info';
  /** Alias of code — reads better for outcomes: status="success" */
  status?: 404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info';
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: string;
  tone?: StateTone;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Details under the actions */
  children?: React.ReactNode;
  className?: string;
}
export declare function StatusPage(props: StatusPageProps): JSX.Element;

// EmptyText/EmptyText.d.ts
/**
 * Atom. One-line "nothing here" inside a list, panel or column: "No matches", "Drop cards here", "No events this day."
 * For a whole empty view with title, illustration and actions use EmptyState (14 Feedback).
 */
export interface EmptyTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Glyph name or node above the text */
  icon?: string | React.ReactNode;
  /** start = left-aligned, no inline padding (inside prose / timelines). @default 'center' */
  align?: 'center' | 'start';
  /** Dashed outline — for drop zones and empty editable lists */
  dashed?: boolean;
  /** Element to render — li inside lists, p inside prose. @default 'div' */
  as?: 'div' | 'li' | 'p' | 'span';
}
export declare function EmptyText(props: EmptyTextProps): JSX.Element;

// EnvironmentBar/EnvironmentBar.d.ts
export interface EnvironmentBarItem { label: React.ReactNode; value: React.ReactNode }
/** Always-visible environment strip with a label chip, key state and a stop action. Each tone has its own colour family (tokens --env-*): neutral, info, warning, and danger as a solid fill, so two environments never look alike. */
export interface EnvironmentBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Colour family. @default 'info' */
  tone?: 'neutral' | 'info' | 'warning' | 'danger';
  /** Chip text. Defaults to the tone name. */
  label?: string;
  /** Key/value state, e.g. Region, Build, Owner */
  items?: EnvironmentBarItem[];
  /** Live-update connection: live (pulsing), stale (warning), offline (danger) */
  connection?: { state: 'live' | 'stale' | 'offline'; label: React.ReactNode };
  /** Shows the stop button (danger); open a ConfirmDialog from here, never act directly */
  onStop?: () => void;
  /** @default 'Stop' */
  stopLabel?: string;
  stopDisabled?: boolean;
  sticky?: boolean;
  /** Sticky offset, e.g. navbar height. @default 0 */
  top?: number;
  /** Inner content max width. @default 1360 */
  maxWidth?: number | string;
  actions?: React.ReactNode;
}
export declare function EnvironmentBar(props: EnvironmentBarProps): JSX.Element;

// ErrorSummary/ErrorSummary.d.ts
/** Submit-time error summary: takes focus when errors appear, lists each problem as a link that focuses and scrolls to its field. Pair each field's error via Input's error prop (aria-describedby is wired). Put it at the top of the form. */
export interface ErrorSummaryProps {
  /** id = the field's input id */
  errors: Array<{ id: string; message: string }>;
  /** Default: "There are N problems to fix" */
  title?: React.ReactNode;
  /** @default true */
  focusOnShow?: boolean;
  className?: string;
}
export declare function ErrorSummary(props: ErrorSummaryProps): JSX.Element | null;

// EventCalendar/EventCalendar.d.ts
export interface CalendarEvent { id?: string | number; /** Date or 'YYYY-MM-DD' */ date: Date | string; title: React.ReactNode; /** 'HH:mm' — also the sort key. Omit for all-day. */ time?: string; description?: React.ReactNode; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' }
/** Compact month grid (days with events get a dot) + agenda for the selected day. Built on Calendar. Sizes to the month grid (~252px) instead of filling its container — drop it into a sidebar or card as-is. */
export interface EventCalendarProps {
  events: CalendarEvent[];
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  /** @default 'en-US' */
  locale?: string;
  /** @default 1 (Monday) */
  weekStartsOn?: 0 | 1;
  /** Shown when the selected day has no events */
  emptyText?: string;
  /** stacked = agenda under the grid, as wide as the grid · split = agenda to the right (≤300px), stacks under 620px. @default 'stacked' */
  layout?: 'stacked' | 'split';
  className?: string;
}
export declare function EventCalendar(props: EventCalendarProps): JSX.Element;

// Fab/Fab.d.ts
/** Floating action button — the single most important creation action on mobile screens. extended adds the label. With actions it becomes a speed dial (icon rotates to ×, labelled mini-buttons stagger in; Esc closes). */
export interface FabProps { icon?: string; /** Required — aria-label or visible text */ label: string; extended?: boolean; onClick?: () => void; actions?: Array<{ label: string; icon: string; onClick?: () => void }>; /** fixed = bottom-right of viewport · static. @default 'fixed' */ position?: 'fixed' | 'static'; className?: string }
export declare function Fab(props: FabProps): JSX.Element;

// FeatureCard/FeatureCard.d.ts
/** Feature tile built on Card: tone icon tile, title, copy, optional action. Default = hoverable + tonal: reacts with the tone lift but is NOT one action — the action link inside is. Other Card / Surface props pass through. */
export interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Velvet icon name */
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Custom action slot — e.g. <Link standalone> */
  action?: React.ReactNode;
  /** Renders a "Learn more →" link (or the whole card's href when interactive) */
  href?: string;
  /** Hue for icon tile, tonal hover and accent. @default 'brand' */
  tone?: CardProps['tone'];
  /** @default true */
  tonal?: boolean;
  /** Whole card becomes the link. @default false */
  interactive?: boolean;
  /** card = Card hover behaviour · lift = legacy VelvetUi tile: solid bg + neutral strong border at rest; on hover lifts 4px with tone border + layered tone glow. @default 'card' */
  look?: 'card' | 'lift';
  /** stack = icon above text · inline = icon left, compact · header = icon + title in one row, description full-width below (shortest tile). @default 'stack' */
  layout?: 'stack' | 'inline' | 'header';
  /** Card pass-through */
  padding?: CardProps['padding'];
  variant?: CardProps['variant'];
  accent?: CardProps['accent'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
}
export declare function FeatureCard(props: FeatureCardProps): JSX.Element;

// Field/Field.d.ts
/** Ids and state the Field hands to its control — spread onto the input. */
export interface FieldControlProps { id: string; invalid: boolean; describedBy?: string; required?: boolean; }
/**
 * Atom. Label + control + hint/error stack with ids and aria wired. Every form component (Input, Select, DatePicker,
 * NumberInput, PhoneInput…) composes it so labels, hints, error lanes and counters look and behave the same.
 * Pass a render function to receive { id, invalid, describedBy }.
 */
export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Replaces the hint, turns the control invalid */
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  id?: string;
  /** Current length for the counter; shown when maxCount is set */
  count?: number;
  maxCount?: number;
  /** Keep the hint lane height so validation messages don't shift layout */
  reserveHint?: boolean;
  className?: string;
  children?: React.ReactNode | ((ctl: FieldControlProps) => React.ReactNode);
}
export declare function Field(props: FieldProps): JSX.Element;
/** Renders <label> when htmlFor is set, otherwise <span> (labels for radiogroups, sliders, OTP groups — pair with aria-labelledby). */
export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { as?: 'label' | 'span' | 'div'; optional?: boolean; required?: boolean; }
export declare function FieldLabel(props: FieldLabelProps): JSX.Element;
export interface FieldHintProps extends React.HTMLAttributes<HTMLSpanElement> { error?: boolean; lane?: boolean; }
export declare function FieldHint(props: FieldHintProps): JSX.Element;

// FileUpload/FileUpload.d.ts
export interface UploadFile {
  id: string | number;
  name: string;
  /** Bytes */
  size?: number;
  /** @default 'done' */
  status?: 'uploading' | 'done' | 'error';
  /** 0–100 while uploading */
  progress?: number;
  /** Error message shown in the row */
  error?: string;
}
/** Dropzone (drag, click or Enter/Space to browse) + file list with progress, retry and remove. Upload itself is yours: receive File[] in onFiles, then drive each row through `files`. */
export interface FileUploadProps {
  files?: UploadFile[];
  onFiles?: (files: File[]) => void;
  onRemove?: (id: string | number) => void;
  onRetry?: (id: string | number) => void;
  /** input accept — e.g. "image/*,.pdf" */
  accept?: string;
  /** @default true */
  multiple?: boolean;
  /** Bytes. Larger files are rejected with an inline error. */
  maxSize?: number;
  /** @default 'Drop files here or browse' */
  title?: React.ReactNode;
  /** e.g. "PNG, JPG or PDF — up to 20 MB" */
  hint?: React.ReactNode;
  /** Shown under the zone when files is empty */
  emptyText?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
export declare function FileUpload(props: FileUploadProps): JSX.Element;
export declare function formatBytes(bytes: number): string;

// FilterBar/FilterBar.d.ts
export interface FilterOption { value: string; label: React.ReactNode; /** Facet count shown right-aligned */ count?: number; /** Dot tone before the label (status filters) */ dot?: string; }
export interface FilterDef { key: string; label: string; icon?: string; options: FilterOption[]; /** @default true */ multiple?: boolean; }
/**
 * Search + faceted filter chips above a list or table. Each chip opens a checklist; a chip with one pick reads "Status: Active",
 * with several shows a count. "Clear all" appears once anything is active; the live result count sits on the right.
 * Value is { [filterKey]: string[] }. Use DualFilterBar for the two-axis segmented variant.
 */
export interface FilterBarProps {
  /** @default true */
  search?: boolean;
  searchPlaceholder?: string;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (q: string) => void;
  filters?: FilterDef[];
  value?: Record<string, string[]>;
  defaultValue?: Record<string, string[]>;
  onChange?: (value: Record<string, string[]>) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: Record<string, string[]>) => void;
  /** Announced politely when it changes */
  resultCount?: number;
  /** @default 'results' */
  resultLabel?: string;
  /** Right-side slot — ColumnManager trigger, view switch, export */
  actions?: React.ReactNode;
  className?: string;
}
export declare function FilterBar(props: FilterBarProps): JSX.Element;

// PracticeSession/PracticeSession.d.ts
export interface PracticeCollection { id: string; name: string; total: number; due?: number; /** Show as a large tile above the category grid (e.g. "All", "My list"). */ pinned?: boolean }
export interface PracticeCard { id?: string | number; front: React.ReactNode; back: React.ReactNode; hint?: string; example?: React.ReactNode }
export interface PracticeResult { id: string | number; known: boolean }
/** Practice-session setup: collection picker (due counts), card count, order and direction. */
export interface PracticeSetupProps { collections: PracticeCollection[]; onStart?: (config: { collection: string; count: number; order: 'due' | 'random' | 'new'; direction: 'front' | 'back' }) => void; maxCards?: number; className?: string }
export declare function PracticeSetup(props: PracticeSetupProps): JSX.Element;
/** One-card-at-a-time practice: flip (Space), then "Didn’t know" (1 / ←) or "Knew it" (2 / →); card slides out, progress bar + tally update. Answer buttons unlock after the flip. */
export interface PracticeSessionProps { cards: PracticeCard[]; onFinish?: (results: PracticeResult[]) => void; onExit?: () => void; /** Show back first */ reverse?: boolean; className?: string }
export declare function PracticeSession(props: PracticeSessionProps): JSX.Element | null;
/** End-of-session result: accuracy ring, known / to-review counts, restart and review-missed actions. */
export interface PracticeSummaryProps { results: PracticeResult[]; onRestart?: () => void; onReviewMissed?: () => void; onDone?: () => void; className?: string }
export declare function PracticeSummary(props: PracticeSummaryProps): JSX.Element;

// FlipCard/FlipCard.d.ts
/** Two-sided card that flips in 3D on click / Enter / Space (fades under reduced motion). Each face is a Card. Reveal answers, term and definition, before/after. */
export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  /** px. @default 220 */
  height?: number;
  label?: string;
  /** Front face paint (Card/Surface variant). @default 'default' */
  variant?: CardProps['variant'];
  /** Back face paint. @default 'brand-solid' */
  backVariant?: CardProps['variant'];
  /** Front face hue + accent strip */
  tone?: CardProps['tone'];
  accent?: CardProps['accent'];
  /** px or CSS length; default fills the column */
  width?: number | string;
  /** center = centred stack (vocab card) · start = left-aligned header / body / footer laid out top-to-bottom (Q&A, metric). @default 'center' */
  align?: 'center' | 'start';
  /** Also flip on pointer hover (click still toggles). @default false */
  flipOnHover?: boolean;
  className?: string;
}
export declare function FlipCard(props: FlipCardProps): JSX.Element;

// Footer/Footer.d.ts
export interface FooterLink { label: React.ReactNode; href?: string; /** New tab + external icon */ external?: boolean; /** Small pill after the label — "New", "Beta" */ badge?: React.ReactNode; current?: boolean; }
export interface FooterColumn { title: string; links: FooterLink[]; }
/**
 * Product footer.
 * full — brand mark + name, one-line description, optional CTA (newsletter, download), social icon tiles, up to 4 link columns
 * (links can carry a "New" badge), then a legal bar: copyright · legal links · status + end slot (LocaleSwitcher, ThemeToggle).
 * Under 640px the columns become collapsible groups. compact — one row inside an app: mark, copyright, version, links, status.
 * surface: card (bordered, rounded — sits inside a page or card) or page (full-bleed, top border only). Tokens: --footer-*.
 */
export interface FooterProps {
  /** @default 'full' */
  variant?: 'full' | 'compact';
  /** @default 'card' */
  surface?: 'card' | 'page';
  /** Product name */
  brand?: React.ReactNode;
  /** Mark tile content — letter, <img> or icon. Defaults to the brand's first letter; null hides it. */
  mark?: React.ReactNode | null;
  description?: React.ReactNode;
  columns?: FooterColumn[];
  social?: { icon: string; label: string; href?: string }[];
  legal?: FooterLink[];
  copyright?: React.ReactNode;
  /** compact: extra text after copyright — "v2.4.0" */
  meta?: React.ReactNode;
  /** Link to a status page with a tone dot: 'ok' | 'degraded' | 'down' or { state, label, href } */
  status?: 'ok' | 'degraded' | 'down' | { state: 'ok' | 'degraded' | 'down'; label?: string; href?: string };
  /** Under the description — e.g. a newsletter Input + Button */
  cta?: React.ReactNode;
  /** Right end of the bar */
  end?: React.ReactNode;
  className?: string;
}
export declare function Footer(props: FooterProps): JSX.Element;

// FormLayout/FormLayout.d.ts
/** Vertical form shell. Renders a <form> (noValidate; onSubmit gets preventDefault for free) or any element. Sets rhythm between sections / grids / fields. */
export interface FormLayoutProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit'> {
  /** @default 'form' */
  as?: 'form' | 'div' | 'section';
  /** sm 12 · md 20 · lg 32 px between children. @default 'md' */
  gap?: 'sm' | 'md' | 'lg';
  /** Max width, e.g. 640 or '40rem' */
  width?: number | string;
  onSubmit?: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}
export declare function FormLayout(props: FormLayoutProps): JSX.Element;
/** Titled group of fields. layout="aside" = settings-page style: title + description in a left column, fields on the right (stacks under 720px). */
export interface FormSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** @default 'stacked' */
  layout?: 'stacked' | 'aside';
  /** Hairline above the section */
  divider?: boolean;
  /** Right side of the header (stacked) */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function FormSection(props: FormSectionProps): JSX.Element;
/** Responsive field grid. Default auto-fits columns of at least minColumnWidth; pass columns for a fixed count (collapses to 1 under 560px). Wrap a field in <FormSpan> to span columns. */
export interface FormGridProps {
  columns?: 1 | 2 | 3 | 4;
  /** @default 240 */
  minColumnWidth?: number | string;
  /** @default 'md' */
  gap?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}
export declare function FormGrid(props: FormGridProps): JSX.Element;
export interface FormSpanProps { /** Columns to span or 'full'. @default 'full' */ span?: number | 'full'; children?: React.ReactNode; className?: string }
export declare function FormSpan(props: FormSpanProps): JSX.Element;
/** Button row for forms, dialogs and panels. start = left slot (e.g. Delete, "Saved 2 min ago"). sticky = pins to the bottom of the scroll container with a frosted background. Wraps on narrow widths; primary stays last. */
export interface ActionRowProps {
  /** @default 'end' */
  align?: 'start' | 'center' | 'end' | 'between';
  sticky?: boolean;
  divider?: boolean;
  start?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function ActionRow(props: ActionRowProps): JSX.Element;

// FunnelChart/FunnelChart.d.ts
/**
 * Conversion funnel — centred bars that narrow step by step, value + share of the first step on the right, and a conversion / drop-off line between steps.
 * The hatched ghost shows where the previous step was, so the loss is visible. Hover or Tab through steps to focus one; each step reads its numbers to screen readers.
 */
export interface FunnelChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  /** @default compact (1.2k) */
  format?: (v: number) => string;
  /** Lightens step by step. @default 'var(--dv-1)' */
  color?: string;
  /** @default true */
  showConversion?: boolean;
  /** Conversion % against the previous step or the first. @default 'previous' */
  relativeTo?: 'previous' | 'first';
  label?: string;
  className?: string;
}
export declare function FunnelChart(props: FunnelChartProps): JSX.Element;

// Gantt/Gantt.d.ts
/**
 * Timeline of tasks on a date axis — sticky task column and header, month + day / week scale, weekend shading, today line, progress strip, milestones and finish-to-start dependency arrows.
 * Tasks sharing `group` get a group row and a data-viz colour. Bars are buttons (name, dates and progress in the label). Scrolls to today on mount.
 * Use Scheduler for hour-level calendars, Timeline for an activity feed.
 */
export interface GanttTask {
  id?: string | number;
  name: string;
  /** Date or 'YYYY-MM-DD' */
  start: Date | string;
  /** Inclusive. Defaults to start. */
  end?: Date | string;
  /** 0–100 */
  progress?: number;
  group?: string;
  /** Overrides the group colour */
  color?: string;
  /** Diamond on `start` */
  milestone?: boolean;
  /** Task id(s) that must finish first — draws an arrow */
  dependsOn?: string | number | Array<string | number>;
}
export interface GanttProps {
  tasks: GanttTask[];
  /** day 36 px · week 16 px · month 5 px per day. @default 'day' */
  scale?: 'day' | 'week' | 'month';
  /** Axis range. Defaults to the tasks ±2–3 days. */
  start?: Date | string;
  end?: Date | string;
  /** @default new Date() */
  today?: Date | string;
  /** @default 220 */
  labelWidth?: number;
  /** @default 40 */
  rowHeight?: number;
  /** Max height before the body scrolls */
  height?: number | string;
  /** @default true */
  showDependencies?: boolean;
  onTaskClick?: (task: GanttTask) => void;
  /** @default 'en-US' */
  locale?: string;
  label?: string;
  className?: string;
}
export declare function Gantt(props: GanttProps): JSX.Element;

// GateList/GateList.d.ts
export interface GateItem { id?: string; label: React.ReactNode; detail?: React.ReactNode; status: 'pass' | 'fail' | 'warn' | 'pending' | 'skip'; /** Reason / error code, shown mono on the right */ code?: string }
/** Ordered pre-condition checks (readiness, order gates, promotion criteria). The first failure is marked as blocking; later items are dimmed because they were not decisive. */
export interface GateListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GateItem[];
  /** @default true */
  ordered?: boolean;
  /** Mark first fail as blocking and dim the rest. @default true */
  stopAtFirstFail?: boolean;
  size?: 'sm' | 'md';
}
export declare function GateList(props: GateListProps): JSX.Element;

// Gauge/Gauge.d.ts
/**
 * Half-circle meter for one value against a range — utilisation, score, SLA, quota. role="meter".
 * thresholds recolour the arc once the value passes them and draw a notch on the track. Use Progress / Meter for linear progress, Stat for a bare number.
 */
export interface GaugeProps {
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  label?: React.ReactNode;
  caption?: React.ReactNode;
  format?: (v: number) => string;
  /** Small suffix after the number — %, ms, GB */
  unit?: string;
  /** e.g. [{ value: 70, tone: 'warning' }, { value: 90, tone: 'danger' }] */
  thresholds?: Array<{ value: number; tone: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | string }>;
  /** Arc colour below the first threshold. @default 'brand' */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** sm 136 · md 188 · lg 244 px wide. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** min / max captions under the arc. @default true */
  showBounds?: boolean;
  className?: string;
}
export declare function Gauge(props: GaugeProps): JSX.Element;

// Glyph/Glyph.d.ts
/**
 * Atom. One Velvet icon as a CSS-mask <i class="vui-icon icon-NAME"> (colour = currentColor). Every component that takes an `icon` prop renders through this.
 * Lighter than the SVG <Icon> (05 Icons) — no markup per glyph, sizes with text. Decorative by default; pass `label` when it carries meaning.
 */
export interface GlyphProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** File name in assets/icons without .svg, e.g. "search" */
  name: string;
  /** Token size (xs 12 · sm 14 · md 16 · lg 18 · xl 20) or px. Omit to follow text (1.15em). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Accessible name — makes the icon role="img" */
  label?: string;
}
export declare function Glyph(props: GlyphProps): JSX.Element;
/** string → <Glyph name>, node → as-is, empty → null. For `icon` props that accept either. */
export declare function renderIcon(icon?: string | React.ReactNode, className?: string): React.ReactNode;

// Handle/Handle.d.ts
/**
 * Atom. Drag grip for reorderable rows and cards (EditableCollection, TransferList). A focusable button by default —
 * wire draggable/onDragStart and ArrowUp/ArrowDown in onKeyDown so reordering works without a mouse.
 */
export interface HandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name incl. the keyboard hint, e.g. "Reorder item 2 (↑↓)". @default 'Drag to reorder' */
  label?: string;
  /** Visual-only grip (the whole row is the drag target). Renders a hidden span. */
  decorative?: boolean;
  /** Swap the grip glyph — e.g. 'lock' for a row that can't move. @default 'grip-vertical' */
  icon?: string;
}
export declare function Handle(props: HandleProps): JSX.Element;

// Heatmap/Heatmap.d.ts
/** Calendar density grid — "how much, when" (sessions, contributions, uptime). Weeks are columns, weekdays rows; colour steps come from --dv-seq-* so it re-themes. Hover or arrow-key through days (←→ week, ↑↓ day, Home/End); each cell has a full spoken label. Pair with Sparkline for trend and BarChart for comparison. */
export interface HeatmapPoint { /** 'YYYY-MM-DD' or Date. Duplicates on one day are summed. */ date: string | Date; value: number }
export interface HeatmapProps {
  data: HeatmapPoint[];
  /** @default 20 */
  weeks?: number;
  /** Last day shown. @default latest date in data (or today) */
  end?: string | Date;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStart?: 0 | 1;
  /** Month / weekday / date names. @default 'en' */
  locale?: string;
  /** Group name, shown after the total. @default 'Activity' */
  label?: string;
  /** e.g. "sessions" — used in total, tooltip and aria labels */
  unit?: string;
  format?: (v: number) => string;
  /** Level colours, index 0 = empty. @default HEATMAP_COLORS (sunken + 4 sequential steps) */
  colors?: string[];
  /** Fixed lower bounds for levels 2…n-1 (any value > 0 is level 1). Default scales to the max in range. */
  thresholds?: number[];
  /** Max cell size in px — grid is fluid below that. @default 16 */
  cellMax?: number;
  showTotal?: boolean;
  showLegend?: boolean;
  onCellClick?: (cell: { date: string; value: number }) => void;
  className?: string;
}
export declare function Heatmap(props: HeatmapProps): JSX.Element;
export declare const HEATMAP_COLORS: string[];

// HierarchyNavigator/HierarchyNavigator.d.ts
export interface HierarchyNode { id: string; label: React.ReactNode; description?: React.ReactNode; icon?: string; children?: HierarchyNode[] }
/** Drill-down picker for deep taxonomies (category → subcategory → item) in a narrow space — one level at a time, path crumbs on top, → / ← (or Backspace) drill in / out. Leaves select. Use TreeView when users need to see several levels at once. */
export interface HierarchyNavigatorProps {
  data: HierarchyNode[];
  /** Selected leaf id */
  value?: string | null;
  onSelect?: (id: string, node: HierarchyNode, path: HierarchyNode[]) => void;
  /** @default 'All' */
  rootLabel?: string;
  className?: string;
}
export declare function HierarchyNavigator(props: HierarchyNavigatorProps): JSX.Element;

// Icon/Icon.d.ts
/** Velvet Icons glyph as inline SVG. Inherits currentColor; 24px grid, 1.75 stroke. For plain HTML use <i class="vui-icon icon-NAME">. */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Velvet icon name, e.g. "arrow-right". See VelvetIcons for the full list. */
  name: 'plus'|'minus'|'x'|'check'|'chevron-down'|'chevron-up'|'chevron-left'|'chevron-right'|'arrow-right'|'arrow-left'|'arrow-up'|'arrow-down'|'external-link'|'menu'|'more-horizontal'|'more-vertical'|'search'|'settings'|'sliders'|'filter'|'home'|'layout-dashboard'|'layout-grid'|'list'|'kanban'|'folder'|'file'|'inbox'|'mail'|'bell'|'calendar'|'clock'|'user'|'users'|'shield'|'lock'|'log-out'|'eye'|'eye-off'|'pencil'|'trash-2'|'copy'|'link'|'download'|'upload'|'refresh'|'tag'|'image'|'bar-chart'|'globe'|'monitor'|'sun'|'moon'|'heart'|'star'|'sparkles'|'play'|'info'|'circle-check'|'circle-x'|'triangle-alert'|'grip-vertical'|'command'|'code'|'maximize'|'pause'|'send'|'bold'|'italic'|'underline'|'strikethrough'|'list-ordered'|'align-left'|'align-center'|'align-right'|'chevrons-left'|'chevrons-right'|'circle-help'|'zoom-in'|'languages'|'map-pin'|'pin'|'message-square'|'palette'|'database'|'rotate-ccw'|'log-in'|'chevrons-up-down'|'caret-up'|'caret-down'|'swap-vertical'|'check-double'|'clipboard'|'cloud-upload'|'share'|'git-branch'|'git-merge'|'save'|'alert-circle'|'unlock'|'zap'|'target'|'shield-check'|'file-text'|'book-open'|'briefcase'|'calendar-plus'|'phone'|'star-filled'|'user-circle'|'handshake'|'trending-up'|'dollar-sign'|'wand'|'sitemap'|'server'|'building'|'graduation-cap'|'thumbs-up'|'close'|'trash'|'edit'|'alert-triangle'|'check-circle'|'x-circle'|'help-circle'|'grid'|'user-plus'|'key'|'paperclip'|'bookmark'|'flag'|'folder-open'|'arrow-up-right'|'at-sign'|'layers'|'megaphone'|'id-card'|'compass'|'video'|'mic'|'volume'|'stop'|'skip-forward'|'home-filled'|'bell-filled'|'user-filled'|'folder-filled'|'briefcase-filled'|'person-filled'|'desktop-filled'|'graduation-cap-filled'|'bookmark-filled'|'heart-filled'|'message-square-filled'|'kanban-filled'|'calendar-filled'|'book-open-filled'|'file-text-filled'|'attach'|'badge'|'chat'|'message'|'warning'|'success'|'error'|'help'|'logout'|'expand';
  /** Pixel size. @default 1.15em */
  size?: number | string;
  color?: string;
  /** @default 1.75 — use 1.5 at ≥32px, 2 at ≤14px */
  strokeWidth?: number;
  /** Accessible label; omit for decorative icons */
  label?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
/** Raw SVG inner markup per icon name */
export declare const VelvetIcons: Record<string, string>;
/** Icon names grouped by category */
export declare const IconCategories: Record<string, string[]>;
/** Legacy alias names (close, trash, edit, alert-triangle, check-circle, x-circle, help-circle, grid, attach, badge, chat, message, warning, success, error, help, logout, expand) → canonical Velvet name. Prefer canonical names in new code. */
export declare const IconAliases: Record<string, string>;
/** Base names that have a `<name>-filled` twin (home, bell, user, folder, bookmark, heart, message-square, star). Filled = selected state only (active BottomNav tab, mobile Navbar rail, pressed ToggleButton) — never decoration. */
export declare const IconFilled: string[];
/** Returns `<name>-filled` when `on` and a filled twin exists, else `name`. */
export declare function filledIcon(name: string, on?: boolean): string;

// IconButton/IconButton.d.ts
/** Square icon-only button. Always pass an accessible label. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Velvet icon name or node */
  icon: string | React.ReactNode;
  /** Accessible label (also used as title) */
  label: string;
  /** raised = floating over content (carousel arrows) · overlay = on media / dark scrims (lightbox). @default 'ghost' */
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'raised' | 'overlay';
  /** circle for floating nav arrows / media controls. @default 'square' */
  shape?: 'square' | 'circle';
  /** xs 24 · sm 32 · md 40 · lg 48. xs is for dense rows, table cells and chips. @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
export declare function IconButton(props: IconButtonProps): JSX.Element;

// IconTile/IconTile.d.ts
/**
 * Atom. A glyph in a tinted box — the leading visual of notification rows, data-source rows, feature cards, confirm dialogs, file rows.
 * No tone = neutral (subtle ground, secondary ink). Tones read --tone-bg / --tone-fg.
 */
export interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: string | React.ReactNode;
  tone?: Tone;
  /** sm 32 · md 36 · lg 40 · xl 48 · 2xl 56 · 3xl 72 (empty / status heroes). @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Soft tinted halo around the tile — empty states, status heroes. true = md */
  halo?: boolean | 'md' | 'lg';
  /** @default 'square' */
  shape?: 'square' | 'circle';
  /** Hairline border — for brand / source logos on a neutral ground */
  outline?: boolean;
  /** Custom ink (brand colour of a source) — wins over tone fg */
  color?: string;
}
export declare function IconTile(props: IconTileProps): JSX.Element;

// ImageCropper/ImageCropper.d.ts
/**
 * Crop an image to a fixed aspect (avatars, covers, thumbnails). The frame stays put; the image pans (drag, arrows, ⇧ for bigger steps) and zooms (Slider, wheel, + / −) behind it and can never leave a gap.
 * Rotate in 90° steps. onCropChange reports the crop in source pixels of the (rotated) image — feed it to canvas drawImage or your image service.
 */
export interface CropArea { x: number; y: number; width: number; height: number; zoom: number; rotation: number }
export interface ImageCropperProps {
  src: string;
  alt?: string;
  /** width / height. Ignored for circle. @default 1 */
  aspect?: number;
  /** circle = avatar mask (output is still the square). @default 'rect' */
  shape?: 'rect' | 'circle';
  /** Stage height px. @default 320 */
  height?: number;
  /** @default 1 */
  minZoom?: number;
  /** @default 4 */
  maxZoom?: number;
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  onCropChange?: (area: CropArea) => void;
  /** @default true */
  rotatable?: boolean;
  className?: string;
}
export declare function ImageCropper(props: ImageCropperProps): JSX.Element;

// ImportSourcesDialog/ImportSourcesDialog.d.ts
export interface ImportSource { id: string; name: string; description?: string; icon?: string; color?: string; status: 'connected' | 'available' | 'error'; /** Items available to import */ count?: number; error?: string; defaultSelected?: boolean }
/** Dialog checklist of import sources grouped Connected / Available. Connected rows are selectable; available/errored rows show Connect / Reconnect (async). Footer sums the selection. */
export interface ImportSourcesDialogProps { open: boolean; onClose?: () => void; sources: ImportSource[]; /** On reject: selection kept, error inline, dialog stays open. */ onImport?: (ids: string[]) => void | Promise<void>; onConnect?: (id: string) => void | Promise<void>; title?: string }
export declare function ImportSourcesDialog(props: ImportSourcesDialogProps): JSX.Element;

// Indicator/Indicator.d.ts
/**
 * Atom. Anchors a Count or Dot to the corner of any element — icon, IconButton, Avatar, tab. Ring in --count-ring separates it from the host.
 * Use overlap="circle" for round hosts (avatars), "rect" for squares (icon buttons). Pair with an accessible label on the host.
 */
export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Number or short text. 0 / null hides it. */
  count?: number | string | null;
  /** Show a dot instead of a number (unread, presence) */
  dot?: boolean;
  /** @default 99 */
  max?: number;
  /** Count tones (brand, danger, success, inverse, neutral, soft) or Dot tones (success, warning…). @default 'brand' */
  tone?: string;
  /** Count size. @default 'sm' */
  size?: 'sm' | 'md';
  /** @default 'top-end' */
  placement?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';
  /** rect = corner of the box · circle = on the curve of a round host. @default 'rect' */
  overlap?: 'rect' | 'circle';
  /** Pull inside the host's bounds (for hosts with overflow:hidden) */
  inset?: boolean;
  /** Announces the indicator, e.g. "3 unread" */
  label?: string;
  children: React.ReactNode;
}
export declare function Indicator(props: IndicatorProps): JSX.Element;

// InlineEdit/InlineEdit.d.ts
/** Click-to-edit value — no separate form or modal. Enter/blur saves, Esc cancels, focus returns to the value. Brief ✓ confirms a save. */
export interface InlineEditProps {
  value?: string;
  defaultValue?: string;
  /** May return a Promise — the field stays open and locked while pending; on reject the draft is kept and the error shows inline. If disabled while editing, the draft is kept and only Cancel remains. */
  onSave?: (value: string) => void | Promise<void>;
  /** @default 'Click to add…' */
  placeholder?: string;
  /** Accessible name — e.g. "Project title" */
  label?: string;
  /** sm = table cell · md = body · lg = page title (display font) */
  size?: 'sm' | 'md' | 'lg';
  /** Return an error string to block the save */
  validate?: (value: string) => string | undefined | null | false;
  disabled?: boolean;
  className?: string;
}
export declare function InlineEdit(props: InlineEditProps): JSX.Element;

// Input/Input.d.ts
/** Text field with label, hint, icons, prefix/suffix and validation. Hint/error lane is fixed-height when `validate`, `reserveHint` or `showCount` is set, so errors never reflow the form. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: string;
  hint?: string;
  /** Controlled error message (overrides `validate`) */
  error?: string;
  optional?: boolean;
  iconLeft?: string | React.ReactNode;
  iconRight?: string | React.ReactNode;
  /** Text inside the field, before the value — "$", "velvet.app/" */
  prefix?: React.ReactNode;
  /** Text inside the field, after the value — "USD / mo", "kg" */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** @deprecated Use Textarea. */
  multiline?: boolean;
  rows?: number;
  /** Focusable and selectable, not editable. Dashed border, secondary text. */
  readOnly?: boolean;
  /** Return an error string or undefined. Runs on blur, then on every change once touched. */
  validate?: (value: string) => string | undefined | null | false;
  /** Always reserve the 18px message lane (use in forms that validate on submit). */
  reserveHint?: boolean;
  /** Live "n / maxLength" counter, right of the hint. Requires maxLength. */
  showCount?: boolean;
  maxLength?: number;
}
export declare function Input(props: InputProps): JSX.Element;

// CodeLabel/CodeLabel.d.ts
/** Code + small tag chip + name, with an initials or logo mark. Clickable when onClick is set. */
export interface CodeLabelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  code: string;
  name?: React.ReactNode;
  /** Short tag shown as a chip next to the code, e.g. a region or a category */
  tag?: string;
  /** Logo node, or text for the initials tile. Defaults to the code. */
  mark?: React.ReactNode;
  showMark?: boolean;
  /** Extra text after the name, e.g. account or source */
  meta?: React.ReactNode;
  size?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export declare function CodeLabel(props: CodeLabelProps): JSX.Element;

// Kanban/Kanban.d.ts
export interface KanbanColumn { id: string; title: string; /** Status dot colour — e.g. 'var(--dv-2)' */ color?: string; /** WIP limit — count turns warning when exceeded */ limit?: number }
export interface KanbanCard { id: string | number; column: string; title?: React.ReactNode; tag?: string; tagTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'; meta?: React.ReactNode; assignee?: React.ReactNode; [key: string]: any }
/** Column task board. Drag & drop with a drop-position ghost, or keyboard: ↑↓ focus cards, Ctrl/⌘/Alt + ←→ move between columns, + ↑↓ reorder. Moves are announced. Controlled: you own cards. */
export interface KanbanProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardsChange?: (cards: KanbanCard[]) => void;
  onCardClick?: (card: KanbanCard) => void;
  /** Replace the default card body */
  renderCard?: (card: KanbanCard) => React.ReactNode;
  /** Shows + in each column header */
  onAddCard?: (columnId: string) => void;
  className?: string;
}
export declare function Kanban(props: KanbanProps): JSX.Element;

// Kbd/Kbd.d.ts
/** Keyboard key(s). keys="mod+k" renders ⌘ K on Mac, Ctrl K elsewhere. Aliases: mod cmd ctrl alt shift enter esc up down left right tab backspace space. */
export interface KbdProps { keys?: string | string[]; children?: React.ReactNode; size?: 'sm' | 'md';
  /** No key cap — bare shortcut text for menus, command palette, tooltips (inherits colour). @default false */
  plain?: boolean;
  className?: string }
export declare function Kbd(props: KbdProps): JSX.Element;

// Lightbox/Lightbox.d.ts
export interface LightboxImage { src: string; thumb?: string; alt?: string; caption?: string; /** ImageGrid: span N×N cells */ span?: number; /** ImageGrid masonry: tile aspect-ratio, e.g. '3 / 4' */ ratio?: string; /** ImageGrid: floating glass label, e.g. 'Cover' */ badge?: string }
/** Full-screen image viewer: ←→ / Esc, click to zoom, thumbnail strip, focus trapped and restored. Controlled by index (−1 / null = closed). */
export interface LightboxProps { images: LightboxImage[]; index: number | null; onIndexChange?: (i: number) => void; onClose?: () => void }
export declare function Lightbox(props: LightboxProps): JSX.Element | null;
/** Image grid that opens the Lightbox. uniform = equal tiles (+ optional span), feature = 1 hero + 2 thumbs, masonry = columns of natural heights. max collapses the overflow into a "+N" tile. */
export interface ImageGridProps { images: LightboxImage[]; /** @default 'uniform' */ layout?: 'uniform' | 'feature' | 'masonry'; /** uniform / masonry column count. @default 3 */ columns?: number; /** px. @default 8 */ gap?: number; /** uniform tile ratio. @default '4 / 3' */ ratio?: string; /** feature container ratio. @default '16 / 9' */ featureRatio?: string; /** Show at most N tiles; the last becomes "+rest". feature always shows 3. */ max?: number; /** @default true */ lightbox?: boolean; className?: string }
export declare function ImageGrid(props: ImageGridProps): JSX.Element;

// LineChart/LineChart.d.ts
/** Line / area chart with crosshair. Mouse, or focus + ←→ Home End, moves the crosshair; the value is announced. "Table" toggle shows the same data as an accessible table with period-over-period Δ. */
export interface LineChartProps {
  data: Array<{ label: string; [key: string]: any }>;
  series?: ChartSeries[];
  /** px. @default 240 */
  height?: number;
  format?: (v: number) => string;
  /** Gradient fill under the first series. @default true */
  area?: boolean;
  /** @default true */
  curved?: boolean;
  /** Axis starts at 0 (default). false fits the axis to the data — use for equity / price levels. Negative values are always supported. @default true */
  includeZero?: boolean;
  /** Start in table view */
  showTable?: boolean;
  label?: string;
  className?: string;
}
export declare function LineChart(props: LineChartProps): JSX.Element;

// Link/Link.d.ts
/**
 * Text link on --fg-link. Inline in prose or standalone as a call-to-action.
 * For navigation lists use Anchor / Breadcrumb / Tabs; for actions that don't navigate use Button variant="ghost".
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  /** default — faint underline, solid on hover (prose) · plain — underline on hover only (UI) · quiet — secondary text colour (meta, footers). @default 'default' */
  variant?: 'default' | 'plain' | 'quiet';
  /** Semibold, no underline, trailing arrow that nudges on hover. "View all", "Read more". */
  standalone?: boolean;
  /** Opens in a new tab, adds external-link icon + screen-reader hint */
  external?: boolean;
  /** Renders without href, aria-disabled, not focusable */
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function Link(props: LinkProps): JSX.Element;

// List/List.d.ts
export interface ListItem { id: string | number; title: React.ReactNode; description?: React.ReactNode; /** Avatar, icon or Checkbox */ leading?: React.ReactNode; /** Badge, time, IconButton… */ trailing?: React.ReactNode; href?: string; disabled?: boolean }
/** Lightweight rows for people, files, contacts, settings — when a Table's columns would be overkill. Pass onValueChange (selectable, uses value) or onItemClick (plain actions) to make rows interactive. */
export interface ListProps {
  items: ListItem[];
  /** Selected item id */
  value?: string | number;
  onValueChange?: (id: string | number) => void;
  onItemClick?: (item: ListItem) => void;
  /** Hairline between rows. @default true */
  divided?: boolean;
  /** 'sm' 40px · 'md' 56px rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Text when items is empty */
  empty?: React.ReactNode;
  label?: string;
  className?: string;
}
export declare function List(props: ListProps): JSX.Element;

// ListItem/ListItem.d.ts
/**
 * Atom. One row: leading (Avatar / IconTile / Checkbox / Swatch) · title · description · meta · trailing (Badge, Count, IconButton…).
 * List renders it; NotificationCenter, ImportSourcesDialog, ColorLabelManager and other pattern rows compose it instead of hand-rolled flex rows.
 * Interactive when it renders as button / a / label (hover, pressed, focus ring).
 */
export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Element — defaults to a (href), button (onClick) or div. 'label' wraps a Checkbox so the whole row toggles it. */
  as?: 'div' | 'button' | 'a' | 'label' | 'li';
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Third line — timestamp, size, source */
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** sm 40 · md 56 min-height. @default 'md' */
  size?: 'sm' | 'md';
  /** start = top-align leading/trailing for multi-line rows. @default 'center' */
  align?: 'center' | 'start';
  /** Description line clamp. @default 1 */
  clamp?: number;
  href?: string;
}
export declare function ListItem(props: ListItemProps): JSX.Element;

// LoadMore/LoadMore.d.ts
/**
 * Incremental "Show more" footer for feeds and card lists — a quiet progress bar ("Showing 20 of 120") over a dashed
 * button; replaced by "All N shown" at the end. Use Pagination when users need to jump to a page or share a URL to one.
 */
export interface LoadMoreProps {
  /** Items currently rendered */
  shown: number;
  /** Items available. Renders nothing when 0 */
  total: number;
  /** Page size — the button reads "Show 20 more" (capped at what's left) */
  step?: number;
  onLoadMore?: () => void;
  /** Spinner on the button while the next page loads */
  loading?: boolean;
  /** Button text override */
  label?: React.ReactNode;
  /** End text. @default 'All {total} shown' */
  doneLabel?: React.ReactNode;
  /** @default (shown, total) => 'Showing ' + shown + ' of ' + total */
  format?: (shown: number, total: number) => React.ReactNode;
  className?: string;
}
export declare function LoadMore(props: LoadMoreProps): JSX.Element | null;

// Loader/Loader.d.ts
export type LoaderVariant = 'bike' | 'bouncing-dots' | 'concentric-pulse' | 'corner-pulse' | 'dual-plane' | 'ellipsis' | 'equalizer' | 'honeycomb' | 'jelly-triangle' | 'orbit-squares' | 'pulse-ring' | 'ripple-dots' | 'shape-trail' | 'shuffle-grid';
/**
 * Decorative brand loaders, ported 1:1 from the legacy VelvetUi (Solid) package — same geometry, timing and keyframes,
 * colour mapped to --action-primary. Use for page / hero / empty-wait moments; for inline/button waits use Spinner.
 * All honour prefers-reduced-motion (animation stops, shape stays visible).
 */
export interface LoaderProps {
  /** @default 'ripple-dots' */
  variant?: LoaderVariant;
  /** shape-trail only. @default 'circle' */
  shape?: 'circle' | 'triangle' | 'square';
  /** Uniform scale multiplier (CSS zoom) — native sizes are the legacy px sizes. @default 1 */
  scale?: number;
  /** 'current' = inherit text colour. @default 'brand' */
  tone?: 'brand' | 'current';
  /** Accessible label (role=status). @default 'Loading' */
  label?: string;
  /** Hide from assistive tech (when a parent already announces loading). */
  decorative?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Loader(props: LoaderProps): JSX.Element;
export declare const LOADER_VARIANTS: LoaderVariant[];
/** Full-screen (fixed, z-modal) or contained (absolute) page veil with a centred Loader. */
export interface PageLoaderProps { /** @default true */ fullScreen?: boolean; /** @default 'ripple-dots' */ variant?: LoaderVariant; label?: string; className?: string }
export declare function PageLoader(props: PageLoaderProps): JSX.Element;

// LocaleSwitcher/LocaleSwitcher.d.ts
/** Compact language toggle (PL / EN by default) with a sliding thumb; ←→ switch. Each option announces its native name. For 4+ languages use Select. */
export interface LocaleSwitcherProps { locales?: Array<{ value: string; label: string; name: string }>; value?: string; defaultValue?: string; onChange?: (locale: string) => void; size?: 'sm' | 'md'; className?: string }
export declare function LocaleSwitcher(props: LocaleSwitcherProps): JSX.Element;

// LogViewer/LogViewer.d.ts
/**
 * Streaming log tail on the code surface — line numbers, timestamps, level column, source, level toggles with counts, text filter with highlights, wrap toggle.
 * Follows new lines while scrolled to the bottom; scrolling up pauses and shows "N new" to jump back. Plain strings work — the level is detected from ERROR / WARN / INFO / DEBUG.
 */
export interface LogLine { message: string; level?: 'debug' | 'info' | 'warn' | 'error'; /** Date, epoch ms or preformatted string */ ts?: Date | number | string; /** Service / module */ source?: string }
export interface LogViewerProps {
  lines: Array<string | LogLine>;
  /** @default 'Logs' */
  title?: string;
  /** Body height. @default 320 */
  height?: number | string;
  /** Start pinned to the newest line. @default true */
  follow?: boolean;
  /** @default true */
  showTimestamps?: boolean;
  /** @default true */
  lineNumbers?: boolean;
  /** @default false */
  wrap?: boolean;
  /** Levels visible at start. @default all */
  levels?: Array<'debug' | 'info' | 'warn' | 'error'>;
  className?: string;
}
export declare function LogViewer(props: LogViewerProps): JSX.Element;

// Mark/Mark.d.ts
/** Atom. A highlighted run inside text: search hits, emphasis, @mentions. */
export interface MarkProps extends React.HTMLAttributes<HTMLElement> {
  /** highlight: tinted fill · text: brand colour, no fill · mention: chip-like. @default 'highlight' */
  variant?: 'highlight' | 'text' | 'mention';
}
export declare function Mark(props: MarkProps): JSX.Element;
/** Wraps the first case-insensitive match of query in a Mark */
export declare function highlightMatch(text: string, query?: string, variant?: MarkProps['variant']): React.ReactNode;

// Markdown/Markdown.d.ts
/**
 * Renders a Markdown string as Velvet-styled prose: ATX and setext headings (unique ids for Anchor: repeats get -1, -2…), paragraphs,
 * bold/italic (* and _)/strike, inline code, hard line breaks (two trailing spaces or \), links — inline, reference ([t][id], [t][], [id])
 * and autolinks (<url>, bare http(s)/www) — external ones open in a new tab, images, nested lists (ordered start kept), task lists
 * (inline formatting kept), blockquotes, fenced code, tables, rules.
 * HTML in the source is escaped and only http(s)/mailto/relative URLs are kept — safe for user or AI content.
 * The .vui-prose class can also wrap hand-written HTML.
 */
export interface MarkdownProps {
  source?: string;
  /** Alternative to source */
  children?: string;
  /** sm for comments/cards, lg for articles. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export declare function Markdown(props: MarkdownProps): JSX.Element;
/** The underlying renderer — returns an HTML string */
export declare function renderMarkdown(source: string): string;

// MarkdownEditor/MarkdownEditor.d.ts
/**
 * Markdown authoring field — Write · Split · Preview tabs, formatting toolbar, ⌘B / ⌘I / ⌘K / ⌘E shortcuts,
 * Enter continues lists (empty item ends the list), Tab / Shift+Tab indents list items. The preview IS <Markdown> —
 * same renderer, same sanitising (raw HTML escaped, only http/mailto/relative links), so what you write is what readers see.
 */
export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: string;
  /** Controlled view. */
  mode?: 'write' | 'split' | 'preview';
  /** @default 'split' — collapses to stacked panes under 640px */
  defaultMode?: 'write' | 'split' | 'preview';
  onModeChange?: (mode: 'write' | 'split' | 'preview') => void;
  /** Pane height. @default 280 */
  height?: number | string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  /** @default true */
  toolbar?: boolean;
  previewEmpty?: React.ReactNode;
  id?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
export declare function MarkdownEditor(props: MarkdownEditorProps): JSX.Element;
/**
 * Edit a Markdown field in a modal. Works on a draft: Save is disabled until something changed; closing a dirty draft asks
 * "Discard unsaved changes?"; ⌘↵ saves. onSave may return a Promise — while pending the editor locks and Save shows a spinner;
 * if it rejects the dialog stays open, the draft is kept and the error shows inline.
 */
export interface MarkdownEditDialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Initial value — the draft resets to it every time the dialog opens. */
  value?: string;
  onSave?: (value: string) => void | Promise<void>;
  saveLabel?: string;
  cancelLabel?: string;
  /** @default 'split' */
  defaultMode?: 'write' | 'split' | 'preview';
  /** @default 340 */
  height?: number | string;
  maxLength?: number;
  placeholder?: string;
  /** @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** @default true */
  confirmDiscard?: boolean;
}
export declare function MarkdownEditDialog(props: MarkdownEditDialogProps): JSX.Element;

// Marker/Marker.d.ts
/** Atom. Round step / event badge — a number, icon, avatar or dot in a circle. Stepper (step state) and Timeline (event tone / status) render it; use it for any numbered or iconed rail. */
export interface MarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** soft = tinted (events) · outline = todo / upcoming · solid = done / current / error. @default 'soft' */
  appearance?: 'soft' | 'outline' | 'solid';
  /** Colour. Omit for neutral. */
  tone?: Tone;
  /** Current-step halo */
  ring?: boolean;
  /** Surface-coloured separation ring — use when the marker sits over a rail line */
  gap?: boolean;
  /** Render a centred dot instead of children */
  dot?: boolean;
  children?: React.ReactNode;
}
export declare function Marker(props: MarkerProps): JSX.Element;

// Marquee/Marquee.d.ts
/** Infinite horizontal scroller (logo walls, testimonials). Content is duplicated once; the copy is aria-hidden. Pauses on hover; static under reduced motion. */
export interface MarqueeProps { children: React.ReactNode; /** px per second. @default 40 */ speed?: number; direction?: 'left' | 'right'; /** @default 48 */ gap?: number; pauseOnHover?: boolean; /** Edge fade mask. @default true */ fade?: boolean; label?: string; className?: string }
export declare function Marquee(props: MarqueeProps): JSX.Element;

// MediaFrame/MediaFrame.d.ts
/**
 * Fixed-ratio frame for an image, video or embed. Reserves space before load (no layout shift), shimmer while loading,
 * striped placeholder when empty or failed, glass play button over a video (with or without poster), top-right badge
 * (duration, "Live"), bottom overlay on a scrim, caption + credit. Ratios come from --aspect-*, styling from --media-*.
 */
export interface MediaFrameProps {
  src?: string;
  /** Required for meaningful images; '' marks decorative */
  alt?: string;
  /** @default 'image' */
  kind?: 'image' | 'video' | 'embed';
  /** Video only — still frame shown until play */
  poster?: string;
  /** Token name or any CSS ratio ("4/5"). @default 'video' */
  ratio?: 'square' | 'video' | 'photo' | 'portrait' | 'wide' | string;
  /** @default 'cover' */
  fit?: 'cover' | 'contain';
  /** object-position, e.g. "top" or "30% 50%" for focal point */
  position?: string;
  caption?: React.ReactNode;
  credit?: React.ReactNode;
  /** Bottom content on a scrim — title, author */
  overlay?: React.ReactNode;
  /** Small pill top-right — duration, "Live", count */
  badge?: React.ReactNode;
  /** Force the shimmer (data still fetching) */
  loading?: boolean;
  /** Text in the empty placeholder */
  placeholder?: React.ReactNode;
  /** Print the ratio ("16 : 9") in the empty placeholder — for layout specs */
  showRatio?: boolean;
  /** Play button size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default true */
  rounded?: boolean;
  bordered?: boolean;
  /** Accessible name for video/embed */
  title?: string;
  onPlay?: () => void;
  /** Custom fallback shown when empty or on error */
  children?: React.ReactNode;
  className?: string;
}
export declare function MediaFrame(props: MediaFrameProps): JSX.Element;

// MentionInput/MentionInput.d.ts
/**
 * Multi-line field with @mention (and optional #tag) suggestions. Typing a trigger opens a listbox at the caret; ↑↓ move, ↵ / Tab insert, Esc closes.
 * Known mentions are highlighted in place (--mark-mention-bg). The value stays plain text ("@Anna Kowal"), so it round-trips through any backend.
 * CommentThread renders the same highlight when displaying the text.
 */
export interface MentionOption { id?: string; label: string; description?: string; /** Avatar image (@) */ src?: string; /** Icon name (# and custom triggers). @default 'tag' */ icon?: string }
export interface MentionInputProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Options for @ */
  users?: MentionOption[];
  /** Options for # */
  tags?: MentionOption[];
  /** Custom triggers — overrides users/tags, e.g. { '@': people, '/': commands } */
  sources?: Record<string, MentionOption[]>;
  /** @default 3 */
  rows?: number;
  /** @default 8 */
  maxRows?: number;
  placeholder?: string;
  /** @default 6 */
  maxResults?: number;
  onMention?: (option: MentionOption, trigger: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function MentionInput(props: MentionInputProps): JSX.Element;

// Menu/Menu.d.ts
export interface MenuItem {
  label?: React.ReactNode;
  icon?: string | React.ReactNode;
  description?: React.ReactNode;
  /** Display-only hint, e.g. "⌘D" */
  shortcut?: string;
  onSelect?: () => void;
  /** Destructive — red text, red hover */
  danger?: boolean;
  disabled?: boolean;
  /** Makes it a menuitemcheckbox with a check column */
  checked?: boolean;
  /** Keep the menu open after selecting (checkbox lists) */
  keepOpen?: boolean;
  /** Renders a separator line (other fields ignored) */
  divider?: boolean;
  /** Renders a small group heading (other fields ignored) */
  section?: string;
}
/** Dropdown menu of actions attached to a trigger. ↑↓ / Home / End move, type to jump, Enter selects, Esc closes and refocuses the trigger. Panel sits on material-4. */
export interface MenuProps {
  /** Usually a Button or IconButton; receives aria-haspopup / aria-expanded. ↓ on the trigger opens. */
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'start' | 'end';
  side?: 'bottom' | 'top';
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Min panel width (px) */
  width?: number;
  /** Where item icons sit. end = label first, icon trailing on the right (row/action menus where the verb should lead). @default 'start' */
  iconPosition?: 'start' | 'end';
  className?: string;
}
export declare function Menu(props: MenuProps): JSX.Element;
/** The bare menu panel — for custom positioning (ContextMenu uses it). onClose(refocus) */
export interface MenuPanelProps { items: MenuItem[]; onClose?: (refocus: boolean) => void; style?: React.CSSProperties; className?: string; autoFocus?: boolean; iconPosition?: 'start' | 'end' }
export declare function MenuPanel(props: MenuPanelProps): JSX.Element;

// MenuChip/MenuChip.d.ts
/** Filter chip that opens a single-choice menu — "Status: Open ▾". Tinted when a value is set. Use in filter bars; for always-visible options use ChipGroup. */
export interface MenuChipProps {
  /** Dimension name — "Status" */
  label: string;
  options: Array<string | { value: string; label: string; icon?: string }>;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Adds an "Any" item that clears. @default true */
  allowClear?: boolean;
  /** @default 'Any' */
  clearLabel?: string;
  icon?: string;
  className?: string;
}
export declare function MenuChip(props: MenuChipProps): JSX.Element;

// Meter/Meter.d.ts
/** Atom. Track + fill for a known quantity (skill level, rating share, quota). Progress is the task-progress component; Meter is the bare bar. */
export interface MeterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  /** @default 100 */
  max?: number;
  /** Fill colour. @default brand */
  tone?: Tone;
  /** sm 4px · md 6px · lg 8px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Split into N segments (password strength) */
  steps?: number;
  /** Sweep highlight while loading */
  shimmer?: boolean;
  /** Rating fill colour */
  rating?: boolean;
  /** Unknown amount — a 40% fill sweeps the track (Progress uses this) */
  indeterminate?: boolean;
  /** Accessible name — omit when a sibling already states the value */
  label?: string;
}
export declare function Meter(props: MeterProps): JSX.Element;

// MetricGroup/MetricGroup.d.ts
export interface MetricItem { label: React.ReactNode; value: React.ReactNode; /** Colour value by market direction */ dir?: 'up' | 'down' | 'flat' }
/** Compact grid of small KPIs (value over caption). Lighter than Stat — for cards, calculators and summaries. */
export interface MetricGroupProps extends React.HTMLAttributes<HTMLDListElement> {
  items: MetricItem[];
  /** Fixed column count; otherwise auto-fit by minWidth */
  columns?: number;
  /** @default 120 */
  minWidth?: number;
  size?: 'sm' | 'md' | 'lg';
  /** subtle = tinted panel background */
  variant?: 'plain' | 'subtle';
}
export declare function MetricGroup(props: MetricGroupProps): JSX.Element;

// Money/Money.d.ts
/** Monetary amount with currency, tabular figures and privacy masking. Wrap a screen in <MoneyPrivacy hidden> to mask every Money inside at once (screen sharing). */
export interface MoneyProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  amount: number | null | undefined;
  /** ISO code, e.g. "PLN", "USD", "EUR" */
  currency?: string;
  digits?: number;
  /** Prefix + for positive amounts */
  signed?: boolean;
  /** Colour by sign with trend tokens */
  colored?: boolean;
  /** 12.4k · 1.32 m · 3.40 bn */
  compact?: boolean;
  /** Overrides the MoneyPrivacy context */
  hidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  strong?: boolean;
  /** code → "1,200.00 USD" · symbol → "$1,200.00". @default 'code' */
  currencyDisplay?: 'code' | 'symbol';
  /** BCP 47 locale for the number, e.g. 'pl-PL'. @default 'en-US' */
  locale?: string;
}
export declare function Money(props: MoneyProps): JSX.Element;
export interface MoneyPrivacyProps { hidden?: boolean; children?: React.ReactNode }
/** Context provider: masks every Money below it. */
export declare function MoneyPrivacy(props: MoneyPrivacyProps): JSX.Element;
export declare function useMoneyHidden(): boolean;

// MultiSelect/MultiSelect.d.ts
/** Pick many from a searchable list. Selected values show as removable tags in the field; checkbox rows in the menu; footer shows count + Clear. Async via loadOptions (debounced, skeleton, error/retry) — labels of picked items are cached across searches. */
export interface MultiSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  options?: Array<string | { value: string; label: string; description?: string; icon?: string }>;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string[]) => void;
  loadOptions?: (query: string) => Promise<Array<string | { value: string; label: string; description?: string; icon?: string }>>;
  placeholder?: string;
  emptyText?: string;
  /** Cap on selections; unpicked rows disable at the cap */
  max?: number;
  /** Allow free entries: typing a value not in options shows an “Add …” row (Enter adds it as a tag) */
  creatable?: boolean;
  /** Verb for the create row. Default 'Add' */
  createLabel?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function MultiSelect(props: MultiSelectProps): JSX.Element;

// Navbar/Navbar.d.ts
export interface NavbarItem { id: string; label: string; /** Velvet icon name (required for variant="menubar") or a custom node (e.g. a filled SVG at 1em, fill="currentColor") — menubar only */ icon?: string | React.ReactNode; href?: string }
/** Top app bar. variant="links" (default): brand · text links · actions; tone="brand" paints it brand-coloured. variant="menubar": brand-filled 3-column bar — full logo (+ optional current-page label) · centred ICON menu — sliding glass indicator (the active icon drops into a ring that hangs below the bar) · actions: NotificationCenter, SearchTrigger (→ CommandPalette), NavbarUser, NavbarLocale all restyle for the brand fill. Both collapse to a burger under 720px, or always with condensed. Leave ~14px of space below a menubar navbar for the indicator. */
export interface NavbarProps {
  /** @default 'links' */
  variant?: 'links' | 'menubar';
  brand?: React.ReactNode;
  /** menubar: the brand mark, rendered bare on the bar — pass the full lockup, e.g. <BrandLogo brand="recron" tone="inverse" size={28} />. A string renders as display-font wordmark. */
  logo?: React.ReactNode;
  /** menubar: makes the logo a home link */
  logoHref?: string;
  onLogoClick?: () => void;
  items?: NavbarItem[];
  /** id of the current item */
  active?: string;
  /** Called with the item id; the link's default navigation is cancelled */
  onNavigate?: (id: string) => void;
  /** Right-hand slot */
  actions?: React.ReactNode;
  /** menubar: show the current item's label next to the logo. @default true */
  showActiveLabel?: boolean;
  /** menubar: override the label text */
  activeLabel?: React.ReactNode;
  /** Force the mobile layout (burger + overlay) at any width */
  condensed?: boolean;
  /** links only. @default 'default' */
  tone?: 'default' | 'brand';
  sticky?: boolean;
  /** Landmark name. @default 'Main' */
  label?: string;
  className?: string;
}
export declare function Navbar(props: NavbarProps): JSX.Element;
/** Glass locale pill for the menubar navbar's actions slot. */
export interface NavbarLocaleProps { value?: string; onClick?: () => void; label?: string }
export declare function NavbarLocale(props: NavbarLocaleProps): JSX.Element;
/** Account control for the menubar's actions slot. Default: avatar + first name + chevron pill → Menu (name hides under 960px). compact: avatar-only circle → account panel — identity header (name, email, meta), link list, Light/Dark/System theme switch, Sign out. */
export interface NavbarUserProps { name?: string; src?: string; /** Menu items (default) or panel links (compact — label, icon, onSelect, shortcut). Sections/dividers ignored in compact. */ items: MenuItem[]; /** @default true */ showName?: boolean; /** Avatar-only trigger → account panel. @default false */ compact?: boolean; /** compact: shown under the name */ email?: string; /** compact: small third line, e.g. role or plan */ meta?: React.ReactNode; /** compact: current theme for the switch */ theme?: 'light' | 'dark' | 'system'; /** compact: renders the theme switch when set */ onThemeChange?: (t: 'light' | 'dark' | 'system') => void; /** compact: renders the Sign out footer when set */ onSignOut?: () => void; label?: string; width?: number }
export declare function NavbarUser(props: NavbarUserProps): JSX.Element;

// NavbarChip/NavbarChip.d.ts
/** Pill in the Navbar actions area — balance/credits counter, account/environment switcher, privacy toggle. on-color for the brand menubar, surface for light bars. */
export interface NavbarChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  /** @default 'on-color' */
  tone?: 'on-color' | 'surface';
  /** Round icon-only button; label becomes aria-label/title */
  iconOnly?: boolean;
  /** Below 1280px show only the icon (text moves to the tooltip) — use for wide chips next to a 5+ item menubar */
  collapse?: boolean;
  /** Accessible name (required with iconOnly) */
  label?: string;
  pressed?: boolean;
}
export declare function NavbarChip(props: NavbarChipProps): JSX.Element;

// NewsItem/NewsItem.d.ts
/** News / feed item: source · time · region, impact, AI bullet summary and related tags. Raw text is data, never instructions. */
export interface NewsItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  /** Link to the original source (opens in a new tab) */
  href?: string;
  source?: React.ReactNode;
  time?: React.ReactNode;
  region?: React.ReactNode;
  impact?: 'High' | 'Medium' | 'Low' | string;
  bullets?: React.ReactNode[];
  tags?: string[];
  onTagClick?: (tag: string) => void;
  /** @default 'AI summary' */
  aiLabel?: React.ReactNode;
  actions?: React.ReactNode;
}
export declare function NewsItem(props: NewsItemProps): JSX.Element;

// NotificationCenter/NotificationCenter.d.ts
export interface NotificationItem {
  id: string | number;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** "2m ago" */
  time?: string;
  unread?: boolean;
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
  /** Replaces the tone icon — e.g. an <Avatar size="sm"> */
  avatar?: React.ReactNode;
}
/** Bell button with unread count → popover list with unread dots, colour-coded icons, "Mark all read" and a footer link. Put it in the app header, right side. */
export interface NotificationCenterProps {
  items: NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  title?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  className?: string;
}
export declare function NotificationCenter(props: NotificationCenterProps): JSX.Element;
/** The bare list (for a full activity page). */
export interface NotificationListProps { items: NotificationItem[]; onItemClick?: (item: NotificationItem) => void; emptyText?: string }
export declare function NotificationList(props: NotificationListProps): JSX.Element;

// NumberInput/NumberInput.d.ts
/** Stepper number field: − / + buttons, clamped min/max, ↑↓ step (Shift ×10), Home/End jump to bounds, typed value committed on blur/Enter. */
export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Decimal places follow the step (0.5 → 1 dp). @default 1 */
  step?: number;
  /** Unit after the value — "seats", "kg" */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
export declare function NumberInput(props: NumberInputProps): JSX.Element;

// Option/Option.d.ts
/**
 * Atom. One row inside any listbox or menu — icon, label, description, shortcut, check, active/selected/danger/disabled.
 * Menu items, Select options, Autocomplete and CommandPalette rows all share this row (tokens: --option-*).
 */
export interface OptionProps extends React.HTMLAttributes<HTMLElement> {
  /** Root element. @default 'div' — Listbox renders 'li' */
  as?: React.ElementType;
  /** Extra content before the icon (Checkmark, country code…) */
  leading?: React.ReactNode;
  /** Extra content after the label / shortcut (dial code, count…) */
  trailing?: React.ReactNode;
  /** Show a check at the end when selected (Listbox rows) */
  checkEnd?: boolean;
  /** Velvet icon name or node */
  icon?: React.ReactNode;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** e.g. "⌘K" */
  shortcut?: React.ReactNode;
  selected?: boolean;
  /** Keyboard-highlighted (aria-activedescendant target) */
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  /** Reserve a leading check column and show it when selected */
  showCheck?: boolean;
  /** @default 'option' — use 'menuitem' / 'menuitemcheckbox' inside menus */
  role?: 'option' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  children?: React.ReactNode;
}
export declare function Option(props: OptionProps): JSX.Element;

// Listbox/Listbox.d.ts
/** Atom. Floating list under a field: the one panel, row, empty and loading state shared by Select, Autocomplete, MultiSelect, PhoneInput, SearchInput, TimePicker, Cascader and TreeSelect. */
export interface ListboxPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'div' */
  as?: React.ElementType;
  /** Open above the field. Omit to flip automatically (less than 260px below and more room above). */
  up?: boolean;
  /** @default true */
  flip?: boolean;
}
export declare const ListboxPanel: React.ForwardRefExoticComponent<ListboxPanelProps & React.RefAttributes<HTMLElement>>;
export interface ListboxProps extends React.HTMLAttributes<HTMLUListElement> {
  /** true = a floating ListboxPanel; false = bare list inside a panel you own. @default true */
  floating?: boolean;
  multiselectable?: boolean;
  up?: boolean;
  flip?: boolean;
}
export declare const Listbox: React.ForwardRefExoticComponent<ListboxProps & React.RefAttributes<HTMLUListElement>>;
/** Option as <li role="option">; mousedown keeps focus in the field. */
export interface ListboxOptionProps extends OptionProps {
  /** Check at the end when selected. @default true */
  checkEnd?: boolean;
}
export declare function ListboxOption(props: ListboxOptionProps): JSX.Element;
export interface ListboxEmptyProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Style as a failure (put a link Button inside for Retry) */
  error?: boolean;
}
export declare function ListboxEmpty(props: ListboxEmptyProps): JSX.Element;
export declare function ListboxSkeleton(props: { rows?: number }): JSX.Element;

// OptionSwitcher/OptionSwitcher.d.ts
export interface SwitcherOption { value: string; label?: React.ReactNode; icon?: string; disabled?: boolean; /** list variant: second line under the label */ description?: React.ReactNode; /** list variant: shown instead of the description while the option is disabled; adds a lock icon when the option has none */ disabledReason?: React.ReactNode }
/** Required single choice among 2–5 options (radiogroup; ←→ move + select). track = segmented tool track (view modes, alignment, icon tools) · chips = separate pills (plan, period, size) · tiles = icon-first square tiles, icon above label (work mode, layout, device — the IconOptionSwitcher pattern) · list = vertical choices with a description, and a reason when an option is locked. Use Tabs when the choice swaps page panels; ChipGroup for multi-select filters. */
export interface OptionSwitcherProps {
  options: Array<string | SwitcherOption>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'track' */
  variant?: 'track' | 'chips' | 'tiles' | 'list';
  size?: 'sm' | 'md';
  /** Icons only; label becomes aria-label + title. Every option needs an icon and a string label. */
  iconOnly?: boolean;
  /** Accessible group name */
  label?: string;
  className?: string;
}
export declare function OptionSwitcher(props: OptionSwitcherProps): JSX.Element;

// OtpInput/OtpInput.d.ts
/** One-time-code boxes: auto-advance, Backspace steps back, ←→ move, paste fills from the focused box. Uses autocomplete="one-time-code" so SMS codes autofill on mobile. */
export interface OtpInputProps {
  /** @default 6 */
  length?: number;
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once every box is filled */
  onComplete?: (code: string) => void;
  /** Digits only. false = A–Z/0–9, upper-cased. @default true */
  numeric?: boolean;
  /** Index where a visual gap is inserted. Default 3 for 6 boxes, 4 for 8, none otherwise. 0 = no gap. */
  groupAt?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}
export declare function OtpInput(props: OtpInputProps): JSX.Element;

// PageHeader/PageHeader.d.ts
export interface PageHeaderMeta { icon?: string; label: React.ReactNode }
/** Masthead of a view, top to bottom: breadcrumb · back button + title + status · description · meta row (owner, due date, members…) · actions on the right · optional section tabs on the bottom edge. Every region is optional — the minimum is just a title. Always sits on its own raised card surface. Wraps on small screens. */
export interface PageHeaderProps {
  /** Location trail above the title; last item = current page */
  breadcrumb?: BreadcrumbItem[];
  /** Small context line above the title when there is no breadcrumb */
  eyebrow?: React.ReactNode;
  /** Shows a back button left of the title */
  onBack?: () => void;
  /** @default 'Back' */
  backLabel?: string;
  title: React.ReactNode;
  /** Pill next to the title: 'Active' | { label, tone } | any node */
  status?: React.ReactNode | { label: React.ReactNode; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' };
  description?: React.ReactNode;
  /** Icon + text facts under the title */
  meta?: PageHeaderMeta[];
  /** Right-aligned buttons — one primary at most */
  actions?: React.ReactNode;
  /** Section tabs on the bottom edge */
  tabs?: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}
export declare function PageHeader(props: PageHeaderProps): JSX.Element;

// PeriodNav/PeriodNav.d.ts
/** Single previous / next arrow (IconButton with the right glyph and default label). */
export interface PeriodNavButtonProps extends Omit<IconButtonProps, 'icon' | 'label'> {
  /** @default 'prev' */
  dir?: 'prev' | 'next';
  label?: string;
}
export declare function PeriodNavButton(props: PeriodNavButtonProps): JSX.Element;
/** Today + previous / next for months, weeks and days (Scheduler, CalendarOrganizer). */
export interface PeriodNavProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onPrev?: () => void;
  onNext?: () => void;
  /** Shows the Today button when set */
  onToday?: () => void;
  /** Accessible names — say the unit ("Previous week"). @default 'Previous' / 'Next' / 'Today' */
  prevLabel?: string;
  nextLabel?: string;
  todayLabel?: string;
  /** IconButton variant. @default 'secondary' */
  variant?: IconButtonProps['variant'];
  /** Joined button group. @default true */
  attached?: boolean;
  /** @default 'sm' */
  size?: 'sm' | 'md';
}
export declare function PeriodNav(props: PeriodNavProps): JSX.Element;

// Pagination/Pagination.d.ts
/** Page navigation with truncation (1 … 4 5 6 … 20). Optional "1–20 of 243" range and rows-per-page select. compact = "Page 3 of 12" (auto under 640px for full). */
export interface PaginationProps {
  page?: number;
  defaultPage?: number;
  /** Or pass total + pageSize */
  pageCount?: number;
  onPageChange?: (page: number) => void;
  /** Pages either side of current. @default 1 */
  siblingCount?: number;
  /** Total rows — shows the range label */
  total?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** @default 'full' */
  variant?: 'full' | 'compact';
  className?: string;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
export declare function pageRange(page: number, count: number, siblings?: number): Array<number | '…'>;

// PasswordInput/PasswordInput.d.ts
/** Password field with show/hide toggle and optional live strength meter (4 segments + label). */
export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** @default 'Password' */
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Show the strength meter — use on "create / change password" only, never on sign-in. */
  showStrength?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export declare function PasswordInput(props: PasswordInputProps): JSX.Element;
/** 0–4 score (−1 for empty): length ≥ 8, mixed case, digit, symbol, length ≥ 12. */
export declare function passwordScore(value: string): number;

// PhoneInput/PhoneInput.d.ts
export interface PhoneCountry { code: string; name: string; dial: string; /** '#' = digit, e.g. '### ### ###' */ mask: string; }
export declare const PHONE_COUNTRIES: PhoneCountry[];
/** Phone field with country picker (ISO code + dial code) and as-you-type formatting per country mask. Emits E.164 ("+48600100200"). */
export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue'> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  countries?: PhoneCountry[];
  defaultCountry?: string;
  /** Controlled ISO country code */
  country?: string;
  onCountryChange?: (code: string) => void;
  /** National digits (controlled) */
  value?: string;
  defaultValue?: string;
  onValueChange?: (e164: string, meta: { country: string; national: string; valid: boolean }) => void;
  /** Show a length error after blur. Default true. */
  validateOnBlur?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Submits E.164 in a hidden input */
  name?: string;
}
export declare function PhoneInput(props: PhoneInputProps): JSX.Element;

// Popover/Popover.d.ts
/** Floating panel on the top material (material-4). For rich content — profiles, quick settings, small forms. openOn="hover" makes it a hover card (profile/link previews): opens after openDelay, stays open while the pointer is over the trigger or panel, also opens on focus. Use Tooltip for plain-text hints. Closes on outside click and Esc. */
export interface PopoverProps {
  /** Element that toggles the popover — usually a Button or IconButton. Receives aria-expanded. */
  trigger: React.ReactNode;
  title?: React.ReactNode;
  side?: 'bottom' | 'top';
  align?: 'start' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** click (default) or hover — hover = HoverCard behaviour. @default 'click' */
  openOn?: 'click' | 'hover';
  /** Hover only. @default 350 */
  openDelay?: number;
  /** Hover only. @default 150 */
  closeDelay?: number;
  /** Extra class on the panel itself (the wrapper takes `className`) — for a panel that lays out its own regions, e.g. NotificationCenter's `vui-notif`. */
  panelClassName?: string;
  /** Render children straight into the panel, without the `vui-popover__body` wrapper. @default false */
  bare?: boolean;
  /** Accessible name of the panel when `title` is not a string (a string `title` is used as the name). */
  label?: string;
  className?: string;
  children?: React.ReactNode;
}
export declare function Popover(props: PopoverProps): JSX.Element;

// Delta/Delta.d.ts
/** Signed change with direction colour (trend tokens, not status tokens), arrow and tabular figures. null renders an em dash — never 0. */
export interface DeltaProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number | null | undefined;
  /** percent → %, pp → " pp", number → no suffix. Any other unit: pass `unit`. @default 'percent' */
  format?: 'percent' | 'number' | 'pp';
  digits?: number;
  /** BCP 47 locale for the number, e.g. 'pl-PL'. @default 'en-US' */
  locale?: string;
  /** Custom suffix, overrides format */
  unit?: string;
  /** @default true */
  arrow?: boolean;
  /** text = coloured text · pill = tinted background · solid = filled chip. @default 'text' */
  variant?: 'text' | 'pill' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  /** |value| ≤ threshold renders as flat. @default 0 */
  flatThreshold?: number;
  /** Screen-reader prefix, e.g. "Change since yesterday" */
  label?: string;
}
export declare function Delta(props: DeltaProps): JSX.Element;

// PricingTable/PricingTable.d.ts
/** Plan comparison cards in a responsive grid (stack on mobile). One featured tier only — a flag, brand outline and the only primary button are the whole hierarchy; no gradients or tinted cards. Prices may be per billing period: then a Monthly / Yearly switch appears (with optional yearlyNote badge) and the amount fades on change. Non-numeric prices ("Talk to us") drop the period. current marks the user's plan (disabled "Current plan"). Features can be excluded ({ included:false }) and introduced by includes ("Everything in Starter, plus"). */
export type Billing = 'monthly' | 'yearly';
export type PerBilling<T> = T | { monthly: T; yearly: T };
export interface PricingFeature { label: React.ReactNode; included?: boolean }
export interface PricingTier {
  id?: string;
  name: string;
  price: PerBilling<string>;
  /** Overrides periods[billing]; '' hides it */
  period?: PerBilling<string>;
  /** Small line under the price, e.g. "billed yearly" */
  note?: PerBilling<string>;
  blurb?: React.ReactNode;
  features?: Array<React.ReactNode | PricingFeature>;
  /** Lead-in above features, e.g. "Everything in Starter, plus" */
  includes?: React.ReactNode;
  /** @default 'Choose {name}' */
  cta?: string;
  featured?: boolean;
  /** Flag text on the featured tier. @default featuredLabel */
  badge?: string;
}
export interface PricingTableProps {
  tiers: PricingTier[];
  billing?: Billing;
  /** @default 'monthly' */
  defaultBilling?: Billing;
  onBillingChange?: (b: Billing) => void;
  billingLabels?: { monthly: string; yearly: string };
  /** @default { monthly: '/ month', yearly: '/ year' } */
  periods?: { monthly: string; yearly: string };
  /** Badge next to the switch, e.g. "2 months free" */
  yearlyNote?: string;
  /** id (or name) of the user's plan */
  current?: string;
  /** @default 'Most popular' */
  featuredLabel?: string;
  onSelect?: (tier: PricingTier, billing: Billing) => void;
  className?: string;
}
export declare function PricingTable(props: PricingTableProps): JSX.Element;

// Progress/Progress.d.ts
/** Linear progress for determinate tasks (upload, onboarding, quota) or indeterminate loading. */
export interface ProgressProps {
  value?: number;
  /** @default 100 */
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  indeterminate?: boolean;
  /** brand, semantic, or auto-free. Use warning/danger for quotas near the limit. */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  /** Custom value text — (v, max) => v + ' of ' + max + ' GB' */
  format?: (value: number, max: number) => string;
  className?: string;
}
export declare function Progress(props: ProgressProps): JSX.Element;
/** Circular progress with centred percentage. */
export interface ProgressRingProps { value?: number; max?: number; /** px @default 48 */ size?: number; stroke?: number; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'; showValue?: boolean; label?: string;
  /** progressbar (task) · meter (measured value) · img (score badge — label carries the value). @default 'progressbar' */
  role?: 'progressbar' | 'meter' | 'img';
  /** Custom centre content — replaces the % value (e.g. "82/100") */
  children?: React.ReactNode; className?: string }
export declare function ProgressRing(props: ProgressRingProps): JSX.Element;

// PromptInput/PromptInput.d.ts
/**
 * Composer for AI chat. Auto-grows to maxRows; ↵ sends, ⇧↵ new line (IME-safe). While loading the Send button becomes Stop (Esc also stops).
 * Attachment chips above the text, optional suggestion chips when empty, a toolbar slot for model / mode pickers.
 */
export interface PromptAttachment { id?: string; name: string; size?: string; icon?: string }
export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with trimmed text + current attachments; the field clears itself */
  onSubmit?: (text: string, attachments: PromptAttachment[]) => void;
  /** Generating — shows Stop */
  loading?: boolean;
  onStop?: () => void;
  /** @default 'Ask anything…' */
  placeholder?: string;
  /** @default 8 */
  maxRows?: number;
  attachments?: PromptAttachment[];
  /** Shows the paperclip button */
  onAttach?: () => void;
  onRemoveAttachment?: (a: PromptAttachment) => void;
  /** Starter prompts shown while empty. Click fills the field (or calls onSuggestion). */
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
  /** Extra controls left of the hint — model Select, toggles */
  toolbar?: React.ReactNode;
  /** Replaces the keyboard hint */
  hint?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Accessible name. @default 'Message' */
  label?: string;
  className?: string;
}
export declare function PromptInput(props: PromptInputProps): JSX.Element;

// QRCode/QRCode.d.ts
/**
 * Scannable QR code generated in the browser (byte mode, UTF-8, versions 1–40, auto mask) — share links, 2FA setup, event tickets, payment requests.
 * Always dark modules on a white tile with a 4-module quiet zone, in both themes, so every scanner reads it. A centre logo bumps error correction to H.
 * Pair with a visible link or code: the image alone is not accessible.
 */
export interface QRCodeProps {
  /** Text or URL to encode */
  value: string;
  /** px. @default 160 */
  size?: number;
  /** Error correction: L 7% · M 15% · Q 25% · H 30%. @default 'M' ('H' with a logo) */
  level?: 'L' | 'M' | 'Q' | 'H';
  /** Quiet zone in modules. Keep ≥ 4 for print. @default 4 */
  margin?: number;
  /** Icon name or node centred on a white tile */
  logo?: string | React.ReactNode;
  /** Accessible name. @default 'QR code: ' + value */
  label?: string;
  className?: string;
}
export declare function QRCode(props: QRCodeProps): JSX.Element;
/** Encoder used by QRCode — returns the module matrix (true = dark) or null if the text is too long. */
export declare function encodeQR(text: string, level?: 'L' | 'M' | 'Q' | 'H'): boolean[][] | null;

// QueryBuilder/QueryBuilder.d.ts
export interface QueryField { key: string; label: string; /** @default 'text' */ type?: 'text' | 'number' | 'select' | 'date' | 'boolean'; options?: { value: string; label: string }[]; placeholder?: string; /** Allowed operator ids for this field (subset of its type's operators, kept in that order). Omit = all. */ operators?: string[]; }
export interface QueryRule { id: string; field: string; op: string; value: string; }
export interface QueryGroup { id: string; combinator: 'and' | 'or'; rules: Array<QueryRule | QueryGroup>; }
/**
 * Visual condition builder for segments, automations and advanced search: "Where Status is Active AND (Plan is Pro OR Seats > 10)".
 * Operators follow the field type (narrow per field with `operators`); the combinator toggles on the second row of each group. Groups nest up to maxDepth.
 * For quick faceted filtering use FilterBar; QueryBuilder is for saved, precise rules.
 */
export interface QueryBuilderProps {
  fields: QueryField[];
  value?: QueryGroup;
  defaultValue?: QueryGroup;
  onChange?: (query: QueryGroup) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (query: QueryGroup) => void;
  /** 1 = flat list, 2 = one level of groups. @default 2 */
  maxDepth?: number;
  /** Readable one-line version under the builder */
  showSummary?: boolean;
  /** Read-only: every control disabled, query still visible. @default false */
  disabled?: boolean;
  /** Up/down buttons on each condition and group to reorder siblings (keyboard-accessible, labelled). @default false */
  reorderable?: boolean;
  /** "Clear all" on the root group — leaves an empty root (same id + combinator); the last root condition becomes removable too. @default false */
  clearable?: boolean;
  /** Fires after Clear all with the emptied query (onChange fires as well). */
  onClear?: (query: QueryGroup) => void;
  className?: string;
}
export declare function QueryBuilder(props: QueryBuilderProps): JSX.Element;
export declare function emptyQuery(fields: QueryField[]): QueryGroup;
/** Empty root group keeping the query's id and combinator. */
export declare function clearQuery(query: QueryGroup): QueryGroup;
export declare function describeQuery(query: QueryGroup, fields: QueryField[]): string;

// QuestionCard/QuestionCard.d.ts
/** Question card built on Card: category + level badges, question text, difficulty stars, time, tags, optional upvote, save and expandable model answer. Put several in a responsive grid. Without `answer` it renders a plain heading instead of an expander. Other Card / Surface props pass through. */
export interface QuestionCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  question: React.ReactNode;
  category?: string;
  /** @default 'brand' */
  categoryTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** e.g. 'Advanced' */
  level?: string;
  /** 1–5 stars, read-only */
  difficulty?: number;
  /** e.g. '15 min' */
  time?: string;
  tags?: string[];
  /** Model answer; adds the Show / Hide answer control */
  answer?: React.ReactNode;
  votes?: number;
  voted?: boolean;
  /** Shows the upvote button */
  onVote?: () => void;
  starred?: boolean;
  /** Shows the save (star) button */
  onStar?: () => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
  /** Card padding. @default 'sm' */
  padding?: CardProps['padding'];
  /** Card pass-through */
  variant?: CardProps['variant'];
  tone?: CardProps['tone'];
  accent?: CardProps['accent'];
  hoverable?: CardProps['hoverable'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
}
export declare function QuestionCard(props: QuestionCardProps): JSX.Element;

// RadarChart/RadarChart.d.ts
export interface RadarAxis { key: string; label: string; /** Axis maximum; defaults to chart max or the largest value */ max?: number; }
export interface RadarSeries { label: string; values: Record<string, number>; /** Defaults to --dv-N in order */ color?: string; }
/**
 * Compares 1–3 profiles across 5–8 dimensions — skill profiles, product scores, team health. Legend toggles series,
 * hovering a vertex dims the others and shows the value. Over 3 series or 8 axes, use a BarChart instead.
 */
export interface RadarChartProps {
  axes: RadarAxis[];
  series: RadarSeries[];
  /** Square px size (scales down to fit). @default 300 */
  size?: number;
  /** Concentric rings. @default 4 */
  levels?: number;
  /** Shared maximum for every axis */
  max?: number;
  format?: (v: number) => string;
  /** @default true */
  showLegend?: boolean;
  /** Tinted area under each series. @default true */
  fill?: boolean;
  /** Accessible name — values are appended automatically */
  label?: string;
  className?: string;
}
export declare function RadarChart(props: RadarChartProps): JSX.Element;

// Radio/Radio.d.ts
/** Radio for picking one of 2–5 visible options. Group with a shared name. */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** sm = 16px circle for dense rows. @default 'md' */
  size?: 'sm' | 'md';
  label?: React.ReactNode;
  /** Secondary line under the label */
  description?: string;
}
export declare function Radio(props: RadioProps): JSX.Element;

// Rail/Rail.d.ts
/** Atom. Vertical list whose items are joined by a connector line under their leading marker (Marker). Timeline renders it; use for activity feeds, audit logs, step lists. */
export interface RailProps extends React.HTMLAttributes<HTMLElement> {
  /** Element. @default 'ol' */
  as?: keyof JSX.IntrinsicElements;
  /** Diameter of the leading markers — the line starts below them. sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Draw the connector. @default true */
  line?: boolean;
  children?: React.ReactNode;
}
export declare function Rail(props: RailProps): JSX.Element;
export interface RailItemProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'li' */
  as?: keyof JSX.IntrinsicElements;
  /** Connector below this item: done = success solid · active = brand · dashed = upcoming */
  state?: 'done' | 'active' | 'dashed';
  children?: React.ReactNode;
}
export declare function RailItem(props: RailItemProps): JSX.Element;

// RangeBandChart/RangeBandChart.d.ts
/** Actual series against an expected band (e.g. Monte Carlo P5–P95 with median). Handles negative values; points outside the band are marked. */
export interface RangeBandChartProps {
  /** Rows with label + lo/hi/mid/value keys */
  data: Array<Record<string, any> & { label: string }>;
  loKey?: string;
  hiKey?: string;
  midKey?: string;
  valueKey?: string;
  bandLabel?: string;
  midLabel?: string;
  valueLabel?: string;
  height?: number;
  format?: (v: number) => string;
  label?: string;
  className?: string;
}
export declare function RangeBandChart(props: RangeBandChartProps): JSX.Element;

// RangeInput/RangeInput.d.ts
export interface RangeValue { min?: number | null; max?: number | null }
/**
 * From–to numeric field — budget, price filter, size range. Two bounds share one label and error lane;
 * values are grouped per locale when not focused. Optional inline unit (currency) and period selects turn it into a
 * money range ("10 000 – 15 000 PLN / month"). An inverted range flags itself. Either bound may be left empty (open range).
 */
export interface RangeInputProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  value?: RangeValue;
  defaultValue?: RangeValue;
  onValueChange?: (value: RangeValue) => void;
  /** Clamp for both bounds. @default 0 */
  min?: number;
  max?: number;
  /** Text affix inside each bound, e.g. "€" or "m²" — use instead of unitOptions for a fixed unit */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Placeholders / accessible names. @default 'From' / 'To' */
  fromLabel?: string;
  toLabel?: string;
  /** @default 'The lower bound is greater than the upper bound' */
  invertedError?: string;
  /** Inline unit select (e.g. currencies) */
  unitOptions?: Array<string | SelectOption>;
  unit?: string;
  defaultUnit?: string;
  onUnitChange?: (unit: string) => void;
  /** @default 'Currency' */
  unitLabel?: string;
  /** Inline period select (e.g. Hourly / Monthly / Yearly) */
  periodOptions?: Array<string | SelectOption>;
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
  /** @default 'Period' */
  periodLabel?: string;
  /** Number grouping locale, e.g. 'pl' */
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function RangeInput(props: RangeInputProps): JSX.Element;

// Rating/Rating.d.ts
/** Star rating. Hover previews, click commits (click the current star again to clear), ←→ / Home / End by keyboard. readOnly renders a static, labelled image for reviews and lists. */
export interface RatingProps {
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 5 */
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** "4.0 / 5" after the stars */
  showValue?: boolean;
  /** Accessible group name. @default 'Rating' */
  label?: string;
  className?: string;
}
export declare function Rating(props: RatingProps): JSX.Element;

// RatingSummary/RatingSummary.d.ts
/** Review summary: big average, read-only stars, total, and a per-star distribution. With onFilter the rows become toggle buttons (click the active row again to clear). */
export interface RatingSummaryProps {
  /** Votes per star, index 0 = 1★ … last = max★. Length sets the scale. e.g. [2, 3, 9, 41, 88] */
  counts: number[];
  /** Override; otherwise computed from counts */
  average?: number;
  /** Singular noun after the total. @default 'review' */
  noun?: string;
  /** Currently filtered star (controlled) */
  activeStar?: number | null;
  onFilter?: (star: number | null) => void;
  /** @default 'Rating breakdown' */
  label?: string;
  className?: string;
}
export declare function RatingSummary(props: RatingSummaryProps): JSX.Element;

// RichTextEditor/RichTextEditor.d.ts
/**
 * Dependency-free WYSIWYG for comments, descriptions and notes. Own editing engine (no deprecated execCommand):
 * - Marks: bold ⌘B · italic ⌘I · underline ⌘U · strike ⌘⇧X · inline code ⌘E — toggling with a collapsed caret affects the next typed text.
 * - Blocks: heading ⌘⌥2 · subheading ⌘⌥3 · bulleted ⌘⇧8 · numbered ⌘⇧7 · quote ⌘⇧9 · code block ⌘⌥C. Enter on an empty list item / quote / heading exits it; Shift+Enter = line break; Enter twice at the end of a code block exits.
 * - Markdown as you type: `# ` `## ` `- ` `1. ` `> ` ```` ``` ```` at line start; **bold**, *italic*, _italic_, ~~strike~~, `code` inline.
 * - Links: ⌘K opens an inline link popover (bare domains get https://, emails mailto:); ⌘-click opens a link.
 * - Own undo/redo stack (⌘Z / ⌘⇧Z / ⌘Y and toolbar), paste is sanitized to the allowed markup (Word/Docs/web keep bold, lists, links; styles dropped).
 * Output is allow-listed HTML: p h2 h3 blockquote pre ul ol li strong em u s code a[href] br. Still sanitize server-side.
 */
export interface RichTextEditorProps {
  label?: string;
  hint?: string;
  error?: string;
  /** Initial HTML (sanitized). Uncontrolled. */
  defaultValue?: string;
  /** Fires on content change with sanitized HTML ('' when empty) and plain text. */
  onChange?: (html: string, text: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (html: string, text: string) => void;
  placeholder?: string;
  /** px. @default 140 */
  minHeight?: number;
  /** px — scrolls beyond */
  maxHeight?: number;
  /** Soft limit on plain-text length (counter turns red) */
  maxLength?: number;
  /** full · minimal (bold, italic, lists, link) · false (shortcuts + markdown only). @default 'full' */
  toolbar?: 'full' | 'minimal' | false;
  disabled?: boolean;
  /** Renders content without toolbar or editing */
  readOnly?: boolean;
  className?: string;
}
export declare function RichTextEditor(props: RichTextEditorProps): JSX.Element;
/** The allow-list sanitizer the editor uses — reuse it when rendering stored content. */
export declare function sanitizeRichText(html: string): string;

// Scheduler/Scheduler.d.ts
export interface SchedulerEvent { id: string | number; title: string; start: Date; end: Date; /** Status or label tone. @default 'brand' */ tone?: string; /** Shown after the time — room, owner */ meta?: string; }
/**
 * Day / week time grid for bookings, shifts and meetings. Overlapping events split into lanes, a now-line marks the current time,
 * clicking an empty slot reports the slot (snap to slotMinutes) so you can open a create dialog. Use EventCalendar for a month
 * overview, Timeline for sequences without a clock.
 */
export interface SchedulerProps {
  events?: SchedulerEvent[];
  view?: 'day' | 'week';
  /** @default 'week' */
  defaultView?: 'day' | 'week';
  onViewChange?: (view: 'day' | 'week') => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** @default 8 */
  startHour?: number;
  /** @default 19 */
  endHour?: number;
  /** Initial scroll position of the grid — e.g. startHour={0} endHour={24} scrollToHour={8} shows the full day but opens on working hours */
  scrollToHour?: number;
  /** Snap for slot clicks. @default 30 */
  slotMinutes?: number;
  /** px per hour. @default 52 */
  hourHeight?: number;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  hideWeekends?: boolean;
  hour12?: boolean;
  locale?: string;
  /** Makes events buttons */
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  /** Scroll height of the grid. @default 520 */
  maxHeight?: number | string;
  className?: string;
}
export declare function Scheduler(props: SchedulerProps): JSX.Element;

// ScoreCard/ScoreCard.d.ts
export interface ScoreCriterion { label: React.ReactNode; /** 0–100 */ value: number; tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' }
/** Result card built on Card for a computed score (match, test result, health check): ring + verdict badge + per-criterion bars. Tone follows the score (≥75 success, ≥50 warning, else danger) unless set; it also drives the Card's accent strip / tonal hover. For a single KPI use Stat. */
export interface ScoreCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  label: React.ReactNode;
  /** 0–100 */
  score: number;
  /** Short verdict, e.g. 'Strong match' */
  verdict?: string;
  hint?: React.ReactNode;
  criteria?: ScoreCriterion[];
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Card pass-through */
  padding?: CardProps['padding'];
  variant?: CardProps['variant'];
  accent?: CardProps['accent'];
  hoverable?: CardProps['hoverable'];
  tonal?: CardProps['tonal'];
  reveal?: CardProps['reveal'];
}
export declare function ScoreCard(props: ScoreCardProps): JSX.Element;

// ScrollArea/ScrollArea.d.ts
/**
 * Scroll container with a thin themed scrollbar and edge fades that appear only when there is more content in that direction.
 * Focusable so keyboard users can scroll it. Use for side panels, long menus, chip rows, code — not for the page itself.
 */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  /** horizontal lays children in a non-wrapping row. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Fade the edge where content continues. @default true */
  fade?: boolean;
  /** Makes it a labelled region — set when the area holds meaningful content */
  label?: string;
  children?: React.ReactNode;
}
export declare function ScrollArea(props: ScrollAreaProps): JSX.Element;

// SearchInput/SearchInput.d.ts
export interface SearchSuggestion { value: string; label: string; description?: string; icon?: string }
/** Search field with clear button and optional suggestions dropdown (match highlighted). ↑↓ move · Enter picks (or submits the query) · Esc closes, then clears. */
export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onSelect'> {
  label?: string;
  /** @default 'Search…' */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enables the dropdown. Filtered client-side by label unless filter=false (server results). */
  suggestions?: Array<string | SearchSuggestion>;
  /** @default true */
  filter?: boolean;
  /** Suggestion picked, or Enter with free text */
  onSelect?: (item: SearchSuggestion) => void;
  /** @default 'No matches.' */
  emptyText?: string;
  /** Swaps the search icon for a spinner */
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Ref to the native input — focus after create / clear in hosting dialogs */
  inputRef?: React.Ref<HTMLInputElement>;
}
export declare function SearchInput(props: SearchInputProps): JSX.Element;

// SearchTrigger/SearchTrigger.d.ts
/** Search field look-alike that opens a command palette. Listens for ⌘K / Ctrl+K globally. Collapses to an icon under 640px. */
export interface SearchTriggerProps {
  /** @default 'Search…' */
  placeholder?: string;
  /** @default '⌘K' */
  shortcut?: string;
  /** Register the global ⌘K / Ctrl+K listener. @default true */
  hotkey?: boolean;
  onOpen?: () => void;
  className?: string;
}
export declare function SearchTrigger(props: SearchTriggerProps): JSX.Element;

// SectionLabel/SectionLabel.d.ts
/**
 * Atom. Uppercase group heading inside menus, listboxes, sidebars, filter bars and panels ("RECENT", "CONNECTED").
 * Reads --type-section. For page-level eyebrows use Text variant="overline".
 */
export interface SectionLabelProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'div' */
  as?: keyof JSX.IntrinsicElements;
  /** Leading glyph name or node */
  icon?: string | React.ReactNode;
  /** Trailing slot — count, "Clear" link, action */
  end?: React.ReactNode;
  /** @default tertiary */
  tone?: 'secondary' | 'brand';
  /** Sticks to the top of a scrolling list with a frosted ground */
  sticky?: boolean;
  children?: React.ReactNode;
}
export declare function SectionLabel(props: SectionLabelProps): JSX.Element;

// Segmented/Segmented.d.ts
/** Atom. Sunken track holding raised, mutually-exclusive items. Build view switchers, compact filters, theme pickers from it; OptionSwitcher variant="track" renders it, Tabs variant="segmented" and ThemeToggle appearance="segmented" share its --segment-* tokens. Owns no state — set role (radiogroup / tablist) and selection yourself. */
export interface SegmentedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** md = 30px items (36px track) · sm = 26px items. @default 'md' */
  size?: 'sm' | 'md';
  /** Stretch to container width; items share it equally */
  block?: boolean;
  /** Pill track + pill items */
  round?: boolean;
  /** Square icon-only items */
  iconOnly?: boolean;
  children?: React.ReactNode;
}
export declare function Segmented(props: SegmentedProps): JSX.Element;
export interface SegmentedItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Writes aria-checked (role="radio"), aria-selected (role="tab") or aria-pressed (no role) */
  selected?: boolean;
  /** Icon name or node, before the label */
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
}
export declare const SegmentedItem: React.ForwardRefExoticComponent<SegmentedItemProps & React.RefAttributes<HTMLButtonElement>>;

// Select/Select.d.ts
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Velvet icon name shown before the label */
  icon?: string;
  /** Secondary line under the label */
  description?: string;
}
/** Custom listbox select with a styled dropdown menu. Keyboard: ↑ ↓ Enter Esc. Opens upward near the viewport bottom. */
export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Options as strings or {value,label,icon,description,disabled} */
  options?: Array<string | SelectOption>;
  /** Shown when nothing is selected. @default 'Select…' */
  placeholder?: string;
  iconLeft?: string | React.ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  /** Adds a hidden input for form submission */
  name?: string;
  /** Controlled value */
  value?: string;
  defaultValue?: string;
  /** Called with the new value */
  onValueChange?: (value: string) => void;
  /** Native-like: receives { target: { value, name } } */
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  /** Accessible name when there is no visible label (inline use in QueryBuilder rows, table cells, toolbars). */
  'aria-label'?: string;
}
export declare function Select(props: SelectProps): JSX.Element;

// Separator/Separator.d.ts
/**
 * Atom. Inline separator between siblings in a row: toolbar groups (line), OTP groups (dash), time units and paths (text: ":" "/" "›").
 * Decorative by default. For block-level section breaks use Divider (12 Layout).
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** line = 1px rule · dash = short 10×2 bar · text = glyph in --fg-tertiary. @default 'line' */
  variant?: 'line' | 'dash' | 'text';
  /** Only for line. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Expose role="separator" (toolbars, menus). Otherwise aria-hidden. */
  semantic?: boolean;
  /** Glyph for variant="text". @default '/' */
  children?: React.ReactNode;
}
export declare function Separator(props: SeparatorProps): JSX.Element;

// SetupChecklist/SetupChecklist.d.ts
export interface ChecklistStep {
  id?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Velvet icon shown until the step is done (else the step number) */
  icon?: string;
  done?: boolean;
  /** Renders the step as a link */
  href?: string;
  /** Renders the step as a button (when no href) */
  onClick?: () => void;
}
/**
 * "Get started" card for first-run setup — profile, import, first record. Progress bar + steps that link to where each
 * task is done; done steps show a check, the first open step is highlighted. Hides itself once every step is done.
 * Not a Tour (guided overlay) or Stepper (linear form flow) — steps here are independent and done in any order.
 */
export interface SetupChecklistProps {
  /** @default 'Get started' */
  title?: React.ReactNode;
  description?: React.ReactNode;
  steps: ChecklistStep[];
  /** list = stacked rows (side column, popover) · grid = tiles in a row (dashboard hero). @default 'list' */
  layout?: 'list' | 'grid';
  /** @default true */
  hideWhenComplete?: boolean;
  /** Shows a close button */
  onDismiss?: () => void;
  /** @default 'Dismiss' */
  dismissLabel?: string;
  /** @default (v, m) => v + ' of ' + m + ' done' */
  progressFormat?: (done: number, total: number) => string;
  className?: string;
}
export declare function SetupChecklist(props: SetupChecklistProps): JSX.Element | null;

// Sidebar/Sidebar.d.ts
/** App navigation spine. variant="floating" (default): raised card with border, radius and shadow; "docked": full-height panel with a right border. Header = brand + ⇇ collapse toggle (separated by a divider). Expanded (--sidebar-width) ⇄ 64px icon rail on the same element: labels/counts/caret hide, section labels become short dividers, counts become a dot, hover shows a tooltip. Single active item = soft brand fill. NavItem with subItems = animated accordion. */
export interface SidebarProps {
  /** Logo or wordmark — hidden in the rail when the toggle is shown */
  brand?: React.ReactNode;
  /** Compact mark shown in the rail when there is no toggle */
  brandCollapsed?: React.ReactNode;
  /** Pinned to the bottom — e.g. avatar + sign out */
  footer?: React.ReactNode;
  collapsed?: boolean;
  /** Shows the collapse/expand toggle in the header */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** @default 'floating' */
  variant?: 'floating' | 'docked';
  className?: string;
  children?: React.ReactNode;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
export interface NavSubItem { id?: string; label: React.ReactNode; active?: boolean; href?: string; onClick?: () => void }
/** Single navigation link inside Sidebar. With subItems it becomes an accordion parent (caret rotates 90°); clicking it in the rail expands the sidebar first. */
export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  /** Current page */
  active?: boolean;
  /** Mono count pill; solid brand when active; a dot in the rail */
  count?: React.ReactNode;
  /** Any trailing node (prefer count) */
  end?: React.ReactNode;
  /** Renders an <a> when set (ignored with subItems) */
  href?: string;
  /** Nested links — opens by default when one is active */
  subItems?: NavSubItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export declare function NavItem(props: NavItemProps): JSX.Element;
/** Small uppercase group label between NavItems; a short divider in the rail. */
export interface NavSectionProps { children?: React.ReactNode }
export declare function NavSection(props: NavSectionProps): JSX.Element;

// SignaturePad/SignaturePad.d.ts
/**
 * Draw-to-sign field for contracts, delivery confirmations and consent forms. Smoothed strokes with speed (mouse / touch) or pressure (pen) width; ink follows --fg-primary and redraws on theme change.
 * onValueChange gets a PNG data URL (null when cleared) plus the raw strokes. Undo / Clear appear once there is ink.
 * Drawing is not keyboard-accessible — always offer an alternative (typed full name Input + consent Checkbox).
 */
export interface SignaturePoint { x: number; y: number; w: number }
export interface SignaturePadProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  /** px. @default 180 */
  height?: number;
  /** Base stroke width px. @default 2.5 */
  penWidth?: number;
  /** @default 'Sign here' */
  placeholder?: string;
  onValueChange?: (dataUrl: string | null, strokes: SignaturePoint[][]) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function SignaturePad(props: SignaturePadProps): JSX.Element;

// Skeleton/Skeleton.d.ts
/** Shimmering placeholder in the shape of content that's loading. Wrap the loading region in aria-busy="true". Shimmer stops under reduced motion. */
export interface SkeletonProps { width?: number | string; /** @default 12 */ height?: number | string; circle?: boolean; radius?: number | string; className?: string; style?: React.CSSProperties }
export declare function Skeleton(props: SkeletonProps): JSX.Element;
/** Paragraph placeholder — full-width lines, shorter last line. */
export interface SkeletonTextProps { /** @default 3 */ lines?: number; /** @default '60%' */ lastWidth?: string; gap?: number; className?: string }
export declare function SkeletonText(props: SkeletonTextProps): JSX.Element;

// SkillBar/SkillBar.d.ts
/** Competency meter: label, optional level word, and a bar that grows in once on mount with a single shimmer sweep. Use for skills, proficiency, profile completeness — not task progress (use Progress). */
export interface SkillBarProps {
  label: React.ReactNode;
  /** 0–100 */
  value: number;
  /** Text shown at right, e.g. 'Advanced'. Keep it a word, not a number. */
  level?: string;
  /** @default 'brand' */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Grow-in + shimmer on mount. Off for static lists / print. @default true */
  animate?: boolean;
  className?: string;
}
export declare function SkillBar(props: SkillBarProps): JSX.Element;

// Slider/Slider.d.ts
/** Range control with filled track. Pass a number for one thumb or [lo, hi] for two — thumbs can never cross. Drag, click the track, or ←→ / PageUp/Down / Home/End. Optional marks (thresholds) with labels; snapToMarks restricts values to them. */
export interface SliderProps {
  label?: string;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onValueChange?: (value: any) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Display + aria-valuetext — e.g. v => v + '%' or v => '$' + v */
  format?: (value: number) => string;
  /** Live value right of the label. @default true */
  showValue?: boolean;
  /** min / max captions under the track */
  showBounds?: boolean;
  /** Thresholds on the track. true = a labelled mark on every step; number[] = dots; {value,label}[] = labelled thresholds (e.g. Junior / Mid / Senior). */
  marks?: boolean | Array<number | { value: number; label?: React.ReactNode }>;
  /** Value can only land on a mark; arrows jump mark to mark. @default false */
  snapToMarks?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function Slider(props: SliderProps): JSX.Element;

// Sparkline/Sparkline.d.ts
/** Tiny inline trend for stat cards and table cells. Scrub with the mouse or focus + ←→; the readout floats top-right. Last point is marked. */
export interface SparklineProps { data: number[]; /** px. @default 40 */ height?: number; color?: string; area?: boolean; format?: (v: number) => string; /** Per-point labels for the readout (dates) */ labels?: string[]; label?: string; className?: string }
export declare function Sparkline(props: SparklineProps): JSX.Element;

// Spinner/Spinner.d.ts
/** Loader: ring (default, inline/buttons), dots (chat/typing), bars (audio/processing), pulse (live). Use Skeleton when content shape is known; Progress when % is known. */
export interface SpinnerProps {
  variant?: 'ring' | 'dots' | 'bars' | 'pulse';
  /** sm 16 · md 24 · lg 40 · inline = 1em of the host text (buttons, chips) */
  size?: 'sm' | 'md' | 'lg' | 'inline';
  /** Accessible status text. @default 'Loading' */
  label?: string;
  /** current = inherit text colour */
  tone?: 'brand' | 'current';
  className?: string;
}
export declare function Spinner(props: SpinnerProps): JSX.Element;
/** Dims its children and centres a spinner + label on top while show is true. */
export interface LoadingOverlayProps { show?: boolean; label?: string; children?: React.ReactNode; className?: string }
export declare function LoadingOverlay(props: LoadingOverlayProps): JSX.Element;

// SplitPane/SplitPane.d.ts
/** Two resizable panes (list/detail, editor/preview). Fills its parent (height:100%) so it nests — put a vertical SplitPane inside a horizontal one. Drag the handle, or focus it and use arrows (Shift ×5), Home/End, Enter / double-click to reset. Size is the first pane in %; minPx keeps both panes usable on narrow containers. */
export interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode] | React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  /** % @default 50 */
  defaultSize?: number;
  size?: number;
  onSizeChange?: (pct: number) => void;
  /** % @default 15 */
  min?: number;
  /** % @default 85 */
  max?: number;
  /** Floor for BOTH panes in px. @default 120 */
  minPx?: number;
  /** Drag past half of min (or Home / double-click) to collapse the first pane to 0; Enter restores. @default false */
  collapsible?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function SplitPane(props: SplitPaneProps): JSX.Element;

// Stack/Stack.d.ts
/** Flex stack with token gaps. gap is a space-scale step (4 → var(--space-4)) or any CSS length. divider adds hairlines between children. */
export interface StackProps extends React.HTMLAttributes<HTMLElement> { as?: any; direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; /** @default 4 */ gap?: number | string; align?: React.CSSProperties['alignItems']; justify?: React.CSSProperties['justifyContent']; wrap?: boolean; divider?: boolean }
export declare function Stack(props: StackProps): JSX.Element;
/** CSS grid. Fixed columns (collapse to 1 under 640px), or min = auto-fill cards of at least that width; fit collapses empty tracks so the cards stretch. */
export interface GridProps extends React.HTMLAttributes<HTMLElement> { as?: any; /** @default 3 */ columns?: number; /** px or CSS length — switches to auto-fill */ min?: number | string; /** With min: auto-fit instead of auto-fill, so a short last row stretches to the full width. @default false */ fit?: boolean; /** @default 4 */ gap?: number | string }
export declare function Grid(props: GridProps): JSX.Element;

// Columns/Columns.d.ts
/** Wrapping row of weighted columns — a main column with an aside that stack when there is no room. Columns sets the row (gap, alignment); each Column sets its weight and the width it asks for before wrapping. */
export interface ColumnsProps extends React.HTMLAttributes<HTMLElement> { as?: any; /** Space-scale step (4 → var(--space-4)) or any CSS length. @default 4 */ gap?: number | string; /** @default 'flex-start' */ align?: React.CSSProperties['alignItems']; children?: React.ReactNode }
export declare function Columns(props: ColumnsProps): JSX.Element;
export interface ColumnProps extends React.HTMLAttributes<HTMLElement> { as?: any; /** Share of the free space (flex-grow). @default 1 */ grow?: number; /** Width it asks for before wrapping: px number or CSS length. @default 320 */ basis?: number | string; children?: React.ReactNode }
export declare function Column(props: ColumnProps): JSX.Element;

// Stat/Stat.d.ts
/** KPI card built on Card: label, big value, delta badge, hint. `spark` adds a trend line (Stat trend). Other Card / Surface props pass through. */
export interface StatProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: string;
  /** Colour of the delta badge */
  tone?: 'success' | 'danger' | 'warning' | 'neutral';
  hint?: React.ReactNode;
  /** Category coding — Surface accent strip in this tone; also colours the sparkline */
  accent?: Tone;
  /** Recent values → small trend line under the number */
  spark?: number[];
  /** Card padding. @default 'sm' */
  padding?: CardProps['padding'];
  /** Card pass-through */
  variant?: CardProps['variant'];
  hoverable?: CardProps['hoverable'];
  interactive?: CardProps['interactive'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
  as?: CardProps['as'];
}
export declare function Stat(props: StatProps): JSX.Element;

// Stepper/Stepper.d.ts
export interface StepItem { label: React.ReactNode; description?: React.ReactNode }
/** Progress through ordered steps: done (✓) · current · upcoming · error. Animated: connector fills left→right (top→bottom when vertical), a node pops + draws its check when it completes, the current node scales up. With onStepClick steps become buttons (←→ / ↑↓ move focus). Vertical under 640px for horizontal steppers with 4+ steps. */
export interface StepperProps {
  steps: StepItem[];
  /** 0-based */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  /** Makes steps clickable */
  onStepClick?: (index: number) => void;
  /** true: only completed steps are clickable · false: any step (free navigation). @default true */
  linear?: boolean;
  /** Index of a step that failed validation */
  errorAt?: number;
  className?: string;
}
export declare function Stepper(props: StepperProps): JSX.Element;

// StructuredCard/StructuredCard.d.ts
/**
 * Card laid out in hairline-divided regions: media → header → body → footer.
 * Built on Surface (clip on); behaviour props are the same as Card (hoverable · interactive · tonal).
 * Use when a card has 2+ distinct regions (project, article, event). For a single content block use Card.
 */
export interface StructuredCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** @default 'div' — 'a' / 'button' with interactive */
  as?: keyof JSX.IntrinsicElements;
  /** Full-bleed media region (img / video / placeholder) */
  media?: React.ReactNode;
  /** @default '16 / 9' */
  mediaRatio?: string;
  /** Floating top-left over media — usually a Badge */
  mediaTag?: React.ReactNode;
  /** Bottom-right over media, white on scrim (e.g. "6 min read"). Turns the scrim on. */
  mediaMeta?: React.ReactNode;
  /** Bottom gradient scrim over media. @default true when mediaMeta is set */
  scrim?: boolean;
  title?: React.ReactNode;
  /** Secondary line under the title — icon + text */
  meta?: React.ReactNode;
  /** Header right slot — Badge / IconButton */
  badge?: React.ReactNode;
  /** Hairline-divided footer row */
  footer?: React.ReactNode;
  /** @default 'between' */
  footerAlign?: 'start' | 'end' | 'between';
  /** Behaviour · neutral hover lift */
  hoverable?: boolean;
  /** Behaviour · whole card is one action. Implies hoverable. */
  interactive?: boolean;
  /** Behaviour · tinted hover tracking tone. Implies hoverable. */
  tonal?: boolean;
  tone?: import('../primitives/Surface').Tone;
  /** 3px top strip in the tone colour (sits over media) */
  accent?: boolean;
  reveal?: boolean | number;
  selected?: boolean;
  /** Body region */
  children?: React.ReactNode;
}
export declare function StructuredCard(props: StructuredCardProps): JSX.Element;

// Surface/Surface.d.ts
export type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'blue' | 'indigo' | 'violet' | 'magenta' | 'teal' | 'cyan' | 'olive' | 'slate';
export type SurfaceVariant = 'default' | 'low' | 'flat' | 'raised' | 'subtle' | 'sunken' | 'brand' | 'brand-solid' | 'inverse' | 'overlay' | 'dialog' | 'glass';
/**
 * Atom. The one primitive that paints a container — background, border, radius, elevation, padding, tone and behaviour.
 * Hierarchy: Surface → Card (adds header/body/footer) → FeatureCard · FlipCard · Stat · ScoreCard · QuestionCard (add an interior).
 * Floating panels (Popover, Menu, Dialog) sit on Surface directly. Retune via --surface-* tokens, never per instance.
 */
export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'div' */
  as?: keyof JSX.IntrinsicElements;
  /** Paint at rest. default (card) · low (control-level shadow — toolbars, filter bars) · flat (border only) · raised (shadow, no border) · subtle · sunken · brand (tinted) · brand-solid (filled, on-colour text) · inverse · overlay (menus/popovers) · dialog · glass. @default 'default' */
  variant?: SurfaceVariant;
  /** Inner padding from --surface-pad-*. @default 'none' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Sets --tone / --tone-fg / --tone-bg for the accent strip, tonal hover and any tinted child */
  tone?: Tone;
  /** 3px top strip in the tone colour */
  accent?: boolean;
  /** Behaviour · visual feedback only — neutral lift on hover. Does NOT make the box clickable. Use for previews / cards with their own inner actions. */
  hoverable?: boolean;
  /** Behaviour · the whole box is one action: pointer, focus ring. Implies hoverable. Render as 'a' or 'button' when possible; a div gets tabIndex=0. */
  interactive?: boolean;
  /** Behaviour · tinted hover — lift (-4px), border and glow track --tone instead of the neutral ladder. Implies hoverable; set tone to pick the hue (defaults to brand). */
  tonal?: boolean;
  /** Staggered entrance. true = no delay; a number = list index (50ms per step). Honours reduced motion. */
  reveal?: boolean | number;
  /** Brand-tinted selected state */
  selected?: boolean;
  /** overflow:hidden — for media that must follow the radius */
  clip?: boolean;
  children?: React.ReactNode;
}
export declare function Surface(props: SurfaceProps): JSX.Element;

// Swatch/Swatch.d.ts
/** Atom. A colour chip — presets, label colours, picker trigger. Clickable when onClick is set (selected ring + check). */
export interface SwatchProps extends React.HTMLAttributes<HTMLElement> {
  /** Any CSS colour; wins over tone */
  color?: string;
  tone?: Tone;
  /** sm 20 · md 28 · lg 40 · fill (grid cell). @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'fill';
  round?: boolean;
  selected?: boolean;
  label?: string;
}
export declare function Swatch(props: SwatchProps): JSX.Element;

// Switch/Switch.d.ts
/** Switch for instant on/off settings (no Save needed). */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** Secondary line under the label */
  description?: string;
  /** @default 'md' */
  size?: 'sm' | 'md';
}
export declare function Switch(props: SwitchProps): JSX.Element;

// Table/Table.d.ts
export interface TableColumn<T = any> {
  key: string;
  label: React.ReactNode;
  /** Freeze the column to the left or right edge while the table scrolls horizontally. Any number may be pinned. */
  pin?: 'left' | 'right';
  /** Custom cell renderer */
  render?: (row: T) => React.ReactNode;
  /** Right-align + tabular numbers */
  align?: 'left' | 'right';
  width?: number | string;
  /** Hide this column under 768px */
  hideOnMobile?: boolean;
  /** Header becomes a sort button (asc → desc → off) */
  sortable?: boolean;
  /** Value used for sorting when the cell is rendered */
  sortValue?: (row: T) => string | number;
}
export interface TableSort { key: string; dir: 'asc' | 'desc' }
/** Data table: toolbar (title · count · actions), sort, row selection (Shift-click selects a range) with bulk-action bar, drag-to-resize columns, expandable detail rows, sticky header, keyboard (↑↓ move · Space select · →/← expand · ⌘A all · Esc clear), skeleton loading, empty state, optional add-row action. Framed on its own; borderless inside <Card padding="none">. */
export interface TableProps<T = any> {
  /** fixed = columns never grow past the container: px/% widths are honoured and columns without a width share what's left. Use to rule out horizontal scroll. @default 'auto' */
  layout?: 'auto' | 'fixed';
  columns: TableColumn<T>[];
  rows: T[];
  /** Unique key field. @default 'id' */
  rowKey?: string;
  selectable?: boolean;
  /** Selected row keys */
  selected?: Array<string | number>;
  onSelectedChange?: (keys: Array<string | number>) => void;
  /** Buttons shown in the bar that appears while rows are selected */
  bulkActions?: React.ReactNode;
  /** Controlled sort. If onSortChange is also set, rows are NOT sorted internally (server sort). */
  sort?: TableSort | null;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort | null) => void;
  /** Show skeleton rows */
  loading?: boolean;
  /** @default 4 */
  loadingRows?: number;
  /** Empty-state content — a string or an <EmptyState size="sm"> */
  empty?: React.ReactNode;
  /** Toolbar title (shows the row count next to it) */
  title?: React.ReactNode;
  /** Override the count shown next to the title */
  count?: React.ReactNode;
  /** Toolbar actions, right-aligned */
  toolbar?: React.ReactNode;
  /** Drag column edges to resize (double-click resets a column; ←/→ on the handle). Adds “Reset widths” to the toolbar once changed. */
  resizable?: boolean;
  /** Adds a chevron column; renders this below the row when expanded */
  renderExpanded?: (row: T) => React.ReactNode;
  /** Scroll height for the body, e.g. 360. Enables sticky header. */
  maxHeight?: number | string;
  /** @default true when maxHeight is set */
  stickyHeader?: boolean;
  /** Last-row "+ Add" action (a real button: Tab/Enter/Space). Only calls onAdd — the app creates/saves the record. Hidden while loading. */
  addRow?: { onAdd: () => void; /** @default 'Add row' */ label?: React.ReactNode; disabled?: boolean };
  className?: string;
}
export declare function Table<T = any>(props: TableProps<T>): JSX.Element;

// Tabs/Tabs.d.ts
export interface TabItem { value: string; label: React.ReactNode; icon?: string | React.ReactNode; count?: number; disabled?: boolean }
/** Tab switcher with a sliding indicator. Arrow keys / Home / End move and select (roving tabindex). */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string) => void;
  /** underline = page sections · segmented = compact view toggle */
  variant?: 'underline' | 'segmented';
  /** vertical = settings-style list (underline variant only) */
  orientation?: 'horizontal' | 'vertical';
  block?: boolean;
}
export declare function Tabs(props: TabsProps): JSX.Element;

// Tag/Tag.d.ts
/** Chip for filters, categories and removable selections. */
export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string | React.ReactNode;
  /** Selected (filter on) — only meaningful with onClick */
  selected?: boolean;
  /** Makes the tag a toggle button */
  onClick?: (e: React.MouseEvent) => void;
  /** Shows a remove (×) affordance */
  onRemove?: (e: React.MouseEvent) => void;
  /** Accessible name of the remove control. @default 'Remove ' + children (when a string) */
  removeLabel?: string;
  /** Dims the tag and disables the remove control / click */
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** outline = hairline on raised (filters) · soft = tinted fill from tone (keyword hits, statuses) · dashed = missing / placeholder. @default 'outline' */
  variant?: 'outline' | 'soft' | 'dashed';
  /** Colour for soft / outline (status or label hue) */
  tone?: import('../primitives/Surface').Tone;
  /** pill = fully rounded (keyword chips, comparison chips). @default 'rounded' */
  shape?: 'rounded' | 'pill';
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;

// TagInput/TagInput.d.ts
/** Free-text tags inside a field. Enter or comma adds, Backspace on empty removes the last, pasted comma/newline lists split, duplicates (case-insensitive) flash instead of adding. */
export interface TagInputProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** @default 'Add…' */
  placeholder?: string;
  /** Cap + "n/max" counter */
  max?: number;
  /** Keys that commit the current text. @default ['Enter', ','] */
  separators?: string[];
  /** Normalise each tag before adding — e.g. s => s.toLowerCase() */
  transform?: (tag: string) => string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function TagInput(props: TagInputProps): JSX.Element;

// Text/Text.d.ts
/**
 * Atom. Applies one type role (--type-*) and an optional text colour. Use instead of hand-combining font tokens.
 */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element override. Defaults by variant: headings → h1–h5, title → h3, body → p, label/caption/overline/kpi → span */
  as?: keyof JSX.IntrinsicElements;
  /** @default 'body' */
  variant?: 'display-lg' | 'display-md' | 'display-sm' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'title' | 'kpi' | 'body-lg' | 'body' | 'body-sm' | 'label' | 'caption' | 'overline' | 'section';
  /** Text colour. Omit to inherit the role default. */
  tone?: 'primary' | 'secondary' | 'tertiary' | 'brand' | 'danger' | 'success' | 'warning' | 'inherit';
  /** Single line with ellipsis */
  truncate?: boolean;
  /** Tabular figures for numbers that update or align */
  tabular?: boolean;
  /** JetBrains Mono */
  mono?: boolean;
  children?: React.ReactNode;
}
export declare function Text(props: TextProps): JSX.Element;

// Textarea/Textarea.d.ts
/** Multi-line text field. Grows with content between `rows` and `maxRows` (autoResize), then scrolls. Same label/hint/error/validate/counter API as Input. */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Minimum visible rows. Default 3. */
  rows?: number;
  /** Grow height with content. Default true. */
  autoResize?: boolean;
  /** Height cap when autoResize; scrolls beyond. Default 10. */
  maxRows?: number;
  /** Manual resize handle. Default 'none' when autoResize, else 'vertical'. */
  resize?: 'none' | 'vertical' | 'both';
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  validate?: (value: string) => string | undefined | null | false;
  reserveHint?: boolean;
  /** Live "n / maxLength" counter. Requires maxLength. */
  showCount?: boolean;
  maxLength?: number;
}
export declare function Textarea(props: TextareaProps): JSX.Element;

// ThemeToggle/ThemeToggle.d.ts
/** Light/dark switch — two overlapping rings with filled sun/moon; the selected ring fills and scales up. Uncontrolled by default: sets html[data-theme] and persists via the Velvet theme key (localStorage 'vui-theme'), staying in sync with other toggles. Pass value+onChange to control. variant: light (default, on light/neutral surfaces) · navbar (on Navbar tone="brand" / brand fills) · dark (on dark or media surfaces). */
export interface ThemeToggleProps {
  /** Controlled theme. Omit to drive the document theme directly. */
  value?: 'light' | 'dark' | 'system';
  onChange?: (theme: 'light' | 'dark' | 'system') => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (theme: 'light' | 'dark' | 'system') => void;
  /** @default 'light' */
  variant?: 'light' | 'navbar' | 'dark';
  /** rings = overlapping filled rings (expressive, settings/hero) · segmented = compact pill with line icons, light · system · dark (toolbars, headers, docs). @default 'rings' */
  appearance?: 'rings' | 'segmented';
  /** Adds a third 'System' option (follows OS prefers-color-scheme; stored as 'system'). @default true for segmented, false for rings */
  showSystem?: boolean;
  /** @default 'System' */
  systemLabel?: string;
  /** md = 32px rings, sm = 24px. @default 'md' */
  size?: 'sm' | 'md';
  /** @default 'Light' */
  lightLabel?: string;
  /** @default 'Dark' */
  darkLabel?: string;
  /** Group label. @default 'Color theme' */
  label?: string;
  className?: string;
}
export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;

// TimeStepper/TimeStepper.d.ts
/** Inline hour/minute stepper with AM/PM toggle — for popovers, schedulers and touch where a typed TimePicker is awkward. Values wrap at their bounds. ↑/↓ step, PgUp/PgDn ×5. Value is "HH:MM" 24h. */
export interface TimeStepperProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: string) => void;
  /** Show 12h + AM/PM toggle. Default true. */
  hour12?: boolean;
  /** Minutes per step. Default 5. */
  minuteStep?: number;
  /** Accessible group label */
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}
export declare function TimeStepper(props: TimeStepperProps): JSX.Element;

// Timeline/Timeline.d.ts
export interface TimelineAction {
  id: string;
  label: string;
  /** Velvet icon — renders an icon button; without it the label is shown */
  icon?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  /** Ask inline before running. true = "<label>?" or pass the question text. */
  confirm?: boolean | string;
  confirmLabel?: string;
  /** Per-action handler (else Timeline.onAction). May return a Promise — the confirm row shows Working… and keeps open with the error on reject. */
  onClick?: (item: TimelineItem) => void | Promise<void>;
}
export interface TimelineItem {
  id?: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Extra block — quote, attachment, diff, <Markdown> notes */
  content?: React.ReactNode;
  time?: string;
  datetime?: string;
  icon?: string;
  avatar?: React.ReactNode;
  /** Pipeline progress: done (green check + solid rail), current (brand, ringed), upcoming (hollow, muted). */
  status?: 'done' | 'current' | 'upcoming';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Small status pill next to the title, e.g. { label: 'Synced', icon: 'check', tone: 'success' } */
  badge?: { label: React.ReactNode; icon?: string; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' };
  /** Icon + text facts under the description — date, duration, location */
  meta?: { icon?: string; label: React.ReactNode }[];
  /** Row actions — revealed on hover / focus (always visible on touch) */
  actions?: TimelineAction[];
}
/**
 * Vertical activity/history feed. default = connecting rail + 32px markers (history, audit trail, review schedule).
 * compact = no rail, 24px markers, one line per event. Items can carry a badge, meta facts and actions (edit / add to calendar /
 * delete) — destructive actions confirm inline; async handlers are awaited. onAdd appends a dashed "Add event" row.
 */
export interface TimelineProps {
  items: TimelineItem[];
  /** @default 'default' */
  variant?: 'default' | 'compact';
  /** Hairline between events */
  divided?: boolean;
  /** Fallback handler for actions without onClick */
  onAction?: (actionId: string, item: TimelineItem) => void | Promise<void>;
  onAdd?: () => void;
  /** @default 'Add event' */
  addLabel?: string;
  className?: string;
}
export declare function Timeline(props: TimelineProps): JSX.Element;

// Toast/Toast.d.ts
/** Transient status message. With `duration` it auto-dismisses via a countdown bar that pauses on hover/focus. With `onUndo` it becomes the undo pattern — prefer this over a confirm dialog for reversible destructive actions. */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Icon name; null hides it. Defaults per tone. */
  icon?: string | null;
  /** Called on dismiss click and when the countdown ends */
  onClose?: () => void;
  /** Auto-dismiss after N ms (shows countdown bar). Suggested: 5000, or 6000 with undo. */
  duration?: number;
  /** Renders an Undo button */
  onUndo?: () => void;
  undoLabel?: string;
}
export declare function Toast(props: ToastProps): JSX.Element;
/** Fixed bottom-right stack (full-width bottom on mobile). New toasts spring in. */
export interface ToastRegionProps { children?: React.ReactNode; className?: string }
export declare function ToastRegion(props: ToastRegionProps): JSX.Element;

// ToggleButton/ToggleButton.d.ts
/** Button with an on/off state (aria-pressed) — favourite, follow, bold, mute. It is an ACTION that stays pressed, not a setting (use Switch) and not a one-of-N view choice inside a form (use OptionSwitcher). Inside a ToggleGroup the group owns the state; pass value instead of pressed. */
export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Identity inside a ToggleGroup */
  value?: string;
  /** Icon name or node. Icons with a filled twin (star, heart, bookmark, bell…) swap to '<name>-filled' when pressed. */
  icon?: string | React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Pressed colour. 'neutral' for editor toolbars (B / I / U). @default 'brand' */
  tone?: 'brand' | 'neutral';
  /** Square icon-only button; auto when icon is set and there are no children. Requires label. */
  iconOnly?: boolean;
  /** Accessible name + tooltip for icon-only toggles */
  label?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function ToggleButton(props: ToggleButtonProps): JSX.Element;

// ToggleGroup/ToggleGroup.d.ts
/** Set of ToggleButtons that share state. type="multiple": each independent (B / I / U). type="single": exactly one pressed, clicking the pressed one keeps it (view: grid / list / tree). ←→ move focus between buttons. */
export interface ToggleGroupProps {
  /** @default 'multiple' */
  type?: 'single' | 'multiple';
  /** string[] for multiple, string for single */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: any) => void;
  /** Joined segments with shared border. @default true */
  attached?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible group name */
  label?: string;
  className?: string;
  children: React.ReactNode;
}
export declare function ToggleGroup(props: ToggleGroupProps): JSX.Element;

// Toolbar/Toolbar.d.ts
export interface ToolbarItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  /** Toggle state → aria-pressed (and a check in the overflow menu) */
  active?: boolean;
  disabled?: boolean;
  shortcut?: string;
  /** Show the label next to the icon */
  showLabel?: boolean;
  divider?: boolean;
  /** Pushes following items to the right (dropped when overflowing) */
  spacer?: boolean;
}
/** Tool row that never wraps: items that don't fit collapse into a "⋯" overflow menu (ResizeObserver). ←→ / Home / End move focus. */
export interface ToolbarProps { items: ToolbarItem[]; /** Accessible name */ label?: string; className?: string }
export declare function Toolbar(props: ToolbarProps): JSX.Element;

// Tooltip/Tooltip.d.ts
/** Short hint on hover/focus. Never put essential info or interactive content inside. */
export interface TooltipProps {
  content: React.ReactNode;
  /** @default 'top' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Keyboard shortcut hint, e.g. "⌘K" */
  shortcut?: string;
  /** Force visible (docs/demos) */
  open?: boolean;
  className?: string;
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;

// Tour/Tour.d.ts
export interface TourStep {
  /** CSS selector or ref of the element to spotlight. Omit for a centred intro step. */
  target?: string | React.RefObject<HTMLElement>;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Preferred side; flips when there's no room. @default 'bottom' */
  placement?: 'bottom' | 'top' | 'left' | 'right';
}
/** Guided walkthrough: dims the page, spotlights one element, floats a step card beside it. ← → navigate, Esc skips. Keep it to 3–5 steps; the page behind is inert while open. */
export interface TourProps { steps: TourStep[]; open: boolean; onClose?: () => void; /** Last step "Done" — defaults to onClose */ onFinish?: () => void; defaultStep?: number; /** Spotlight padding px. @default 6 */ padding?: number }
export declare function Tour(props: TourProps): JSX.Element | null;

// TransferList/TransferList.d.ts
export interface TransferItem {
  value: string;
  label: React.ReactNode;
  description?: string;
  /** Right-aligned secondary text (level, count, team) */
  meta?: React.ReactNode;
  /** Initials / <img> in a round lead slot */
  avatar?: React.ReactNode;
  /** Velvet icon name in a square lead slot */
  icon?: string;
  /** Source list is grouped by this (sticky group headers) */
  group?: string;
  /** Extra search text that is not shown */
  keywords?: string;
  disabled?: boolean;
}
/**
 * Pick an ordered subset from a long pool (required skills, team members, permissions, columns). The value is the ordered
 * array of values in the right list.
 * Per-panel search with match highlight · grouped source list · click / Shift-click range / ⌘A select · double-click or Enter moves ·
 * drag items between panels (drags every checked item) · orderable: drag within the right list or ⌥↑ / ⌥↓ · optional max with meter.
 * Duplicate values are reported and block transfer. Stacks vertically under 640px.
 */
export interface TransferListProps {
  items: TransferItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** @default ['Available', 'Selected'] */
  titles?: [string, string];
  /** List height in px. @default 280 */
  height?: number;
  /** Accessible group name */
  label?: string;
  /** @default true */
  searchable?: boolean;
  searchPlaceholder?: [string, string];
  /** Right list can be reordered (drag or ⌥↑↓). @default false */
  orderable?: boolean;
  /** Max items in the right list — shows a meter, blocks adding past it. */
  max?: number;
  /** Group the source list by item.group. @default true */
  groupBy?: boolean;
  emptyText?: [React.ReactNode, React.ReactNode];
  /** Footer move-button labels. @default ['Add', 'Remove'] */
  moveLabels?: [string, string];
  /** Custom row body (checkbox + grip stay). */
  renderItem?: (item: TransferItem, state: { query: string; selected: boolean }) => React.ReactNode;
  className?: string;
}
export declare function TransferList(props: TransferListProps): JSX.Element;

// TreeSelect/TreeSelect.d.ts
export interface TreeSelectNode { id: string; label: string; icon?: string; /** Right-aligned meta — count, code */ meta?: React.ReactNode; children?: TreeSelectNode[]; }
/**
 * Select over hierarchical options — departments, categories, locations. Expand with the chevron or →/←, search filters and
 * auto-expands matches. multiple: tri-state checkboxes (a parent selects all its leaves; value holds leaf ids) with tags in the field.
 * Built on Field + Control. Use Select for flat lists, HierarchyNavigator for drill-down browsing on small screens.
 */
export interface TreeSelectProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  data: TreeSelectNode[];
  /** id (single) or leaf ids (multiple) */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: any) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (value: any) => void;
  multiple?: boolean;
  /** Single mode: parents only expand, can't be picked */
  leavesOnly?: boolean;
  placeholder?: string;
  /** @default true */
  searchable?: boolean;
  defaultExpanded?: string[];
  /** Tags shown before "+N". @default 2 */
  maxTags?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
}
export declare function TreeSelect(props: TreeSelectProps): JSX.Element;

// TreeView/TreeView.d.ts
export interface TreeNode { id: string; label: React.ReactNode; icon?: string; /** Right-aligned count/size */ meta?: React.ReactNode; children?: TreeNode[]; /** Has children that load on first expand (via onLoadChildren) */ lazy?: boolean }
/** Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent · Home/End · Enter select · * expand siblings. Indent guides per level. With checkable: tri-state checkboxes (parent = all / some / none of its leaves), Space or click toggles; value is the list of checked LEAF ids. With onMove: drag rows (top/bottom edge = before/after, middle of a folder = inside) or Alt+↑/↓ reorder among siblings · Alt+→ into the previous sibling · Alt+← out of the parent; moves into itself or its own descendants are rejected; result is announced. */
export interface TreeMove { id: string; targetId: string; position: 'before' | 'after' | 'inside' }
export interface TreeViewProps {
  data: TreeNode[];
  /** Tri-state checkbox per row (permissions, filters). Row icons only render when a node sets icon. */
  checkable?: boolean;
  /** Checked leaf ids (controlled) */
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (leafIds: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Called when a lazy node without children expands. Resolve after you put the children into data; while pending a Loading… row shows, on reject an error row with Retry (Enter / Space on it retries). */
  onLoadChildren?: (node: TreeNode) => Promise<void>;
  /** Enables drag + keyboard moving. The tree never mutates data — apply the move (e.g. with moveTreeNode) and pass new data back. */
  onMove?: (move: TreeMove) => void;
  /** Veto a drop (return false). Self/descendant drops and "inside" on nodes without children/lazy are already rejected. */
  canDrop?: (node: TreeNode, target: TreeNode, position: TreeMove['position']) => boolean;
  /** Accessible name */
  label?: string;
  className?: string;
}
export declare function TreeView(props: TreeViewProps): JSX.Element;
/** Pure helper: returns a new tree with the move applied. */
export declare function moveTreeNode(data: TreeNode[], move: TreeMove): TreeNode[];

// UsageMeter/UsageMeter.d.ts
/** Labelled usage bar: label + "used / limit" + Meter + optional hint. Tone switches automatically at thresholds (70% warning, 90% danger) unless tone is set. */
export interface UsageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: number | null;
  max?: number;
  /** Appended to value and max, e.g. "%", "×", " PLN" */
  unit?: string;
  /** Replaces the "value / max" text */
  valueText?: React.ReactNode;
  hint?: React.ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** Fractions of max for warning / danger. @default [0.7, 0.9] */
  thresholds?: [number, number];
  size?: 'sm' | 'md';
  format?: (v: number) => string;
}
export declare function UsageMeter(props: UsageMeterProps): JSX.Element;

// ValueShift/ValueShift.d.ts
/** "expected → actual" (or before → after) with the result highlighted when it got worse or better. */
export interface ValueShiftProps<T = number> extends React.HTMLAttributes<HTMLSpanElement> {
  from: T;
  to: T;
  format?: (v: T) => React.ReactNode;
  /** Return true when the change is a deterioration → danger colour */
  worse?: (from: T, to: T) => boolean;
  /** Return true when the change is an improvement → success colour */
  better?: (from: T, to: T) => boolean;
  /** Screen-reader prefix */
  label?: string;
}
export declare function ValueShift<T = number>(props: ValueShiftProps<T>): JSX.Element;

// VideoPlayer/VideoPlayer.d.ts
/**
 * Video with Velvet controls over a bottom scrim: play, seek (buffered range shown), mute + volume, time, captions, speed, full screen.
 * Controls fade after 2.5 s of stillness while playing. Keyboard on the focused player: Space / K play · ← → 5 s · J / L 10 s · M mute · F full screen · C captions.
 * Same ratio scale and play button as MediaFrame — use MediaFrame kind="video" for a static thumbnail that opens a player elsewhere.
 */
export interface VideoPlayerProps {
  src: string;
  poster?: string;
  /** Shown top-left over a scrim while controls are visible; also the region label */
  title?: string;
  tracks?: Array<{ src: string; srcLang?: string; label?: string; kind?: 'subtitles' | 'captions' }>;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** --aspect-* token. @default 'video' */
  ratio?: 'video' | 'wide' | 'square' | 'photo' | 'portrait';
  /** Speed button cycles through these. @default [0.75, 1, 1.25, 1.5, 2] */
  rates?: number[];
  onEnded?: () => void;
  className?: string;
}
export declare function VideoPlayer(props: VideoPlayerProps): JSX.Element;
/** Transparent control button shared by VideoPlayer and AudioPlayer. */
export interface PlayerButtonProps { icon?: string; label: string; onClick?: () => void; pressed?: boolean; className?: string; children?: React.ReactNode }
export declare function PlayerButton(props: PlayerButtonProps): JSX.Element;

// VirtualList/VirtualList.d.ts
/**
 * Windowed list for thousands of rows — only the visible window (+ overscan) is in the DOM. Fixed itemHeight, or known variable
 * heights via getItemHeight (prefix-sum offsets, binary search). Invalid sizes fall back to safe defaults; duplicate keys warn and
 * fall back to key+index so rows never collide. Keyboard: ↑↓ PgUp PgDn Home End, Enter activates, Space/Enter selects.
 * Infinite loading: onEndReached fires once per growth when within endThreshold px of the bottom; loading shows a footer row.
 * For tabular data with columns use VirtualTable.
 */
export interface VirtualListProps<T = any> {
  items: T[];
  renderItem?: (item: T, index: number, state: { selected: boolean; focused: boolean }) => React.ReactNode;
  /** Row height px. @default 48 */
  itemHeight?: number;
  /** Per-row height when rows differ (must be known up front) */
  getItemHeight?: (item: T, index: number) => number;
  /** Viewport height px. @default 400 */
  height?: number;
  /** Rows rendered outside the viewport. @default 6 */
  overscan?: number;
  /** Space between rows px. @default 0 */
  gap?: number;
  /** Stable key. @default item.id ?? item.key ?? index */
  getKey?: (item: T, index: number) => string | number;
  /** listbox semantics + selected styling */
  selectable?: boolean;
  /** Selected key, or keys (multi) */
  selected?: string | number | (string | number)[];
  onSelect?: (key: string | number, item: T) => void;
  /** Click / Enter */
  onActivate?: (item: T, index: number) => void;
  onEndReached?: () => void;
  /** @default 200 */
  endThreshold?: number;
  loading?: boolean;
  loadingLabel?: string;
  empty?: React.ReactNode;
  /** Accessible name */
  label?: string;
  /** Hairline between rows */
  divided?: boolean;
  className?: string;
}
export declare function VirtualList<T = any>(props: VirtualListProps<T>): JSX.Element;

// VirtualTable/VirtualTable.d.ts
export interface VirtualColumn<T = any> { key: string; label: React.ReactNode; /** Fixed px */ width?: number; /** Share of remaining space. @default 1 */ flex?: number; align?: 'left' | 'right'; render?: (row: T, index: number) => React.ReactNode }
/** Windowed table for 10k–1M rows: only visible rows (+ overscan) are in the DOM. Fixed row height. ↑↓ PageUp/Down Home End keep the focused row in view. Footer reports the visible range. */
export interface VirtualTableProps<T = any> {
  columns: VirtualColumn<T>[];
  rows: T[];
  /** px. @default 40 */
  rowHeight?: number;
  /** Viewport px. @default 400 */
  height?: number;
  /** @default 8 */
  overscan?: number;
  rowKey?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}
export declare function VirtualTable<T = any>(props: VirtualTableProps<T>): JSX.Element;

// VisuallyHidden/VisuallyHidden.d.ts
/** Accessibility utility. Content for screen readers only (.vui-sr-only) — extra context for icon buttons, table captions, form group names. focusable = becomes visible when it (or a child) receives focus. */
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> { /** @default 'span' */ as?: keyof JSX.IntrinsicElements; focusable?: boolean; children?: React.ReactNode }
export declare function VisuallyHidden(props: VisuallyHiddenProps): JSX.Element;
/** First focusable element on the page. Hidden until Tab reaches it, then slides in top-left; moves focus to the target landmark (adds tabindex=-1 if needed). */
export interface SkipLinkProps { /** Id of the main landmark. @default '#main' */ href?: string; /** @default 'Skip to main content' */ children?: React.ReactNode; className?: string }
export declare function SkipLink(props: SkipLinkProps): JSX.Element;
/**
 * Announces dynamic changes ("3 results", "Saved", "Upload failed") to screen readers. Mount it once, then change message.
 * To repeat an identical message pass a new object: { text: 'Saved', id: Date.now() }. assertive interrupts — reserve for errors.
 */
export interface LiveRegionProps {
  message?: string | { text: string; id?: string | number };
  /** @default 'polite' */
  politeness?: 'polite' | 'assertive';
  /** ms, 0 = keep. @default 5000 */
  clearAfter?: number;
  /** Also show the text (status line) instead of hiding it */
  visible?: boolean;
  className?: string;
}
export declare function LiveRegion(props: LiveRegionProps): JSX.Element;

// Watermark/Watermark.d.ts
/**
 * Repeating diagonal text over its children — "Confidential", "Draft", the viewer's email on shared documents and previews.
 * Painted with --fg-primary through a CSS mask, so it follows the theme. Never intercepts clicks or selection. Deterrent only — not access control.
 */
export interface WatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default 'Confidential' */
  text?: string;
  /** Multi-line stamp, e.g. ['anna@velvet.io', '2026-10-06'] — overrides text */
  lines?: string[];
  /** Degrees. @default -24 */
  rotate?: number;
  /** [x, y] px between stamps. @default [96, 72] */
  gap?: [number, number];
  /** @default 14 */
  fontSize?: number;
  /** @default 600 */
  fontWeight?: number;
  /** 0.05–0.12 keeps content readable. @default 0.08 */
  opacity?: number;
  children?: React.ReactNode;
}
export declare function Watermark(props: WatermarkProps): JSX.Element;

// Weekday/Weekday.d.ts
/** Atom. Short weekday label (overline type) for date grids. Pair with weekdayNames(locale, weekStartsOn, length) from primitives/date.js. */
export interface WeekdayProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'span' */
  as?: keyof JSX.IntrinsicElements;
  /** Brand colour for the current day */
  today?: boolean;
  children?: React.ReactNode;
}
export declare function Weekday(props: WeekdayProps): JSX.Element;

// Wizard/Wizard.d.ts
export interface WizardStep {
  label: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  /** Return an error string (sync or async) to block Next */
  validate?: () => string | null | undefined | Promise<string | null | undefined>;
  /** Hide the step heading above content */
  title?: false;
}
/** Multi-step flow that owns its index: Stepper on top, one step's content, Back / Next → Finish. Validation errors mark the step red and block. Focus moves to the new panel. */
export interface WizardProps {
  steps: WizardStep[];
  /** Awaited — Finish shows a spinner meanwhile */
  onFinish?: () => void | Promise<void>;
  /** Shows Cancel instead of Back on step 1 */
  onCancel?: () => void;
  /** @default 'Finish' */
  finishLabel?: string;
  defaultStep?: number;
  className?: string;
}
export declare function Wizard(props: WizardProps): JSX.Element;

// primitives/constants.d.ts
/** Milliseconds in one day (primitives/date.js). */
export declare const DAY_MS: number;
/** Status tones in display order (primitives/tone.js). */
export declare const TONES: readonly ['neutral', 'brand', 'info', 'success', 'warning', 'danger'];
/** Default icon name for each tone (primitives/tone.js). */
export declare const TONE_ICON: Record<'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger', string>;
/** SVG path `d` strings of the Recron "R" signet and wordmark (display/recron-logo-paths.js). BrandLogo positions and scales them. */
export declare const R_MARK: string[];
export declare const R_WORD: string[];
/** SVG path `d` strings of the QuantCore "Q" signet and wordmark (display/quantcore-logo-data.js). */
export declare const Q_MARK: string;
export declare const Q_WORD: string;

// RobotProcessingIndicator/RobotProcessingIndicator.d.ts
/** Inline "the assistant is working" status: a softly blinking robot icon with a visible label. role="status"; the blink stops under prefers-reduced-motion. Use it beside a heading or inside a panel while an AI task runs; use Loader or Spinner when there is no label to show. */
export interface RobotProcessingIndicatorProps {
  /** Visible status text. @default 'Processing' */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function RobotProcessingIndicator(props: RobotProcessingIndicatorProps): JSX.Element;

// StatusBar/StatusBar.d.ts
/** App status strip at the bottom of the window — connection, context, state, clocks. fixed pins it to the viewport (leave ~32px of bottom padding on the page). Items with hide="md" drop below 1024px, hide="sm" below 640px. */
export interface StatusBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Left group */
  start?: React.ReactNode;
  /** Right group (pushed to the end) */
  end?: React.ReactNode;
  /** position: fixed at the bottom of the viewport. @default false */
  fixed?: boolean;
  /** Landmark name. @default 'Status' */
  label?: string;
  children?: React.ReactNode;
}
export declare function StatusBar(props: StatusBarProps): JSX.Element;
/** One segment of a StatusBar: a status Dot (from tone) or an icon, then text. */
export interface StatusBarItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  /** Soft ping on the dot (live states) */
  pulse?: boolean;
  /** Icon instead of the dot */
  icon?: string | React.ReactNode;
  /** Mono, tabular figures (IDs, versions, clocks) */
  mono?: boolean;
  /** Primary text colour and weight; with tone="danger" the text turns danger */
  strong?: boolean;
  /** Drop on narrow screens: md = below 1024px, sm = below 640px */
  hide?: 'md' | 'sm';
  title?: string;
  children?: React.ReactNode;
}
export declare function StatusBarItem(props: StatusBarItemProps): JSX.Element;

// MarketSessionClock/MarketSessionClock.d.ts
/** A trading venue's regular session. Times are local to timeZone. */
export interface MarketHours {
  code: string;
  name?: string;
  /** IANA zone, e.g. 'Europe/Warsaw' */
  timeZone?: string;
  /** 'HH:MM'. @default '09:00' */
  open?: string;
  /** 'HH:MM'. @default '17:00' */
  close?: string;
  /** Trading weekdays, 0 = Sunday. @default [1,2,3,4,5] */
  days?: number[];
  /** Closed dates 'YYYY-MM-DD' (local to timeZone) */
  holidays?: string[];
  /** Early closes: { 'YYYY-MM-DD': 'HH:MM' } */
  earlyClose?: Record<string, string>;
  /** 24/7 venues (crypto) */
  alwaysOpen?: boolean;
}
export interface MarketSessionState { state: 'open' | 'pre' | 'closed'; reason?: 'weekend' | 'holiday' | 'after'; opensAt?: string; minutesToOpen?: number; closesAt?: string; minutesToClose?: number; early?: boolean; alwaysOpen?: boolean }
/** Pure helper: the session state of one venue at a moment. */
export declare function marketSession(market: MarketHours, date?: Date): MarketSessionState;
/** Open / opening-in / closed state per venue, recomputed every refresh ms. variant="inline" renders StatusBarItems (for a StatusBar); "list" a small list for cards. Holidays are only what you pass — say so in the UI when the calendar is incomplete. */
export interface MarketSessionClockProps {
  markets: MarketHours[];
  /** Fixed moment (tests, specimens); omit for the live clock */
  now?: Date | number;
  /** @default 30000 */
  refresh?: number;
  /** @default 'inline' */
  variant?: 'inline' | 'list';
  /** Text templates: open '{t}', early '{t}', opensIn '{d}', closed, holiday, allDay, hours, minutes */
  labels?: Partial<Record<'open' | 'early' | 'opensIn' | 'closed' | 'holiday' | 'allDay' | 'hours' | 'minutes', string>>;
  /** inline: passed to each StatusBarItem */
  hide?: 'md' | 'sm';
  /** Tooltip (inline) or list name */
  title?: string;
  className?: string;
}
export declare function MarketSessionClock(props: MarketSessionClockProps): JSX.Element;

// ContextSwitcher/ContextSwitcher.d.ts
export interface ContextItem { id: string; label?: React.ReactNode; description?: React.ReactNode; icon?: string; /** danger marks a context with real consequences (a live account): the chip gets a ring */ tone?: 'neutral' | 'info' | 'warning' | 'danger' }
/** Account / environment / workspace switcher on a NavbarChip with a menu. confirmWhen(next, current) returning true opens a ConfirmDialog before switching (e.g. into a live account). */
export interface ContextSwitcherProps {
  items: ContextItem[];
  value?: string;
  onValueChange?: (id: string, item: ContextItem) => void;
  confirmWhen?: (next: ContextItem, current: ContextItem) => boolean;
  confirmTitle?: React.ReactNode | ((next: ContextItem, current: ContextItem) => React.ReactNode);
  confirmDescription?: React.ReactNode | ((next: ContextItem, current: ContextItem) => React.ReactNode);
  confirmLabel?: string | ((next: ContextItem, current: ContextItem) => string);
  cancelLabel?: string | ((next: ContextItem, current: ContextItem) => string);
  /** @default 'danger' */
  confirmTone?: 'primary' | 'danger';
  /** Menu group heading */
  sectionLabel?: string;
  /** More menu rows after a divider (MenuItem) */
  extraItems?: MenuItem[];
  /** NavbarChip tone. @default 'on-color' */
  tone?: 'on-color' | 'surface';
  icon?: string | React.ReactNode;
  /** Accessible name of the chip; start it with the visible text */
  label?: string;
  /** @default 300 */
  width?: number;
  /** @default 'end' */
  align?: 'start' | 'end';
  /** Chip content; defaults to the current item's label */
  children?: React.ReactNode;
  className?: string;
}
export declare function ContextSwitcher(props: ContextSwitcherProps): JSX.Element;

// KillSwitchButton/KillSwitchButton.d.ts
/** Emergency stop trigger. Click opens a typed ConfirmDialog (requireText); onActivate runs only after confirmation. While active it shows activeLabel and calls onActiveClick (e.g. open the recovery view). variant="chip" sits in a brand menubar (danger fill), "button" anywhere else. */
export interface KillSwitchButtonProps {
  active?: boolean;
  onActivate?: () => void;
  onActiveClick?: () => void;
  /** What the stop covers, appended to the accessible name: "ACC-01 · PAPER" */
  scope?: string;
  /** @default 'Kill Switch' */
  label?: string;
  /** @default 'STOP' */
  activeLabel?: string;
  title?: React.ReactNode;
  /** Say what the stop does and does NOT do (orders, positions, protections) */
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** @default 'STOP' */
  requireText?: string;
  /** @default 'chip' */
  variant?: 'chip' | 'button';
  /** chip: icon only below 1280px. @default true */
  collapse?: boolean;
  /** Controlled dialog (open it from a command palette) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accessibleLabel?: string;
  className?: string;
}
export declare function KillSwitchButton(props: KillSwitchButtonProps): JSX.Element;

// PriceCell/PriceCell.d.ts
/** Live-price pub/sub. set / setMany notify only subscribers of that symbol, so a tick re-renders the cells that show it and nothing else. */
export interface QuoteStore { get(symbol: string): number | undefined; set(symbol: string, value: number): void; setMany(values: Record<string, number>): void; subscribe(symbol: string, fn: (value: number) => void): () => void }
export declare function createQuoteStore(initial?: Record<string, number>): QuoteStore;
/** Hook: the symbol's current value in store (fallback while it has none). */
export declare function useQuote(store: QuoteStore | undefined, symbol: string | undefined, fallback?: number | null): number | null | undefined;
/** A live price in tabular figures. When value changes it flashes up (trend-up) or down (trend-down) for --dur-slower; no flash under reduced motion. null renders an em dash. */
export interface PriceCellProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Static value, or the fallback until quotes has the symbol */
  value?: number | null | undefined;
  /** Live source: with symbol, the cell subscribes and re-renders on its own */
  quotes?: QuoteStore;
  symbol?: string;
  /** @default 2 */
  digits?: number;
  locale?: string;
  currency?: string;
  /** Optional Delta after the price */
  change?: number | null;
  /** @default 'percent' */
  changeFormat?: 'percent' | 'pp' | 'number';
  /** @default true */
  flash?: boolean;
  /** lg = display size for page headers. @default 'sm' */
  size?: 'sm' | 'md' | 'lg';
  /** Privacy mode: masks the figure */
  hidden?: boolean;
  /** Accessible prefix, e.g. "Last" */
  label?: string;
}
export declare function PriceCell(props: PriceCellProps): JSX.Element;

// InstrumentHeader/InstrumentHeader.d.ts
/** Masthead of an instrument page: symbol (h1), name · venue, live price (PriceCell lg), change, session state, key facts and actions. Use instead of PageHeader on instrument and company pages. */
export interface InstrumentHeaderProps {
  symbol: React.ReactNode;
  name?: string;
  venue?: string;
  /** Small outline badge after the symbol (asset class, exchange code) */
  tag?: React.ReactNode;
  badges?: React.ReactNode;
  price?: number | null;
  /** Live source for the price (see PriceCell) */
  quotes?: QuoteStore;
  /** Key in quotes; defaults to symbol when it is a string */
  quoteKey?: string;
  /** Reference price (previous close): with quotes, change and changeAbs follow the live price */
  reference?: number;
  /** @default 2 */
  digits?: number;
  locale?: string;
  currency?: string;
  /** Percent change */
  change?: number | null;
  /** Absolute change in price units */
  changeAbs?: number | null;
  session?: { state: 'open' | 'pre' | 'closed'; label: React.ReactNode; tone?: 'success' | 'warning' | 'neutral' | 'danger' };
  /** Key facts under the quote: [{ label, value, mono? }] (mono by default) */
  meta?: Array<{ label: React.ReactNode; value: React.ReactNode; mono?: boolean }>;
  actions?: React.ReactNode;
  hidden?: boolean;
  className?: string;
}
export declare function InstrumentHeader(props: InstrumentHeaderProps): JSX.Element;

// OrderTicket/OrderTicket.d.ts
export interface OrderTicketOrder { side: 'buy' | 'sell'; type: 'market' | 'limit' | 'stop'; qty: number; limitPrice: number | null; stopPrice: number | null; stopLoss: number | null; takeProfit: number | null; tif: 'day' | 'gtc'; notional: number | null; risk: number | null }
/** Compact order entry: side (radio, ←→), type, quantity, price, stop loss / take profit, time in force; a live estimate (notional, risk to stop, % of equity, reward:risk, buying power after) and the problems that block or warn. Review opens a ConfirmDialog; onSubmit gets the order. It never sends anything by itself. */
export interface OrderTicketProps {
  symbol?: string;
  /** Last / reference price (fallback until quotes has symbol) */
  price?: number | null;
  /** Live source: the side buttons and estimates follow the price */
  quotes?: QuoteStore;
  /** @default 2 */
  digits?: number;
  locale?: string;
  /** @default 'USD' */
  currency?: string;
  /** @default 1 */
  qtyStep?: number;
  minQty?: number;
  /** Shown after the quantity: "oz", "shares" */
  qtyUnit?: string;
  defaultQty?: number;
  /** For risk as % of equity */
  equity?: number;
  buyingPower?: number;
  /** Per-trade risk limit in % of equity; above it the order is blocked */
  maxRiskPct?: number;
  /** Shown in the description and the confirmation */
  account?: string;
  /** Environment badge in the header: "PAPER", "LIVE" */
  envLabel?: string;
  /** @default 'info' */
  envTone?: 'neutral' | 'info' | 'warning' | 'danger';
  /** Confirmation tone; use danger for live money. @default 'primary' */
  confirmTone?: 'primary' | 'danger';
  /** Reason orders are blocked (trading state, gates); disables review */
  blocked?: string | null;
  /** Only position-reducing orders (CLOSE_ONLY) */
  reduceOnly?: boolean;
  /** Signed open position, for reduceOnly */
  position?: number;
  /** Privacy mode */
  hidden?: boolean;
  onSubmit?: (order: OrderTicketOrder) => void;
  /** Override any text (keys: title, buy, sell, market, limit, stop, qty, sl, tp, tif, review, send, cancel, noStop, wrongSl, overLimit, overPower, reduceOnly, estimate …) */
  labels?: Record<string, string>;
  className?: string;
}
export declare function OrderTicket(props: OrderTicketProps): JSX.Element;

// WidgetGrid/WidgetGrid.d.ts
export interface WidgetGridWidget { id: string; title: string; /** Default column span. @default 1 */ span?: number; content: React.ReactNode }
export interface WidgetGridLayout { order?: string[]; hidden?: string[]; spans?: Record<string, number> }
/** Dashboard the viewer arranges. Controlled: pass layout, persist what onLayoutChange gives. In editing mode each widget gets a bar (drag grip, earlier / later, narrower / wider, hide) and hidden widgets wait in a tray. Columns collapse to 2 below 1024px and 1 below 768px. */
export interface WidgetGridProps {
  widgets: WidgetGridWidget[];
  layout?: WidgetGridLayout;
  onLayoutChange?: (layout: Required<WidgetGridLayout>) => void;
  editing?: boolean;
  /** @default 3 */
  columns?: 2 | 3 | 4;
  labels?: Partial<Record<'earlier' | 'later' | 'wider' | 'narrower' | 'hide' | 'hiddenTitle' | 'show' | 'drag', string>>;
  className?: string;
}
export declare function WidgetGrid(props: WidgetGridProps): JSX.Element;
