import { type Accessor, createEffect, createSignal, type JSX } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createTypeahead } from '../../utils/createTypeahead';
import type { PhoneCountry } from './phoneCountries';

interface PhoneCountryPopupOptions {
  countries: Accessor<readonly PhoneCountry[]>;
  selected: Accessor<string>;
  countryName: (country: PhoneCountry) => string;
  root: Accessor<HTMLElement | undefined>;
  onPick: (country: PhoneCountry) => void;
}

export const createPhoneCountryPopup = (options: PhoneCountryPopupOptions) => {
  const [open, setOpen] = createSignal(false);
  const [activeCode, setActiveCode] = createSignal<string>();
  const search = createTypeahead();
  const active = () =>
    options.countries().length
      ? Math.max(
          0,
          options.countries().findIndex((country) => country.code === activeCode()),
        )
      : -1;
  const setActive = (index: number) => setActiveCode(options.countries()[index]?.code);
  const openList = (last = false) => {
    const countries = options.countries();
    setActive(
      last
        ? countries.length - 1
        : Math.max(
            0,
            countries.findIndex((country) => country.code === options.selected()),
          ),
    );
    setOpen(true);
  };
  createDismiss(open, () => setOpen(false), options.root);
  const floating = createFloating(open, options.root, { matchWidth: true });

  createEffect(() => {
    if (!open()) return;
    const list = options.root()?.querySelector('.vui-select__menu');
    const row = list?.children[active()];
    if (!list || !(row instanceof HTMLElement)) return;
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
  });

  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    if (!open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        openList(event.key === 'ArrowUp');
      }
      return;
    }
    const countries = options.countries();
    const count = countries.length;
    if (!count) return;
    let next: number | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = (active() + 1) % count;
        break;
      case 'ArrowUp':
        next = (active() - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const country = countries[active()];
        if (country) options.onPick(country);
        return;
      }
      case 'Tab':
        setOpen(false);
        return;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          const found = search(event.key, countries.map(options.countryName), active());
          if (found >= 0) next = found;
        }
    }
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
  };
  return { open, setOpen, active, setActive, openList, onKeyDown, floating };
};
