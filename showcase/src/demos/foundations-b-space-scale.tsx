import { For } from 'solid-js';
import { Example } from '../Example';
import { TokenRow } from './foundations-b-parts';

const SPACES = [
  '--space-0-5',
  '--space-1',
  '--space-1-5',
  '--space-2',
  '--space-2-5',
  '--space-3',
  '--space-3-5',
  '--space-4',
  '--space-5',
  '--space-6',
  '--space-7',
  '--space-8',
  '--space-10',
  '--space-12',
  '--space-16',
  '--space-20',
  '--space-24',
];

export const SpaceScaleExample = () => (
  <Example title="Space scale" stack>
    <For each={SPACES}>
      {(token) => (
        <TokenRow token={token}>
          <div
            style={{
              width: `var(${token})`,
              height: 'var(--space-3-5)',
              'border-radius': 'var(--radius-2xs)',
              background: 'var(--bg-brand-subtle)',
              'box-shadow': 'inset 0 0 0 var(--border-width) var(--border-brand)',
            }}
          />
        </TokenRow>
      )}
    </For>
  </Example>
);
