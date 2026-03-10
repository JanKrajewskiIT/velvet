import { Pagination, Stepper, Tabs, Timeline } from '@jankrajewskiit/ui';
import { createSignal, For } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

type TabValue = 'preview' | 'code' | 'props';

const STEPPER_STEPS = [
  { value: 'info', label: 'Info' },
  { value: 'details', label: 'Details' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const TIMELINE_ITEMS = [
  {
    key: '1',
    content: (
      <span>
        <strong>v0.3.3</strong> - Reorganized component categories
      </span>
    ),
  },
  {
    key: '2',
    content: (
      <span>
        <strong>v0.1.6</strong> - Added Wizard, Stepper and Timeline
      </span>
    ),
  },
  {
    key: '3',
    content: (
      <span>
        <strong>v0.1.0</strong> - Initial release
      </span>
    ),
  },
];

const NavigationSection = () => {
  const [tab, setTab] = createSignal<TabValue>('preview');
  const [activeStep, setActiveStep] = createSignal('details');
  const [page, setPage] = createSignal(5);

  return (
    <div>
      <ShowcaseSection title="Tabs" subtitle="Underline and pill variants">
        <PreviewPanel>
          <Tabs<TabValue>
            tabs={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
              { value: 'props', label: 'Props' },
            ]}
            value={tab()}
            onChange={setTab}
            variant="underline"
          />
          <ShowcaseMeta>
            Active tab: <strong>{tab()}</strong>
          </ShowcaseMeta>
          <Tabs<TabValue>
            tabs={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
              { value: 'props', label: 'Props' },
            ]}
            value={tab()}
            onChange={setTab}
            variant="pill"
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Stepper" subtitle="Visual progress through ordered steps">
        <PreviewPanel>
          <Stepper steps={STEPPER_STEPS} activeStep={activeStep()} />
          <div class="stepButtons">
            <For each={STEPPER_STEPS}>
              {(s) => (
                <button
                  type="button"
                  class={`miniButton${activeStep() === s.value ? ' miniButtonActive' : ''}`}
                  onClick={() => setActiveStep(s.value)}
                >
                  {s.label}
                </button>
              )}
            </For>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Pagination" subtitle="Navigate large result sets">
        <PreviewPanel>
          <Pagination
            page={page()}
            totalPages={19}
            onChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
            ariaLabel="Table pages"
          />
          <ShowcaseMeta>
            Current page: <strong>{page()}</strong>
          </ShowcaseMeta>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Timeline" subtitle="Chronological list of events">
        <PreviewPanel>
          <Timeline items={TIMELINE_ITEMS} />
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default NavigationSection;
