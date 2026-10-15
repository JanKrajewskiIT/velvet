import { type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { typographyClass } from '../primitives/typography';
import styles from './PlayerButton.module.css';

export interface PlayerButtonProps {
  /** Glyph name; without it `children` is the face. */
  icon?: string;
  /** Accessible name, also the tooltip. */
  label: string;
  onClick?: () => void;
  pressed?: boolean;
  class?: string;
  children?: JSX.Element;
}

/** Transparent control button shared by VideoPlayer and AudioPlayer. */
export const PlayerButton = (props: PlayerButtonProps) => {
  return (
    <button
      type="button"
      class={cx(typographyClass('label-sm'), styles.playerPartBtn, props.class)}
      aria-label={props.label}
      title={props.label}
      aria-pressed={props.pressed}
      onClick={() => props.onClick?.()}
    >
      <Show when={props.icon} fallback={props.children}>
        {(icon) => <Glyph name={icon()} />}
      </Show>
    </button>
  );
};
