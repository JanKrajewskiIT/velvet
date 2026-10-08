import type { velvetEn } from './en';

declare module '@jankrajewskiit/i18n' {
  // Module augmentation can only extend an interface; the members come from the dictionary type.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface I18nDictionary extends Pick<typeof velvetEn, keyof typeof velvetEn> {}
}
