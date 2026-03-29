import type { ColorTag, FlashcardQuizResult } from '@jankrajewskiit/ui';
import {
  addToast,
  AtsAnalysisPanel,
  Button,
  ChipCategorySelector,
  ColorTagCloud,
  ColorTagManagerDialog,
  ColorTagSelectionDialog,
  ComparisonInsightsDialog,
  ComparisonSelectionBar,
  FlashcardQuizCard,
  FlashcardQuizSession,
  FlashcardQuizSummary,
  Heading,
  HierarchicalCategoryNavigator,
  IconCategorySelector,
  ImportSourcesDialog,
  IndexedContentCard,
  InterviewJourneyTimeline,
  InterviewSessionCard,
  QuestionAnswerPanel,
  QuestionFilterBar,
  QuizSetupPanel,
  ScoredInsightsPanel,
  StatusFilterChips,
  StatusMenuChip,
  Text,
  useI18n,
} from '@jankrajewskiit/ui';
import { IoAddSharp, IoCalendar, IoMail, IoSearch } from 'solid-icons/io';
import type { ComponentProps } from 'solid-js';
import { createMemo, createSignal } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const tagItems = [
  { id: 'tag-1', label: 'Remote', color: '#1d4ed8' },
  { id: 'tag-2', label: 'Senior', color: '#7c3aed' },
  { id: 'tag-3', label: 'Fintech', color: '#0f766e' },
  { id: 'tag-4', label: 'Urgent', color: '#dc2626' },
];

const statusOptions = [
  { value: 'new', label: 'New', variant: 'primary' as const },
  { value: 'screening', label: 'Screening', variant: 'info' as const },
  { value: 'interview', label: 'Interview', variant: 'warning' as const },
  { value: 'offer', label: 'Offer', variant: 'success' as const },
  { value: 'rejected', label: 'Rejected', variant: 'error' as const },
];

const statusFilterItems = [
  { value: 'new', label: 'New', count: 12, variant: 'primary' as const },
  { value: 'screening', label: 'Screening', count: 5, variant: 'info' as const },
  { value: 'interview', label: 'Interview', count: 3, variant: 'warning' as const },
  { value: 'offer', label: 'Offer', count: 2, variant: 'success' as const },
  { value: 'rejected', label: 'Rejected', count: 7, variant: 'error' as const },
];

const comparisonAxes = [
  { key: 'salary', label: 'Salary' },
  { key: 'stack', label: 'Tech stack' },
  { key: 'growth', label: 'Growth' },
  { key: 'flexibility', label: 'Flexibility' },
];

const comparisonDatasets = [
  { label: 'Velvet Labs', values: [88, 92, 84, 73], color: '#1d4ed8' },
  { label: 'Signal Forge', values: [79, 86, 77, 91], color: '#059669' },
];

const comparisonColumns = [
  { label: 'Velvet Labs', description: 'Platform team', accentColor: '#1d4ed8' },
  { label: 'Signal Forge', description: 'Product engineering', accentColor: '#059669' },
];

const comparisonRows = [
  { label: 'Compensation', values: ['22-28k PLN B2B', '20-25k PLN B2B'] },
  { label: 'Work mode', values: ['Hybrid, 2 days office', 'Remote first'] },
  { label: 'Hiring process', values: ['3 stages', '4 stages'] },
];

const interviewStageOptions = [
  { value: 'hr', label: 'HR call', icon: IoMail, chipVariant: 'info' as const },
  { value: 'technical', label: 'Technical interview', icon: IoSearch, chipVariant: 'warning' as const },
  { value: 'final', label: 'Final meeting', icon: IoCalendar, chipVariant: 'success' as const },
];

const interviewStatusOptions = [
  { value: 'scheduled', label: 'Scheduled', chipVariant: 'info' as const },
  { value: 'completed', label: 'Completed', chipVariant: 'success' as const },
  { value: 'rescheduled', label: 'Rescheduled', chipVariant: 'warning' as const },
];

