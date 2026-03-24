import { For } from 'solid-js';

import DropdownOption from '~/components/dropdowns/DropdownOption/DropdownOption';
import DropdownSurface from '~/components/dropdowns/DropdownSurface/DropdownSurface';
import type Props from '~/models/Props';

interface TimePanelProps {
  id: string;
  ariaLabel: string;
  options: string[];
  value?: string;
  onSelect: (time: string) => void;
  panelClass?: string;
  surfaceRef?: (element: HTMLDivElement) => void;
}

const TimePanel = (props: Props<TimePanelProps>) => {
  return (
    <DropdownSurface
      ref={props.surfaceRef}
      id={props.id}
      class={props.panelClass}
      style={{ top: 'calc(100% + var(--spacing-xs))' }}
      align="right"
      origin="top"
      role="listbox"
      aria-label={props.ariaLabel}
    >
      <For each={props.options}>
        {(time) => (
          <DropdownOption
            selected={time === props.value}
            label={time}
            onClick={() => props.onSelect(time)}
            role="option"
            aria-selected={time === props.value}
          />
        )}
      </For>
    </DropdownSurface>
  );
};

export default TimePanel;
