import type { MultiSelectOption } from '@jankrajewskiit/ui';

export type DemoRoleValue = 'admin' | 'editor' | 'viewer';

export const DEMO_INPUT_PRESET_COLORS = [
  '#1467ff',
  '#0c52cf',
  '#02a4ff',
  '#2e7d32',
  '#ed6c02',
  '#d32f2f',
  '#1b78ff',
  '#00838f',
];

export const DEMO_FRAMEWORK_OPTIONS: MultiSelectOption[] = [
  { value: 'solid', label: 'SolidJS' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'qwik', label: 'Qwik' },
];
