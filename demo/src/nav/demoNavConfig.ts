import type { DemoI18nMessageKey } from '../i18n/messages';

export type SectionId =
  | 'overview'
  | 'typography'
  | 'developer'
  | 'inputs-buttons'
  | 'inputs-switchers'
  | 'inputs-dropdowns'
  | 'inputs-fields'
  | 'inputs-pickers'
  | 'inputs-datetime'
  | 'inputs-other'
  | 'inputs-form-layout'
  | 'data-content'
  | 'data-media'
  | 'data-charts'
  | 'data-tables'
  | 'data-lists'
  | 'data-filters'
  | 'data-timeline'
  | 'data-tree'
  | 'nav-navbar'
  | 'nav-sidebars'
  | 'nav-breadcrumbs'
  | 'nav-stepper'
  | 'nav-tabs'
  | 'nav-pagination'
  | 'nav-speed-dial'
  | 'nav-bottom-nav'
  | 'nav-back-to-top'
  | 'feedback-badges-chips'
  | 'feedback-chips-tags'
  | 'feedback-progress'
  | 'feedback-loaders'
  | 'feedback-alerts'
  | 'feedback-states'
  | 'overlays-tooltips'
  | 'overlays-dialogs'
  | 'overlays-sheets'
  | 'overlays-context'
  | 'overlays-lightbox'
  | 'surfaces-layouts'
  | 'surfaces-main-layout'
  | 'surfaces-collapsible'
  | 'surfaces-cards'
  | 'surfaces-interactive-cards'
  | 'composites-transfer-list'
  | 'composites-editable-collection'
  | 'composites-kanban-board'
  | 'composites-command-palette'
  | 'composites-ai-result'
  | 'composites-scheduler';

interface DemoNavItemConfig {
  id: SectionId;
  labelKey: DemoI18nMessageKey;
}

interface DemoNavGroupConfig {
  labelKey: DemoI18nMessageKey;
  items: DemoNavItemConfig[];
}

