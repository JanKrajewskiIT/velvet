import { Glyph } from '../primitives/Glyph';

export interface AutocompleteCustomOptionProps {
  label: string;
  onPick: () => void;
}

export const AutocompleteCustomOption = (props: AutocompleteCustomOptionProps) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- keyboard handled by the combobox input; pointer-only shortcut for the custom entry
  <li class="vui-select__option" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onPick()}>
    <Glyph name="plus" />
    {props.label}
  </li>
);
