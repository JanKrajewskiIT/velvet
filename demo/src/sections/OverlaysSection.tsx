import {
  Button,
  Chip,
  CodeText,
  ConfirmAction,
  ConfirmDialog,
  ContextMenu,
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
  Heading,
  Popover,
  Sheet,
  Text,
  Tooltip,
  Tour,
  type TourStep,
} from '@jankrajewskiit/ui';
import { IoCopy, IoPencil, IoTrash } from 'solid-icons/io';
import { createMemo, createSignal, Show } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { useDemoDictionary } from '../hooks/useDemoDictionary';
import { renderRichText } from '../i18n/renderRichText';
import type { SectionId } from '../nav/demoNavConfig';

const OverlaysSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const { t } = useDemoDictionary();
  const [tourOpen, setTourOpen] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const [sheetActionsOpen, setSheetActionsOpen] = createSignal(false);
  const [confirmRuns, setConfirmRuns] = createSignal(0);
  const [bottomSheetOpen, setBottomSheetOpen] = createSignal(false);
  const [leftSheetOpen, setLeftSheetOpen] = createSignal(false);
  const [rightSheetOpen, setRightSheetOpen] = createSignal(false);

  const tourSteps = createMemo<TourStep[]>(() => [
    {
      target: '.showcaseTitle',
      title: t('demo.text.overlays.tour.welcomeTitle'),
      content: t('demo.text.overlays.tour.welcomeContent'),
      placement: 'bottom',
    },
    {
      target: '.previewPanel',
      title: t('demo.text.overlays.tour.previewTitle'),
      content: t('demo.text.overlays.tour.previewContent'),
      placement: 'bottom',
    },
    {
      target: '.themeToggleBar',
      title: t('demo.text.overlays.tour.themeTitle'),
      content: t('demo.text.overlays.tour.themeContent'),
      placement: 'top',
    },
  ]);

  return (
    <div>
      <Show when={sectionId() === 'overlays-tooltips'}>
        <ShowcaseSection
          title={t('demo.showcase.overlays.tooltip.title')}
          subtitle={t('demo.showcase.overlays.tooltip.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Tooltip content={t('demo.text.overlays.tooltip.topContent')} position="top">
                  <Button variant="ghost">{t('demo.text.overlays.tooltip.top')}</Button>
                </Tooltip>
                <Tooltip content={t('demo.text.overlays.tooltip.bottomContent')} position="bottom">
                  <Button variant="ghost">{t('demo.text.overlays.tooltip.bottom')}</Button>
                </Tooltip>
                <Tooltip content={t('demo.text.overlays.tooltip.leftContent')} position="left">
                  <Button variant="ghost">{t('demo.text.overlays.tooltip.left')}</Button>
                </Tooltip>
                <Tooltip content={t('demo.text.overlays.tooltip.rightContent')} position="right">
                  <Button variant="ghost">{t('demo.text.overlays.tooltip.right')}</Button>
                </Tooltip>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.overlays.popover.title')}
          subtitle={t('demo.showcase.overlays.popover.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      {t('demo.text.overlays.tooltip.top')}
                    </Button>
                  )}
                  content={t('demo.text.overlays.popover.topContent')}
                  position="top"
                />
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      {t('demo.text.overlays.tooltip.bottom')}
                    </Button>
                  )}
                  content={t('demo.text.overlays.popover.bottomContent')}
                  position="bottom"
                />
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      {t('demo.text.overlays.tooltip.left')}
                    </Button>
                  )}
                  content={t('demo.text.overlays.popover.leftContent')}
                  position="left"
                />
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      {t('demo.text.overlays.tooltip.right')}
                    </Button>
                  )}
                  content={t('demo.text.overlays.popover.rightContent')}
                  position="right"
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-dialogs'}>
        <ShowcaseSection
          title={t('demo.showcase.overlays.dialog.title')}
          subtitle={t('demo.showcase.overlays.dialog.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="scenarioShell">
                <div class="scenarioHeader">
                  <div class="scenarioHeaderCopy">
                    <Text as="p" variant="overline" tone="primary">
                      {t('demo.page.overlaysDialogs.title')}
                    </Text>
                    <Heading level={3} variant="titleLg">
                      {t('demo.page.overlaysDialogs.description')}
                    </Heading>
                  </div>
                  <div class="scenarioMetricRow">
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.text.overlays.confirmAction.confirmedActions')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {confirmRuns()}
                      </Text>
                    </div>
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.text.overlays.confirmAction.confirmOpened')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {dialogOpen()
                          ? t('demo.text.overlays.confirmAction.yes')
                          : t('demo.text.overlays.confirmAction.no')}
                      </Text>
                    </div>
                  </div>
                </div>

                <div class="actionCluster">
                  <Button variant="primary" onClick={() => setDialogOpen(true)}>
                    {t('demo.text.overlays.dialog.openDialog')}
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                    {t('demo.text.overlays.confirmDialog.deleteItem')}
                  </Button>
                </div>
              </div>

              <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
                <DialogTitle label={t('demo.text.overlays.dialog.exampleTitle')} />
                <DialogBody>
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    {renderRichText(t('demo.text.overlays.dialog.meta'), {
                      dialogElement: (
                        <CodeText as="span" class="codeInline">
                          &lt;dialog&gt;
                        </CodeText>
                      ),
                    })}
                  </Text>
                </DialogBody>
                <DialogActions>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    {t('demo.text.overlays.dialog.cancel')}
                  </Button>
                  <Button variant="primary" onClick={() => setDialogOpen(false)}>
                    {t('demo.text.overlays.dialog.confirm')}
                  </Button>
                </DialogActions>
              </Dialog>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.overlays.confirmDialog.title')}
          subtitle={t('demo.showcase.overlays.confirmDialog.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                {t('demo.text.overlays.confirmDialog.deleteItem')}
              </Button>

              <ConfirmDialog
                open={confirmOpen()}
                label={t('demo.text.overlays.confirmDialog.deleteItemQuestion')}
                message={t('demo.text.overlays.confirmDialog.deleteItemMessage')}
                confirmLabel={t('demo.text.overlays.confirmDialog.delete')}
                variant="danger"
                onConfirm={() => setConfirmOpen(false)}
                onClose={() => setConfirmOpen(false)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.overlays.confirmAction.title')}
          subtitle={t('demo.showcase.overlays.confirmAction.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ConfirmAction
                label={t('demo.text.overlays.confirmAction.runDestructive')}
                message={t('demo.text.overlays.confirmAction.message')}
                confirmLabel={t('demo.text.overlays.confirmAction.run')}
                variant="danger"
                onConfirm={() => {
                  setConfirmRuns((current) => current + 1);
                }}
              >
                {({ openConfirm, isConfirmOpen }) => (
                  <div class="row">
                    <Button variant="danger" onClick={openConfirm}>
                      {t('demo.text.overlays.confirmAction.openConfirmation')}
                    </Button>
                    <Chip
                      variant="subtle"
                      label={`${t('demo.text.overlays.confirmAction.confirmOpened')}: ${isConfirmOpen() ? t('demo.text.overlays.confirmAction.yes') : t('demo.text.overlays.confirmAction.no')}`}
                    />
                  </div>
                )}
              </ConfirmAction>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {t('demo.text.overlays.confirmAction.confirmedActions')}:{' '}
            <CodeText as="span" class="codeInline">
              {String(confirmRuns())}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-sheets'}>
        <ShowcaseSection
          title={t('demo.showcase.overlays.sheets.title')}
          subtitle={t('demo.showcase.overlays.sheets.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Button variant="ghost" onClick={() => setBottomSheetOpen(true)}>
                  {t('demo.text.overlays.sheets.bottomSheet')}
                </Button>
                <Button variant="ghost" onClick={() => setLeftSheetOpen(true)}>
                  {t('demo.text.overlays.sheets.leftSheet')}
                </Button>
                <Button variant="ghost" onClick={() => setRightSheetOpen(true)}>
                  {t('demo.text.overlays.sheets.rightSheet')}
                </Button>
                <Button variant="ghost" onClick={() => setSheetActionsOpen(true)}>
                  {t('demo.text.overlays.sheets.openRightSheet')}
                </Button>
              </div>

              <Sheet
                open={bottomSheetOpen()}
                onClose={() => setBottomSheetOpen(false)}
                label={t('demo.text.overlays.sheets.bottomSheet')}
                side="bottom"
                size="md"
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.overlays.sheets.bottomContent')}
                </Text>
              </Sheet>

              <Sheet
                open={leftSheetOpen()}
                onClose={() => setLeftSheetOpen(false)}
                label={t('demo.text.overlays.sheets.leftSheet')}
                side="left"
                size="sm"
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.overlays.sheets.leftContent')}
                </Text>
              </Sheet>

              <Sheet
                open={rightSheetOpen()}
                onClose={() => setRightSheetOpen(false)}
                label={t('demo.text.overlays.sheets.rightSheet')}
                side="right"
                size="lg"
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.overlays.sheets.rightContent')}
                </Text>
              </Sheet>

              <Sheet
                open={sheetActionsOpen()}
                onClose={() => setSheetActionsOpen(false)}
                label={t('demo.text.overlays.sheets.settings')}
                subtitle={t('demo.text.overlays.sheets.adjustPreferences')}
                side="right"
                size="lg"
                actions={
                  <>
                    <Button variant="ghost" onClick={() => setSheetActionsOpen(false)}>
                      {t('demo.text.overlays.sheets.cancel')}
                    </Button>
                    <Button variant="primary" onClick={() => setSheetActionsOpen(false)}>
                      {t('demo.text.overlays.sheets.saveChanges')}
                    </Button>
                  </>
                }
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  {t('demo.text.overlays.sheets.settingsContent')}
                </Text>
              </Sheet>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-context'}>
        <ShowcaseSection
          title={t('demo.showcase.overlays.contextMenu.title')}
          subtitle={t('demo.showcase.overlays.contextMenu.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ContextMenu
                items={[
                  { label: t('demo.text.overlays.contextMenu.edit'), icon: <IoPencil />, onClick: () => {} },
                  { label: t('demo.text.overlays.contextMenu.duplicate'), icon: <IoCopy />, onClick: () => {} },
                  'separator',
                  {
                    label: t('demo.text.overlays.contextMenu.delete'),
                    icon: <IoTrash />,
                    onClick: () => {},
                    danger: true,
                  },
                ]}
              >
                <div class="contextMenuTarget">{t('demo.text.overlays.contextMenu.rightClickHere')}</div>
              </ContextMenu>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.overlays.contextMenu.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-lightbox'}>
        <ShowcaseSection
          title={t('demo.showcase.overlays.tour.title')}
          subtitle={t('demo.showcase.overlays.tour.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Button variant="primary" onClick={() => setTourOpen(true)}>
                {t('demo.text.overlays.tour.startTour')}
              </Button>
              <Tour steps={tourSteps()} open={tourOpen()} onClose={() => setTourOpen(false)} />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.overlays.tour.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default OverlaysSection;
