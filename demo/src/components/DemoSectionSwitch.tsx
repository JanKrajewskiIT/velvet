import { Match, Suspense, Switch } from 'solid-js';

import type { DemoOverviewFeaturedSection, DemoOverviewTrack } from '../demoTypes';
import type { SectionId } from '../nav/demoNavConfig';
import DemoSectionFallback from './DemoSectionFallback';
import {
  LazyCompositesSection,
  LazyDataDisplaySection,
  LazyDeveloperSection,
  LazyFeedbackSection,
  LazyInputsSection,
  LazyLayoutSection,
  LazyNavigationSection,
  LazyOverlaysSection,
  LazyOverviewSection,
  LazyTablesSection,
  LazyTypographySection,
} from './demoSectionLazy';

interface DemoSectionSwitchProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  overviewTracks: DemoOverviewTrack[];
  featuredSections: DemoOverviewFeaturedSection[];
}

const DemoSectionSwitch = (props: DemoSectionSwitchProps) => {
  return (
    <Suspense fallback={<DemoSectionFallback />}>
      <Switch>
        <Match when={props.activeSection === 'overview'}>
          <LazyOverviewSection
            tracks={props.overviewTracks}
            featuredSections={props.featuredSections}
            onNavigate={(id) => props.onNavigate(id as SectionId)}
          />
        </Match>
        <Match when={props.activeSection === 'developer'}>
          <LazyDeveloperSection />
        </Match>
        <Match when={props.activeSection === 'typography'}>
          <LazyTypographySection />
        </Match>
        <Match when={props.activeSection === 'data-tables'}>
          <LazyTablesSection />
        </Match>
        <Match when={props.activeSection.startsWith('inputs-')}>
          <LazyInputsSection sectionId={props.activeSection} />
        </Match>
        <Match when={props.activeSection.startsWith('data-')}>
          <LazyDataDisplaySection sectionId={props.activeSection} />
        </Match>
        <Match when={props.activeSection.startsWith('nav-')}>
          <LazyNavigationSection sectionId={props.activeSection} />
        </Match>
        <Match when={props.activeSection.startsWith('feedback-')}>
          <LazyFeedbackSection sectionId={props.activeSection} />
        </Match>
        <Match when={props.activeSection.startsWith('overlays-')}>
          <LazyOverlaysSection sectionId={props.activeSection} />
        </Match>
        <Match when={props.activeSection.startsWith('surfaces-')}>
          <LazyLayoutSection sectionId={props.activeSection} />
        </Match>
        <Match when={props.activeSection.startsWith('composites-')}>
          <LazyCompositesSection sectionId={props.activeSection} />
        </Match>
      </Switch>
    </Suspense>
  );
};

export default DemoSectionSwitch;
