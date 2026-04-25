import {
  Accordion,
  AccordionIcon,
  AccordionItem,
  addToast,
  Button,
  Card,
  Chip,
  CodeText,
  DataCard,
  Divider,
  FeatureCard,
  type FeatureCardTone,
  FlashcardPracticeCard,
  type FlashcardPracticeResult,
  FlashcardPracticeSession,
  FlashcardPracticeSummary,
  FlipCard,
  Footer,
  Grid,
  Heading,
  MainLayout,
  Navbar,
  PracticeSetupPanel,
  ResizablePanel,
  Stack,
  StatCard,
  Surface,
  Text,
} from '@jankrajewskiit/ui';
import type { IconTypes } from 'solid-icons';
import { FaSolidBriefcase, FaSolidWandMagicSparkles } from 'solid-icons/fa';
import { FiBookOpen, FiFileText } from 'solid-icons/fi';
import { IoAlertCircle, IoCheckmarkCircle, IoPeople, IoStatsChart } from 'solid-icons/io';
import { createMemo, createSignal, For, Show } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { DEMO_FLASHCARD_ITEMS, DEMO_PRACTICE_SETUP_CATEGORIES } from '../fixtures/layoutFixtures';
import { useDemoDictionary } from '../hooks/useDemoDictionary';
import { renderRichText } from '../i18n/renderRichText';
import type { SectionId } from '../nav/demoNavConfig';

const fallbackQuizResults: FlashcardPracticeResult<(typeof DEMO_FLASHCARD_ITEMS)[number]>[] = DEMO_FLASHCARD_ITEMS.map(
  (item, index) => ({
    id: item.id,
    item,
    known: index !== 1,
  }),
);

const LayoutSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const year = new Date().getFullYear();
  const { t } = useDemoDictionary();
  const featureCards = createMemo<{ icon: IconTypes; title: string; description: string; tone: FeatureCardTone }[]>(
    () => [
      {
        icon: FaSolidBriefcase,
        title: t('demo.recron.featureCard.organizer.title'),
        description: t('demo.recron.featureCard.organizer.description'),
        tone: 'primary',
      },
      {
        icon: FiBookOpen,
        title: t('demo.recron.featureCard.questions.title'),
        description: t('demo.recron.featureCard.questions.description'),
        tone: 'success',
      },
      {
        icon: FiFileText,
        title: t('demo.recron.featureCard.portfolio.title'),
        description: t('demo.recron.featureCard.portfolio.description'),
        tone: 'warning',
      },
      {
        icon: FaSolidWandMagicSparkles,
        title: t('demo.recron.featureCard.ai.title'),
        description: t('demo.recron.featureCard.ai.description'),
        tone: 'info',
      },
    ],
  );
  const [quizFlipped, setQuizFlipped] = createSignal(false);
  const [quizSessionItems, setQuizSessionItems] = createSignal([...DEMO_FLASHCARD_ITEMS]);
  const [quizResults, setQuizResults] = createSignal<FlashcardPracticeResult<(typeof DEMO_FLASHCARD_ITEMS)[number]>[]>(
    [],
  );

  const handleQuizFinish = (results: FlashcardPracticeResult<(typeof DEMO_FLASHCARD_ITEMS)[number]>[]) => {
    setQuizResults(results);
    addToast({ type: 'success', message: t('demo.toast.layout.quizFinished') });
  };

  const handleQuizSummaryBack = () => {
    addToast({ type: 'info', message: t('demo.toast.layout.quizBack') });
  };

  const handleQuizRestart = () => {
    setQuizResults([]);
    setQuizSessionItems([...DEMO_FLASHCARD_ITEMS]);
  };

  const handlePracticeSetupStart = (value: { categoryId: string | null; count: number }) => {
    const category = value.categoryId ?? t('demo.toast.layout.practiceAllCategories');
    addToast({
      type: 'success',
      message: t('demo.toast.layout.practiceConfigured', { category, count: value.count }),
    });
  };

  return (
    <div>
      <Show when={sectionId() === 'surfaces-main-layout'}>
        <ShowcaseSection
          title={t('demo.showcase.layout.mainLayout.title')}
          subtitle={t('demo.showcase.layout.mainLayout.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup
              title={t('demo.text.layout.mainLayout.fullShell.title')}
              subtitle={t('demo.text.layout.mainLayout.fullShell.subtitle')}
            >
              <div class="layoutPreviewShell">
                <MainLayout
                  navbar={<Navbar navItems={[]} />}
                  footer={
                    <Footer
                      copyrightText={`(c) ${String(year)} MyApp`}
                      privacyLabel={t('demo.text.layout.mainLayout.privacy')}
                      privacyHref="/privacy"
                      builtWithText={t('demo.text.layout.mainLayout.builtWithVelvetUi')}
                    />
                  }
                >
                  <div class="layoutShellContent">
                    <div class="recronHero">
                      <Heading as="h3" level={3} variant="titleLg" class="recronTitle">
                        {t('demo.text.layout.mainLayout.dashboard')}
                      </Heading>
                      <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                        {t('demo.text.layout.mainLayout.fixedHeightContent')}
                      </Text>
                    </div>
                  </div>
                </MainLayout>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.mainLayout.meta'), {
              navbar: (
                <CodeText as="span" class="codeInline">
                  navbar
                </CodeText>
              ),
              footer: (
                <CodeText as="span" class="codeInline">
                  footer
                </CodeText>
              ),
              mainLayout: (
                <CodeText as="span" class="codeInline">
                  MainLayout
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-layouts'}>
        <ShowcaseSection
          title={t('demo.showcase.layout.grid.title')}
          subtitle={t('demo.showcase.layout.grid.subtitle')}
        >
          <PreviewPanel>
            <Grid columns={3} gap="sm">
              <Chip variant="subtle" label={t('demo.text.layout.grid.column1')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.column2')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.column3')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.column4')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.column5')} />
            </Grid>
            <Grid minColumnWidth="180px" gap="md">
              <Chip variant="subtle" label={t('demo.text.layout.grid.autoFitA')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.autoFitB')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.autoFitC')} />
              <Chip variant="subtle" label={t('demo.text.layout.grid.autoFitD')} />
            </Grid>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.grid.meta'), {
              columns: (
                <CodeText as="span" class="codeInline">
                  columns
                </CodeText>
              ),
              minColumnWidth: (
                <CodeText as="span" class="codeInline">
                  minColumnWidth
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.layout.stack.title')}
          subtitle={t('demo.showcase.layout.stack.subtitle')}
        >
          <PreviewPanel>
            <Stack gap="sm">
              <Chip variant="subtle" label={t('demo.text.layout.stack.firstItem')} />
              <Chip variant="subtle" label={t('demo.text.layout.stack.secondItem')} />
              <Chip variant="subtle" label={t('demo.text.layout.stack.thirdItem')} />
            </Stack>
            <Stack direction="horizontal" gap="md" align="center" justify="between" wrap>
              <Chip variant="subtle" label={t('demo.text.layout.stack.horizontal')} />
              <Chip variant="subtle" label={t('demo.text.layout.stack.alignedCenter')} />
              <Chip variant="subtle" label={t('demo.text.layout.stack.wrapEnabled')} />
            </Stack>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.stack.meta'), {
              direction: (
                <CodeText as="span" class="codeInline">
                  direction
                </CodeText>
              ),
              gap: (
                <CodeText as="span" class="codeInline">
                  gap
                </CodeText>
              ),
              align: (
                <CodeText as="span" class="codeInline">
                  align
                </CodeText>
              ),
              justify: (
                <CodeText as="span" class="codeInline">
                  justify
                </CodeText>
              ),
              wrap: (
                <CodeText as="span" class="codeInline">
                  wrap
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.layout.resizablePanel.title')}
          subtitle={t('demo.showcase.layout.resizablePanel.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup
              title={t('demo.text.layout.resizable.horizontalSplit.title')}
              subtitle={t('demo.text.layout.resizable.horizontalSplit.subtitle')}
            >
              <div class="resizableDemoShell">
                <ResizablePanel direction="horizontal" initialSplit={40} minSize={20}>
                  <div class="resizableDemoPanel">
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.resizable.leftPanel')}
                    </Text>
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      {t('demo.text.layout.resizable.dragHandle')}
                    </Text>
                  </div>
                  <div class="resizableDemoPanel">
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.resizable.rightPanel')}
                    </Text>
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      {t('demo.text.layout.resizable.contentAdjusts')}
                    </Text>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
            <PreviewGroup
              title={t('demo.text.layout.resizable.verticalSplit.title')}
              subtitle={t('demo.text.layout.resizable.verticalSplit.subtitle')}
            >
              <div class="resizableDemoShell">
                <ResizablePanel direction="vertical" initialSplit={50} minSize={20}>
                  <div class="resizableDemoPanel">
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.resizable.topPanel')}
                    </Text>
                  </div>
                  <div class="resizableDemoPanel">
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.resizable.bottomPanel')}
                    </Text>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.resizable.meta'), {
              horizontal: (
                <CodeText as="span" class="codeInline">
                  horizontal
                </CodeText>
              ),
              vertical: (
                <CodeText as="span" class="codeInline">
                  vertical
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.layout.divider.title')}
          subtitle={t('demo.showcase.layout.divider.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.layout.divider.horizontalVariants.title')}>
              <Divider />
              <Divider label={t('demo.text.layout.divider.or')} />
              <Divider variant="dashed" />
              <Divider variant="dashed" label={t('demo.text.layout.divider.section')} />
            </PreviewGroup>
            <PreviewGroup title={t('demo.text.layout.divider.verticalVariant.title')}>
              <div class="row dividerVerticalDemo">
                <Text as="span" variant="bodySm">
                  {t('demo.text.layout.divider.left')}
                </Text>
                <Divider orientation="vertical" />
                <Text as="span" variant="bodySm">
                  {t('demo.text.layout.divider.right')}
                </Text>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-cards'}>
        <ShowcaseSection
          title={t('demo.showcase.layout.card.title')}
          subtitle={t('demo.showcase.layout.card.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.layout.surface.baseSurface.title')}>
              <Surface>
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.layout.surface.baseBody')}
                </Text>
              </Surface>
            </PreviewGroup>
            <PreviewGroup title={t('demo.text.layout.card.baseCard.title')}>
              <Card>
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.layout.card.baseBody')}
                </Text>
              </Card>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.surface.meta'), {
              surface: (
                <CodeText as="span" class="codeInline">
                  Surface
                </CodeText>
              ),
            })}{' '}
            {renderRichText(t('demo.text.layout.card.meta'), {
              card: (
                <CodeText as="span" class="codeInline">
                  Card
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.layout.dataCardVariants.title')}
          subtitle={t('demo.showcase.layout.dataCardVariants.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.layout.dataCard.variants.title')}>
              <div class="gridCards">
                <DataCard
                  variant="filled"
                  hoverable
                  header={
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.dataCard.filledHeader')}
                    </Text>
                  }
                  footer={<Button variant="primary">{t('demo.text.layout.dataCard.continue')}</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    {t('demo.text.layout.dataCard.filledBody')}
                  </Text>
                </DataCard>
                <DataCard
                  variant="elevated"
                  hoverable
                  header={
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.dataCard.elevatedHeader')}
                    </Text>
                  }
                  footer={<Button variant="primary">{t('demo.text.layout.dataCard.open')}</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    {t('demo.text.layout.dataCard.elevatedBody')}
                  </Text>
                </DataCard>
                <DataCard
                  variant="outlined"
                  hoverable
                  header={
                    <Text as="span" variant="labelMd">
                      {t('demo.text.layout.dataCard.outlinedHeader')}
                    </Text>
                  }
                  footer={<Button variant="ghost">{t('demo.text.layout.dataCard.details')}</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    {t('demo.text.layout.dataCard.outlinedBody')}
                  </Text>
                </DataCard>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.dataCard.meta'), {
              header: (
                <CodeText as="span" class="codeInline">
                  header
                </CodeText>
              ),
              footer: (
                <CodeText as="span" class="codeInline">
                  footer
                </CodeText>
              ),
              hoverable: (
                <CodeText as="span" class="codeInline">
                  hoverable
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="FeatureCard" subtitle={t('demo.recron.showcase.featureCard.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="gridCards">
                <For each={featureCards()}>
                  {(feature, index) => (
                    <FeatureCard
                      icon={feature.icon}
                      label={feature.title}
                      description={feature.description}
                      tone={feature.tone}
                      animationOrder={index()}
                    />
                  )}
                </For>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.statCard.title')}
          subtitle={t('demo.showcase.feedback.statCard.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="gridCards">
                <StatCard
                  value="1 284"
                  label={t('demo.text.feedback.statCard.activeUsers')}
                  icon={IoPeople}
                  colorClass="info"
                />
                <StatCard
                  value="98.7%"
                  label={t('demo.text.feedback.statCard.uptime')}
                  icon={IoCheckmarkCircle}
                  colorClass="success"
                />
                <StatCard
                  value="3"
                  label={t('demo.text.feedback.statCard.openIssues')}
                  icon={IoAlertCircle}
                  colorClass="warning"
                />
                <StatCard
                  value="42"
                  label={t('demo.text.feedback.statCard.deployments')}
                  icon={IoStatsChart}
                  colorClass="error"
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              StatCard
            </CodeText>{' '}
            {t('demo.text.feedback.statCard.meta')}
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-interactive-cards'}>
        <ShowcaseSection title="FlipCard" subtitle={t('demo.showcase.layout.flipCard.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.layout.flipCard.samples.title')}>
              <div class="flipCardGrid">
                <FlipCard
                  width="220px"
                  height="140px"
                  front={
                    <div class="flipCardFace">
                      <Heading as="strong" level={4} variant="titleLg" tone="primary" class="flipCardTitle">
                        VelvetUI
                      </Heading>
                      <Text as="span" variant="bodySm" tone="muted" class="flipCardHint">
                        {t('demo.text.layout.flipCard.clickToFlip')}
                      </Text>
                    </div>
                  }
                  back={
                    <div class="flipCardBack">
                      <Text as="span" variant="labelMd">
                        {t('demo.text.layout.flipCard.backStrong')}
                      </Text>
                      <Text as="span" variant="bodySm" tone="muted" class="flipCardHint">
                        {t('demo.text.layout.flipCard.backHint')}
                      </Text>
                    </div>
                  }
                />
                <FlipCard
                  width="220px"
                  height="140px"
                  front={<div class="flipCardFace">{t('demo.text.layout.flipCard.uiSystem')}</div>}
                  back={<div class="flipCardSimple">{t('demo.text.layout.flipCard.darkLight')}</div>}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.layout.flipCard.meta'), {
              flipCard: (
                <CodeText as="span" class="codeInline">
                  FlipCard
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="FlashcardPracticeCard" subtitle={t('demo.recron.showcase.flashcardQuizCard.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoMedium">
                <FlashcardPracticeCard
                  front={<Text as="p">{t('demo.recron.knowledge.flashcard.card.front')}</Text>}
                  back={<Text as="p">{t('demo.recron.knowledge.flashcard.card.back')}</Text>}
                  badgeLabel={t('demo.recron.knowledge.flashcard.card.badgeLabel')}
                  flipped={quizFlipped()}
                  onFlip={setQuizFlipped}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="FlashcardPracticeSession"
          subtitle={t('demo.recron.showcase.flashcardQuizSession.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoWide">
                <FlashcardPracticeSession
                  items={quizSessionItems()}
                  getId={(item) => item.id}
                  getBadgeLabel={(item) => item.category}
                  renderFront={(item) => <Text as="p">{item.question}</Text>}
                  renderBack={(item) => <Text as="p">{item.answer}</Text>}
                  emptyMessage={t('demo.recron.knowledge.flashcard.session.emptyMessage')}
                  onQuit={() =>
                    addToast({ type: 'info', message: t('demo.recron.knowledge.flashcard.session.quitToast') })
                  }
                  onFinish={handleQuizFinish}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="FlashcardPracticeSummary"
          subtitle={t('demo.recron.showcase.flashcardQuizSummary.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoMedium">
                <FlashcardPracticeSummary
                  results={quizResults().length > 0 ? quizResults() : fallbackQuizResults}
                  title={t('demo.recron.knowledge.flashcard.summary.title')}
                  onBack={handleQuizSummaryBack}
                  onRestart={handleQuizRestart}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="PracticeSetupPanel" subtitle={t('demo.recron.showcase.quizSetupPanel.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoMedium">
                <PracticeSetupPanel
                  title={t('demo.recron.knowledge.quizSetup.title')}
                  description={t('demo.recron.knowledge.quizSetup.description')}
                  categories={DEMO_PRACTICE_SETUP_CATEGORIES}
                  countOptions={[10, 20, 30, 50]}
                  initialCount={20}
                  onStart={handlePracticeSetupStart}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-collapsible'}>
        <ShowcaseSection
          title={t('demo.showcase.layout.accordion.title')}
          subtitle={t('demo.showcase.layout.accordion.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Accordion>
                <AccordionItem label={t('demo.text.layout.accordion.whatIs')}>
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    {t('demo.text.layout.accordion.whatIsBody')}
                  </Text>
                </AccordionItem>
                <AccordionItem label={t('demo.text.layout.accordion.howInstall')}>
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    npm install @jankrajewskiit/ui
                  </Text>
                </AccordionItem>
                <AccordionItem label={t('demo.text.layout.accordion.disabledItem')} disabled>
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    {t('demo.text.layout.accordion.disabledBody')}
                  </Text>
                </AccordionItem>
              </Accordion>
            </PreviewGroup>
            <PreviewGroup title="AccordionIcon">
              <div class="row">
                <AccordionIcon />
                <AccordionIcon isOpen />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default LayoutSection;
