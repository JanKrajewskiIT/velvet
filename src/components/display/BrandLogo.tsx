import { For, type JSX, mergeProps, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import styles from './BrandLogo.module.css';
import { Q_MARK, Q_WORD } from './quantcoreLogoPaths';
import { R_MARK, R_WORD } from './recronLogoPaths';

const LOGO_CLASSES = {
  velvet: styles.logoVariantVelvet,
  plain: styles.logoVariantPlain,
  inverse: styles.logoVariantInverse,
  sm: styles.logoVariantSm,
  md: styles.logoVariantMd,
  lg: styles.logoVariantLg,
  xl: styles.logoVariantXl,
} as const;

const VELVET = { name: 'Velvet UI', letter: 'v', word: 'velvet', accent: '/ui' } as const;
const RECRON_NAME = 'Recron';
const RECRON_HEIGHTS = { sm: 24, md: 32, lg: 48, xl: 64 } as const;
const RECRON_VIEWBOX = { mark: '318 264 182 232', lockup: '320 268 772 224' } as const;

export type BrandLogoSize = keyof typeof RECRON_HEIGHTS | number;

export interface BrandLogoProps {
  /** @default 'velvet' */
  brand?: 'velvet' | 'recron' | 'quantcore';
  /** `lockup` = signet + wordmark. `wordmark` applies to velvet only. @default 'lockup' */
  variant?: 'lockup' | 'wordmark' | 'mark';
  /** `inverse` = all `--on-color-fg`, for brand fills. @default 'default' */
  tone?: 'default' | 'inverse';
  /** Preset or px. Recron/QuantCore: height (sm 24 · md 32 · lg 48 · xl 64). Velvet: font size. @default 'md' */
  size?: BrandLogoSize;
  /** Velvet only: soft brand elevation under the mark. @default true */
  glow?: boolean;
  /** Accessible name. @default brand name */
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

/** Brand signet and wordmark for Recron, QuantCore or Velvet UI. */
export const BrandLogo = (props: BrandLogoProps) => {
  const merged = mergeProps(
    { brand: 'velvet', variant: 'lockup', tone: 'default', size: 'md', glow: true } satisfies BrandLogoProps,
    props,
  );
  const pixelSize = () => (typeof merged.size === 'number' ? merged.size : undefined);
  const presetSize = () => (typeof merged.size === 'string' ? merged.size : undefined);
  const recronHeight = () => pixelSize() ?? RECRON_HEIGHTS[presetSize() ?? 'md'];
  const markOnly = () => merged.variant === 'mark';
  const inverse = () => merged.tone === 'inverse';
  return (
    <Show
      when={merged.brand !== 'velvet'}
      fallback={
        <span
          role="img"
          aria-label={merged.label ?? VELVET.name}
          class={cx(
            styles.logo,
            styles.logoVariantVelvet,
            presetSize() && variantClass(LOGO_CLASSES, presetSize()),
            inverse() && styles.logoVariantInverse,
            !merged.glow && styles.logoVariantPlain,
            merged.class,
          )}
          style={pixelSize() === undefined ? merged.style : { 'font-size': `${pixelSize()}px`, ...merged.style }}
        >
          <Show when={merged.variant !== 'wordmark'}>
            <span class={styles.logoPartMark} aria-hidden="true">
              <span>{VELVET.letter}</span>
            </span>
          </Show>
          <Show when={!markOnly()}>
            <span class={styles.logoPartWord} aria-hidden="true">
              {VELVET.word}
              <span class={styles.logoPartAccent}>{VELVET.accent}</span>
            </span>
          </Show>
        </span>
      }
    >
      <svg
        role="img"
        aria-label={merged.label ?? (merged.brand === 'quantcore' ? 'QuantCore' : RECRON_NAME)}
        viewBox={
          merged.brand === 'quantcore'
            ? markOnly()
              ? '64 76 172 176'
              : '64 76 884 176'
            : markOnly()
              ? RECRON_VIEWBOX.mark
              : RECRON_VIEWBOX.lockup
        }
        class={cx(styles.logoR, inverse() && styles.logoRVariantInverse, merged.class)}
        style={{ height: `${recronHeight()}px`, ...merged.style }}
      >
        <Show
          when={merged.brand === 'quantcore'}
          fallback={
            <g transform="translate(0,752) scale(0.1,-0.1)">
              <g class={styles.logoRPartMark}>
                <For each={R_MARK}>{(d) => <path d={d} />}</For>
              </g>
              <Show when={!markOnly()}>
                <g class={styles.logoRPartWord}>
                  <For each={R_WORD}>{(d) => <path d={d} />}</For>
                </g>
              </Show>
            </g>
          }
        >
          <path class={styles.logoRPartMark} fill-rule="evenodd" d={Q_MARK} />
          <Show when={!markOnly()}>
            <path class={styles.logoRPartWord} fill-rule="evenodd" d={Q_WORD} />
          </Show>
        </Show>
      </svg>
    </Show>
  );
};
