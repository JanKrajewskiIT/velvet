import {
  ActionRow,
  addToast,
  AiResultPanel,
  Button,
  CodeText,
  EditableCollection,
  FilterBar,
  type FilterBarFilter,
  type FilterBarValue,
  FormField,
  IconButton,
  Input,
  KanbanBoard,
  type KanbanColumn,
  type KanbanItemBase,
  Scheduler,
  type SchedulerEvent,
  Text,
  type TransferItem,
  TransferList,
  Wizard,
} from '@jankrajewskiit/ui';
import { IoTrash } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const INITIAL_SOURCE: TransferItem[] = [
  { id: '1', label: 'TypeScript' },
  { id: '2', label: 'CSS Modules' },
  { id: '3', label: 'Vite' },
  { id: '4', label: 'ESLint' },
  { id: '5', label: 'Prettier' },
];

const INITIAL_TARGET: TransferItem[] = [{ id: '6', label: 'SolidJS' }];

const FILTER_DEFINITIONS: FilterBarFilter[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'todo', label: 'To do' },
      { value: 'in-progress', label: 'In progress' },
      { value: 'done', label: 'Done' },
    ],
    placeholder: 'Any status',
  },
  {
    key: 'owner',
    label: 'Owner',
    options: [
      { value: 'anna', label: 'Anna' },
      { value: 'marek', label: 'Marek' },
      { value: 'jan', label: 'Jan' },
      { value: 'kasia', label: 'Kasia' },
    ],
    placeholder: 'Any owner',
  },
  {
    key: 'priority',
    label: 'Priority',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
    placeholder: 'Any priority',
  },
];

type AnalysisState = 'idle' | 'loading' | 'result' | 'error';

interface TaskItem {
  id: string;
  title: string;
  owner: string;
}

interface KanbanDemoItem extends KanbanItemBase {
  owner: string;
  priority: 'low' | 'medium' | 'high';
}

const createTask = (index: number): TaskItem => ({
  id: crypto.randomUUID(),
  title: `Task ${index}`,
  owner: 'Product Team',
});

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To do' },
  { id: 'in-progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
];

const INITIAL_KANBAN_ITEMS: KanbanDemoItem[] = [
  {
    id: 'kanban-1',
    columnId: 'todo',
    title: 'Design system review',
    description: 'Audit inconsistent paddings in legacy cards.',
    owner: 'Anna',
    priority: 'high',
  },
  {
    id: 'kanban-2',
    columnId: 'todo',
    title: 'Write migration notes',
    description: 'Summarize DataGridPro v3 API additions.',
    owner: 'Marek',
    priority: 'medium',
  },
  {
    id: 'kanban-3',
    columnId: 'in-progress',
    title: 'Polish interactions',
    description: 'Finalize keyboard UX for grid toolbar.',
    owner: 'Jan',
    priority: 'high',
  },
  {
    id: 'kanban-4',
    columnId: 'done',
    title: 'Ship release notes',
    description: 'Publish changelog to docs portal.',
    owner: 'Kasia',
    priority: 'low',
  },
];

const SCHEDULER_EVENTS: SchedulerEvent[] = [
  {
    id: 'event-1',
    title: 'Design review',
    date: '2026-03-12',
    time: '09:30',
    description: 'Review dashboard cards and interaction states.',
  },
  {
    id: 'event-2',
    title: 'API sync',
    date: '2026-03-12',
    time: '13:00',
    description: 'Align contract for DataGrid server-side sorting.',
  },
  {
    id: 'event-3',
    title: 'UX workshop sprint',
    date: '2026-03-14',
    endDate: '2026-03-16',
    time: '11:00',
    description: 'Collect feedback for scheduling and planning flows during a multi-day workshop.',
  },
  {
    id: 'event-4',
    title: 'Release prep',
    date: '2026-03-19',
    time: '16:00',
    description: 'Finalize changelog and migration notes.',
  },
];

const CompositesSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [sourceItems, setSourceItems] = createSignal<TransferItem[]>(INITIAL_SOURCE);
  const [targetItems, setTargetItems] = createSignal<TransferItem[]>(INITIAL_TARGET);
  const [analysisState, setAnalysisState] = createSignal<AnalysisState>('idle');
  const [resultNext, setResultNext] = createSignal(true);
  const [tasks, setTasks] = createSignal<TaskItem[]>([createTask(1), createTask(2)]);
  const [filtersQuery, setFiltersQuery] = createSignal('');
  const [filtersValue, setFiltersValue] = createSignal<FilterBarValue[]>([
    { key: 'status', value: 'in-progress' },
    { key: 'priority', value: 'high' },
  ]);
  const [kanbanItems, setKanbanItems] = createSignal<KanbanDemoItem[]>(INITIAL_KANBAN_ITEMS);
  const [schedulerEvents, setSchedulerEvents] = createSignal<SchedulerEvent[]>(SCHEDULER_EVENTS);

  const wizardSteps = [
    {
      label: 'Account',
      component: (
        <div class="col">
          <FormField label="Email" id="wiz-email">
            <Input id="wiz-email" type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Username" id="wiz-user">
            <Input id="wiz-user" type="text" placeholder="jankowalski" />
          </FormField>
        </div>
      ),
    },
    {
      label: 'Profile',
      component: (
        <div class="col">
          <FormField label="Full name" id="wiz-name">
            <Input id="wiz-name" type="text" placeholder="Jan Kowalski" />
          </FormField>
          <FormField label="Bio" id="wiz-bio">
            <Input id="wiz-bio" type="text" placeholder="Short bio..." />
          </FormField>
        </div>
      ),
    },
    {
      label: 'Confirm',
      component: (
        <Text as="p" variant="bodySm" tone="muted" class="mutedText">
          Review your information and click <strong>Finish</strong> to complete registration.
        </Text>
      ),
    },
  ];

  const runAnalysis = () => {
    setAnalysisState('loading');

    setTimeout(() => {
      const shouldSucceed = resultNext();
      setAnalysisState(shouldSucceed ? 'result' : 'error');
      setResultNext((current) => !current);
    }, 1200);
  };

  const updateTask = (id: string, field: keyof TaskItem, value: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const handleTransferChange = (source: TransferItem[], target: TransferItem[]) => {
    setSourceItems(source);
    setTargetItems(target);
  };

  return (
    <div>
      <Show when={sectionId() === 'composites-lists'}>
        <ShowcaseSection title="TransferList" subtitle="Dual-list picker for moving items between groups">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <TransferList
                sourceItems={sourceItems()}
                targetItems={targetItems()}
                onChange={handleTransferChange}
                sourceTitle="Available"
                targetTitle="Selected"
                searchable
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Check items and use the arrow buttons to transfer. Search filters within each panel.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="FilterBar" subtitle="Search + structured filters + active removable chips">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FilterBar
                filters={FILTER_DEFINITIONS}
                value={filtersValue()}
                onChange={setFiltersValue}
                search={filtersQuery()}
                onSearchChange={setFiltersQuery}
                searchPlaceholder="Search tasks..."
                allLabel="All"
                clearAllLabel="Clear filters"
                removeFilterLabel="Remove filter"
              />
              <Text as="p" variant="caption" tone="muted" class="mutedText">
                Query: {filtersQuery() || 'none'} | Active filters: {filtersValue().length}
              </Text>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Use the toolbar to compose search and filter criteria, then remove single filters via chips or reset all.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="EditableCollection" subtitle="Add/remove/edit list scaffold for dynamic forms">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <EditableCollection
                items={tasks()}
                getId={(item) => item.id}
                onAdd={() => setTasks((current) => [...current, createTask(current.length + 1)])}
                onRemove={(id) => setTasks((current) => current.filter((item) => item.id !== id))}
                addLabel="Add task"
                confirmTitle="Remove task"
                confirmMessage="Do you want to remove this task from the collection?"
                confirmLabel="Remove"
                cancelLabel="Cancel"
                renderItem={(item, { requestRemove }) => (
                  <>
                    <div class="editableHeader">
                      <Text as="span" variant="labelMd" class="statusChip">
                        {item.id.slice(0, 8)}
                      </Text>
                      <IconButton icon={<IoTrash />} title="Remove task" size="sm" onClick={requestRemove} />
                    </div>
                    <div class="editableGrid">
                      <FormField label="Title" id={`task-title-${item.id}`}>
                        <Input
                          id={`task-title-${item.id}`}
                          value={item.title}
                          onInput={(e) => updateTask(item.id, 'title', e.currentTarget.value)}
                        />
                      </FormField>
                      <FormField label="Owner" id={`task-owner-${item.id}`}>
                        <Input
                          id={`task-owner-${item.id}`}
                          value={item.owner}
                          onInput={(e) => updateTask(item.id, 'owner', e.currentTarget.value)}
                        />
                      </FormField>
                    </div>
                  </>
                )}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="KanbanBoard" subtitle="Drag and drop cards between workflow columns">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <KanbanBoard
                columns={KANBAN_COLUMNS}
                items={kanbanItems()}
                onChange={setKanbanItems}
                emptyLabel="Drop cards here"
                renderCard={(item) => (
                  <div class="col" style={{ gap: 'var(--spacing-2xs)' }}>
                    <strong>{item.title}</strong>
                    <Text as="span" variant="bodySm" tone="muted" class="mutedText">
                      {item.description}
                    </Text>
                    <div class="row" style={{ 'justify-content': 'space-between' }}>
                      <Text as="span" variant="labelMd" class="statusChip">
                        {item.owner}
                      </Text>
                      <Text as="span" variant="labelMd" class="statusChip">
                        {item.priority}
                      </Text>
                    </div>
                  </div>
                )}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>Drag cards between columns to update their status.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-wizard-ai'}>
        <ShowcaseSection title="Wizard" subtitle="Multi-step guided workflow">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Wizard
                steps={wizardSteps}
                backLabel="Back"
                nextLabel="Next"
                finishLabel="Finish"
                onFinish={() => {
                  addToast({ type: 'success', message: 'Registration complete!' });
                }}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AiResultPanel" subtitle="Reusable result layout for AI and scoring flows">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <AiResultPanel
                isPending={analysisState() === 'loading'}
                loadingText="Analyzing design consistency..."
                hasError={analysisState() === 'error'}
                errorText="Analysis timed out. Retry to generate a new report."
                onRetry={runAnalysis}
                retryLabel="Retry"
                score={87}
                scoreLabel="Design consistency"
                summary="The component library now uses stronger visual hierarchy and shared interaction patterns."
                sections={[
                  {
                    icon: 'success',
                    title: 'Highlights',
                    items: [
                      'Unified interaction styles for buttons, inputs and tabs',
                      'Consistent spacing and elevation across sections',
                    ],
                  },
                  {
                    icon: 'danger',
                    title: 'Needs follow-up',
                    items: ['Extend the same polish to all remaining secondary components'],
                  },
                ]}
                hasResult={analysisState() === 'result'}
                idle={
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Run analysis to generate a consistency report for the current component set.
                  </Text>
                }
                actions={
                  <ActionRow align="end">
                    <Button variant="ghost" onClick={() => setAnalysisState('idle')}>
                      Reset
                    </Button>
                    <Button onClick={runAnalysis}>Run analysis</Button>
                  </ActionRow>
                }
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-scheduler'}>
        <ShowcaseSection title="Scheduler" subtitle="Month calendar with per-day agenda panel">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Scheduler
                events={schedulerEvents()}
                onEventsChange={setSchedulerEvents}
                defaultSelectedDate="2026-03-12"
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Navigate months, select a day, add events with{' '}
            <CodeText as="span" class="codeInline">
              Add event
            </CodeText>{' '}
            (or double-click a day), edit/delete entries inline, then drag{' '}
            <CodeText as="span" class="codeInline">
              Move
            </CodeText>{' '}
            or{' '}
            <CodeText as="span" class="codeInline">
              Resize end
            </CodeText>{' '}
            onto a calendar day. Use{' '}
            <CodeText as="span" class="codeInline">
              Esc
            </CodeText>{' '}
            to cancel forms and{' '}
            <CodeText as="span" class="codeInline">
              Ctrl+Enter
            </CodeText>{' '}
            to submit.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default CompositesSection;
