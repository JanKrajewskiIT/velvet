import { For, type JSX, Show } from 'solid-js';

import { Glyph } from '../primitives/Glyph';
import { ComboboxOption } from './ComboboxOption';
import type { PhoneCountry } from './phoneCountries';

interface PhoneCountryListProps {
  id: string;
  label: string;
  countries: readonly PhoneCountry[];
  selected: string;
  active: number;
  countryName: (country: PhoneCountry) => string;
  onHover: (index: number) => void;
  onPick: (country: PhoneCountry) => void;
  ref: (element: HTMLUListElement) => void;
  style: JSX.CSSProperties | undefined;
}

export const PhoneCountryList = (props: PhoneCountryListProps) => (
  <ul
    ref={props.ref}
    style={props.style}
    id={props.id}
    role="listbox"
    aria-label={props.label}
    class="vui-select__menu"
  >
    <For each={props.countries}>
      {(item, index) => (
        <ComboboxOption
          id={`${props.id}-${index()}`}
          selected={item.code === props.selected}
          active={index() === props.active}
          onHover={() => props.onHover(index())}
          onPick={() => props.onPick(item)}
        >
          <span class="vui-phone__code">{item.code}</span>
          <span class="vui-select__label">{props.countryName(item)}</span>
          <span class="vui-phone__dial">+{item.dial}</span>
          <Show when={item.code === props.selected}>
            <Glyph name="check" />
          </Show>
        </ComboboxOption>
      )}
    </For>
  </ul>
);
