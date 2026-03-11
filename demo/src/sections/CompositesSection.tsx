import {
  ActionRow,
  addToast,
  AiResultPanel,
  Button,
  DataTable,
  type DataTableColumn,
  EditableCollection,
  FileDropZone,
  FlipCard,
  FormField,
  IconButton,
  Input,
  type TransferItem,
  TransferList,
  Wizard,
} from '@jankrajewskiit/ui';
import { IoDocument, IoTrash } from 'solid-icons/io';
import { createSignal } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

interface PackageRow extends Record<string, unknown> {
  name: string;
  version: string;
  downloads: number;
  license: string;
}

const PACKAGE_DATA: PackageRow[] = [
  { name: 'solid-js', version: '1.9.7', downloads: 45000, license: 'MIT' },
  { name: 'vite', version: '7.3.1', downloads: 120000, license: 'MIT' },
  { name: 'typescript', version: '5.9.3', downloads: 300000, license: 'Apache-2.0' },
  { name: 'vitest', version: '3.1.0', downloads: 68000, license: 'MIT' },
  { name: 'eslint', version: '9.18.0', downloads: 210000, license: 'MIT' },
  { name: 'prettier', version: '4.0.0', downloads: 175000, license: 'MIT' },
  { name: 'postcss', version: '8.5.1', downloads: 95000, license: 'MIT' },
];

const PACKAGE_COLUMNS: DataTableColumn<PackageRow>[] = [
  { key: 'name', header: 'Package', sortable: true },
  { key: 'version', header: 'Version' },
  {
    key: 'downloads',
    header: 'Downloads',
    sortable: true,
    render: (val) => <span>{Number(val).toLocaleString()}</span>,
  },
  { key: 'license', header: 'License', sortable: true },
];

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

const CompositesSection = () => {
  const [sourceItems, setSourceItems] = createSignal<TransferItem[]>(INITIAL_SOURCE);
  const [targetItems, setTargetItems] = createSignal<TransferItem[]>(INITIAL_TARGET);
  const [droppedFile, setDroppedFile] = createSignal<string | null>(null);
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
        <p class="mutedText">
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
      <ShowcaseSection title="DataTable" subtitle="Generic sortable and paginated table">
        <PreviewPanel>
          <DataTable<PackageRow>
            data={PACKAGE_DATA}
            columns={PACKAGE_COLUMNS}
            pageSize={4}
            sortable
            striped
            hoverable
          />
        </PreviewPanel>
        <ShowcaseMeta>
          Click column headers to sort. Pagination appears when rows exceed <span class="codeInline">pageSize</span>.
        </ShowcaseMeta>
      </ShowcaseSection>

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
            idle={<p class="mutedText">Run analysis to generate a consistency report for the current component set.</p>}
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
                <div class="editableHeader">
                  <span class="statusChip">{item.id.slice(0, 8)}</span>
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
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FileDropZone" subtitle="Drag-and-drop file input">
        <PreviewPanel class="col">
          <FileDropZone
            label="Drop a file here or click to browse"
            hint="Supports: .pdf, .jpg, .png"
            accept=".pdf,.jpg,.png,image/*"
            icon={<IoDocument size={28} />}
            onFile={(f) => {
              setDroppedFile(f.name);
              addToast({ type: 'success', message: `Picked: ${f.name}` });
            }}
          />
          {droppedFile() && (
            <ShowcaseMeta>
              Selected file: <strong>{droppedFile()}</strong>
            </ShowcaseMeta>
          )}
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FlipCard" subtitle="Interactive front/back card">
        <PreviewPanel>
          <div class="flipCardGrid">
            <FlipCard
              width="220px"
              height="140px"
              front={
                <div class="flipCardFace">
                  <strong class="flipCardTitle">VelvetUI</strong>
                  <span class="flipCardHint">Click to flip</span>
                </div>
              }
              back={
                <div class="flipCardBack">
                  <strong>SolidJS plus Vite</strong>
                  <span class="flipCardHint">TypeScript and CSS Modules</span>
                </div>
              }
            />
            <FlipCard
              width="220px"
              height="140px"
              front={<div class="flipCardFace">UI System</div>}
              back={<div class="flipCardSimple">Dark and light theme</div>}
            />
          </div>
        </PreviewPanel>
        <ShowcaseMeta>Click a card to flip it.</ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default CompositesSection;
