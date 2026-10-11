import { defineDictionary } from '@jankrajewskiit/i18n';

export const navigationEn = defineDictionary({
  anchor: {
    label: 'On this page',
  },
  backToTop: {
    label: 'Back to top',
  },
  bottomNav: {
    label: 'Primary',
  },
  breadcrumb: {
    navigation: 'Breadcrumb',
    more: 'Show {count} more',
  },
  hierarchyNavigator: {
    path: 'Path',
    rootLabel: 'All',
  },
  link: {
    externalLabel: '(opens in new tab)',
  },
  loadMore: {
    format: 'Showing {shown} of {total}',
    doneLabel: 'All {total} shown',
    showNext: 'Show {count} more',
    showMore: 'Show more',
  },
  navbar: {
    label: 'Main',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mobile: '{label} (mobile)',
  },
  navbarLocale: {
    label: 'Change language',
  },
  navbarUser: {
    label: 'Account menu',
    labelWithName: '{label} — {name}',
  },
  pagination: {
    navigation: 'Pagination',
    rows: 'Rows',
    previous: 'Previous page',
    next: 'Next page',
    page: 'Page {page}',
    range: '{from}–{to} of {total}',
    compact: 'Page <b>{page}</b> of {count}',
  },
  stepper: {
    navigation: 'Progress',
    done: 'completed',
    error: 'has errors',
  },
  treeView: {
    loading: 'Loading…',
    loadFailed: 'Couldn’t load',
    positionInstructions:
      'Alt+Up or Alt+Down reorders siblings. Alt+Right moves into the previous folder. Alt+Left moves out of the parent. Space (Ctrl+Space in a checkable tree) starts a move into a folder; Enter confirms and Escape cancels.',
    moveInstructions:
      'To move an item, press Space (Ctrl+Space in a checkable tree), use the arrow keys to choose a parent, then press Enter. Press Escape to cancel.',
    moveStarted: 'Choose a parent with the arrow keys, then press Enter to move. Press Escape to cancel.',
    moveCompleted: 'Item moved.',
    moveCancelled: 'Move cancelled.',
    invalidMove: 'That item cannot be moved into the selected item.',
  },
  wizard: {
    finish: 'Finish',
    step: 'Step {index} of {count}',
    failed: 'Something went wrong. Try again.',
  },
});
