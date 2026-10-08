import { defineDictionary } from '@jankrajewskiit/i18n';

export const displayEn = defineDictionary({
  markdownEditDialog: {
    saving: 'Saving…',
    saveError: 'Couldn’t save. Your changes are kept — try again.',
    saveShortcut: '{modifier}↵ to save',
    discardPrompt: 'Discard unsaved changes?',
    keepEditing: 'Keep editing',
    discard: 'Discard',
  },
  markdownEditor: {
    placeholder: 'Write in Markdown…',
    previewEmpty: 'Nothing to preview yet.',
    modesLabel: 'Editor view',
    toolbarLabel: 'Formatting',
    previewLabel: 'Preview',
    markdownSupported: 'Markdown supported',
    wordCount: '{count, plural, one {# word} other {# words}}',
    modes: {
      write: 'Write',
      split: 'Split',
      preview: 'Preview',
    },
    tools: {
      heading: 'Heading',
      bold: 'Bold',
      italic: 'Italic',
      strikethrough: 'Strikethrough',
      bulletedList: 'Bulleted list',
      numberedList: 'Numbered list',
      checklist: 'Checklist',
      quote: 'Quote',
      inlineCode: 'Inline code',
      link: 'Link',
      codeBlock: 'Code block',
    },
    placeholders: {
      linkText: 'link text',
      code: 'code',
    },
  },
  qrCode: {
    label: 'QR code: {value}',
    unavailable: 'QR code unavailable',
    tooLong: 'Too long for a QR code',
  },
  tag: {
    removeItem: 'Remove {name}',
  },
  watermark: {
    text: 'Confidential',
  },
});
