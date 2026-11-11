export interface MarketHours {
  code: string;
  name?: string;
  /** IANA time zone. Defaults to UTC. */
  timeZone?: string;
  /** Local HH:MM. @default '09:00' */
  open?: string;
  /** Local HH:MM on the same day. @default '17:00' */
  close?: string;
  /** Trading weekdays, 0 = Sunday. Defaults to Monday–Friday. */
  days?: readonly number[];
  /** Local closed dates, YYYY-MM-DD. */
  holidays?: readonly string[];
  /** Local dates mapped to earlier closing times. */
  earlyClose?: Readonly<Record<string, string>>;
  alwaysOpen?: boolean;
}

export type MarketSessionState =
  | { state: 'open'; alwaysOpen: true }
  | { state: 'open'; alwaysOpen?: false; closesAt: string; minutesToClose: number; early: boolean }
  | { state: 'pre'; opensAt: string; minutesToOpen: number }
  | { state: 'closed'; reason: 'weekend' | 'holiday' | 'after' };

export interface MarketSessionLabels {
  open: string;
  early: string;
  opensIn: string;
  closed: string;
  holiday: string;
  allDay: string;
  hours: string;
  minutes: string;
}
