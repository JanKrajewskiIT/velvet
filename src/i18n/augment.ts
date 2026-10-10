import type { velvetEn } from './en';

declare module '@jankrajewskiit/i18n' {
  interface I18nDictionary extends Pick<typeof velvetEn, keyof typeof velvetEn> {}
}
