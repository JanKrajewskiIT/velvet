import { formatMessage, type Locale } from '@jankrajewskiit/i18n';

import type { useTranslate } from '../../i18n/useTranslate';
import { SESSION_MINUTES_PER_HOUR } from './marketSession';
import type { MarketSessionLabels, MarketSessionState } from './marketSessionTypes';

interface SessionTextOptions {
  translate: ReturnType<typeof useTranslate>;
  locale: Locale;
  timeFormat: Intl.DateTimeFormat;
  labels?: Partial<MarketSessionLabels>;
}

const displayTime = (value: string, formatter: Intl.DateTimeFormat): string => {
  const [hours, minutes] = value.split(':').map(Number);
  return formatter.format(new Date(Date.UTC(2000, 0, 1, hours ?? 0, minutes ?? 0)));
};

export const marketSessionText = (state: MarketSessionState, options: SessionTextOptions): string => {
  const translate = options.translate;
  const labels = options.labels;
  const template = (value: string | undefined, fallback: string, params: Record<string, string>): string =>
    value === undefined ? fallback : formatMessage(value, options.locale, params);
  switch (state.state) {
    case 'open': {
      if (state.alwaysOpen) return labels?.allDay ?? translate('velvet.trading.marketSessionClock.allDay');
      const t = displayTime(state.closesAt, options.timeFormat);
      return state.early
        ? template(labels?.early, translate('velvet.trading.marketSessionClock.early', { t }), { t })
        : template(labels?.open, translate('velvet.trading.marketSessionClock.open', { t }), { t });
    }
    case 'pre': {
      const minutes = state.minutesToOpen % SESSION_MINUTES_PER_HOUR;
      const minuteUnit = labels?.minutes ?? translate('velvet.trading.marketSessionClock.minutes');
      const d =
        state.minutesToOpen >= SESSION_MINUTES_PER_HOUR
          ? translate('velvet.trading.marketSessionClock.durationHours', {
              hours: Math.floor(state.minutesToOpen / SESSION_MINUTES_PER_HOUR),
              minutes,
              hourUnit: labels?.hours ?? translate('velvet.trading.marketSessionClock.hours'),
              minuteUnit,
            })
          : translate('velvet.trading.marketSessionClock.durationMinutes', { minutes, minuteUnit });
      return template(labels?.opensIn, translate('velvet.trading.marketSessionClock.opensIn', { d }), { d });
    }
    case 'closed':
      return state.reason === 'holiday'
        ? (labels?.holiday ?? translate('velvet.trading.marketSessionClock.holiday'))
        : (labels?.closed ?? translate('velvet.trading.marketSessionClock.closed'));
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
};