const flashcardItems = [
  {
    id: 'fc-1',
    category: 'SolidJS',
    question: 'What problem does `createMemo` solve?',
    answer: 'It caches derived values and only recomputes when tracked dependencies change.',
  },
  {
    id: 'fc-2',
    category: 'TypeScript',
    question: 'When would you prefer a discriminated union?',
    answer: 'When state variants need precise narrowing and exhaustiveness checks.',
  },
  {
    id: 'fc-3',
    category: 'CSS',
    question: 'What is the benefit of CSS custom properties?',
    answer: 'They allow dynamic theming and composition directly in the cascade.',
  },
];

const fallbackQuizResults: FlashcardQuizResult<(typeof flashcardItems)[number]>[] = flashcardItems.map(
  (item, index) => ({
    id: item.id,
    item,
    known: index !== 1,
  })
);

const questionFilterItems = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'voted', label: 'Voted' },
  { value: 'pending', label: 'Pending' },
  { value: 'unanswered', label: 'Unanswered' },
];

const questionSortItems = [
  { value: 'order', label: 'Manual order' },
  { value: 'popular', label: 'Most popular' },
];

const quizSetupCategories = [
  { value: 'solid-basics', label: 'SolidJS / Basics' },
  { value: 'solid-performance', label: 'SolidJS / Performance' },
  { value: 'ts-advanced', label: 'TypeScript / Advanced' },
  { value: 'css-architecture', label: 'CSS / Architecture' },
];

const chipCategoryItems = quizSetupCategories.map((item) => ({
  id: item.value,
  label: item.label,
}));

const iconCategoryItems = [
  { id: 'solid', label: 'SolidJS', icon: <IoSearch /> },
  { id: 'testing', label: 'Testing', icon: <IoMail /> },
  { id: 'architecture', label: 'Architecture', icon: <IoCalendar /> },
  { id: 'delivery', label: 'Delivery', icon: <IoAddSharp /> },
];

