import { For, type JSX, Show } from 'solid-js';

import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { ComboboxOption } from './ComboboxOption';
import type { PhoneCountry } from './phoneCountries';
import styles from './PhoneCountryList.module.css';

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
    class={styles.selectPartMenu}
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
          <Text as="span" variant="kbd" tone="inherit" class={styles.phonePartCode}>
            {item.code}
          </Text>
          <Text as="span" variant="body" tone="inherit" class={styles.selectPartLabel}>
            {props.countryName(item)}
          </Text>
          <Text as="span" variant="body-sm" tone="inherit" class={styles.phonePartDial}>
            +{item.dial}
          </Text>
          <Show when={item.code === props.selected}>
            <Glyph name="check" />
          </Show>
        </ComboboxOption>
      )}
    </For>
  </ul>
);
