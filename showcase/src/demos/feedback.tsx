import { For } from 'solid-js';
import { LoadingOverlay, Spinner, type SpinnerVariant } from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const VARIANTS: SpinnerVariant[] = ['ring', 'dots', 'bars', 'pulse'];

export const feedbackDemos: DemoEntry[] = [
  {
    id: 'spinner',
    group: '14 Feedback',
    title: 'Spinner',
    description:
      'Loader for unknown-duration work. Use Skeleton when the content shape is known and Progress when the percentage is known.',
    render: () => (
      <>
        <Example title="Variants" code={'<Spinner variant="dots" />'}>
          <For each={VARIANTS}>{(variant) => <Spinner variant={variant} />}</For>
        </Example>
        <Example title="Sizes" code={'<Spinner size="lg" />'}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Example>
        <Example title="Loading overlay" code={'<LoadingOverlay show>…</LoadingOverlay>'}>
          <LoadingOverlay>
            <p style={{ padding: 'var(--space-8)' }}>Content that is being refreshed.</p>
          </LoadingOverlay>
        </Example>
      </>
    ),
  },
];
