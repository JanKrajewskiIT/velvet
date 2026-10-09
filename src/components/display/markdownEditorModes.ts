import type { I18nKey } from '@jankrajewskiit/i18n';

export const MARKDOWN_EDITOR_MODES = [
  { id: 'write', labelKey: 'velvet.display.markdownEditor.modes.write' },
  { id: 'split', labelKey: 'velvet.display.markdownEditor.modes.split' },
  { id: 'preview', labelKey: 'velvet.display.markdownEditor.modes.preview' },
] as const satisfies readonly { id: string; labelKey: I18nKey }[];

export type MarkdownEditorMode = (typeof MARKDOWN_EDITOR_MODES)[number]['id'];
