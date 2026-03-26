import {
  AccessDenied,
  addToast,
  Alert,
  Badge,
  Banner,
  Button,
  Chip,
  CircularProgress,
  ClosableChip,
  CodeText,
  Countdown,
  EmptyState,
  ErrorFallback,
  ErrorMessage,
  IconButton,
  Kbd,
  LoadingContainer,
  NotificationCenter,
  Progress,
  Skeleton,
  Spinner,
  StatCard,
  useI18n,
} from '@jankrajewskiit/ui';
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoFolder,
  IoMail,
  IoNotifications,
  IoPeople,
  IoSearch,
  IoStatsChart,
} from 'solid-icons/io';
import { createMemo, createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';
import { renderRichText } from '../i18n/renderRichText';

const FeedbackSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey): string => dictionary()[key];
  const [retried, setRetried] = createSignal(false);
  const [bannerVisible, setBannerVisible] = createSignal(true);

  return (
    <div>
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
                  icon={<IoPeople />}
                  colorClass="info"
                />
                <StatCard
                  value="98.7%"
                  label={t('demo.text.feedback.statCard.uptime')}
                  icon={<IoCheckmarkCircle />}
                  colorClass="success"
                />
                <StatCard
                  value="3"
                  label={t('demo.text.feedback.statCard.openIssues')}
                  icon={<IoAlertCircle />}
                  colorClass="warning"
                />
                <StatCard
                  value="42"
                  label={t('demo.text.feedback.statCard.deployments')}
                  icon={<IoStatsChart />}
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
          title={t('demo.showcase.feedback.spinner.title')}
          subtitle={t('demo.showcase.feedback.spinner.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Spinner size="sm" label={t('demo.text.feedback.spinner.small')} />
                <Spinner size="md" label={t('demo.text.feedback.spinner.medium')} />
                <Spinner size="lg" label={t('demo.text.feedback.spinner.large')} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.feedback.spinner.meta')}</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.feedback.loadingContainer.title')}
          subtitle={t('demo.showcase.feedback.loadingContainer.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="loaderRow">
                <div class="loaderSample loaderSm">
                  <LoadingContainer size="sm" />
                </div>
                <div class="loaderSample loaderMd">
                  <LoadingContainer size="md" />
                </div>
                <div class="loaderSample loaderLg">
                  <LoadingContainer size="lg" />
                </div>
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
                retryLabel={t('demo.text.feedback.states.tryAgain')}
                onRetry={() => setRetried(true)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
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
          title={t('demo.showcase.feedback.emptyStateFolderEmpty.title')}
          subtitle={t('demo.showcase.feedback.emptyStateFolderEmpty.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <EmptyState icon={<IoFolder size={40} />} message={t('demo.text.feedback.states.folderEmpty')} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default FeedbackSection;