export const NAV_GROUPS: DemoNavGroupConfig[] = [
  {
    labelKey: 'demo.nav.start',
    items: [
      { id: 'overview', labelKey: 'demo.nav.item.overview' },
      { id: 'typography', labelKey: 'demo.nav.item.typography' },
      { id: 'developer', labelKey: 'demo.nav.item.developer' },
    ],
  },
  {
    labelKey: 'demo.nav.surfaces',
    items: [
      { id: 'surfaces-layouts', labelKey: 'demo.nav.item.surfacesLayouts' },
      { id: 'surfaces-main-layout', labelKey: 'demo.nav.item.surfacesMainLayout' },
      { id: 'surfaces-collapsible', labelKey: 'demo.nav.item.surfacesCollapsible' },
      { id: 'surfaces-cards', labelKey: 'demo.nav.item.surfacesCards' },
      { id: 'surfaces-interactive-cards', labelKey: 'demo.nav.item.surfacesInteractiveCards' },
    ],
  },
  {
    labelKey: 'demo.nav.navigation',
    items: [
      { id: 'nav-navbar', labelKey: 'demo.nav.item.navbar' },
      { id: 'nav-sidebars', labelKey: 'demo.nav.item.sidebars' },
      { id: 'nav-breadcrumbs', labelKey: 'demo.nav.item.breadcrumbs' },
      { id: 'nav-stepper', labelKey: 'demo.nav.item.stepper' },
      { id: 'nav-tabs', labelKey: 'demo.nav.item.tabs' },
      { id: 'nav-pagination', labelKey: 'demo.nav.item.pagination' },
      { id: 'nav-speed-dial', labelKey: 'demo.nav.item.speedDial' },
      { id: 'nav-bottom-nav', labelKey: 'demo.nav.item.bottomNav' },
      { id: 'nav-back-to-top', labelKey: 'demo.nav.item.backToTop' },
    ],
  },
  {
    labelKey: 'demo.nav.inputs',
    items: [
      { id: 'inputs-buttons', labelKey: 'demo.nav.item.inputsButtons' },
      { id: 'inputs-fields', labelKey: 'demo.nav.item.inputsFields' },
      { id: 'inputs-switchers', labelKey: 'demo.nav.item.inputsSwitchers' },
      { id: 'inputs-pickers', labelKey: 'demo.nav.item.inputsPickers' },
      { id: 'inputs-dropdowns', labelKey: 'demo.nav.item.inputsDropdowns' },
      { id: 'inputs-datetime', labelKey: 'demo.nav.item.inputsDateTime' },
      { id: 'inputs-other', labelKey: 'demo.nav.item.inputsUpload' },
      { id: 'inputs-form-layout', labelKey: 'demo.nav.item.inputsFormLayout' },
    ],
  },
  {
    labelKey: 'demo.nav.data',
    items: [
      { id: 'data-tables', labelKey: 'demo.nav.item.dataTables' },
      { id: 'data-lists', labelKey: 'demo.nav.item.dataLists' },
      { id: 'data-filters', labelKey: 'demo.nav.item.dataFilters' },
      { id: 'data-tree', labelKey: 'demo.nav.item.dataTree' },
      { id: 'data-media', labelKey: 'demo.nav.item.dataMedia' },
      { id: 'data-charts', labelKey: 'demo.nav.item.dataCharts' },
      { id: 'data-timeline', labelKey: 'demo.nav.item.dataTimeline' },
    ],
  },
  {
    labelKey: 'demo.nav.feedback',
    items: [
      { id: 'feedback-chips-tags', labelKey: 'demo.nav.item.feedbackChipsTags' },
      { id: 'feedback-badges-chips', labelKey: 'demo.nav.item.feedbackStatusNotifications' },
      { id: 'feedback-progress', labelKey: 'demo.nav.item.feedbackProgress' },
      { id: 'feedback-loaders', labelKey: 'demo.nav.item.feedbackLoaders' },
      { id: 'feedback-alerts', labelKey: 'demo.nav.item.feedbackAlertsBanners' },
      { id: 'feedback-states', labelKey: 'demo.nav.item.feedbackEmptyStates' },
    ],
  },
  {
    labelKey: 'demo.nav.overlays',
    items: [
      { id: 'overlays-tooltips', labelKey: 'demo.nav.item.overlaysTooltipPopover' },
      { id: 'overlays-dialogs', labelKey: 'demo.nav.item.overlaysDialogs' },
      { id: 'overlays-sheets', labelKey: 'demo.nav.item.overlaysSheets' },
      { id: 'overlays-context', labelKey: 'demo.nav.item.overlaysContextMenu' },
      { id: 'overlays-lightbox', labelKey: 'demo.nav.item.overlaysTour' },
    ],
  },
  {
    labelKey: 'demo.nav.composites',
    items: [
      { id: 'data-content', labelKey: 'demo.nav.item.codeMarkdown' },
      { id: 'composites-transfer-list', labelKey: 'demo.nav.item.transferList' },
      { id: 'composites-editable-collection', labelKey: 'demo.nav.item.editableCollection' },
      { id: 'composites-kanban-board', labelKey: 'demo.nav.item.kanbanBoard' },
      { id: 'composites-command-palette', labelKey: 'demo.nav.item.commandPalette' },
      { id: 'composites-ai-result', labelKey: 'demo.nav.item.aiResultPanel' },
      { id: 'composites-scheduler', labelKey: 'demo.nav.item.scheduler' },
    ],
  },
];

