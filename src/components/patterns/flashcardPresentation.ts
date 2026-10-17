import type { JSX } from 'solid-js';

const LONG_CONTENT_LENGTH = 140;
const contentLength = (content: JSX.Element) => (typeof content === 'string' ? content.length : 0);

export const isLongFlashcardContent = (content: JSX.Element): boolean => contentLength(content) > LONG_CONTENT_LENGTH;

export const flashcardHeight = (front: JSX.Element, back: JSX.Element): number =>
  Math.round(
    Math.max(
      isLongFlashcardContent(front) || isLongFlashcardContent(back) ? 360 : 240,
      Math.min(520, 200 + Math.max(contentLength(front), contentLength(back)) * 0.45),
    ),
  );
