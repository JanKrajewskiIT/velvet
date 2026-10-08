import { type Accessor, createContext, type JSX, mergeProps, useContext } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleGroupState {
  isOn: (value: string | undefined) => boolean;
  toggle: (value: string | undefined) => void;
  size: Accessor<ToggleSize | undefined>;
  disabled: Accessor<boolean | undefined>;
}

export const ToggleGroupContext = createContext<ToggleGroupState>();

export const useToggleGroup = (): ToggleGroupState | undefined => useContext(ToggleGroupContext);

interface ToggleGroupBaseProps {
  /** Joined segments with a shared border. @default true */
  attached?: boolean;
  size?: ToggleSize;
  disabled?: boolean;
  /** Accessible group name. */
  label?: string;
  class?: string;
  children: JSX.Element;
}

export type ToggleGroupProps = ToggleGroupBaseProps &
  (
    | {
        /** Each button is independent (B / I / U). @default 'multiple' */
        type?: 'multiple';
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
    | {
        /** Exactly one pressed; pressing the pressed one keeps it (view: grid / list / tree). */
        type: 'single';
        value?: string | null;
        defaultValue?: string | null;
        onValueChange?: (value: string | null) => void;
      }
  );

const FOCUSABLE_TOGGLE = '.vui-toggle:not(:disabled)';

/** Set of ToggleButtons that share state; ←→ move focus between buttons. */
export const ToggleGroup = (props: ToggleGroupProps) => {
  const p = mergeProps({ attached: true }, props);
  const multiple = () => p.type !== 'single';

  const [selected, setSelected] = createControllable<string | string[] | null>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? (multiple() ? [] : null),
    onChange: (next) => (p.onValueChange as ((value: string | string[] | null) => void) | undefined)?.(next),
  });

  const selectedList = (): string[] => {
    const current = selected();
    return Array.isArray(current) ? current : [];
  };
  const isOn = (value: string | undefined) =>
    multiple() ? value !== undefined && selectedList().includes(value) : selected() === value;
  const toggle = (value: string | undefined) => {
    if (value === undefined) return;
    if (!multiple()) {
      if (!isOn(value)) setSelected(value);
      return;
    }
    setSelected(isOn(value) ? selectedList().filter((v) => v !== value) : [...selectedList(), value]);
  };

  let root!: HTMLDivElement;
  const onKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const buttons = [...root.querySelectorAll<HTMLElement>(FOCUSABLE_TOGGLE)];
    const at = buttons.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    e.preventDefault();
    buttons[(at + step + buttons.length) % buttons.length]?.focus();
  };

  return (
    <ToggleGroupContext.Provider value={{ isOn, toggle, size: () => p.size, disabled: () => p.disabled }}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- arrow-key focus movement between the group's buttons is handled on the group container */}
      <div
        ref={root}
        role="group"
        aria-label={p.label}
        onKeyDown={onKeyDown}
        class={cx(
          'vui-togglegroup',
          p.attached && 'vui-togglegroup--attached',
          !multiple() && 'vui-togglegroup--single',
          p.class,
        )}
      >
        {p.children}
      </div>
    </ToggleGroupContext.Provider>
  );
};
