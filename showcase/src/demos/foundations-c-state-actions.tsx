import { For, type JSX } from 'solid-js';
import { Button, type ButtonVariant, Text } from '../../../src';
import { Example } from '../Example';
import { columnStyle, gridStyle, TokenName } from './foundations-a-parts';

interface ActionVariant {
  name: ButtonVariant;
  fg: string;
  rest?: string;
  hover: string;
  active: string;
  border?: { rest: string; hover: string };
}

const STATES = ['rest', 'hover', 'active', 'disabled', 'focus'] as const;
type ActionState = (typeof STATES)[number];

const VARIANTS: ActionVariant[] = [
  {
    name: 'primary',
    fg: '--action-primary-fg',
    rest: '--action-primary',
    hover: '--action-primary-hover',
    active: '--action-primary-active',
  },
  {
    name: 'soft',
    fg: '--action-soft-fg',
    rest: '--action-soft',
    hover: '--action-soft-hover',
    active: '--action-soft-hover',
  },
  {
    name: 'secondary',
    fg: '--button-secondary-fg',
    rest: '--button-secondary-bg',
    hover: '--button-secondary-bg-hover',
    active: '--bg-sunken',
    border: { rest: '--button-secondary-border', hover: '--button-secondary-border-hover' },
  },
  {
    name: 'ghost',
    fg: '--button-ghost-fg',
    hover: '--button-ghost-bg-hover',
    active: '--button-ghost-bg-active',
  },
  {
    name: 'danger',
    fg: '--action-danger-fg',
    rest: '--action-danger',
    hover: '--action-danger-hover',
    active: '--action-danger-hover',
  },
];
const MATRIX_COLUMNS = 'calc(var(--space-24) * 1.5) repeat(5, minmax(0, 1fr))';

const fillToken = (variant: ActionVariant, state: ActionState): string | undefined => {
  if (state === 'hover') return variant.hover;
  if (state === 'active') return variant.active;
  return variant.rest;
};

const cellStyle = (variant: ActionVariant, state: ActionState): JSX.CSSProperties => {
  const pressed = state === 'hover' || state === 'active';
  const border = variant.border ? (pressed ? variant.border.hover : variant.border.rest) : undefined;
  const fill = fillToken(variant, state);
  return {
    display: 'grid',
    'place-items': 'center',
    'box-sizing': 'border-box',
    height: 'var(--control-height-sm)',
    'border-radius': 'var(--button-radius)',
    font: 'var(--type-button-sm)',
    color: `var(${variant.fg})`,
    background: fill ? `var(${fill})` : 'transparent',
    border: border ? `1px solid var(${border})` : undefined,
    transform: state === 'active' ? 'translateY(var(--motion-nudge))' : undefined,
    opacity: state === 'disabled' ? 'var(--opacity-disabled)' : undefined,
    'box-shadow': state === 'focus' ? 'var(--focus-ring)' : undefined,
  };
};

export const ActionStatesExample = () => (
  <Example title="Action states" stack>
    <div style={{ ...gridStyle(MATRIX_COLUMNS), 'align-items': 'center' }}>
      <span />
      <For each={STATES}>
        {(state) => (
          <Text variant="overline" tone="tertiary">
            {state}
          </Text>
        )}
      </For>
      <For each={VARIANTS}>
        {(variant) => (
          <>
            <div style={columnStyle}>
              <Text variant="label">{variant.name}</Text>
              <TokenName>{variant.rest ?? variant.fg}</TokenName>
            </div>
            <For each={STATES}>{(state) => <div style={cellStyle(variant, state)}>Save</div>}</For>
          </>
        )}
      </For>
    </div>
    <Text variant="overline" tone="tertiary">
      Live
    </Text>
    <div style={{ display: 'flex', 'flex-wrap': 'wrap', gap: 'var(--space-3)' }}>
      <For each={VARIANTS}>
        {(variant) => (
          <Button size="sm" variant={variant.name}>
            Save
          </Button>
        )}
      </For>
      <Button size="sm" disabled>
        Disabled
      </Button>
    </div>
  </Example>
);
