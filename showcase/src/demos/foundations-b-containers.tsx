import { For } from 'solid-js';
import { Text } from '../../../src';
import { Example } from '../Example';
import { GroupHeading } from './foundations-b-parts';

const CONTAINERS = [
  { name: 'prose', token: '--container-prose', use: 'reading' },
  { name: 'sm', token: '--container-sm', use: 'forms, auth' },
  { name: 'md', token: '--container-md', use: 'single column' },
  { name: 'lg', token: '--container-lg', use: 'settings, detail' },
  { name: 'xl', token: '--container-xl', use: 'default app page', current: true },
  { name: '2xl', token: '--container-2xl', use: 'dashboards, wide tables' },
];

const USAGE = `.page {
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--gutter);
}`;

export const ContainersExample = () => (
  <Example title="Containers" code={USAGE} stack>
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: 'var(--space-2)', width: '100%' }}>
      <GroupHeading>Pick max-width by content type · bars at ½ scale</GroupHeading>
      <For each={CONTAINERS}>
        {(container) => (
          <div
            style={{
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'space-between',
              gap: 'var(--space-2)',
              width: `calc(var(${container.token}) / 2)`,
              'max-width': '100%',
              height: 'var(--space-8)',
              padding: '0 var(--space-3)',
              margin: '0 auto',
              'box-sizing': 'border-box',
              border: `var(--border-width) solid ${container.current ? 'var(--border-brand)' : 'var(--border-strong)'}`,
              'border-radius': 'var(--radius-sm)',
              background: container.current ? 'var(--bg-selected)' : 'var(--bg-subtle)',
            }}
          >
            <Text variant="label" mono tone={container.current ? 'brand' : 'primary'}>
              {container.name}
            </Text>
            <Text variant="caption" mono tone="tertiary" truncate>
              {`${container.token} · ${container.use}`}
            </Text>
          </div>
        )}
      </For>
    </div>
  </Example>
);
