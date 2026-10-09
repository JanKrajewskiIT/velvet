import type { DemoEntry } from '../registry';
import { BreakpointsExample } from './foundations-b-breakpoints';
import { ContainersExample } from './foundations-b-containers';
import { ControlsExample } from './foundations-b-controls';
import { FixedSizesExample } from './foundations-b-fixed';
import { ElevationIntentsExample } from './foundations-b-intents';
import { LayersExample } from './foundations-b-layers';
import { NestedOverlaysExample } from './foundations-b-nested';
import { ScrimsExample } from './foundations-b-scrims';
import { ShadowsExample } from './foundations-b-shadows';
import { ShapePage } from './foundations-b-shape';
import { ShellExample } from './foundations-b-shell';
import { SpaceScaleExample } from './foundations-b-space-scale';

export const foundationBDemos: DemoEntry[] = [
  {
    id: 'shape',
    group: '06 Shape',
    title: 'Shape',
    description: 'Border widths and the radius scale, rendered through the shape tokens.',
    render: () => <ShapePage />,
  },
  {
    id: 'space-layout',
    group: '07 Space & Layout',
    title: 'Space & layout',
    description:
      'Breakpoints, containers, the page shell, control and fixed sizes, nested overlays and the spacing scale.',
    render: () => (
      <>
        <BreakpointsExample />
        <ContainersExample />
        <ShellExample />
        <ControlsExample />
        <FixedSizesExample />
        <NestedOverlaysExample />
        <SpaceScaleExample />
      </>
    ),
  },
  {
    id: 'depth',
    group: '08 Depth',
    title: 'Depth & elevation',
    description:
      'Elevation intents are what components read; they resolve to the shadow ladder. Layers, scrims and blur complete the depth model.',
    render: () => (
      <>
        <ElevationIntentsExample />
        <LayersExample />
        <ScrimsExample />
        <ShadowsExample />
      </>
    ),
  },
];
