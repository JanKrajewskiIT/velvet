import type { JSX } from 'solid-js';

export interface AiSection {
  title: string;
  icon?: string;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  items: JSX.Element[];
}

export interface AiSource {
  label: string;
  href?: string;
  detail?: string;
}

export type AiFeedback = 'up' | 'down' | null;

export type AiScoreTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
