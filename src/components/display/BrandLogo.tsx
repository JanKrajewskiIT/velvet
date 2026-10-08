import { For, type JSX, mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { R_MARK, R_WORD } from './recronLogoPaths';

const VELVET = { name: 'Velvet UI', letter: 'v', word: 'velvet', accent: '/ui' } as const;
const RECRON_NAME = 'Recron';
const RECRON_HEIGHTS = { sm: 24, md: 32, lg: 48, xl: 64 } as const;
const RECRON_VIEWBOX = { mark: '318 264 182 232', lockup: '320 268 772 224' } as const;

export type BrandLogoSize = keyof typeof RECRON_HEIGHTS | number;

export interface BrandLogoProps {
  /** @default 'velvet' */
  brand?: 'velvet' | 'recron';
  /** `lockup` = signet + wordmark. `wordmark` applies to velvet only. @default 'lockup' */
  variant?: 'lockup' | 'wordmark' | 'mark';
  /** `inverse` = all `--on-color-fg`, for brand fills. @default 'default' */
  tone?: 'default' | 'inverse';
  /** Preset or px. Recron: logo height (sm 24 · md 32 · lg 48 · xl 64). Velvet: wordmark font size. @default 'md' */
  size?: BrandLogoSize;
  /** Velvet only: soft brand elevation under the mark. @default true */
  glow?: boolean;
  /** Accessible name. @default brand name */
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

const RecronPaths = (props: { paths: readonly string[] }) => <For each={props.paths}>{(d) => <path d={d} />}</For>;

/** Brand mark: the Recron "R" signet + wordmark, or the type-only "velvet/ui" placeholder. */
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
      when={merged.brand === 'recron'}
      fallback={
        <span
          role="img"
          aria-label={merged.label ?? VELVET.name}
          class={cx(
            'vui-logo',
            'vui-logo--velvet',
            presetSize() && `vui-logo--${presetSize()}`,
            inverse() && 'vui-logo--inverse',
            !merged.glow && 'vui-logo--plain',
            merged.class,
          )}
          style={pixelSize() === undefined ? merged.style : { 'font-size': `${pixelSize()}px`, ...merged.style }}
        >
          <Show when={merged.variant !== 'wordmark'}>
            <span class="vui-logo__mark" aria-hidden="true">
              <span>{VELVET.letter}</span>
            </span>
          </Show>
          <Show when={!markOnly()}>
            <span class="vui-logo__word" aria-hidden="true">
              {VELVET.word}
              <span class="vui-logo__accent">{VELVET.accent}</span>
            </span>
          </Show>
        </span>
      }
    >
      <svg
        role="img"
        aria-label={merged.label ?? RECRON_NAME}
        viewBox={markOnly() ? RECRON_VIEWBOX.mark : RECRON_VIEWBOX.lockup}
        class={cx('vui-logo-r', inverse() && 'vui-logo-r--inverse', merged.class)}
        style={{ height: `${recronHeight()}px`, ...merged.style }}
      >
        <g transform="translate(0,752) scale(0.1,-0.1)">
          <g class="vui-logo-r__mark">
            <RecronPaths paths={R_MARK} />
          </g>
          <Show when={!markOnly()}>
            <g class="vui-logo-r__word">
              <RecronPaths paths={R_WORD} />
            </g>
          </Show>
        </g>
      </svg>
    </Show>
  );
};
