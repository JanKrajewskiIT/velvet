import { Glyph } from '../primitives/Glyph';
import styles from './AutocompleteCustomOption.module.css';
import { ComboboxOption } from './ComboboxOption';

export interface AutocompleteCustomOptionProps {
  label: string;
  id: string;
  active: boolean;
  onHover: () => void;
  onPick: () => void;
}

export const AutocompleteCustomOption = (props: AutocompleteCustomOptionProps) => (
  <ComboboxOption
    class={styles.root}
    id={props.id}
    selected={false}
    active={props.active}
    onHover={props.onHover}
    onPick={props.onPick}
  >
    <Glyph name="plus" />
    {props.label}
  </ComboboxOption>
);
