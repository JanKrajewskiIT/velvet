export const DEMO_FLASHCARD_ITEMS = [
  {
    id: 'fc-1',
    category: 'SolidJS',
    question: 'What problem does `createMemo` solve?',
    answer: 'It caches derived values and only recomputes when tracked dependencies change.',
  },
  {
    id: 'fc-2',
    category: 'TypeScript',
    question: 'When would you prefer a discriminated union?',
    answer: 'When state variants need precise narrowing and exhaustiveness checks.',
  },
  {
    id: 'fc-3',
    category: 'CSS',
    question: 'What is the benefit of CSS custom properties?',
    answer: 'They allow dynamic theming and composition directly in the cascade.',
  },
];

export const DEMO_PRACTICE_SETUP_CATEGORIES = [
  { value: 'solid-basics', label: 'SolidJS / Basics' },
  { value: 'solid-performance', label: 'SolidJS / Performance' },
  { value: 'ts-advanced', label: 'TypeScript / Advanced' },
  { value: 'css-architecture', label: 'CSS / Architecture' },
];
