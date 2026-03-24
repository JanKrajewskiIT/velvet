import {
  ActionRow,
  addToast,
  AiResultPanel,
  Button,
  Chip,
  CodeText,
  CommandPalette,
  EditableCollection,
  FormField,
  IconButton,
  Input,
  KanbanBoard,
  type KanbanColumn,
  type KanbanItemBase,
  Scheduler,
  type SchedulerEvent,
  Select,
  Text,
  type TransferItem,
  TransferList,
  Wizard,
} from '@jankrajewskiit/ui';
import {
  IoAdd,
  IoCalendar,
  IoCopy,
  IoDocumentText,
  IoDownload,
  IoHome,
  IoMail,
  IoNotifications,
  IoPencil,
  IoSearch,
  IoSettings,
  IoTrash,
} from 'solid-icons/io';
import { createMemo, createSignal, For, Show } from 'solid-js';

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

type AnalysisState = 'idle' | 'loading' | 'result' | 'error';

interface AiRunScenario {
  id: string;
  label: string;
  state: AnalysisState;
  score: number;
  scoreLabel: string;
  summary: string;
  sections: {
    icon: 'success' | 'danger' | 'info';
    title: string;
    items: string[];
  }[];
}

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

const COMMAND_ITEMS = [
  {
    id: 'dashboard',
    label: 'Go to Dashboard',
    description: 'Navigate to main dashboard',
    group: 'Navigation',
    icon: <IoHome size={16} />,
    onSelect: () => {},
  },
  {
    id: 'settings',
    label: 'Go to Settings',
    description: 'Open app settings',
    group: 'Navigation',
    icon: <IoSettings size={16} />,
    onSelect: () => {},
  },
  {
    id: 'projects',
    label: 'Go to Projects',
    description: 'Open projects workspace',
    group: 'Navigation',
    icon: <IoDocumentText size={16} />,
    onSelect: () => {},
  },
  {
    id: 'inbox',
    label: 'Go to Inbox',
    description: 'Review recent updates and messages',
    group: 'Navigation',
    icon: <IoMail size={16} />,
    onSelect: () => {},
  },
  {
    id: 'create',
    label: 'Create new item',
    description: 'Add a new entry',
    group: 'Actions',
    icon: <IoAdd size={16} />,
    onSelect: () => {},
  },
  {
    id: 'export',
    label: 'Export data',
    description: 'Download selected records as CSV',
    group: 'Actions',
    icon: <IoDownload size={16} />,
    onSelect: () => {},
  },
  {
    id: 'duplicate',
    label: 'Duplicate item',
    description: 'Create a copy of the current entry',
    group: 'Actions',
    icon: <IoCopy size={16} />,
    onSelect: () => {},
  },
  {
    id: 'bulk-archive',
    label: 'Archive selected',
    description: 'Move selected entries to archive',
    group: 'Actions',
    icon: <IoTrash size={16} />,
    onSelect: () => {},
  },
  {
    id: 'theme-light',
    label: 'Switch to light theme',
    description: 'Apply light mode colors',
    group: 'Preferences',
    icon: <IoSettings size={16} />,
    onSelect: () => {},
  },
  {
    id: 'theme-dark',
    label: 'Switch to dark theme',
    description: 'Apply dark mode colors',
    group: 'Preferences',
    icon: <IoNotifications size={16} />,
    onSelect: () => {},
  },
  {
    id: 'open-shortcuts',
    label: 'Open keyboard shortcuts',
    description: 'Show list of available hotkeys',
    group: 'Preferences',
    icon: <IoSearch size={16} />,
    onSelect: () => {},
  },
  {
    id: 'schedule-review',
    label: 'Schedule review',
    description: 'Plan a calendar slot for design QA',
    group: 'Preferences',
    icon: <IoCalendar size={16} />,
    onSelect: () => {},
  },
  {
    id: 'rename-item',
    label: 'Rename current item',
    description: 'Edit the title without leaving this view',
    group: 'Actions',
    icon: <IoPencil size={16} />,
    onSelect: () => {},
  },
];

