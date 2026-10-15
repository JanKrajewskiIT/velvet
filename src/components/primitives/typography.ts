import type { ElementTag } from '../../utils/polymorphic';

export const HEADING_ROLES = {
  'display-lg': 'h1',
  'display-md': 'h1',
  'display-sm': 'h2',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  'title-lg': 'h3',
  title: 'h3',
} as const satisfies Record<string, ElementTag>;

export type HeadingVariant = keyof typeof HEADING_ROLES;

export const TEXT_ROLES = {
  ...HEADING_ROLES,
  kpi: 'span',
  overline: 'span',
  section: 'span',
  caption: 'span',
  label: 'span',
  'label-sm': 'span',
  micro: 'span',
  code: 'code',
  kbd: 'kbd',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  'button-sm': 'span',
  button: 'span',
  'button-lg': 'span',
} as const satisfies Record<string, ElementTag>;

export type TextVariant = keyof typeof TEXT_ROLES;

/** Font role only; leaves colour, layout and element semantics to the owner. */
export const typographyClass = (variant: TextVariant): string => `vui-type-${variant}`;

const TEXT_ROLE_CLASSES: Partial<Record<TextVariant, string>> = {
  label: 'vui-label-text',
  section: 'vui-section-text',
  code: 'vui-code-text',
  kbd: 'vui-kbd-text',
  'button-sm': 'vui-button-sm-text',
  button: 'vui-button-text',
  'button-lg': 'vui-button-lg-text',
};

export const textRoleClass = (variant: TextVariant): string => TEXT_ROLE_CLASSES[variant] ?? `vui-${variant}`;
