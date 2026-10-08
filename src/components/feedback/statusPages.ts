import type { I18nKey } from '@jankrajewskiit/i18n';

import type { StateTone } from './StateTile';

export type StatusPageCode = 404 | 403 | 500 | 'offline' | 'success' | 'warning' | 'info';

export interface StatusPageCopy {
  /** Short caption next to the error code. */
  tagKey?: I18nKey;
  titleKey: I18nKey;
  descriptionKey: I18nKey;
  icon: string;
  tone: StateTone;
}

export const STATUS_PAGES: Record<StatusPageCode, StatusPageCopy> = {
  404: {
    tagKey: 'velvet.feedback.statusPage.notFound.tag',
    titleKey: 'velvet.feedback.statusPage.notFound.title',
    descriptionKey: 'velvet.feedback.statusPage.notFound.description',
    icon: 'search',
    tone: 'brand',
  },
  403: {
    tagKey: 'velvet.feedback.statusPage.forbidden.tag',
    titleKey: 'velvet.feedback.statusPage.forbidden.title',
    descriptionKey: 'velvet.feedback.statusPage.forbidden.description',
    icon: 'lock',
    tone: 'warning',
  },
  500: {
    tagKey: 'velvet.feedback.statusPage.serverError.tag',
    titleKey: 'velvet.feedback.statusPage.serverError.title',
    descriptionKey: 'velvet.feedback.statusPage.serverError.description',
    icon: 'triangle-alert',
    tone: 'danger',
  },
  offline: {
    titleKey: 'velvet.feedback.statusPage.offline.title',
    descriptionKey: 'velvet.feedback.statusPage.offline.description',
    icon: 'globe',
    tone: 'info',
  },
  success: {
    titleKey: 'velvet.feedback.statusPage.success.title',
    descriptionKey: 'velvet.feedback.statusPage.success.description',
    icon: 'circle-check',
    tone: 'success',
  },
  warning: {
    titleKey: 'velvet.feedback.statusPage.warning.title',
    descriptionKey: 'velvet.feedback.statusPage.warning.description',
    icon: 'triangle-alert',
    tone: 'warning',
  },
  info: {
    titleKey: 'velvet.feedback.statusPage.info.title',
    descriptionKey: 'velvet.feedback.statusPage.info.description',
    icon: 'info',
    tone: 'info',
  },
};

/** Numeric codes are errors; the named statuses are outcomes. */
export const isErrorCode = (code: StatusPageCode): code is 404 | 403 | 500 => typeof code === 'number';
