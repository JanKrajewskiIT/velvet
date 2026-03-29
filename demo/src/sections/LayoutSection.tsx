import {
  Accordion,
  AccordionIcon,
  AccordionItem,
  Button,
  Card,
  Chip,
  CodeText,
  DataCard,
  Divider,
  FlipCard,
  Footer,
  Grid,
  Heading,
  MainLayout,
  Navbar,
  ResizablePanel,
  SectionCard,
  Stack,
  Surface,
  Text,
  useI18n,
} from '@jankrajewskiit/ui';
import { createMemo, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';
import { renderRichText } from '../i18n/renderRichText';

const LayoutSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const year = new Date().getFullYear();
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey): string => dictionary()[key];

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
                  navbar={
                    <Navbar
                      navItems={[]}
                      toggleMenuLabel={t('demo.text.layout.mainLayout.toggleNavigation')}
                      navLabel={t('demo.text.layout.mainLayout.mainNavigation')}
                    />
                  }
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

        <ShowcaseSection
          title={t('demo.showcase.layout.flipCard.title')}
          subtitle={t('demo.showcase.layout.flipCard.subtitle')}
        >
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

        <ShowcaseSection
          title={t('demo.showcase.layout.sectionCard.title')}
          subtitle={t('demo.showcase.layout.sectionCard.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <SectionCard label={t('demo.text.layout.sectionCard.details')} defaultOpen>
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.layout.sectionCard.detailsBody')}
                </Text>
              </SectionCard>
              <SectionCard label={t('demo.text.layout.sectionCard.advancedOptions')}>
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.layout.sectionCard.collapsedByDefault')}
                </Text>
              </SectionCard>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              SectionCard
            </CodeText>{' '}
            {t('demo.text.layout.sectionCard.meta')}
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default LayoutSection;
