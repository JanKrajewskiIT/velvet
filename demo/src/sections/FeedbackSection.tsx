import type { ColorLabel } from '@jankrajewskiit/ui';
import {
  AccessDenied,
  addToast,
  Alert,
  Badge,
  Banner,
  BikeLoader,
  BouncingDotsLoader,
  Button,
  Chip,
  CircularProgress,
  ClosableChip,
  CodeText,
  ColorLabelManagerDialog,
  ColorLabelSelectionDialog,
  ConcentricPulseLoader,
  CornerPulseLoader,
  Countdown,
  DualFilterBar,
  DualPlaneSpinner,
  EllipsisLoader,
  EmptyState,
  EqualizerLoader,
  ErrorFallback,
  ErrorMessage,
  HoneycombLoader,
  IconButton,
  InlineEmptyState,
  JellyTriangleLoader,
  Kbd,
  NotFound,
  NotificationCenter,
  OrbitSquaresLoader,
  PageLoader,
  Progress,
  PulseRingLoader,
  RippleDotsLoader,
  SelectableChips,
  ShapeTrailLoader,
  ShuffleGridLoader,
  Skeleton,
  Spinner,
  Text,
} from '@jankrajewskiit/ui';
import { IoFolder, IoMail, IoNotifications, IoSearch } from 'solid-icons/io';
import { createMemo, createSignal, Show } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { DEMO_COLOR_LABEL_CHIPS, DEMO_SELECTABLE_FILTER_ITEMS } from '../fixtures/feedbackFixtures';
import { useDemoDictionary } from '../hooks/useDemoDictionary';
import { renderRichText } from '../i18n/renderRichText';
import type { SectionId } from '../nav/demoNavConfig';

const FeedbackSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const { t } = useDemoDictionary();
  const [retried, setRetried] = createSignal(false);
  const [bannerVisible, setBannerVisible] = createSignal(true);
  const [selectedLabelIds, setSelectedLabelIds] = createSignal<string[]>(['tag-1', 'tag-2']);
  const [managedLabels, setManagedLabels] = createSignal<ColorLabel[]>([
    { id: 'tag-1', name: 'Remote', color: '#1d4ed8' },
    { id: 'tag-2', name: 'Top pick', color: '#7c3aed' },
    { id: 'tag-3', name: 'Fast track', color: '#dc2626' },
  ]);
  const [multiFilterValue, setMultiFilterValue] = createSignal<string[]>(['new', 'interview']);
  const [labelManagerOpen, setLabelManagerOpen] = createSignal(false);
  const [labelSelectionOpen, setLabelSelectionOpen] = createSignal(false);
  const [dualFilterValue, setDualFilterValue] = createSignal('all');
  const [dualSortValue, setDualSortValue] = createSignal('order');

  const dualFilterItems = createMemo(() => [
    { value: 'all', label: t('demo.text.dataDisplay.dualFilterBar.filter.all') },
    { value: 'learning', label: t('demo.text.dataDisplay.dualFilterBar.filter.learning') },
    { value: 'voted', label: t('demo.text.dataDisplay.dualFilterBar.filter.voted') },
    { value: 'pending', label: t('demo.text.dataDisplay.dualFilterBar.filter.pending') },
    { value: 'unanswered', label: t('demo.text.dataDisplay.dualFilterBar.filter.unanswered') },
  ]);

  const dualSortItems = createMemo(() => [
    { value: 'order', label: t('demo.text.dataDisplay.dualFilterBar.sort.order') },
    { value: 'popular', label: t('demo.text.dataDisplay.dualFilterBar.sort.popular') },
  ]);

  const handleLabelSelectionSubmit = (value: string[]) => {
    setSelectedLabelIds(value);
    addToast({ type: 'success', message: t('demo.toast.feedback.labelSelectionUpdated') });
  };

  const handleLabelCreate = (item: ColorLabel) => {
    setManagedLabels((current) => [...current, item]);
  };

  const handleLabelUpdate = (item: ColorLabel) => {
    setManagedLabels((current) => current.map((entry) => (entry.id === item.id ? item : entry)));
  };

  const handleLabelDelete = (id: string) => {
    setManagedLabels((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div>
      <Show when={sectionId() === 'feedback-chips-tags'}>
        <ShowcaseSection
          title={t('demo.showcase.feedback.chip.title')}
          subtitle={t('demo.showcase.feedback.chip.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.feedback.chip.presetVariants.title')}>
              <div class="row">
                <Chip variant="primary" label={t('demo.text.feedback.chip.primary')} />
                <Chip variant="primaryOutline" label={t('demo.text.feedback.chip.outline')} />
                <Chip variant="info" label={t('demo.text.feedback.chip.info')} />
                <Chip variant="success" label={t('demo.text.feedback.chip.success')} />
                <Chip variant="warning" label={t('demo.text.feedback.chip.warning')} />
                <Chip variant="error" label={t('demo.text.feedback.chip.error')} />
                <Chip variant="subtle" label={t('demo.text.feedback.chip.subtle')} />
              </div>
            </PreviewGroup>
            <PreviewGroup title={t('demo.text.feedback.chip.interactiveCustomColor.title')}>
              <div class="row">
                <Chip variant="success" filled label={t('demo.text.feedback.chip.filledSuccess')} />
                <Chip variant="error" filled label={t('demo.text.feedback.chip.filledError')} />
                <Chip variant="info" size="sm" label={t('demo.text.feedback.chip.small')} />
                <Chip variant="primary" selected label={t('demo.text.feedback.chip.selected')} />
                <Chip variant="primary" onClick={() => {}} label={t('demo.text.feedback.chip.clickable')} />
                <Chip color="#2e7d32" selected label={t('demo.text.feedback.chip.selectedLower')} />
                <Chip color="#ed6c02" onClick={() => {}} label={t('demo.text.feedback.chip.clickableLower')} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.closableChip.title')}
          subtitle={t('demo.showcase.feedback.closableChip.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <ClosableChip label={t('demo.text.feedback.closableChip.javascript')} onRemove={() => {}} />
                <ClosableChip label={t('demo.text.feedback.closableChip.typescript')} onRemove={() => {}} />
                <ClosableChip label={t('demo.text.feedback.closableChip.solidjs')} onRemove={() => {}} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="SelectableChips" subtitle={t('demo.text.feedback.chipsTags.selectableChips.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="chipsCasesGrid">
                <div class="chipsCaseCard">
                  <Text as="p" variant="labelMd" tone="default">
                    {t('demo.text.feedback.chipsTags.selectableChips.colorCaseLabel')}
                  </Text>
                  <Text as="p" variant="bodySm" tone="muted">
                    {t('demo.text.feedback.chipsTags.selectableChips.colorCaseDescription')}
                  </Text>
                  <SelectableChips
                    label={t('demo.recron.status.tagCloud.label')}
                    description={t('demo.recron.status.tagCloud.description')}
                    items={DEMO_COLOR_LABEL_CHIPS}
                    value={selectedLabelIds()}
                    onChange={setSelectedLabelIds}
                  />
                </div>
                <div class="chipsCaseCard">
                  <Text as="p" variant="labelMd" tone="default">
                    {t('demo.text.feedback.chipsTags.selectableChips.filterCaseLabel')}
                  </Text>
                  <Text as="p" variant="bodySm" tone="muted">
                    {t('demo.text.feedback.chipsTags.selectableChips.filterCaseDescription')}
                  </Text>
                  <SelectableChips
                    label={t('demo.recron.status.filters.label')}
                    items={DEMO_SELECTABLE_FILTER_ITEMS}
                    value={multiFilterValue()}
                    onChange={setMultiFilterValue}
                  />
                </div>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="ColorLabelSelectionDialog"
          subtitle={t('demo.recron.showcase.colorTagSelectionDialog.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title="Example">
              <Button
                label={t('demo.recron.status.tagSelection.trigger')}
                onClick={() => setLabelSelectionOpen(true)}
              />
              <ColorLabelSelectionDialog
                open={labelSelectionOpen()}
                label={t('demo.recron.status.tagSelection.title')}
                description={t('demo.recron.status.tagSelection.description')}
                items={DEMO_COLOR_LABEL_CHIPS}
                value={selectedLabelIds()}
                chipsLabel={t('demo.recron.status.tagSelection.label')}
                cancelLabel={t('demo.recron.status.tagSelection.cancel')}
                onClose={() => setLabelSelectionOpen(false)}
                onSubmit={handleLabelSelectionSubmit}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="ColorLabelManagerDialog"
          subtitle={t('demo.recron.showcase.colorTagManagerDialog.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title="Example">
              <Button label={t('demo.recron.status.tagManager.trigger')} onClick={() => setLabelManagerOpen(true)} />
              <ColorLabelManagerDialog
                open={labelManagerOpen()}
                label={t('demo.recron.status.tagManager.title')}
                items={managedLabels()}
                colors={['#1d4ed8', '#7c3aed', '#0f766e', '#dc2626', '#f59e0b']}
                onClose={() => setLabelManagerOpen(false)}
                onCreate={handleLabelCreate}
                onUpdate={handleLabelUpdate}
                onDelete={handleLabelDelete}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.dualFilterBar.title')}
          subtitle={t('demo.showcase.dataDisplay.dualFilterBar.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="recronDemoWide recronDemoSurface">
                <DualFilterBar
                  filterItems={dualFilterItems()}
                  sortItems={dualSortItems()}
                  activeFilter={dualFilterValue()}
                  activeSort={dualSortValue()}
                  onFilterChange={setDualFilterValue}
                  onSortChange={setDualSortValue}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-badges-chips'}>
        <ShowcaseSection
          title={t('demo.showcase.feedback.badge.title')}
          subtitle={t('demo.showcase.feedback.badge.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.feedback.badge.primarySamples.title')}>
              <div class="row">
                <Badge content={5}>
                  <IconButton icon={<IoNotifications />} label={t('demo.text.feedback.badge.notifications')} />
                </Badge>
                <Badge content={99} max={99}>
                  <Button variant="primary">{t('demo.text.feedback.badge.messages')}</Button>
                </Badge>
                <Badge dot>
                  <IconButton icon={<IoMail />} label={t('demo.text.feedback.badge.mail')} />
                </Badge>
              </div>
            </PreviewGroup>
            <PreviewGroup title={t('demo.text.feedback.badge.semanticVariants.title')}>
              <div class="row">
                <Badge variant="info" content={3}>
                  <Button variant="ghost">{t('demo.text.feedback.badge.info')}</Button>
                </Badge>
                <Badge variant="success" content="OK">
                  <Button variant="ghost">{t('demo.text.feedback.badge.status')}</Button>
                </Badge>
                <Badge variant="error" content={12}>
                  <Button variant="ghost">{t('demo.text.feedback.badge.errors')}</Button>
                </Badge>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.kbd.title')}
          subtitle={t('demo.showcase.feedback.kbd.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
                <Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>
                <Kbd>Esc</Kbd>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-progress'}>
        <ShowcaseSection
          title={t('demo.showcase.feedback.progress.title')}
          subtitle={t('demo.showcase.feedback.progress.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Progress value={75} variant="primary" label={t('demo.text.feedback.progress.uploading')} showValue />
              <Progress value={45} variant="success" size="sm" />
              <Progress value={90} variant="warning" size="lg" showValue />
              <Progress variant="info" label={t('demo.text.feedback.progress.loading')} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.circularProgress.title')}
          subtitle={t('demo.showcase.feedback.circularProgress.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <CircularProgress
                  value={75}
                  showValue
                  variant="primary"
                  label={t('demo.text.feedback.circular.primary75')}
                />
                <CircularProgress
                  value={50}
                  showValue
                  variant="success"
                  label={t('demo.text.feedback.circular.success50')}
                />
                <CircularProgress
                  value={25}
                  showValue
                  variant="warning"
                  label={t('demo.text.feedback.circular.warning25')}
                />
                <CircularProgress
                  value={90}
                  showValue
                  variant="error"
                  label={t('demo.text.feedback.circular.error90')}
                />
              </div>
              <div class="row">
                <CircularProgress value={60} size="sm" showValue label={t('demo.text.feedback.circular.small')} />
                <CircularProgress value={60} size="md" showValue label={t('demo.text.feedback.circular.medium')} />
                <CircularProgress value={60} size="lg" showValue label={t('demo.text.feedback.circular.large')} />
                <CircularProgress label={t('demo.text.feedback.circular.indeterminate')} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.feedback.circular.meta'), {
              value: (
                <CodeText as="span" class="codeInline">
                  value
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.countdown.title')}
          subtitle={t('demo.showcase.feedback.countdown.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Countdown seconds={90} format="mm:ss" size="lg" />
                <Countdown seconds={3600} format="hh:mm:ss" />
                <Countdown seconds={15} format="ss" size="sm" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.skeleton.title')}
          subtitle={t('demo.showcase.feedback.skeleton.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Skeleton variant="circular" width={48} height={48} />
                <div class="col flex1">
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="90%" height={14} />
                  <Skeleton variant="text" width="40%" height={14} />
                </div>
              </div>
              <Skeleton variant="rectangular" height={120} animation="pulse" />
              <Skeleton variant="text" width="80%" animation="none" />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-loaders'}>
        <ShowcaseSection
          title={t('demo.showcase.feedback.spinner.title')}
          subtitle={t('demo.showcase.feedback.spinner.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <Spinner size="sm" label={t('demo.text.feedback.spinner.small')} />
                <Spinner size="md" label={t('demo.text.feedback.spinner.medium')} />
                <Spinner size="lg" label={t('demo.text.feedback.spinner.large')} />
              </div>
            </div>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.feedback.spinner.meta')}</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.pulseRingLoader.title')}
          subtitle={t('demo.showcase.feedback.pulseRingLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <PulseRingLoader label={t('demo.text.feedback.pulseRingLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.cornerPulseLoader.title')}
          subtitle={t('demo.showcase.feedback.cornerPulseLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <CornerPulseLoader label={t('demo.text.feedback.cornerPulseLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.jellyTriangleLoader.title')}
          subtitle={t('demo.showcase.feedback.jellyTriangleLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <JellyTriangleLoader label={t('demo.text.feedback.jellyTriangleLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.dualPlaneSpinner.title')}
          subtitle={t('demo.showcase.feedback.dualPlaneSpinner.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <DualPlaneSpinner label={t('demo.text.feedback.dualPlaneSpinner.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.equalizerLoader.title')}
          subtitle={t('demo.showcase.feedback.equalizerLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <EqualizerLoader label={t('demo.text.feedback.equalizerLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.ellipsisLoader.title')}
          subtitle={t('demo.showcase.feedback.ellipsisLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <EllipsisLoader label={t('demo.text.feedback.ellipsisLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.bouncingDotsLoader.title')}
          subtitle={t('demo.showcase.feedback.bouncingDotsLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <BouncingDotsLoader label={t('demo.text.feedback.bouncingDotsLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.rippleDotsLoader.title')}
          subtitle={t('demo.showcase.feedback.rippleDotsLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <RippleDotsLoader label={t('demo.text.feedback.rippleDotsLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.shapeTrailLoader.title')}
          subtitle={t('demo.showcase.feedback.shapeTrailLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <ShapeTrailLoader shape="circle" label={t('demo.text.feedback.shapeTrailLoader.circle')} />
                <ShapeTrailLoader shape="triangle" label={t('demo.text.feedback.shapeTrailLoader.triangle')} />
                <ShapeTrailLoader shape="square" label={t('demo.text.feedback.shapeTrailLoader.square')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.orbitSquaresLoader.title')}
          subtitle={t('demo.showcase.feedback.orbitSquaresLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <OrbitSquaresLoader label={t('demo.text.feedback.orbitSquaresLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.shuffleGridLoader.title')}
          subtitle={t('demo.showcase.feedback.shuffleGridLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <ShuffleGridLoader label={t('demo.text.feedback.shuffleGridLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.concentricPulseLoader.title')}
          subtitle={t('demo.showcase.feedback.concentricPulseLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <ConcentricPulseLoader label={t('demo.text.feedback.concentricPulseLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.bikeLoader.title')}
          subtitle={t('demo.showcase.feedback.bikeLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <BikeLoader label={t('demo.text.feedback.bikeLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.honeycombLoader.title')}
          subtitle={t('demo.showcase.feedback.honeycombLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="row loaderPreviewRow">
                <HoneycombLoader label={t('demo.text.feedback.honeycombLoader.loading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.pageLoader.title')}
          subtitle={t('demo.showcase.feedback.pageLoader.subtitle')}
        >
          <PreviewPanel>
            <div class="previewGroupContent">
              <div class="pageLoaderPreview">
                <PageLoader fullScreen={false} label={t('demo.text.feedback.pageLoader.reloading')} />
              </div>
            </div>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-alerts'}>
        <ShowcaseSection
          title={t('demo.showcase.feedback.alert.title')}
          subtitle={t('demo.showcase.feedback.alert.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Alert
                variant="info"
                label={t('demo.text.feedback.alert.information')}
                message={t('demo.text.feedback.alert.accountUpdated')}
              />
              <Alert
                variant="success"
                label={t('demo.text.feedback.alert.success')}
                message={t('demo.text.feedback.alert.fileUploaded')}
              />
              <Alert variant="warning" onClose={() => {}} message={t('demo.text.feedback.alert.diskLow')} />
              <Alert
                variant="error"
                label={t('demo.text.feedback.alert.error')}
                message={t('demo.text.feedback.alert.saveFailed')}
              />
              <Alert
                variant="tip"
                label={t('demo.text.feedback.alert.tip')}
                message={t('demo.text.feedback.alert.commandPaletteTip')}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.banner.title')}
          subtitle={t('demo.showcase.feedback.banner.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Banner
                variant="primary"
                message={t('demo.text.feedback.banner.newVersion')}
                action={<Button variant="navbar">{t('demo.text.feedback.banner.updateNow')}</Button>}
              />
              {bannerVisible() && (
                <Banner
                  variant="warning"
                  onClose={() => setBannerVisible(false)}
                  message={t('demo.text.feedback.banner.maintenance')}
                />
              )}
              <Banner variant="error" message={t('demo.text.feedback.banner.serviceDegraded')} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.toast.title')}
          subtitle={t('demo.showcase.feedback.toast.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Button
                  variant="primary"
                  onClick={() =>
                    addToast({
                      type: 'success',
                      message: t('demo.text.feedback.toast.changesSaved'),
                    })
                  }
                >
                  {t('demo.text.feedback.toast.successButton')}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => addToast({ type: 'error', message: t('demo.text.feedback.toast.somethingWrong') })}
                >
                  {t('demo.text.feedback.toast.errorButton')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => addToast({ type: 'info', message: t('demo.text.feedback.toast.newVersion') })}
                >
                  {t('demo.text.feedback.toast.infoButton')}
                </Button>
                <Button
                  variant="dashed"
                  onClick={() =>
                    addToast({
                      type: 'warning',
                      message: t('demo.text.feedback.toast.diskLow'),
                    })
                  }
                >
                  {t('demo.text.feedback.toast.warningButton')}
                </Button>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.feedback.toast.meta'), {
              toastProvider: (
                <CodeText as="span" class="codeInline">
                  ToastProvider
                </CodeText>
              ),
              toastViewport: (
                <CodeText as="span" class="codeInline">
                  ToastViewport
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.errorMessage.title')}
          subtitle={t('demo.showcase.feedback.errorMessage.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ErrorMessage message={t('demo.text.feedback.errorMessage.loadFailed')} />
              <ErrorMessage message={t('demo.text.feedback.errorMessage.networkTimeout')} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.notificationCenter.title')}
          subtitle={t('demo.showcase.feedback.notificationCenter.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <NotificationCenter maxItems={6} />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.feedback.notificationCenter.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-states'}>
        <ShowcaseSection
          id="feedback-not-found"
          title={t('demo.showcase.feedback.notFound.title')}
          subtitle={t('demo.showcase.feedback.notFound.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <NotFound />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          id="feedback-access-denied"
          title={t('demo.showcase.feedback.accessDenied.title')}
          subtitle={t('demo.showcase.feedback.accessDenied.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <AccessDenied
                label={t('demo.text.feedback.states.accessDeniedLabel')}
                description={t('demo.text.feedback.states.accessDeniedDescription')}
                goHomeLabel={t('demo.text.feedback.states.goHome')}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          id="feedback-error-fallback"
          title={t('demo.showcase.feedback.errorFallback.title')}
          subtitle={t('demo.showcase.feedback.errorFallback.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ErrorFallback
                label={
                  retried()
                    ? t('demo.text.feedback.states.stillFailing')
                    : t('demo.text.feedback.states.somethingWrong')
                }
                description={t('demo.text.feedback.states.unexpectedError')}
                onRetry={() => setRetried(true)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          id="feedback-empty-state-search"
          title={t('demo.showcase.feedback.emptyStateNoResults.title')}
          subtitle={t('demo.showcase.feedback.emptyStateNoResults.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <EmptyState
                icon={<IoSearch size={40} />}
                message={t('demo.text.feedback.states.noResults')}
                hint={t('demo.text.feedback.states.adjustSearch')}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          id="feedback-empty-state-folder"
          title={t('demo.showcase.feedback.emptyStateFolderEmpty.title')}
          subtitle={t('demo.showcase.feedback.emptyStateFolderEmpty.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <EmptyState icon={<IoFolder size={40} />} message={t('demo.text.feedback.states.folderEmpty')} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          id="feedback-inline-empty-state"
          title={t('demo.showcase.feedback.inlineEmptyState.title')}
          subtitle={t('demo.showcase.feedback.inlineEmptyState.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="recronDemoWide">
                <InlineEmptyState
                  message={t('demo.text.feedback.states.inlineEmpty')}
                  action={
                    <>
                      <Button size="sm" variant="primary" label={t('demo.text.inputs.actions.submit')} />
                      <Button size="sm" variant="ghost" label={t('demo.text.inputs.actions.saveDraft')} />
                    </>
                  }
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default FeedbackSection;