export const PAGE_META_KEYS: Record<SectionId, { titleKey: DemoI18nMessageKey; descriptionKey: DemoI18nMessageKey }> = {
  overview: {
    titleKey: 'demo.page.overview.title',
    descriptionKey: 'demo.page.overview.description',
  },
  typography: {
    titleKey: 'demo.page.typography.title',
    descriptionKey: 'demo.page.typography.description',
  },
  developer: {
    titleKey: 'demo.page.developer.title',
    descriptionKey: 'demo.page.developer.description',
  },
  'inputs-buttons': {
    titleKey: 'demo.page.inputsButtons.title',
    descriptionKey: 'demo.page.inputsButtons.description',
  },
  'inputs-switchers': {
    titleKey: 'demo.page.inputsSwitchers.title',
    descriptionKey: 'demo.page.inputsSwitchers.description',
  },
  'inputs-dropdowns': {
    titleKey: 'demo.page.inputsDropdowns.title',
    descriptionKey: 'demo.page.inputsDropdowns.description',
  },
  'inputs-fields': {
    titleKey: 'demo.page.inputsFields.title',
    descriptionKey: 'demo.page.inputsFields.description',
  },
  'inputs-pickers': {
    titleKey: 'demo.page.inputsPickers.title',
    descriptionKey: 'demo.page.inputsPickers.description',
  },
  'inputs-datetime': {
    titleKey: 'demo.page.inputsDateTime.title',
    descriptionKey: 'demo.page.inputsDateTime.description',
  },
  'inputs-other': {
    titleKey: 'demo.page.inputsOther.title',
    descriptionKey: 'demo.page.inputsOther.description',
  },
  'inputs-form-layout': {
    titleKey: 'demo.page.inputsFormLayout.title',
    descriptionKey: 'demo.page.inputsFormLayout.description',
  },
  'data-content': {
    titleKey: 'demo.page.dataContent.title',
    descriptionKey: 'demo.page.dataContent.description',
  },
  'data-media': {
    titleKey: 'demo.page.dataMedia.title',
    descriptionKey: 'demo.page.dataMedia.description',
  },
  'data-charts': {
    titleKey: 'demo.page.dataCharts.title',
    descriptionKey: 'demo.page.dataCharts.description',
  },
  'data-tables': {
    titleKey: 'demo.page.dataTables.title',
    descriptionKey: 'demo.page.dataTables.description',
  },
  'data-lists': {
    titleKey: 'demo.page.dataLists.title',
    descriptionKey: 'demo.page.dataLists.description',
  },
  'data-filters': {
    titleKey: 'demo.page.dataFilters.title',
    descriptionKey: 'demo.page.dataFilters.description',
  },
  'data-timeline': {
    titleKey: 'demo.page.dataTimeline.title',
    descriptionKey: 'demo.page.dataTimeline.description',
  },
  'data-tree': {
    titleKey: 'demo.page.dataTree.title',
    descriptionKey: 'demo.page.dataTree.description',
  },
  'nav-navbar': {
    titleKey: 'demo.page.navNavbar.title',
    descriptionKey: 'demo.page.navNavbar.description',
  },
  'nav-sidebars': {
    titleKey: 'demo.page.navSidebars.title',
    descriptionKey: 'demo.page.navSidebars.description',
  },
  'nav-breadcrumbs': {
    titleKey: 'demo.page.navBreadcrumbs.title',
    descriptionKey: 'demo.page.navBreadcrumbs.description',
  },
  'nav-stepper': {
    titleKey: 'demo.page.navStepper.title',
    descriptionKey: 'demo.page.navStepper.description',
  },
  'nav-tabs': {
    titleKey: 'demo.page.navTabs.title',
    descriptionKey: 'demo.page.navTabs.description',
  },
  'nav-pagination': {
    titleKey: 'demo.page.navPagination.title',
    descriptionKey: 'demo.page.navPagination.description',
  },
  'nav-speed-dial': {
    titleKey: 'demo.page.navSpeedDial.title',
    descriptionKey: 'demo.page.navSpeedDial.description',
  },
  'nav-bottom-nav': {
    titleKey: 'demo.page.navBottomNav.title',
    descriptionKey: 'demo.page.navBottomNav.description',
  },
  'nav-back-to-top': {
    titleKey: 'demo.page.navBackToTop.title',
    descriptionKey: 'demo.page.navBackToTop.description',
  },
  'feedback-badges-chips': {
    titleKey: 'demo.page.feedbackBadgesChips.title',
    descriptionKey: 'demo.page.feedbackBadgesChips.description',
  },
  'feedback-chips-tags': {
    titleKey: 'demo.page.feedbackChipsTags.title',
    descriptionKey: 'demo.page.feedbackChipsTags.description',
  },
  'feedback-progress': {
    titleKey: 'demo.page.feedbackProgress.title',
    descriptionKey: 'demo.page.feedbackProgress.description',
  },
  'feedback-loaders': {
    titleKey: 'demo.page.feedbackLoaders.title',
    descriptionKey: 'demo.page.feedbackLoaders.description',
  },
  'feedback-alerts': {
    titleKey: 'demo.page.feedbackAlerts.title',
    descriptionKey: 'demo.page.feedbackAlerts.description',
  },
  'feedback-states': {
    titleKey: 'demo.page.feedbackStates.title',
    descriptionKey: 'demo.page.feedbackStates.description',
  },
  'overlays-tooltips': {
    titleKey: 'demo.page.overlaysTooltips.title',
    descriptionKey: 'demo.page.overlaysTooltips.description',
  },
  'overlays-dialogs': {
    titleKey: 'demo.page.overlaysDialogs.title',
    descriptionKey: 'demo.page.overlaysDialogs.description',
  },
  'overlays-sheets': {
    titleKey: 'demo.page.overlaysSheets.title',
    descriptionKey: 'demo.page.overlaysSheets.description',
  },
  'overlays-context': {
    titleKey: 'demo.page.overlaysContext.title',
    descriptionKey: 'demo.page.overlaysContext.description',
  },
  'overlays-lightbox': {
    titleKey: 'demo.page.overlaysLightbox.title',
    descriptionKey: 'demo.page.overlaysLightbox.description',
  },
  'surfaces-layouts': {
    titleKey: 'demo.page.surfacesLayouts.title',
    descriptionKey: 'demo.page.surfacesLayouts.description',
  },
  'surfaces-main-layout': {
    titleKey: 'demo.page.surfacesMainLayout.title',
    descriptionKey: 'demo.page.surfacesMainLayout.description',
  },
  'surfaces-collapsible': {
    titleKey: 'demo.page.surfacesCollapsible.title',
    descriptionKey: 'demo.page.surfacesCollapsible.description',
  },
  'surfaces-cards': {
    titleKey: 'demo.page.surfacesCards.title',
    descriptionKey: 'demo.page.surfacesCards.description',
  },
  'surfaces-interactive-cards': {
    titleKey: 'demo.page.surfacesInteractiveCards.title',
    descriptionKey: 'demo.page.surfacesInteractiveCards.description',
  },
  'composites-transfer-list': {
    titleKey: 'demo.page.compositesTransferList.title',
    descriptionKey: 'demo.page.compositesTransferList.description',
  },
  'composites-editable-collection': {
    titleKey: 'demo.page.compositesEditableCollection.title',
    descriptionKey: 'demo.page.compositesEditableCollection.description',
  },
  'composites-kanban-board': {
    titleKey: 'demo.page.compositesKanbanBoard.title',
    descriptionKey: 'demo.page.compositesKanbanBoard.description',
  },
  'composites-command-palette': {
    titleKey: 'demo.page.compositesCommandPalette.title',
    descriptionKey: 'demo.page.compositesCommandPalette.description',
  },
  'composites-ai-result': {
    titleKey: 'demo.page.compositesAiResult.title',
    descriptionKey: 'demo.page.compositesAiResult.description',
  },
  'composites-scheduler': {
    titleKey: 'demo.page.compositesScheduler.title',
    descriptionKey: 'demo.page.compositesScheduler.description',
  },
};

export const HEADER_SECTION_IDS: SectionId[] = [
  'surfaces-main-layout',
  'data-tables',
  'inputs-fields',
  'feedback-alerts',
];

export const OVERVIEW_TRACKS: { id: SectionId; groupKey: DemoI18nMessageKey }[] = [
  { id: 'surfaces-main-layout', groupKey: 'demo.nav.surfaces' },
  { id: 'inputs-form-layout', groupKey: 'demo.nav.inputs' },
  { id: 'data-tables', groupKey: 'demo.nav.data' },
];

export const DEMO_NAV_GROUP_COUNT = NAV_GROUPS.length;

export const DEMO_SECTION_PAGE_COUNT = NAV_GROUPS.reduce((total, group) => total + group.items.length, 0);

export const isValidSectionId = (value: string): value is SectionId => Object.hasOwn(PAGE_META_KEYS, value);

/** sessionStorage key: last demo section when the URL has no valid `?section=`. */
export const DEMO_LAST_SECTION_STORAGE_KEY = 'velvet-demo-last-section';