const hierarchicalCategoryItems = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: <IoSearch />,
    children: [
      { id: 'solidjs', label: 'SolidJS' },
      { id: 'reactivity', label: 'Reactivity' },
      { id: 'styling', label: 'Styling' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: <IoMail />,
    children: [
      { id: 'apis', label: 'APIs' },
      { id: 'auth', label: 'Auth' },
      { id: 'queues', label: 'Queues' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: <IoCalendar />,
    children: [
      { id: 'ownership', label: 'Ownership' },
      { id: 'communication', label: 'Communication' },
    ],
  },
];

const RecronExtractsSection = () => {
  type ColorTagSelectionSubmit = NonNullable<ComponentProps<typeof ColorTagSelectionDialog>['onSubmit']>;
  type ColorTagCreate = NonNullable<ComponentProps<typeof ColorTagManagerDialog>['onCreate']>;
  type ColorTagUpdate = NonNullable<ComponentProps<typeof ColorTagManagerDialog>['onUpdate']>;
  type ColorTagDelete = NonNullable<ComponentProps<typeof ColorTagManagerDialog>['onDelete']>;
  type ScoredInsightsRun = NonNullable<ComponentProps<typeof ScoredInsightsPanel>['onRun']>;
  type ImportSourcesSubmit = NonNullable<ComponentProps<typeof ImportSourcesDialog>['onSubmit']>;
  type InterviewSessionValue = ComponentProps<typeof InterviewSessionCard>['value'];
  type InterviewSessionSave = NonNullable<ComponentProps<typeof InterviewSessionCard>['onSave']>;
  type InterviewSessionDelete = NonNullable<ComponentProps<typeof InterviewSessionCard>['onDelete']>;

  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey): string => dictionary()[key];

  const [selectedTagIds, setSelectedTagIds] = createSignal<string[]>(['tag-1', 'tag-2']);
  const [managedTags, setManagedTags] = createSignal<ColorTag[]>([
    { id: 'tag-1', name: 'Remote', color: '#1d4ed8' },
    { id: 'tag-2', name: 'Top pick', color: '#7c3aed' },
    { id: 'tag-3', name: 'Fast track', color: '#dc2626' },
  ]);
  const [statusFilterValue, setStatusFilterValue] = createSignal<string[]>(['new', 'interview']);
  const [menuStatus, setMenuStatus] = createSignal('screening');
  const [comparisonOpen, setComparisonOpen] = createSignal(false);
  const [comparisonPending, setComparisonPending] = createSignal(false);
  const [comparisonReady, setComparisonReady] = createSignal(false);
  const [tagManagerOpen, setTagManagerOpen] = createSignal(false);
  const [tagSelectionOpen, setTagSelectionOpen] = createSignal(false);
  const [importOpen, setImportOpen] = createSignal(false);
  const [importBusy, setImportBusy] = createSignal(false);
  const [atsInput, setAtsInput] = createSignal('SolidJS, TypeScript, Design systems, accessibility');
  const [atsLoading, setAtsLoading] = createSignal(false);
  const [atsError, setAtsError] = createSignal<string | undefined>();
  const [atsResult, setAtsResult] = createSignal<{
    overallScore: number;
    categories: { label: string; score: number }[];
    recommendations: { label: string; message: string; severity: 'critical' | 'warning' | 'suggestion' }[];
  } | null>(null);
  const [interviewValue, setInterviewValue] = createSignal<InterviewSessionValue>({
    id: 'interview-1',
    stage: 'technical',
    status: 'scheduled',
    scheduledAt: '2026-03-29T13:30:00.000Z',
    duration: '60',
    location: 'Google Meet',
    notes: 'Focus on **SolidJS architecture** and testing strategy.',
    isCalendarSynced: true,
  });
  const [quizFlipped, setQuizFlipped] = createSignal(false);
  const [quizSessionItems, setQuizSessionItems] = createSignal([...flashcardItems]);
  const [quizResults, setQuizResults] = createSignal<FlashcardQuizResult<(typeof flashcardItems)[number]>[]>([]);
  const [questionFilter, setQuestionFilter] = createSignal('all');
  const [questionSort, setQuestionSort] = createSignal('order');
  const [questionAnswerContent, setQuestionAnswerContent] = createSignal<string | null>(null);
  const [questionAnswerLoading, setQuestionAnswerLoading] = createSignal(false);
  const [questionAnswerError, setQuestionAnswerError] = createSignal<string | undefined>();
  const [iconCategory, setIconCategory] = createSignal('solid');
  const [chipCategory, setChipCategory] = createSignal<string | null>('solid-basics');
  const [hierarchicalMainCategory, setHierarchicalMainCategory] = createSignal<string | null>('frontend');
  const [hierarchicalChildCategory, setHierarchicalChildCategory] = createSignal<string | null>('solidjs');
  const [selectedOfferCount] = createSignal(2);

  const runComparison = async () => {
    setComparisonPending(true);
    await wait(700);
    setComparisonPending(false);
    setComparisonReady(true);
  };

  const runAtsAnalysis = async () => {
    setAtsLoading(true);
    setAtsError(undefined);
    setAtsResult(null);
    await wait(700);

    if (!atsInput().trim()) {
      setAtsLoading(false);
      setAtsError('Paste a resume excerpt before running the ATS analysis.');
      return;
    }

    setAtsResult({
      overallScore: 86,
      categories: [
        { label: 'Keyword match', score: 91 },
        { label: 'Structure', score: 83 },
        { label: 'Readability', score: 78 },
      ],
      recommendations: [
        {
          label: 'Add measurable outcomes',
          message: 'Highlight impact with numbers in two recent experience bullets.',
          severity: 'warning',
        },
        {
          label: 'Mirror required stack',
          message: 'Mention testing and accessibility closer to the top of the profile.',
          severity: 'suggestion',
        },
      ],
    });
    setAtsLoading(false);
  };

  const handleTagSelectionSubmit: ColorTagSelectionSubmit = async (value) => {
    await wait(300);
    setSelectedTagIds(value);
    addToast({ type: 'success', message: 'Tag selection updated.' });
  };

  const handleTagCreate: ColorTagCreate = async (item) => {
    await wait(200);
    setManagedTags((current) => [...current, item]);
  };

  const handleTagUpdate: ColorTagUpdate = async (item) => {
    await wait(200);
    setManagedTags((current) => current.map((entry) => (entry.id === item.id ? item : entry)));
  };

  const handleTagDelete: ColorTagDelete = async (id) => {
    await wait(200);
    setManagedTags((current) => current.filter((entry) => entry.id !== id));
  };

  const handleComparisonClose = () => {
    setComparisonOpen(false);
    setComparisonReady(false);
    setComparisonPending(false);
  };

  const handleScoreRun: ScoredInsightsRun = async () => {
    await wait(600);
    return {
      score: 89,
      summary: 'Strong match for a design-system focused frontend role.',
      strengths: ['SolidJS expertise', 'Design system ownership', 'TypeScript depth'],
      gaps: ['Less exposure to data visualization'],
      recommendations: ['Highlight accessibility projects', 'Add product-facing outcomes'],
    };
  };

  const resetAtsAnalysis = () => {
    setAtsResult(null);
    setAtsError(undefined);
  };

  const closeImportDialog = () => {
    setImportOpen(false);
    setImportBusy(false);
  };

  const handleImportSubmit: ImportSourcesSubmit = async () => {
    setImportBusy(true);
    await wait(500);
    setImportBusy(false);
    setImportOpen(false);
    addToast({ type: 'success', message: 'Import finished.' });
  };

  const handleInterviewSave: InterviewSessionSave = async (value) => {
    await wait(250);
    setInterviewValue(value);
  };

  const handleInterviewDelete: InterviewSessionDelete = async () => {
    await wait(200);
    addToast({ type: 'info', message: 'Interview deleted in demo state.' });
  };

  const handleQuizFinish = (results: FlashcardQuizResult<(typeof flashcardItems)[number]>[]) => {
    setQuizResults(results);
    addToast({ type: 'success', message: 'Quiz session finished.' });
  };

  const handleQuizSummaryBack = () => {
    addToast({ type: 'info', message: 'Back action triggered.' });
  };

  const handleQuizRestart = () => {
    setQuizResults([]);
    setQuizSessionItems([...flashcardItems]);
  };

  const handleQuestionAnswerAsk = async () => {
    setQuestionAnswerLoading(true);
    setQuestionAnswerError(undefined);
    await wait(600);
    setQuestionAnswerContent(
      'Use `createMemo` for derived state that depends on reactive inputs.\n\n- It caches the computed result\n- It reruns only when tracked dependencies change\n- It keeps expensive derivations out of plain render code'
    );
    setQuestionAnswerLoading(false);
  };

  const handleQuizSetupStart = (value: { categoryId: string | null; count: number }) => {
    addToast({
      type: 'success',
      message: `Quiz configured for ${value.categoryId ?? 'all categories'} with ${String(value.count)} questions.`,
    });
  };

  return (
    <div>
      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.status.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.status.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.status.description')}
        </Text>
      </div>

      <ShowcaseSection title="ColorTagCloud" subtitle={t('demo.recron.showcase.colorTagCloud.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <ColorTagCloud
                label={t('demo.recron.status.tagCloud.label')}
                description={t('demo.recron.status.tagCloud.description')}
                items={tagItems}
                selectedIds={selectedTagIds()}
                onChange={setSelectedTagIds}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="ColorTagSelectionDialog"
        subtitle={t('demo.recron.showcase.colorTagSelectionDialog.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title="Example">
            <Button label={t('demo.recron.status.tagSelection.trigger')} onClick={() => setTagSelectionOpen(true)} />
            <ColorTagSelectionDialog
              open={tagSelectionOpen()}
              title={t('demo.recron.status.tagSelection.title')}
              description={t('demo.recron.status.tagSelection.description')}
              items={tagItems}
              value={selectedTagIds()}
              label={t('demo.recron.status.tagSelection.label')}
              emptyMessage={t('demo.recron.status.tagSelection.empty')}
              confirmLabel={t('demo.recron.status.tagSelection.confirm')}
              cancelLabel={t('demo.recron.status.tagSelection.cancel')}
              onClose={() => setTagSelectionOpen(false)}
              onSubmit={handleTagSelectionSubmit}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="ColorTagManagerDialog"
        subtitle={t('demo.recron.showcase.colorTagManagerDialog.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title="Example">
            <Button label={t('demo.recron.status.tagManager.trigger')} onClick={() => setTagManagerOpen(true)} />
            <ColorTagManagerDialog
              open={tagManagerOpen()}
              title={t('demo.recron.status.tagManager.title')}
              items={managedTags()}
              colors={['#1d4ed8', '#7c3aed', '#0f766e', '#dc2626', '#f59e0b']}
              nameLabel={t('demo.recron.status.tagManager.nameLabel')}
              colorLabel={t('demo.recron.status.tagManager.colorLabel')}
              emptyMessage={t('demo.recron.status.tagManager.empty')}
              addLabel={t('demo.recron.status.tagManager.add')}
              editLabel={t('demo.recron.status.tagManager.edit')}
              deleteLabel={t('demo.recron.status.tagManager.delete')}
              saveLabel={t('demo.recron.status.tagManager.save')}
              cancelLabel={t('demo.recron.status.tagManager.cancel')}
              deleteConfirmLabel={t('demo.recron.status.tagManager.deleteConfirmLabel')}
              deleteConfirmMessage={t('demo.recron.status.tagManager.deleteConfirmMessage')}
              onClose={() => setTagManagerOpen(false)}
              onCreate={handleTagCreate}
              onUpdate={handleTagUpdate}
              onDelete={handleTagDelete}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="StatusFilterChips" subtitle={t('demo.recron.showcase.statusFilterChips.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <StatusFilterChips
                label={t('demo.recron.status.filters.label')}
                items={statusFilterItems}
                value={statusFilterValue()}
                onChange={setStatusFilterValue}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="StatusMenuChip" subtitle={t('demo.recron.showcase.statusMenuChip.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <StatusMenuChip
              value={menuStatus()}
              options={statusOptions}
              menuLabel={t('demo.recron.status.menu.menuLabel')}
              triggerLabel={t('demo.recron.status.menu.triggerLabel')}
              onChange={setMenuStatus}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.offer.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.offer.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.offer.description')}
        </Text>
      </div>

      <ShowcaseSection
        title="ComparisonSelectionBar"
        subtitle={t('demo.recron.showcase.comparisonSelectionBar.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <ComparisonSelectionBar
                selectedCount={selectedOfferCount()}
                selectedLabel={t('demo.recron.offer.comparison.selectedLabel')}
                promptLabel={t('demo.recron.offer.comparison.promptLabel')}
                compareLabel={t('demo.recron.offer.comparison.compareLabel')}
                clearLabel={t('demo.recron.offer.comparison.clearLabel')}
                compareDisabled={selectedOfferCount() < 2 || selectedOfferCount() > 5}
                onClear={() => addToast({ type: 'info', message: 'Selection cleared in demo.' })}
                onCompare={() => setComparisonOpen(true)}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="ComparisonInsightsDialog"
        subtitle={t('demo.recron.showcase.comparisonInsightsDialog.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title="Example">
            <Button label={t('demo.recron.hero.action.compare')} onClick={() => setComparisonOpen(true)} />
            <ComparisonInsightsDialog
              open={comparisonOpen()}
              title={t('demo.recron.offer.comparison.dialog.title')}
              prompt={t('demo.recron.offer.comparison.dialog.prompt')}
              compareLabel={t('demo.recron.offer.comparison.dialog.compareLabel')}
              clearLabel={t('demo.recron.offer.comparison.dialog.clearLabel')}
              isPending={comparisonPending()}
              hasResult={comparisonReady()}
              selectionSummary={t('demo.recron.offer.comparison.dialog.selectionSummary')}
              axes={comparisonAxes}
              datasets={comparisonDatasets}
              columns={comparisonColumns}
              rows={comparisonRows}
              onClose={handleComparisonClose}
              onCompare={runComparison}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.ai.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.ai.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.ai.description')}
        </Text>
      </div>

      <ShowcaseSection title="ScoredInsightsPanel" subtitle={t('demo.recron.showcase.scoredInsightsPanel.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <ScoredInsightsPanel
                labels={{
                  loading: t('demo.recron.ai.scoredInsights.loading'),
                  retry: t('demo.recron.ai.scoredInsights.retry'),
                  run: t('demo.recron.ai.scoredInsights.run'),
                  score: t('demo.recron.ai.scoredInsights.score'),
                  strengths: t('demo.recron.ai.scoredInsights.strengths'),
                  gaps: t('demo.recron.ai.scoredInsights.gaps'),
                  recommendations: t('demo.recron.ai.scoredInsights.recommendations'),
                }}
                errorText={t('demo.recron.ai.scoredInsights.error')}
                onRun={handleScoreRun}
              />
            </div>
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
                errorLabel={t('demo.recron.ai.ats.errorLabel')}
                inputLabel={t('demo.recron.ai.ats.inputLabel')}
                inputPlaceholder={t('demo.recron.ai.ats.inputPlaceholder')}
                inputHint={t('demo.recron.ai.ats.inputHint')}
                loadingLabel={t('demo.recron.ai.ats.loading')}
                scoreLabel={t('demo.recron.ai.ats.scoreLabel')}
                categoriesLabel={t('demo.recron.ai.ats.categoriesLabel')}
                recommendationsLabel={t('demo.recron.ai.ats.recommendationsLabel')}
                submitLabel={t('demo.recron.ai.ats.submitLabel')}
                tryAgainLabel={t('demo.recron.ai.ats.tryAgainLabel')}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ImportSourcesDialog" subtitle={t('demo.recron.showcase.importSourcesDialog.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <Button label={t('demo.recron.hero.action.import')} onClick={() => setImportOpen(true)} />
            <ImportSourcesDialog
              open={importOpen()}
              title={t('demo.recron.hero.action.import')}
              sources={[
                {
                  value: 'portfolio-url',
                  label: t('demo.recron.ai.import.source.url.label'),
                  kind: 'url',
                  inputLabel: t('demo.recron.ai.import.source.url.inputLabel'),
                  inputPlaceholder: 'https://example.com/cv',
                  helperText: t('demo.recron.ai.import.source.url.helperText'),
                },
                {
                  value: 'portfolio-file',
                  label: t('demo.recron.ai.import.source.file.label'),
                  kind: 'file',
                  accept: '.pdf,.docx',
                  dropLabel: t('demo.recron.ai.import.source.file.dropLabel'),
                  dropHint: t('demo.recron.ai.import.source.file.dropHint'),
                  clearLabel: t('demo.recron.ai.import.source.file.clearLabel'),
                },
              ]}
              submitLabel={t('demo.recron.ai.import.submitLabel')}
              cancelLabel={t('demo.recron.ai.import.cancelLabel')}
              loadingLabel={t('demo.recron.ai.import.loadingLabel')}
              busy={importBusy()}
              onClose={closeImportDialog}
              onSubmit={handleImportSubmit}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.identity.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.identity.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.identity.description')}
        </Text>
      </div>

      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.interview.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.interview.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.interview.description')}
        </Text>
      </div>

      <ShowcaseSection title="InterviewSessionCard" subtitle={t('demo.recron.showcase.interviewSessionCard.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <InterviewSessionCard
                value={interviewValue()}
                labels={{
                  stage: t('demo.recron.interview.session.stage'),
                  status: t('demo.recron.interview.session.status'),
                  scheduledAt: t('demo.recron.interview.session.scheduledAt'),
                  duration: t('demo.recron.interview.session.duration'),
                  location: t('demo.recron.interview.session.location'),
                  notes: t('demo.recron.interview.session.notes'),
                  editLabel: t('demo.recron.interview.session.editLabel'),
                  deleteLabel: t('demo.recron.interview.session.deleteLabel'),
                  editDialogLabel: t('demo.recron.interview.session.editDialogLabel'),
                  deleteDialogLabel: t('demo.recron.interview.session.deleteDialogLabel'),
                  deleteDialogMessage: t('demo.recron.interview.session.deleteDialogMessage'),
                  deleteConfirmLabel: t('demo.recron.interview.session.deleteConfirmLabel'),
                  deleteCancelLabel: t('demo.recron.interview.session.deleteCancelLabel'),
                  editNotesLabel: t('demo.recron.interview.session.editNotesLabel'),
                  saveLabel: t('demo.recron.interview.session.saveLabel'),
                  cancelLabel: t('demo.recron.interview.session.cancelLabel'),
                  syncedLabel: t('demo.recron.interview.session.syncedLabel'),
                  notScheduledLabel: t('demo.recron.interview.session.notScheduledLabel'),
                }}
                stageOptions={interviewStageOptions}
                statusOptions={interviewStatusOptions}
                calendarAction={
                  <Button size="sm" variant="ghost" label={t('demo.recron.interview.session.calendarAction')} />
                }
                onSave={handleInterviewSave}
                onDelete={handleInterviewDelete}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="InterviewJourneyTimeline"
        subtitle={t('demo.recron.showcase.interviewJourneyTimeline.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <InterviewJourneyTimeline
                emptyMessage={t('demo.recron.interview.timeline.emptyMessage')}
                items={[
                  {
                    key: 'timeline-1',
                    statusTone: 'success',
                    content: <Text as="p">{t('demo.recron.interview.timeline.item.reviewed')}</Text>,
                  },
                  {
                    key: 'timeline-2',
                    statusTone: 'default',
                    content: <Text as="p">{t('demo.recron.interview.timeline.item.scheduled')}</Text>,
                  },
                  {
                    key: 'timeline-3',
                    statusTone: 'muted',
                    content: <Text as="p">{t('demo.recron.interview.timeline.item.pending')}</Text>,
                  },
                ]}
                action={<Button size="sm" variant="ghost" label={t('demo.recron.interview.timeline.action')} />}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.knowledge.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.knowledge.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.knowledge.description')}
        </Text>
      </div>

      <ShowcaseSection title="QuestionFilterBar" subtitle={t('demo.recron.showcase.questionFilterBar.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <QuestionFilterBar
                filterItems={questionFilterItems}
                sortItems={questionSortItems}
                activeFilter={questionFilter()}
                activeSort={questionSort()}
                filterGroupLabel={t('demo.recron.knowledge.filterBar.filterGroupLabel')}
                sortGroupLabel={t('demo.recron.knowledge.filterBar.sortGroupLabel')}
                onFilterChange={setQuestionFilter}
                onSortChange={setQuestionSort}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="IconCategorySelector" subtitle={t('demo.recron.showcase.iconCategorySelector.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <IconCategorySelector
                aria-label={t('demo.recron.knowledge.iconSelector.ariaLabel')}
                items={iconCategoryItems}
                selectedId={iconCategory()}
                onSelect={setIconCategory}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ChipCategorySelector" subtitle={t('demo.recron.showcase.chipCategorySelector.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <ChipCategorySelector items={chipCategoryItems} selectedId={chipCategory()} onSelect={setChipCategory} />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="HierarchicalCategoryNavigator"
        subtitle={t('demo.recron.showcase.hierarchicalCategoryNavigator.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <HierarchicalCategoryNavigator
                items={hierarchicalCategoryItems}
                selectedMainId={hierarchicalMainCategory()}
                selectedChildId={hierarchicalChildCategory()}
                mainAriaLabel={t('demo.recron.knowledge.navigator.mainAriaLabel')}
                childAriaLabel={t('demo.recron.knowledge.navigator.childAriaLabel')}
                onMainSelect={(id) => {
                  setHierarchicalMainCategory(id);
                  const selectedItem = hierarchicalCategoryItems.find((item) => item.id === id);
                  const firstChild = selectedItem?.children[0]?.id ?? null;
                  setHierarchicalChildCategory(firstChild);
                }}
                onChildSelect={setHierarchicalChildCategory}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="QuestionAnswerPanel" subtitle={t('demo.recron.showcase.questionAnswerPanel.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide">
              <QuestionAnswerPanel
                content={questionAnswerContent()}
                loading={questionAnswerLoading()}
                errorMessage={questionAnswerError()}
                loadingLabel={t('demo.recron.knowledge.answer.loadingLabel')}
                askLabel={t('demo.recron.knowledge.answer.askLabel')}
                onAsk={() => void handleQuestionAnswerAsk()}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="IndexedContentCard" subtitle={t('demo.recron.showcase.indexedContentCard.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <IndexedContentCard
                index={0}
                label={t('demo.recron.knowledge.indexedCard.label')}
                summary={t('demo.recron.knowledge.indexedCard.summary')}
                tone="warning"
                animationOrder={1}
                actions={<Button size="sm" variant="ghost" label={t('demo.recron.knowledge.indexedCard.action')} />}
                detail={
                  <QuestionAnswerPanel
                    content={t('demo.recron.knowledge.indexedCard.detail')}
                    loadingLabel={t('demo.recron.knowledge.indexedCard.loadingLabel')}
                    askLabel={t('demo.recron.knowledge.indexedCard.askLabel')}
                  />
                }
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="QuizSetupPanel" subtitle={t('demo.recron.showcase.quizSetupPanel.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <QuizSetupPanel
                title={t('demo.recron.knowledge.quizSetup.title')}
                description={t('demo.recron.knowledge.quizSetup.description')}
                categoryLabel={t('demo.recron.knowledge.quizSetup.categoryLabel')}
                countLabel={t('demo.recron.knowledge.quizSetup.countLabel')}
                allCategoriesLabel={t('demo.recron.knowledge.quizSetup.allCategoriesLabel')}
                startLabel={t('demo.recron.knowledge.quizSetup.startLabel')}
                categories={quizSetupCategories}
                countOptions={[10, 20, 30, 50]}
                initialCount={20}
                onStart={handleQuizSetupStart}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FlashcardQuizCard" subtitle={t('demo.recron.showcase.flashcardQuizCard.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <FlashcardQuizCard
                front={<Text as="p">{t('demo.recron.knowledge.flashcard.card.front')}</Text>}
                back={<Text as="p">{t('demo.recron.knowledge.flashcard.card.back')}</Text>}
                badgeLabel={t('demo.recron.knowledge.flashcard.card.badgeLabel')}
                flipped={quizFlipped()}
                onFlip={setQuizFlipped}
                revealHintLabel={t('demo.recron.knowledge.flashcard.card.revealHintLabel')}
                answerLabel={t('demo.recron.knowledge.flashcard.card.answerLabel')}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FlashcardQuizSession" subtitle={t('demo.recron.showcase.flashcardQuizSession.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide">
              <FlashcardQuizSession
                items={quizSessionItems()}
                getId={(item) => item.id}
                getBadgeLabel={(item) => item.category}
                renderFront={(item) => <Text as="p">{item.question}</Text>}
                renderBack={(item) => <Text as="p">{item.answer}</Text>}
                emptyMessage={t('demo.recron.knowledge.flashcard.session.emptyMessage')}
                knowLabel={t('demo.recron.knowledge.flashcard.session.knowLabel')}
                dontKnowLabel={t('demo.recron.knowledge.flashcard.session.dontKnowLabel')}
                quitLabel={t('demo.recron.knowledge.flashcard.session.quitLabel')}
                revealHintLabel={t('demo.recron.knowledge.flashcard.session.revealHintLabel')}
                answerLabel={t('demo.recron.knowledge.flashcard.session.answerLabel')}
                onQuit={() =>
                  addToast({ type: 'info', message: t('demo.recron.knowledge.flashcard.session.quitToast') })
                }
                onFinish={handleQuizFinish}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FlashcardQuizSummary" subtitle={t('demo.recron.showcase.flashcardQuizSummary.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoMedium">
              <FlashcardQuizSummary
                results={quizResults().length > 0 ? quizResults() : fallbackQuizResults}
                title={t('demo.recron.knowledge.flashcard.summary.title')}
                knownLabel={t('demo.recron.knowledge.flashcard.summary.knownLabel')}
                unknownLabel={t('demo.recron.knowledge.flashcard.summary.unknownLabel')}
                totalLabel={t('demo.recron.knowledge.flashcard.summary.totalLabel')}
                restartLabel={t('demo.recron.knowledge.flashcard.summary.restartLabel')}
                backLabel={t('demo.recron.knowledge.flashcard.summary.backLabel')}
                onBack={handleQuizSummaryBack}
                onRestart={handleQuizRestart}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default RecronExtractsSection;
