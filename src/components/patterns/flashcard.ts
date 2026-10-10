import type { I18nKey } from '@jankrajewskiit/i18n';
import type { JSX } from 'solid-js';

export interface FlashDeck {
  id: string;
  name: string;
  total: number;
  due?: number;
}

export interface Flashcard {
  id?: string | number;
  front: JSX.Element;
  back: JSX.Element;
  hint?: string;
  example?: JSX.Element;
}

export interface FlashResult {
  id: string | number;
  known: boolean;
}

export const FLASH_ORDERS = Object.freeze(['due', 'random', 'new'] as const);
export type FlashOrder = (typeof FLASH_ORDERS)[number];

export const FLASH_DIRECTIONS = Object.freeze(['front', 'back'] as const);
export type FlashDirection = (typeof FLASH_DIRECTIONS)[number];

export interface FlashcardConfig {
  deck: string;
  count: number;
  order: FlashOrder;
  direction: FlashDirection;
}

export const FLASH_ORDER_LABEL_KEYS: Record<FlashOrder, I18nKey> = {
  due: 'velvet.patterns.flashcardSetup.orders.due',
  random: 'velvet.patterns.flashcardSetup.orders.random',
  new: 'velvet.patterns.flashcardSetup.orders.new',
};

export const FLASH_DIRECTION_LABEL_KEYS: Record<FlashDirection, I18nKey> = {
  front: 'velvet.patterns.flashcardSetup.directions.front',
  back: 'velvet.patterns.flashcardSetup.directions.back',
};

/** Known-card ratio at or above which the summary reads as success / warning. */
export const FLASH_SUCCESS_PERCENT = 70;
export const FLASH_WARNING_PERCENT = 40;
