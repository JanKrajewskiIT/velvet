import {
  ActionRow,
  AiResultPanel,
  AtsAnalysisPanel,
  Button,
  Chip,
  CodeText,
  CommandPaletteTrigger,
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
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { DEMO_TRANSFER_INITIAL_SOURCE, DEMO_TRANSFER_INITIAL_TARGET } from '../fixtures/compositesFixtures';
import { useDemoDictionary } from '../hooks/useDemoDictionary';
import { type DemoI18nMessageKey } from '../i18n/messages';
import { renderRichText } from '../i18n/renderRichText';
import type { SectionId } from '../nav/demoNavConfig';

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

const createTask = (index: number, t: (key: DemoI18nMessageKey) => string): TaskItem => ({
  id: crypto.randomUUID(),
  title: `${t('demo.text.composites.editableCollection.taskLabel')} ${index}`,
  owner: t('demo.text.composites.editableCollection.defaultOwner'),
});

const createKanbanColumns = (t: (key: DemoI18nMessageKey) => string): KanbanColumn[] => [
  { id: 'todo', label: t('demo.text.composites.kanban.column.todo') },
  { id: 'in-progress', label: t('demo.text.composites.kanban.column.inProgress') },
  { id: 'done', label: t('demo.text.composites.kanban.column.done') },
];

const createInitialKanbanItems = (t: (key: DemoI18nMessageKey) => string): KanbanDemoItem[] => [
  {
    id: 'kanban-1',
    columnId: 'todo',
    title: t('demo.text.composites.kanban.item.designSystemReview.title'),
    description: t('demo.text.composites.kanban.item.designSystemReview.description'),
    owner: t('demo.text.common.owner.anna'),
    priority: 'high',
  },
  {
    id: 'kanban-2',
    columnId: 'todo',
    title: t('demo.text.composites.kanban.item.writeMigrationNotes.title'),
    description: t('demo.text.composites.kanban.item.writeMigrationNotes.description'),
    owner: t('demo.text.common.owner.marek'),
    priority: 'medium',
  },
  {
    id: 'kanban-3',
    columnId: 'in-progress',
    title: t('demo.text.composites.kanban.item.polishInteractions.title'),
    description: t('demo.text.composites.kanban.item.polishInteractions.description'),
    owner: t('demo.text.common.owner.jan'),
    priority: 'high',
  },
  {
    id: 'kanban-4',
    columnId: 'done',
    title: t('demo.text.composites.kanban.item.shipReleaseNotes.title'),
    description: t('demo.text.composites.kanban.item.shipReleaseNotes.description'),
    owner: t('demo.text.common.owner.kasia'),
    priority: 'low',
  },
];

const createSchedulerEvents = (t: (key: DemoI18nMessageKey) => string): SchedulerEvent[] => [
  {
    id: 'event-1',
    title: t('demo.text.composites.scheduler.event.designReview.title'),
    date: '2026-03-12',
    time: '09:30',
    description: t('demo.text.composites.scheduler.event.designReview.description'),
  },
  {
    id: 'event-2',
    title: t('demo.text.composites.scheduler.event.apiSync.title'),
    date: '2026-03-12',
    time: '13:00',
    description: t('demo.text.composites.scheduler.event.apiSync.description'),
  },
  {
    id: 'event-3',
    title: t('demo.text.composites.scheduler.event.uxWorkshopSprint.title'),
    date: '2026-03-14',
    endDate: '2026-03-16',
    time: '11:00',
    description: t('demo.text.composites.scheduler.event.uxWorkshopSprint.description'),
  },
  {
    id: 'event-4',
    title: t('demo.text.composites.scheduler.event.releasePrep.title'),
    date: '2026-03-19',
    time: '16:00',
    description: t('demo.text.composites.scheduler.event.releasePrep.description'),
  },
];

const createCommandItems = (t: (key: DemoI18nMessageKey) => string) => [
  {
    id: 'dashboard',
    label: t('demo.text.composites.commandPalette.item.dashboard.label'),
    description: t('demo.text.composites.commandPalette.item.dashboard.description'),
    group: t('demo.text.composites.commandPalette.group.navigation'),
    icon: IoHome,
    onSelect: () => {},
  },
  {
    id: 'settings',
    label: t('demo.text.composites.commandPalette.item.settings.label'),
    description: t('demo.text.composites.commandPalette.item.settings.description'),
    group: t('demo.text.composites.commandPalette.group.navigation'),
    icon: IoSettings,
    onSelect: () => {},
  },
  {
    id: 'projects',
    label: t('demo.text.composites.commandPalette.item.projects.label'),
    description: t('demo.text.composites.commandPalette.item.projects.description'),
    group: t('demo.text.composites.commandPalette.group.navigation'),
    icon: IoDocumentText,
    onSelect: () => {},
  },
  {
    id: 'inbox',
    label: t('demo.text.composites.commandPalette.item.inbox.label'),
    description: t('demo.text.composites.commandPalette.item.inbox.description'),
    group: t('demo.text.composites.commandPalette.group.navigation'),
    icon: IoMail,
    onSelect: () => {},
  },
  {
    id: 'create',
    label: t('demo.text.composites.commandPalette.item.create.label'),
    description: t('demo.text.composites.commandPalette.item.create.description'),
    group: t('demo.text.composites.commandPalette.group.actions'),
    icon: IoAdd,
    onSelect: () => {},
  },
  {
    id: 'export',
    label: t('demo.text.composites.commandPalette.item.export.label'),
    description: t('demo.text.composites.commandPalette.item.export.description'),
    group: t('demo.text.composites.commandPalette.group.actions'),
    icon: IoDownload,
    onSelect: () => {},
  },
  {
    id: 'duplicate',
    label: t('demo.text.composites.commandPalette.item.duplicate.label'),
    description: t('demo.text.composites.commandPalette.item.duplicate.description'),
    group: t('demo.text.composites.commandPalette.group.actions'),
    icon: IoCopy,
    onSelect: () => {},
  },
  {
    id: 'bulk-archive',
    label: t('demo.text.composites.commandPalette.item.bulkArchive.label'),
    description: t('demo.text.composites.commandPalette.item.bulkArchive.description'),
    group: t('demo.text.composites.commandPalette.group.actions'),
    icon: IoTrash,
    onSelect: () => {},
  },
  {
    id: 'theme-light',
    label: t('demo.text.composites.commandPalette.item.themeLight.label'),
    description: t('demo.text.composites.commandPalette.item.themeLight.description'),
    group: t('demo.text.composites.commandPalette.group.preferences'),
    icon: IoSettings,
    onSelect: () => {},
  },
  {
    id: 'theme-dark',
    label: t('demo.text.composites.commandPalette.item.themeDark.label'),
    description: t('demo.text.composites.commandPalette.item.themeDark.description'),
    group: t('demo.text.composites.commandPalette.group.preferences'),
    icon: IoNotifications,
    onSelect: () => {},
  },
  {
    id: 'open-shortcuts',
    label: t('demo.text.composites.commandPalette.item.openShortcuts.label'),
    description: t('demo.text.composites.commandPalette.item.openShortcuts.description'),
    group: t('demo.text.composites.commandPalette.group.preferences'),
    icon: IoSearch,
    onSelect: () => {},
  },
  {
    id: 'schedule-review',
    label: t('demo.text.composites.commandPalette.item.scheduleReview.label'),
    description: t('demo.text.composites.commandPalette.item.scheduleReview.description'),
    group: t('demo.text.composites.commandPalette.group.preferences'),
    icon: IoCalendar,
    onSelect: () => {},
  },
  {
    id: 'rename-item',
    label: t('demo.text.composites.commandPalette.item.renameItem.label'),
    description: t('demo.text.composites.commandPalette.item.renameItem.description'),
    group: t('demo.text.composites.commandPalette.group.actions'),
    icon: IoPencil,
    onSelect: () => {},
  },
];

const createAiRunScenarios = (t: (key: DemoI18nMessageKey) => string): readonly AiRunScenario[] => [
  {
    id: 'a11y-audit',
    label: t('demo.text.composites.ai.scenario.a11yAudit.label'),
    state: 'result',
    score: 91,
    scoreLabel: t('demo.text.composites.ai.scenario.a11yAudit.scoreLabel'),
    summary: t('demo.text.composites.ai.scenario.a11yAudit.summary'),
    sections: [
      {
        icon: 'success',
        title: t('demo.text.composites.ai.scenario.a11yAudit.strongAreas.title'),
        items: [
          t('demo.text.composites.ai.scenario.a11yAudit.strongAreas.item1'),
          t('demo.text.composites.ai.scenario.a11yAudit.strongAreas.item2'),
          t('demo.text.composites.ai.scenario.a11yAudit.strongAreas.item3'),
        ],
      },
      {
        icon: 'info',
        title: t('demo.text.composites.ai.scenario.a11yAudit.nextSteps.title'),
        items: [
          t('demo.text.composites.ai.scenario.a11yAudit.nextSteps.item1'),
          t('demo.text.composites.ai.scenario.a11yAudit.nextSteps.item2'),
        ],
      },
    ],
  },
  {
    id: 'run-failure',
    label: t('demo.text.composites.ai.scenario.runFailure.label'),
    state: 'error',
    score: 0,
    scoreLabel: t('demo.text.composites.ai.scenario.runFailure.scoreLabel'),
    summary: t('demo.text.composites.ai.scenario.runFailure.summary'),
    sections: [
      {
        icon: 'danger',
        title: t('demo.text.composites.ai.scenario.runFailure.failureDetails.title'),
        items: [
          t('demo.text.composites.ai.scenario.runFailure.failureDetails.item1'),
          t('demo.text.composites.ai.scenario.runFailure.failureDetails.item2'),
        ],
      },
    ],
  },
  {
    id: 'interaction-review',
    label: t('demo.text.composites.ai.scenario.interactionReview.label'),
    state: 'result',
    score: 84,
    scoreLabel: t('demo.text.composites.ai.scenario.interactionReview.scoreLabel'),
    summary: t('demo.text.composites.ai.scenario.interactionReview.summary'),
    sections: [
      {
        icon: 'success',
        title: t('demo.text.composites.ai.scenario.interactionReview.progressMade.title'),
        items: [
          t('demo.text.composites.ai.scenario.interactionReview.progressMade.item1'),
          t('demo.text.composites.ai.scenario.interactionReview.progressMade.item2'),
        ],
      },
      {
        icon: 'danger',
        title: t('demo.text.composites.ai.scenario.interactionReview.followUpRequired.title'),
        items: [
          t('demo.text.composites.ai.scenario.interactionReview.followUpRequired.item1'),
          t('demo.text.composites.ai.scenario.interactionReview.followUpRequired.item2'),
        ],
      },
    ],
  },
];

const CompositesSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const { t } = useDemoDictionary();
  const aiRunScenarios = createMemo(() => createAiRunScenarios(t));
  const commandItems = createMemo(() => createCommandItems(t));
  const kanbanColumns = createMemo(() => createKanbanColumns(t));
  const [sourceItems, setSourceItems] = createSignal(DEMO_TRANSFER_INITIAL_SOURCE);
  const [targetItems, setTargetItems] = createSignal(DEMO_TRANSFER_INITIAL_TARGET);
  const [analysisState, setAnalysisState] = createSignal<AnalysisState>('idle');
  const [selectedScenarioId, setSelectedScenarioId] = createSignal('a11y-audit');
  const [atsInput, setAtsInput] = createSignal('SolidJS, TypeScript, Design systems, accessibility');
  const [atsLoading, setAtsLoading] = createSignal(false);
  const [atsError, setAtsError] = createSignal<string | undefined>();
  const [atsResult, setAtsResult] = createSignal<{
    overallScore: number;
    categories: { label: string; score: number }[];
    recommendations: { label: string; message: string; severity: 'critical' | 'warning' | 'suggestion' }[];
  } | null>(null);
  const [tasks, setTasks] = createSignal<TaskItem[]>([]);
  const [kanbanItems, setKanbanItems] = createSignal<KanbanDemoItem[]>([]);
  const [schedulerEvents, setSchedulerEvents] = createSignal<SchedulerEvent[]>([]);

  createEffect(() => {
    if (tasks().length === 0) {
      setTasks([createTask(1, t), createTask(2, t)]);
    }
    if (kanbanItems().length === 0) {
      setKanbanItems(createInitialKanbanItems(t));
    }
    if (schedulerEvents().length === 0) {
      setSchedulerEvents(createSchedulerEvents(t));
    }
  });

  const runAnalysis = () => {
    setAnalysisState('loading');

    setTimeout(() => {
      const scenario = selectedScenario();
      if (!scenario) return;
      setAnalysisState(scenario.state);
    }, 1200);
  };

  const runAtsAnalysis = async () => {
    setAtsLoading(true);
    setAtsError(undefined);
    setAtsResult(null);
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!atsInput().trim()) {
      setAtsLoading(false);
      setAtsError(t('demo.text.composites.ats.errorEmptyInput'));
      return;
    }

    setAtsResult({
      overallScore: 86,
      categories: [
        { label: t('demo.text.composites.ats.category.keywordMatch'), score: 91 },
        { label: t('demo.text.composites.ats.category.structure'), score: 83 },
        { label: t('demo.text.composites.ats.category.readability'), score: 78 },
      ],
      recommendations: [
        {
          label: t('demo.text.composites.ats.reco.measurableOutcomes.label'),
          message: t('demo.text.composites.ats.reco.measurableOutcomes.message'),
          severity: 'warning',
        },
        {
          label: t('demo.text.composites.ats.reco.mirrorStack.label'),
          message: t('demo.text.composites.ats.reco.mirrorStack.message'),
          severity: 'suggestion',
        },
      ],
    });
    setAtsLoading(false);
  };

  const resetAtsAnalysis = () => {
    setAtsResult(null);
    setAtsError(undefined);
  };

  const selectedScenario = createMemo(
    () => aiRunScenarios().find((scenario) => scenario.id === selectedScenarioId()) ?? aiRunScenarios()[0],
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
        <Chip variant="subtle" size="sm" label={item.id.slice(0, 8)} />
        <IconButton
          icon={<IoTrash />}
          label={t('demo.text.composites.editableCollection.removeTask')}
          size="sm"
          onClick={requestRemove}
        />
      </div>
      <div class="editableGrid">
        <FormField label={t('demo.text.composites.editableCollection.title')}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={item.title}
              onInput={(e) => updateTask(item.id, 'title', e.currentTarget.value)}
            />
          )}
        </FormField>
        <FormField label={t('demo.text.composites.editableCollection.owner')}>
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
      <Text as="span" variant="labelMd">
        {item.title}
      </Text>
      <Text as="span" variant="bodySm" tone="muted" class="mutedText">
        {item.description}
      </Text>
      <div class="row justifyBetween">
        <Chip variant="subtle" size="sm" label={item.owner} />
        <Chip
          variant="subtle"
          size="sm"
          label={
            item.priority === 'high'
              ? t('demo.text.composites.kanban.priority.high')
              : item.priority === 'medium'
                ? t('demo.text.composites.kanban.priority.medium')
                : t('demo.text.composites.kanban.priority.low')
          }
        />
      </div>
    </div>
  );

  return (
    <div>
      <Show when={sectionId() === 'composites-transfer-list'}>
        <ShowcaseSection
          title={t('demo.showcase.composites.transferList.title')}
          subtitle={t('demo.showcase.composites.transferList.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <TransferList
                sourceItems={sourceItems()}
                targetItems={targetItems()}
                onChange={handleTransferChange}
                searchable
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.composites.transferList.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-editable-collection'}>
        <ShowcaseSection
          title={t('demo.showcase.composites.editableCollection.title')}
          subtitle={t('demo.showcase.composites.editableCollection.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <EditableCollection<TaskItem>
                items={tasks()}
                getId={(item) => item.id}
                onAdd={() => setTasks((current) => [...current, createTask(current.length + 1, t)])}
                onRemove={(id) => setTasks((current) => current.filter((item) => item.id !== id))}
                renderItem={renderTaskItem}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-kanban-board'}>
        <ShowcaseSection
          title={t('demo.showcase.composites.kanbanBoard.title')}
          subtitle={t('demo.showcase.composites.kanbanBoard.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <KanbanBoard
                columns={kanbanColumns()}
                items={kanbanItems()}
                onChange={setKanbanItems}
                renderCard={renderKanbanCard}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.composites.kanban.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-command-palette'}>
        <ShowcaseSection
          title={t('demo.showcase.composites.commandPalette.title')}
          subtitle={t('demo.showcase.composites.commandPalette.subtitle')}
        >
          <PreviewPanel>
            <CommandPaletteTrigger items={commandItems()} />
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-ai-result'}>
        <ShowcaseSection
          title={t('demo.showcase.composites.aiResultPanel.title')}
          subtitle={t('demo.showcase.composites.aiResultPanel.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="actionCluster">
                <For each={aiRunScenarios()}>
                  {(scenario) => (
                    <Button
                      type="button"
                      variant={selectedScenarioId() === scenario.id ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setSelectedScenarioId(scenario.id);
                        setAnalysisState('idle');
                      }}
                    >
                      {scenario.label}
                    </Button>
                  )}
                </For>
              </div>
              <AiResultPanel
                isPending={analysisState() === 'loading'}
                hasError={analysisState() === 'error'}
                onRetry={runAnalysis}
                score={selectedScenario()?.score ?? 0}
                scoreLabel={selectedScenario()?.scoreLabel ?? t('demo.text.composites.ai.analysis')}
                summary={selectedScenario()?.summary ?? ''}
                sections={selectedScenario()?.sections ?? []}
                hasResult={analysisState() === 'result'}
                idle={
                  <div class="col colGap2xs">
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      {t('demo.text.composites.ai.idlePrimary')}
                    </Text>
                    <Text as="p" variant="caption" tone="muted" class="mutedText">
                      {t('demo.text.composites.ai.idleSecondary')}
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
                      aria-label={t('demo.text.composites.ai.selectScenario')}
                      options={aiRunScenarios().map((scenario) => ({ value: scenario.id, label: scenario.label }))}
                    />
                    <Button size="sm" variant="ghost" class="aiActionButton" onClick={() => setAnalysisState('idle')}>
                      {t('demo.text.composites.ai.reset')}
                    </Button>
                    <Button size="sm" class="aiActionButton aiRunButton" onClick={runAnalysis}>
                      {t('demo.text.composites.ai.run')}
                    </Button>
                  </ActionRow>
                }
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AtsAnalysisPanel" subtitle={t('demo.recron.showcase.atsAnalysisPanel.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoWide">
                <AtsAnalysisPanel
                  value={atsInput()}
                  onValueChange={setAtsInput}
                  onSubmit={runAtsAnalysis}
                  onReset={resetAtsAnalysis}
                  result={atsResult()}
                  loading={atsLoading()}
                  errorMessage={atsError()}
                  inputLabel={t('demo.recron.ai.ats.inputLabel')}
                  inputHint={t('demo.recron.ai.ats.inputHint')}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-scheduler'}>
        <ShowcaseSection
          title={t('demo.showcase.composites.scheduler.title')}
          subtitle={t('demo.showcase.composites.scheduler.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Scheduler
                events={schedulerEvents()}
                onEventsChange={setSchedulerEvents}
                defaultSelectedDate="2026-03-12"
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.composites.scheduler.meta'), {
              addEvent: (
                <CodeText as="span" class="codeInline">
                  {t('demo.text.composites.scheduler.action.addEvent')}
                </CodeText>
              ),
              move: (
                <CodeText as="span" class="codeInline">
                  {t('demo.text.composites.scheduler.action.move')}
                </CodeText>
              ),
              resizeEnd: (
                <CodeText as="span" class="codeInline">
                  {t('demo.text.composites.scheduler.action.resizeEnd')}
                </CodeText>
              ),
              esc: (
                <CodeText as="span" class="codeInline">
                  {t('demo.text.composites.scheduler.action.esc')}
                </CodeText>
              ),
              ctrlEnter: (
                <CodeText as="span" class="codeInline">
                  {t('demo.text.composites.scheduler.action.ctrlEnter')}
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default CompositesSection;
