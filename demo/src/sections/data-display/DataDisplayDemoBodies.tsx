import {
  ActionRow,
  Avatar,
  AvatarGroup,
  Button,
  Carousel,
  CodeBlock,
  CodeText,
  ComparisonInsightsDialog,
  ComparisonSelectionBar,
  FilterBar,
  Heading,
  ImageGrid,
  Lightbox,
  List,
  ListItem,
  MarkdownEditDialog,
  MarkdownRenderer,
  Marquee,
  RadarChart,
  ScoreRing,
  StatusTimeline,
  Text,
  Timeline,
  TimelineCard,
  TimelineCardEditDialog,
  TradingViewChart,
  TreeView,
  VirtualizedList,
} from '@jankrajewskiit/ui';
import { IoDocumentText, IoFolder, IoImage } from 'solid-icons/io';
import { For, Show } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../../components/ShowcaseSection';
import type { SectionId } from '../../nav/demoNavConfig';
import { useDataDisplayDemo } from './DataDisplayDemoContext';

interface DataDisplayDemoBodiesProps {
  sectionId: () => SectionId;
}

const DataDisplayDemoBodies = (props: DataDisplayDemoBodiesProps) => {
  const {
    addToast,
    asUtcTimestamp,
    checkedTreeNodes,
    clickMeLabel,
    comparisonAxes,
    comparisonColumns,
    comparisonDatasets,
    comparisonOpen,
    comparisonPending,
    comparisonReady,
    comparisonRows,
    comparisonSelectionCount,
    createCodeSample,
    createTreeData,
    editorOpen,
    filterDefinitions,
    filteredReviewQueueItems,
    filtersQuery,
    filtersValue,
    galleryImages,
    handleComparisonClose,
    handleTimelineCardAddSave,
    handleTimelineCardCompletedSave,
    handleTimelineCardDelete,
    handleTimelineCardPlannedSave,
    handleTimelineCardSave,
    handleTreeMove,
    lastMove,
    lightboxImages,
    lightboxOpen,
    loadTreeChildren,
    markdown,
    pollingFeed,
    renderRichText,
    renderVirtualItem,
    runComparison,
    selectedNode,
    setCheckedTreeNodes,
    setComparisonOpen,
    setEditorOpen,
    setFiltersQuery,
    setFiltersValue,
    setLightboxOpen,
    setMarkdown,
    setSelectedNode,
    setTimelineCardAddOpen,
    t,
    timelineCardAddOpen,
    timelineCardCategoryOptions,
    timelineCardCompletedValue,
    timelineCardLabels,
    timelineCardPlannedValue,
    timelineCardStatusOptions,
    timelineCardValue,
    timelineItems,
    TRADING_VIEW_SAMPLE,
    virtualItems,
    wsFeed,
  } = useDataDisplayDemo();

  return (
    <div>
      <Show when={props.sectionId() === 'data-content'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.codeBlock.title')}
          subtitle={t('demo.showcase.dataDisplay.codeBlock.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.dataDisplay.codeBlock.tsxSnippet.title')}>
              <CodeBlock code={createCodeSample(clickMeLabel())} language="tsx" />
            </PreviewGroup>
            <PreviewGroup title={t('demo.text.dataDisplay.codeBlock.cliSnippet.title')}>
              <CodeBlock code="npm install @jankrajewskiit/ui" language="bash" />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.codeBlock.meta')}</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.markdownEditDialog.title')}
          subtitle={t('demo.showcase.dataDisplay.markdownEditDialog.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ActionRow align="start">
                <Button variant="ghost" onClick={() => setEditorOpen(true)}>
                  {t('demo.text.dataDisplay.markdownEdit.openButton')}
                </Button>
              </ActionRow>
              <MarkdownEditDialog
                open={editorOpen()}
                label={t('demo.text.dataDisplay.markdownEdit.label')}
                initialValue={markdown()}
                onSave={setMarkdown}
                onClose={() => setEditorOpen(false)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.markdownRenderer.title')}
          subtitle={t('demo.showcase.dataDisplay.markdownRenderer.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <MarkdownRenderer content={markdown()} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={props.sectionId() === 'data-lists'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.listAndListItem.title')}
          subtitle={t('demo.showcase.dataDisplay.listAndListItem.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <List>
                <ListItem
                  icon={<IoFolder />}
                  secondary={t('demo.text.dataDisplay.list.threeFiles')}
                  label={t('demo.text.dataDisplay.list.documents')}
                />
                <ListItem
                  icon={<IoDocumentText />}
                  secondary={t('demo.text.dataDisplay.list.updatedYesterday')}
                  label={t('demo.text.dataDisplay.list.reportPdf')}
                />
                <ListItem
                  icon={<IoImage />}
                  secondary={t('demo.text.dataDisplay.list.clickToPreview')}
                  onClick={() => {}}
                  label={t('demo.text.dataDisplay.list.photoPng')}
                />
              </List>
              <List variant="bordered">
                <ListItem
                  icon={<IoFolder />}
                  secondary={t('demo.text.dataDisplay.list.sharedFolder')}
                  label={t('demo.text.dataDisplay.list.projects')}
                />
                <ListItem
                  icon={<IoDocumentText />}
                  secondary={t('demo.text.dataDisplay.list.draft')}
                  action={<Button variant="ghost">{t('demo.text.dataDisplay.list.edit')}</Button>}
                  label={t('demo.text.dataDisplay.list.notesMd')}
                />
              </List>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.virtualizedList.title')}
          subtitle={t('demo.showcase.dataDisplay.virtualizedList.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <VirtualizedList
                items={virtualItems()}
                height={320}
                itemHeight={46}
                overscan={6}
                renderItem={renderVirtualItem}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.virtualizedList.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={props.sectionId() === 'data-filters'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.filterBar.title')}
          subtitle={t('demo.showcase.dataDisplay.filterBar.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="scenarioShell">
                <div class="scenarioHeader">
                  <div class="scenarioHeaderCopy">
                    <Text as="p" variant="overline" tone="primary">
                      {t('demo.page.dataFilters.title')}
                    </Text>
                    <Heading level={3} variant="titleLg">
                      {t('demo.page.dataFilters.description')}
                    </Heading>
                  </div>
                  <div class="scenarioMetricRow">
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.text.dataDisplay.filterBar.activeFilters')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {filtersValue().length}
                      </Text>
                    </div>
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.text.dataDisplay.filterBar.query')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {filtersQuery() || t('demo.text.dataDisplay.filterBar.none')}
                      </Text>
                    </div>
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.page.dataTables.title')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {filteredReviewQueueItems().length}
                      </Text>
                    </div>
                  </div>
                </div>

                <FilterBar
                  filters={filterDefinitions()}
                  value={filtersValue()}
                  onChange={setFiltersValue}
                  search={filtersQuery()}
                  onSearchChange={setFiltersQuery}
                />

                <div class="scenarioBody">
                  <List variant="bordered">
                    <For each={filteredReviewQueueItems()}>
                      {(item) => (
                        <ListItem
                          label={item.label}
                          secondary={`${item.owner} • ${item.statusLabel} • ${item.priorityLabel}`}
                        />
                      )}
                    </For>
                  </List>
                </div>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.filterBar.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={props.sectionId() === 'data-timeline'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.timeline.title')}
          subtitle={t('demo.showcase.dataDisplay.timeline.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Timeline items={timelineItems()} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.statusTimeline.title')}
          subtitle={t('demo.showcase.dataDisplay.statusTimeline.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoMedium">
                <StatusTimeline
                  emptyMessage={t('demo.text.dataDisplay.statusTimeline.emptyMessage')}
                  items={[
                    {
                      key: 'timeline-1',
                      statusTone: 'success',
                      content: <Text as="p">{t('demo.text.dataDisplay.statusTimeline.item.done')}</Text>,
                    },
                    {
                      key: 'timeline-2',
                      statusTone: 'default',
                      content: <Text as="p">{t('demo.text.dataDisplay.statusTimeline.item.inProgress')}</Text>,
                    },
                    {
                      key: 'timeline-3',
                      statusTone: 'muted',
                      content: <Text as="p">{t('demo.text.dataDisplay.statusTimeline.item.todo')}</Text>,
                    },
                  ]}
                  action={<Button size="sm" variant="ghost" label={t('demo.text.dataDisplay.statusTimeline.action')} />}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="TimelineCard" subtitle={t('demo.showcase.dataDisplay.timelineCardComposite.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="recronDemoMedium">
                <TimelineCard
                  value={timelineCardValue()}
                  labels={timelineCardLabels()}
                  categoryOptions={timelineCardCategoryOptions()}
                  statusOptions={timelineCardStatusOptions()}
                  calendarAction={
                    <Button
                      size="sm"
                      variant="ghost"
                      label={t('demo.text.dataDisplay.timelineCard.label.calendarAction')}
                    />
                  }
                  onSave={handleTimelineCardSave}
                  onDelete={handleTimelineCardDelete}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.timelineCardComposite.title')}
          subtitle={t('demo.showcase.dataDisplay.timelineCardComposite.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="timelineCompositeDemo">
                <StatusTimeline
                  emptyMessage={t('demo.text.dataDisplay.statusTimeline.emptyMessage')}
                  items={[
                    {
                      key: 'composite-session-1',
                      statusTone: 'default',
                      content: (
                        <TimelineCard
                          value={timelineCardValue()}
                          labels={timelineCardLabels()}
                          categoryOptions={timelineCardCategoryOptions()}
                          statusOptions={timelineCardStatusOptions()}
                          calendarAction={
                            <Button
                              size="sm"
                              variant="ghost"
                              label={t('demo.text.dataDisplay.timelineCard.label.calendarAction')}
                            />
                          }
                          onSave={handleTimelineCardSave}
                          onDelete={handleTimelineCardDelete}
                        />
                      ),
                    },
                    {
                      key: 'composite-session-2',
                      statusTone: 'muted',
                      content: (
                        <TimelineCard
                          value={timelineCardPlannedValue()}
                          labels={timelineCardLabels()}
                          categoryOptions={timelineCardCategoryOptions()}
                          statusOptions={timelineCardStatusOptions()}
                          onSave={handleTimelineCardPlannedSave}
                          onDelete={handleTimelineCardDelete}
                        />
                      ),
                    },
                    {
                      key: 'composite-session-3',
                      statusTone: 'success',
                      content: (
                        <TimelineCard
                          value={timelineCardCompletedValue()}
                          labels={timelineCardLabels()}
                          categoryOptions={timelineCardCategoryOptions()}
                          statusOptions={timelineCardStatusOptions()}
                          calendarAction={
                            <Button
                              size="sm"
                              variant="ghost"
                              label={t('demo.text.dataDisplay.timelineCard.label.calendarAction')}
                            />
                          }
                          onSave={handleTimelineCardCompletedSave}
                          onDelete={handleTimelineCardDelete}
                        />
                      ),
                    },
                  ]}
                  action={
                    <Button
                      size="sm"
                      variant="ghost"
                      label={t('demo.text.dataDisplay.timelineCard.label.addAction')}
                      onClick={() => setTimelineCardAddOpen(true)}
                    />
                  }
                />
                <TimelineCardEditDialog
                  open={timelineCardAddOpen()}
                  value={{
                    id: 'session-new',
                    category: timelineCardCategoryOptions()[0]?.value ?? 'review',
                    status: timelineCardStatusOptions()[0]?.value ?? 'scheduled',
                    dateTime: null,
                    duration: '',
                    location: '',
                    notes: '',
                    isSynced: false,
                  }}
                  labels={{
                    ...timelineCardLabels(),
                    editDialogLabel: t('demo.text.dataDisplay.timelineCard.label.addDialog'),
                  }}
                  categoryOptions={timelineCardCategoryOptions()}
                  statusOptions={timelineCardStatusOptions()}
                  onClose={() => setTimelineCardAddOpen(false)}
                  onSave={handleTimelineCardAddSave}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={props.sectionId() === 'data-tree'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.treeView.title')}
          subtitle={t('demo.showcase.dataDisplay.treeView.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <TreeView
                nodes={createTreeData()}
                defaultExpanded={['src']}
                selectedId={selectedNode()}
                onSelect={setSelectedNode}
                checkable
                checkedIds={checkedTreeNodes()}
                onCheckedIdsChange={setCheckedTreeNodes}
                loadChildren={loadTreeChildren}
                draggable
                onMove={handleTreeMove}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {t('demo.text.dataDisplay.tree.selected')}:{' '}
            <CodeText as="span" class="codeInline">
              {selectedNode() || t('demo.text.dataDisplay.tree.none')}
            </CodeText>{' '}
            | {t('demo.text.dataDisplay.tree.checked')}:{' '}
            <CodeText as="span" class="codeInline">
              {String(checkedTreeNodes().length)}
            </CodeText>{' '}
            | {t('demo.text.dataDisplay.tree.lastMove')}:{' '}
            <CodeText as="span" class="codeInline">
              {lastMove() || t('demo.text.dataDisplay.tree.none')}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={props.sectionId() === 'data-media'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.avatarAndAvatarGroup.title')}
          subtitle={t('demo.showcase.dataDisplay.avatarAndAvatarGroup.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Avatar src="https://i.pravatar.cc/150?u=a" alt={t('demo.text.dataDisplay.avatar.userPhotoAlt')} />
                <Avatar name="Jan Krajewski" />
                <Avatar />
              </div>
              <div class="row">
                <Avatar src="https://i.pravatar.cc/150?u=a" size="sm" />
                <Avatar src="https://i.pravatar.cc/150?u=a" size="md" />
                <Avatar src="https://i.pravatar.cc/150?u=a" size="lg" />
                <Avatar src="https://i.pravatar.cc/150?u=a" size="xl" />
              </div>
              <AvatarGroup max={3}>
                <Avatar src="https://i.pravatar.cc/150?u=a" />
                <Avatar src="https://i.pravatar.cc/150?u=b" />
                <Avatar src="https://i.pravatar.cc/150?u=c" />
                <Avatar src="https://i.pravatar.cc/150?u=d" />
                <Avatar src="https://i.pravatar.cc/150?u=e" />
              </AvatarGroup>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.carousel.title')}
          subtitle={t('demo.showcase.dataDisplay.carousel.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Carousel>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide1')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide2')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide3')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide4')}</div>
              </Carousel>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.carouselAutoPlayAndDots.title')}
          subtitle={t('demo.showcase.dataDisplay.carouselAutoPlayAndDots.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Carousel autoPlay interval={4000}>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.autoSlide1')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.autoSlide2')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.autoSlide3')}</div>
              </Carousel>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.dataDisplay.carousel.meta'), {
              autoPlay: (
                <CodeText as="span" class="codeInline">
                  autoPlay
                </CodeText>
              ),
              interval: (
                <CodeText as="span" class="codeInline">
                  interval
                </CodeText>
              ),
              showDots: (
                <CodeText as="span" class="codeInline">
                  showDots
                </CodeText>
              ),
              showArrows: (
                <CodeText as="span" class="codeInline">
                  showArrows
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.imageGrid.title')}
          subtitle={t('demo.showcase.dataDisplay.imageGrid.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ImageGrid images={galleryImages()} columns={3} hoverable rounded />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.imageGrid.meta')}</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.lightbox.title')}
          subtitle={t('demo.showcase.dataDisplay.lightbox.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Button variant="ghost" onClick={() => setLightboxOpen(true)}>
                {t('demo.text.dataDisplay.lightbox.openButton')}
              </Button>
              <Lightbox images={lightboxImages()} open={lightboxOpen()} onClose={() => setLightboxOpen(false)} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.marquee.title')}
          subtitle={t('demo.showcase.dataDisplay.marquee.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Marquee speed={20}>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagSolid')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagTypeScript')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagCssModules')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagVite')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagVelvetUi')}
                </Text>
              </Marquee>
              <Marquee speed={25} direction="right">
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagEslint')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagPrettier')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagVitest')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagPostcss')}
                </Text>
              </Marquee>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.marquee.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={props.sectionId() === 'data-charts'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.scoreRing.title')}
          subtitle={t('demo.showcase.dataDisplay.scoreRing.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <ScoreRing score={92} />
                <ScoreRing score={68} />
                <ScoreRing score={45} />
                <ScoreRing score={22} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.radarChart.title')}
          subtitle={t('demo.showcase.dataDisplay.radarChart.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <RadarChart
                size={280}
                axes={[
                  { label: t('demo.text.dataDisplay.radar.performance'), key: 'perf' },
                  { label: t('demo.text.dataDisplay.radar.accessibility'), key: 'a11y' },
                  { label: t('demo.text.dataDisplay.radar.bestPractices'), key: 'bp' },
                  { label: 'SEO', key: 'seo' },
                  { label: 'PWA', key: 'pwa' },
                ]}
                datasets={[
                  { label: t('demo.text.dataDisplay.radar.desktop'), values: [92, 88, 95, 80, 60] },
                  { label: t('demo.text.dataDisplay.radar.mobile'), values: [74, 85, 90, 75, 55] },
                ]}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="ComparisonSelectionBar"
          subtitle={t('demo.recron.showcase.comparisonSelectionBar.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="recronDemoWide recronDemoSurface">
                <ComparisonSelectionBar
                  selectedCount={comparisonSelectionCount()}
                  compareDisabled={comparisonSelectionCount() < 2 || comparisonSelectionCount() > 5}
                  onClear={() => addToast({ type: 'info', message: t('demo.toast.dataDisplay.selectionCleared') })}
                  onCompare={() => setComparisonOpen(true)}
                />
                <ComparisonInsightsDialog
                  open={comparisonOpen()}
                  title={t('demo.recron.offer.comparison.dialog.title')}
                  prompt={t('demo.recron.offer.comparison.dialog.prompt')}
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
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.tradingViewChart.title')}
          subtitle={t('demo.showcase.dataDisplay.tradingViewChart.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <TradingViewChart symbol="XAUUSD" />
              <TradingViewChart symbol="XAUUSD custom feed" data={TRADING_VIEW_SAMPLE} height={420} />
              <TradingViewChart
                symbol="XAUUSD polling adapter"
                data={TRADING_VIEW_SAMPLE}
                defaultDrawingTool="trendline"
                liveFeed={pollingFeed}
                drawings={{
                  levels: [{ id: 'lvl-res', price: 2104.5 }],
                  zones: [
                    {
                      id: 'zone-demand',
                      fromTime: asUtcTimestamp(1704672000),
                      toTime: asUtcTimestamp(1704931200),
                      low: 2088,
                      high: 2094,
                    },
                  ],
                }}
                height={460}
              />
              <TradingViewChart
                symbol="XAUUSD websocket adapter"
                data={TRADING_VIEW_SAMPLE}
                liveFeed={wsFeed}
                height={420}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.dataDisplay.trading.meta'), {
              pollingFeed: (
                <CodeText as="span" class="codeInline">
                  useTradingViewPollingFeed
                </CodeText>
              ),
              wsFeed: (
                <CodeText as="span" class="codeInline">
                  useTradingViewWsFeed
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default DataDisplayDemoBodies;
