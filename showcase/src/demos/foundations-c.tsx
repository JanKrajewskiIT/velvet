import type { DemoEntry } from '../registry';
import { A11yExample } from './foundations-c-a11y';
import { DurationsExample } from './foundations-c-motion-durations';
import { EasingExample } from './foundations-c-motion-easing';
import { IntentsExample } from './foundations-c-motion-intents';
import { ActionStatesExample } from './foundations-c-state-actions';
import { FocusExample } from './foundations-c-state-focus';
import { StateLayersExample } from './foundations-c-state-layers';

export const foundationCDemos: DemoEntry[] = [
  {
    id: 'motion',
    group: '09 Motion',
    title: 'Motion',
    description:
      'Five durations and five curves in the reference layer, composed into --motion-* intents that components read. Playback loops and can be slowed to compare.',
    render: () => (
      <>
        <DurationsExample />
        <EasingExample />
        <IntentsExample />
      </>
    ),
  },
  {
    id: 'state',
    group: '10 State',
    title: 'State layers',
    description:
      'Action states, focus rings and the translucent washes that sit over any background for hover, pressed and selected.',
    render: () => (
      <>
        <ActionStatesExample />
        <FocusExample />
        <StateLayersExample />
      </>
    ),
  },
  {
    id: 'a11y',
    group: '11 Atoms',
    title: 'Accessibility',
    description:
      'VisuallyHidden for screen-reader-only text, SkipLink for jumping to the main landmark, and LiveRegion for polite or assertive announcements.',
    render: () => <A11yExample />,
  },
];
