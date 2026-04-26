import { defineDictionary } from '../defineDictionary';
import type { TranslationOf } from '../types';

/**
 * VelvetUi foundation dictionary (English).
 *
 * This is the source of truth for the foundation key set; the Polish
 * dictionary mirrors its shape exactly. Apps and library packages add
 * their own dictionaries on top via `defineDictionaries`.
 */
export const en = defineDictionary({
  common: {
    add: 'Add',
    all: 'All',
    apply: 'Apply',
    back: 'Back',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    confirm: 'Confirm',
    copy: 'Copy',
    copied: 'Copied!',
    copyFailed: 'Copy failed',
    default: 'Default',
    delete: 'Delete',
    dismiss: 'Dismiss',
    edit: 'Edit',
    end: 'End',
    exportJson: 'Export JSON',
    field: 'Field',
    finish: 'Finish',
    importJson: 'Import JSON',
    loading: 'Loading',
    logIn: 'Log in',
    logOut: 'Log out',
    match: 'Match',
    menuOptions: 'Menu options',
    moveDown: 'Move down',
    moveUp: 'Move up',
    next: 'Next',
    noData: 'No data',
    notSet: 'Not set',
    noItems: 'No items',
    noOptions: 'No options',
    none: 'None',
    notifications: 'Notifications',
    operator: 'Operator',
    pagination: 'Pagination',
    persisted: 'Persisted',
    pin: 'Pin',
    previous: 'Previous',
    queryBuilder: 'Query builder',
    remove: 'Remove',
    save: 'Save',
    saveChanges: 'Save changes',
    search: 'Search',
    searchEllipsis: 'Search...',
    selectEllipsis: 'Select...',
    selected: 'Selected',
    skip: 'Skip',
    start: 'Start',
    today: 'Today',
    value: 'Value',
  },
  error: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
    retry: 'Try again',
  },
  accessDenied: {
    unauthorized: {
      title: 'Authentication required',
      description: 'You need to log in to access this content.',
    },
    forbidden: {
      title: 'Access denied',
      description: 'You do not have permission to view this content.',
    },
    goHome: 'Go home',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has moved.',
    goHome: 'Go home',
    suggestions: 'You can try one of these pages instead:',
  },
  dir: {
    left: 'Left',
    right: 'Right',
  },
  time: {
    hhmm: 'HH:MM',
  },
  date: {
    yyyymmdd: 'YYYY-MM-DD',
  },
  calendar: {
    label: 'Calendar',
    rangeLabel: 'Date range calendar',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    day: {
      mo: 'Mo',
      tu: 'Tu',
      we: 'We',
      th: 'Th',
      fr: 'Fr',
      sa: 'Sa',
      su: 'Su',
    },
  },
  speedDial: {
    actions: 'Quick actions',
    open: 'Open quick actions',
    close: 'Close quick actions',
  },
  dropdown: {
    openMenu: 'Open menu',
  },
  accordion: {
    toggleSection: 'Toggle section',
    toggleSectionWithLabel: 'Toggle {label} section',
  },
  datetime: {
    openDatePicker: 'Open date picker',
    openTimePicker: 'Open time picker',
    timeOptions: 'Time options',
    startDate: 'Start date',
    endDate: 'End date',
  },
  notification: {
    markAllRead: 'Mark all as read',
    markRead: 'Mark as read',
    clearAll: 'Clear all',
    empty: 'No notifications yet.',
  },
  table: {
    filterRows: 'Filter rows...',
    result: 'result',
    results: 'results',
    pageOf: 'Page {current} of {total}',
  },
  multiselect: {
    selectOptions: 'Select options',
  },
  alert: {
    close: 'Close',
  },
  bikeLoader: { loading: 'Loading' },
  bouncingDotsLoader: { loading: 'Loading' },
  concentricPulseLoader: { loading: 'Loading' },
  cornerPulseLoader: { loading: 'Loading' },
  dualPlaneSpinner: { loading: 'Loading' },
  ellipsisLoader: { loading: 'Loading' },
  equalizerLoader: { loading: 'Loading' },
  honeycombLoader: { loading: 'Loading' },
  jellyTriangleLoader: { loading: 'Loading' },
  orbitSquaresLoader: { loading: 'Loading' },
  pulseRingLoader: { loading: 'Loading' },
  rippleDotsLoader: { loading: 'Loading' },
  shuffleGridLoader: { loading: 'Loading' },
  shapeTrailLoader: { loading: 'Loading' },
  spinner: { loading: 'Loading' },
  pageLoader: { loading: 'Loading page' },
  inlineEditable: {
    clickEdit: 'Click edit',
    editValue: 'Edit value',
    inputLabel: 'Editable text input',
  },
  number: {
    decrease: 'Decrease value',
    increase: 'Increase value',
  },
  search: {
    clear: 'Clear search',
  },
  otp: {
    group: 'One-time password input',
    digit: 'Digit {index}',
  },
  password: {
    show: 'Show password',
    hide: 'Hide password',
  },
  richText: {
    editor: 'Rich text editor',
    placeholder: 'Write rich text content...',
    list: 'List',
    link: 'Link',
    linkPlaceholder: 'https://example.com',
    unlink: 'Unlink',
    clear: 'Clear',
  },
  sidebar: {
    expand: 'Expand sidebar',
    collapse: 'Collapse sidebar',
    navigation: 'Sidebar navigation',
    searchItems: 'Search items...',
    onlyBadges: 'Only with badges',
    noMatches: 'No matching items found.',
    broaderHint: 'Try a broader search term.',
    componentCategories: 'Component categories',
  },
  navbar: {
    navigation: 'Main navigation',
    toggleMenu: 'Toggle menu',
  },
  tabs: {
    tabList: 'Tab list',
  },
  backToTop: {
    label: 'Back to top',
  },
  lightbox: {
    imageViewer: 'Image viewer',
  },
  avatar: {
    label: 'Avatar',
  },
  breadcrumbs: {
    label: 'Breadcrumb',
    showAll: 'Show all breadcrumbs',
  },
  carousel: {
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: 'Go to slide {index}',
  },
  rangeSlider: {
    minimum: 'Range minimum',
    maximum: 'Range maximum',
  },
  kanban: {
    noCards: 'No cards',
  },
  commandPalette: {
    searchCommands: 'Search commands...',
    open: 'Open command palette',
    label: 'Command palette',
    results: 'Command results',
    noResults: 'No results found',
    navigate: 'Use \u2191 \u2193 to navigate',
    select: 'Enter to select',
    escToClose: 'Esc to close',
  },
  transfer: {
    available: 'Available',
    selected: 'Selected',
    selectItem: 'Select {label}',
    moveSelectedRight: 'Move selected to right',
    moveAllRight: 'Move all to right',
    moveSelectedLeft: 'Move selected to left',
    moveAllLeft: 'Move all to left',
  },
  locale: {
    switchLanguage: 'Switch language',
  },
  scheduler: {
    agenda: 'Agenda',
    addEvent: 'Add event',
    eventTitle: 'Event title',
    descriptionOptional: 'Description (optional)',
    noEventsForDay: 'No events scheduled for this day.',
    move: 'Move',
    resizeEnd: 'Resize end',
    moveEvent: 'Move {title}',
    resizeEventEnd: 'Resize {title} end',
    deleteEvent: 'Delete event',
    deleteEventMessage: 'Do you want to remove this event from the schedule?',
  },
  filterBar: {
    clearAll: 'Clear all',
  },
  tree: {
    loading: 'Loading...',
    toggleNode: 'Toggle {label}',
  },
  rating: {
    valueOf: '{index} of {max}',
  },
  resizablePanel: {
    resizePanels: 'Resize panels',
  },
  theme: {
    light: 'Light',
    dark: 'Dark',
    label: 'Theme',
  },
  flashcard: {
    revealHint: 'Flip to reveal',
    answer: 'Answer',
    iKnow: 'I know this',
    iDontKnow: "I don't know",
    quit: 'Quit',
    known: 'Known',
    unknown: 'Unknown',
    total: 'Total',
    restart: 'Restart',
  },
  practiceSetup: {
    category: 'Category',
    count: 'Count',
    allCategories: 'All categories',
  },
  banner: {
    close: 'Close banner',
  },
  analysis: {
    categories: 'Categories',
    inputPlaceholder: 'Enter text to analyze...',
    recommendations: 'Recommendations',
    score: 'Score',
    analyze: 'Analyze',
  },
  comparison: {
    compare: 'Compare',
    selectToCompare: 'Select items to compare',
  },
  dualFilterBar: {
    filterGroup: 'Filters',
    sortGroup: 'Sort',
  },
  editableCollection: {
    deleteConfirmMessage: 'Are you sure you want to delete this item?',
  },
  colorLabel: {
    name: 'Name',
    color: 'Color',
    empty: 'No labels yet',
    deleteConfirm: 'Delete label',
    deleteConfirmMessage: 'Are you sure you want to delete this label?',
  },
});

/** Foundation dictionary shape — used to seed `VelvetI18nDictionary` and
 *  to constrain other locales (e.g. `pl`) to the same key set without
 *  pinning them to English string literals. */
export type VelvetUiFoundationDictionary = TranslationOf<typeof en>;

declare module '../types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface VelvetI18nDictionary extends VelvetUiFoundationDictionary {}
}
