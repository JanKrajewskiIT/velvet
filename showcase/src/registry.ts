import type { JSX } from 'solid-js';

export const GROUPS = [
  'Primitives',
  'Actions',
  'Forms',
  'Menus',
  'Display',
  'Navigation',
  'Feedback',
  'Data',
  'Charts',
  'Media',
  'Layout',
  'Patterns',
] as const;

export type DemoGroup = (typeof GROUPS)[number];

export interface DemoEntry {
  id: string;
  group: DemoGroup;
  title: string;
  description: string;
  render: () => JSX.Element;
}
