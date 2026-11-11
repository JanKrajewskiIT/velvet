import { For, type JSX } from 'solid-js';

import { Listbox } from '../primitives/Listbox';
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
  up: boolean;
}

export const PhoneCountryList = (props: PhoneCountryListProps) => (
  <Listbox flip={false} up={props.up} ref={props.ref} style={props.style} id={props.id} aria-label={props.label}>
    <For each={props.countries}>
      {(item, index) => (
        <ComboboxOption
          id={`${props.id}-${index()}`}
          selected={item.code === props.selected}
          active={index() === props.active}
          onHover={() => props.onHover(index())}
          onPick={() => props.onPick(item)}
          leading={
            <Text as="span" variant="kbd" tone="inherit" class={styles.phonePartCode}>
              {item.code}
            </Text>
          }
          label={props.countryName(item)}
          trailing={
            <Text as="span" variant="body-sm" tone="inherit" class={styles.phonePartDial}>
              +{item.dial}
            </Text>
          }
          checkEnd
        />
      )}
    </For>
  </Listbox>
);
