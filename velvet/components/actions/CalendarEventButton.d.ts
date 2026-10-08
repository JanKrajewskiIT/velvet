import * as React from 'react';
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
 * "Add to calendar" for interviews, deadlines, meetings. One provider = plain button; several = menu (Google · Outlook.com · .ics download
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
