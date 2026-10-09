import type { JSX } from 'solid-js';

/** Same numbering and names as the design-system showcase (`velvet/templates/showcase/cards.json`). */
export const GROUPS = [
  '01 Overview',
  '02 Brand',
  '03 Color',
  '04 Type',
  '05 Icons',
  '06 Shape',
  '07 Space & Layout',
  '08 Depth',
  '09 Motion',
  '10 State',
  '11 Atoms',
  '12 Layout',
  '13 Display',
  '14 Feedback',
  '15 Actions',
  '16 Inputs',
  '17 Selection',
  '18 Pickers',
  '19 Forms',
  '20 Overlays',
  '21 Menus',
  '22 Navigation',
  '23 Cards',
  '24 Media',
  '25 Data viz',
  '26 Data',
  '27 Planning',
  '28 Patterns',
] as const;

export type DemoGroup = (typeof GROUPS)[number];

export interface DemoEntry {
  id: string;
  group: DemoGroup;
  title: string;
  description: string;
  render: () => JSX.Element;
}
