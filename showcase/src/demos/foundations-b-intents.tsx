import { For } from 'solid-js';
import { Example } from '../Example';
import { autoFillColumns, gridStyle } from './foundations-a-parts';
import { Specimen, stageStyle } from './foundations-b-parts';

const INTENTS = [
  { token: '--elevation-flat', radius: 'var(--radius-lg)', background: '--bg-raised', border: '--border-default' },
  { token: '--elevation-control', radius: 'var(--radius-md)', background: '--bg-field', border: '--control-border' },
  { token: '--elevation-card', radius: 'var(--radius-lg)', background: '--bg-raised', border: '--border-subtle' },
  {
    token: '--elevation-card-hover',
    radius: 'var(--radius-lg)',
    background: '--bg-raised',
    border: '--border-subtle',
    transform: 'translateY(var(--surface-lift))',
  },
  { token: '--elevation-raised', radius: 'var(--radius-lg)', background: '--bg-raised' },
  { token: '--elevation-popover', radius: 'var(--radius-lg)', background: '--bg-overlay', border: '--border-subtle' },
  { token: '--elevation-dialog', radius: 'var(--radius-xl)', background: '--bg-overlay', border: '--border-subtle' },
  { token: '--elevation-brand', radius: 'var(--radius-lg)', background: '--bg-raised' },
  {
    token: '--elevation-drawer-right',
    radius: 'var(--radius-lg) 0 0 var(--radius-lg)',
    background: '--bg-overlay',
    margin: '0 0 0 var(--space-6)',
  },
  {
    token: '--elevation-drawer-left',
    radius: '0 var(--radius-lg) var(--radius-lg) 0',
    background: '--bg-overlay',
    margin: '0 var(--space-6) 0 0',
  },
];

export const ElevationIntentsExample = () => (
  <Example title="Elevation intents">
    <div style={{ ...stageStyle, ...gridStyle(autoFillColumns), width: '100%' }}>
      <For each={INTENTS}>
        {(intent) => (
          <Specimen name={intent.token}>
            <div
              style={{
                'align-self': 'stretch',
                height: 'calc(var(--space-20) * 0.95)',
                margin: intent.margin,
                'border-radius': intent.radius,
                background: `var(${intent.background})`,
                'box-shadow': `var(${intent.token})`,
                border: intent.border ? `var(--border-width) solid var(${intent.border})` : undefined,
                transform: intent.transform,
              }}
            />
          </Specimen>
        )}
      </For>
    </div>
  </Example>
);
