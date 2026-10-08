import * as React from 'react';
export interface OrganizerEvent { id: string | number; date: Date | string; title: string; /** "09:30" — sorts the day */ time?: string; location?: string; color?: string }
/** Month planner: day grid with event chips (+N more) beside a detail panel for the selected day, with quick add and delete. Arrow keys move between days; Today / prev / next. Stacks under 820px. */
export interface CalendarOrganizerProps { events: OrganizerEvent[]; /** Enables add + delete */ onEventsChange?: (events: OrganizerEvent[]) => void; onEventClick?: (e: OrganizerEvent) => void; defaultMonth?: Date; weekStartsOn?: number; locale?: string; /** Chips per cell. @default 2 */ maxChips?: number; className?: string }
export declare function CalendarOrganizer(props: CalendarOrganizerProps): JSX.Element;
