import * as React from 'react';
export interface FlashDeck { id: string; name: string; total: number; due?: number }
export interface Flashcard { id?: string | number; front: React.ReactNode; back: React.ReactNode; hint?: string; example?: React.ReactNode }
export interface FlashResult { id: string | number; known: boolean }
/** Study-session setup: deck picker (due counts), card count, order and direction. */
export interface FlashcardSetupProps { decks: FlashDeck[]; onStart?: (config: { deck: string; count: number; order: 'due' | 'random' | 'new'; direction: 'front' | 'back' }) => void; maxCards?: number; className?: string }
export declare function FlashcardSetup(props: FlashcardSetupProps): JSX.Element;
/** One-card-at-a-time practice: flip (Space), then "Didn’t know" (1 / ←) or "Knew it" (2 / →); card slides out, progress bar + tally update. Answer buttons unlock after the flip. */
export interface FlashcardSessionProps { cards: Flashcard[]; onFinish?: (results: FlashResult[]) => void; onExit?: () => void; /** Show back first */ reverse?: boolean; className?: string }
export declare function FlashcardSession(props: FlashcardSessionProps): JSX.Element | null;
/** End-of-session result: accuracy ring, known / to-review counts, restart and review-missed actions. */
export interface FlashcardSummaryProps { results: FlashResult[]; onRestart?: () => void; onReviewMissed?: () => void; onDone?: () => void; className?: string }
export declare function FlashcardSummary(props: FlashcardSummaryProps): JSX.Element;
