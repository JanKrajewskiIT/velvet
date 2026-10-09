import { Example } from '../Example';
import type { DemoEntry } from '../registry';
import { ColorPalette } from './foundations-a-color';
import { ColorRoles } from './foundations-a-color-roles';
import { OverviewPage } from './foundations-a-overview';
import { gridStyle, Ramp, RAMP_STEPS } from './foundations-a-parts';
import { TypePage } from './foundations-a-type';

const WordmarkPanel = (props: { background: string; color: string; bordered?: boolean }) => (
  <div
    style={{
      flex: 1,
      display: 'grid',
      'place-items': 'center',
      'min-width': 'calc(var(--space-24) * 2)',
      padding: 'var(--space-10) var(--space-6)',
      'border-radius': 'var(--radius-lg)',
      background: props.background,
      border: props.bordered ? '1px solid var(--border-default)' : undefined,
    }}
  >
    <span
      style={{
        font: 'var(--font-weight-bold) var(--font-size-5xl)/var(--leading-none) var(--font-display)',
        'letter-spacing': 'var(--tracking-tighter)',
        color: props.color,
      }}
    >
      velvet<span style={{ opacity: 0.55 }}>/ui</span>
    </span>
  </div>
);

export const foundationADemos: DemoEntry[] = [
  {
    id: 'overview',
    group: '01 Overview',
    title: 'Overview',
    description:
      'Which atom to reach for, how tokens layer from reference to component, and which layers components may read. Component CSS reads comp tokens first, sys tokens second and ref tokens never.',
    render: () => <OverviewPage />,
  },
  {
    id: 'brand-identity',
    group: '02 Brand',
    title: 'Wordmark & brand colour',
    description:
      'The type-only wordmark on brand and raised backgrounds, and the Velvet brand ramp that --bg-brand and the action tokens resolve from.',
    render: () => (
      <>
        <Example title="Wordmark">
          <div style={gridStyle('repeat(auto-fit, minmax(calc(var(--space-24) * 2), 1fr))')}>
            <WordmarkPanel background="var(--bg-brand)" color="var(--on-color-fg)" />
            <WordmarkPanel background="var(--bg-raised)" color="var(--bg-brand)" bordered />
          </div>
        </Example>
        <Example title="Velvet" stack>
          <Ramp prefix="--velvet" steps={RAMP_STEPS} selected="700" />
        </Example>
      </>
    ),
  },
  {
    id: 'color',
    group: '03 Color',
    title: 'Colour',
    description:
      'Backgrounds, neutral, categorical, status and on-colour tokens, rendered live through CSS variables so they follow the active theme.',
    render: () => (
      <>
        <ColorPalette />
        <ColorRoles />
      </>
    ),
  },
  {
    id: 'type',
    group: '04 Type',
    title: 'Typography',
    description:
      'Font families and weights, the display and text role tokens, the size scale, and tracking and leading tokens.',
    render: () => <TypePage />,
  },
];