const AI_RUN_SCENARIOS: readonly AiRunScenario[] = [
  {
    id: 'a11y-audit',
    label: 'Accessibility audit',
    state: 'result',
    score: 91,
    scoreLabel: 'Accessibility compliance',
    summary:
      'Core primitives are now consistent for keyboard focus, but two complex composites still need aria regression checks.',
    sections: [
      {
        icon: 'success',
        title: 'Strong areas',
        items: [
          'Form controls expose accessible labels and descriptions',
          'Heading hierarchy is consistent across key layouts',
          'Color tokens keep contrast stable in both themes',
        ],
      },
      {
        icon: 'info',
        title: 'Suggested next steps',
        items: [
          'Add keyboard e2e checks for DataGridPro drag and resize flows',
          'Validate screen reader announcements for status-heavy components',
        ],
      },
    ],
  },
  {
    id: 'run-failure',
    label: 'Error state',
    state: 'error',
    score: 0,
    scoreLabel: 'Run failed',
    summary: 'The analysis endpoint returned an internal error while building the latest component map.',
    sections: [
      {
        icon: 'danger',
        title: 'Failure details',
        items: ['Request timeout after 12s', 'Two input snapshots were incomplete in this run'],
      },
    ],
  },
  {
    id: 'interaction-review',
    label: 'Interaction review',
    state: 'result',
    score: 84,
    scoreLabel: 'Interaction consistency',
    summary:
      'Most action patterns are now unified, but there are still minor differences in secondary button emphasis.',
    sections: [
      {
        icon: 'success',
        title: 'Progress made',
        items: [
          'Toolbar actions use shared Button primitives',
          'Filter and sorting behaviors are aligned between tabular composites',
        ],
      },
      {
        icon: 'danger',
        title: 'Follow-up required',
        items: [
          'Normalize ghost button contrast in dense table headers',
          'Unify helper text spacing in edge-case field wrappers',
        ],
      },
    ],
  },
];

const CompositesSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [sourceItems, setSourceItems] = createSignal<TransferItem[]>(INITIAL_SOURCE);
  const [targetItems, setTargetItems] = createSignal<TransferItem[]>(INITIAL_TARGET);
  const [analysisState, setAnalysisState] = createSignal<AnalysisState>('idle');
  const [selectedScenarioId, setSelectedScenarioId] = createSignal(AI_RUN_SCENARIOS[0]?.id ?? '');
  const [tasks, setTasks] = createSignal<TaskItem[]>([createTask(1), createTask(2)]);
  const [kanbanItems, setKanbanItems] = createSignal<KanbanDemoItem[]>(INITIAL_KANBAN_ITEMS);
  const [schedulerEvents, setSchedulerEvents] = createSignal<SchedulerEvent[]>(SCHEDULER_EVENTS);
  const [commandOpen, setCommandOpen] = createSignal(false);

  const wizardSteps = [
    {
      label: 'Account',
      component: (
        <div class="col">
          <FormField label="Email">
            {(fieldProps) => <Input {...fieldProps} type="email" placeholder="you@example.com" />}
          </FormField>
          <FormField label="Username">
            {(fieldProps) => <Input {...fieldProps} type="text" placeholder="jankowalski" />}
          </FormField>
        </div>
      ),
    },
    {
      label: 'Profile',
      component: (
        <div class="col">
          <FormField label="Full name">
            {(fieldProps) => <Input {...fieldProps} type="text" placeholder="Jan Kowalski" />}
          </FormField>
          <FormField label="Bio">
            {(fieldProps) => <Input {...fieldProps} type="text" placeholder="Short bio..." />}
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
      const scenario = selectedScenario();
      if (!scenario) return;
      setAnalysisState(scenario.state);
    }, 1200);
  };

  const selectedScenario = createMemo(
    () => AI_RUN_SCENARIOS.find((scenario) => scenario.id === selectedScenarioId()) ?? AI_RUN_SCENARIOS[0]
  );

  const updateTask = (id: string, field: keyof TaskItem, value: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const handleTransferChange = (source: TransferItem[], target: TransferItem[]) => {
    setSourceItems(source);
    setTargetItems(target);
  };

  const renderTaskItem = (item: TaskItem, { requestRemove }: { requestRemove: () => void }) => (
    <>
      <div class="editableHeader">
        <Chip variant="subtle" size="sm">
          {item.id.slice(0, 8)}
        </Chip>
        <IconButton icon={<IoTrash />} title="Remove task" size="sm" onClick={requestRemove} />
      </div>
      <div class="editableGrid">
        <FormField label="Title">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={item.title}
              onInput={(e) => updateTask(item.id, 'title', e.currentTarget.value)}
            />
          )}
        </FormField>
        <FormField label="Owner">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={item.owner}
              onInput={(e) => updateTask(item.id, 'owner', e.currentTarget.value)}
            />
          )}
        </FormField>
      </div>
    </>
  );

  const renderKanbanCard = (item: KanbanDemoItem) => (
    <div class="col colGap2xs">
      <strong>{item.title}</strong>
      <Text as="span" variant="bodySm" tone="muted" class="mutedText">
        {item.description}
      </Text>
      <div class="row justifyBetween">
        <Chip variant="subtle" size="sm">
          {item.owner}
        </Chip>
        <Chip variant="subtle" size="sm">
          {item.priority}
        </Chip>
      </div>
    </div>
  );

  return (
    <div>
      <Show when={sectionId() === 'composites-transfer-list'}>
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
      </Show>

      <Show when={sectionId() === 'composites-editable-collection'}>
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
                renderItem={renderTaskItem}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-kanban-board'}>
        <ShowcaseSection title="KanbanBoard" subtitle="Drag and drop cards between workflow columns">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <KanbanBoard
                columns={KANBAN_COLUMNS}
                items={kanbanItems()}
                onChange={setKanbanItems}
                emptyLabel="Drop cards here"
                renderCard={renderKanbanCard}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>Drag cards between columns to update their status.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-wizard'}>
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
      </Show>

      <Show when={sectionId() === 'composites-command-palette'}>
        <ShowcaseSection title="Command Palette" subtitle="Keyboard-driven command launcher with grouped results">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="primary" onClick={() => setCommandOpen(true)}>
                Open Command Palette (Ctrl+K)
              </Button>
              <CommandPalette open={commandOpen()} onClose={() => setCommandOpen(false)} items={COMMAND_ITEMS} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-ai-result'}>
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
                score={selectedScenario()?.score ?? 0}
                scoreLabel={selectedScenario()?.scoreLabel ?? 'Analysis'}
                summary={selectedScenario()?.summary ?? ''}
                sections={selectedScenario()?.sections ?? []}
                hasResult={analysisState() === 'result'}
                idle={
                  <div class="col colGap2xs">
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Run analysis to generate a consistency report for the current component set.
                    </Text>
                    <Text as="p" variant="caption" tone="muted" class="mutedText">
                      Choose a scenario and run analysis to preview a specific panel state.
                    </Text>
                  </div>
                }
                actions={
                  <ActionRow align="start" class="aiActionsRow">
                    <Select
                      size="sm"
                      class="aiScenarioSelect"
                      value={selectedScenarioId()}
                      onChange={(e) => setSelectedScenarioId(e.currentTarget.value)}
                      aria-label="Select AI scenario"
                    >
                      <For each={AI_RUN_SCENARIOS}>
                        {(scenario) => <option value={scenario.id}>{scenario.label}</option>}
                      </For>
                    </Select>
                    <Button size="sm" variant="ghost" class="aiActionButton" onClick={() => setAnalysisState('idle')}>
                      Reset
                    </Button>
                    <Button size="sm" class="aiActionButton aiRunButton" onClick={runAnalysis}>
                      Run analysis
                    </Button>
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
