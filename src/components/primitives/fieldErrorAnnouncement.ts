export const FIELD_ERROR_ANNOUNCEMENTS = Object.freeze({ polite: 'polite', none: 'none' } as const);

export type FieldErrorAnnouncement = (typeof FIELD_ERROR_ANNOUNCEMENTS)[keyof typeof FIELD_ERROR_ANNOUNCEMENTS];

export interface FieldErrorAnnouncementProps {
  /** Use none when an application summary or announcer owns the error message. @default 'polite' */
  readonly 'data-field-error-announcement'?: FieldErrorAnnouncement | undefined;
}
