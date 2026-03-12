import {
  ActionRow,
  addToast,
  AiResultPanel,
  Button,
  EditableCollection,
  FormField,
  IconButton,
  Input,
  type TransferItem,
  TransferList,
  Wizard,
} from '@jankrajewskiit/ui';
import { IoTrash } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const INITIAL_SOURCE: TransferItem[] = [
  { id: '1', label: 'TypeScript' },
  { id: '2', label: 'CSS Modules' },
  { id: '3', label: 'Vite' },
  { id: '4', label: 'ESLint' },
  { id: '5', label: 'Prettier' },
];

const INITIAL_TARGET: TransferItem[] = [{ id: '6', label: 'SolidJS' }];

type AnalysisState = 'idle' | 'loading' | 'result' | 'error';

interface TaskItem {
  id: string;
  title: string;
  owner: string;
}

const createTask = (index: number): TaskItem => ({
  id: crypto.randomUUID(),
  title: `Task ${index}`,
  owner: 'Product Team',
});

const CompositesSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [sourceItems, setSourceItems] = createSignal<TransferItem[]>(INITIAL_SOURCE);
  const [targetItems, setTargetItems] = createSignal<TransferItem[]>(INITIAL_TARGET);
  const [analysisState, setAnalysisState] = createSignal<AnalysisState>('idle');
  const [resultNext, setResultNext] = createSignal(true);
  const [tasks, setTasks] = createSignal<TaskItem[]>([createTask(1), createTask(2)]);

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
        <p class="muted-text">
          Review your information and click <strong>Finish</strong> to complete registration.
        </p>
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
            <TransferList
              sourceItems={sourceItems()}
              targetItems={targetItems()}
              onChange={handleTransferChange}
              sourceTitle="Available"
              targetTitle="Selected"
              searchable
            />
          </PreviewPanel>
          <ShowcaseMeta>
            Check items and use the arrow buttons to transfer. Search filters within each panel.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="EditableCollection" subtitle="Add/remove/edit list scaffold for dynamic forms">
          <PreviewPanel class="col">
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
                  <div class="editable-header">
                    <span class="status-chip">{item.id.slice(0, 8)}</span>
                    <IconButton icon={<IoTrash />} title="Remove task" size="sm" onClick={requestRemove} />
                  </div>
                  <div class="editable-grid">
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
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'composites-wizard-ai'}>
        <ShowcaseSection title="Wizard" subtitle="Multi-step guided workflow">
          <PreviewPanel>
            <Wizard
              steps={wizardSteps}
              backLabel="Back"
              nextLabel="Next"
              finishLabel="Finish"
              onFinish={() => {
                addToast({ type: 'success', message: 'Registration complete!' });
              }}
            />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AiResultPanel" subtitle="Reusable result layout for AI and scoring flows">
          <PreviewPanel>
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
                <p class="muted-text">Run analysis to generate a consistency report for the current component set.</p>
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
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default CompositesSection;
