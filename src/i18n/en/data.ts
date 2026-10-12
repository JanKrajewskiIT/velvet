import { defineDictionary } from '@jankrajewskiit/i18n';

export const dataEn = defineDictionary({
  avatar: {
    statusOnline: 'Online',
    statusAway: 'Away',
    statusBusy: 'Busy',
    statusOffline: 'Offline',
  },
  codeSnippet: {
    copyFailed: 'Copy failed',
    copyCode: 'Copy code',
    copiedAnnouncement: 'Copied to clipboard',
  },
  diffSkip: {
    showUnchanged: '⋯ Show {count, plural, one {# unchanged line} other {# unchanged lines}}',
  },
  diffViewer: {
    modeUnified: 'Unified',
    modeSplit: 'Split',
    statsLabel: '{added} added, {removed} removed lines',
    viewLabel: 'View',
    changesLabel: 'changes',
    changesLabelNamed: '{filename} — changes',
  },
  eventCalendar: {
    emptyText: 'No events this day.',
    allDay: 'All day',
  },
  featureCard: {
    learnMore: 'Learn more',
  },
  flipCard: {
    label: 'Flip card',
    showingBack: '{label} (showing back)',
    showingFront: '{label} (showing front)',
  },
  kanban: {
    cardFallback: 'Card',
    cardMoved: '{card} moved to {column}, position {position}',
    addCard: 'Add card to {column}',
    listLabel: '{title}, {count, plural, one {# card} other {# cards}}',
    cardRoleDescription: 'Draggable card',
    dropHere: 'Drop cards here',
    help: 'Ctrl plus arrow keys move the card between columns and positions.',
  },
  list: {
    empty: 'Nothing here yet.',
  },
  logViewer: {
    title: 'Logs',
    levelsLabel: 'Levels',
    filterPlaceholder: 'Filter',
    filterLabel: 'Filter log lines',
    wrap: 'Wrap',
    noWrap: 'No wrap',
    noMatches: 'No lines match the filter.',
    newLines: '{count} new',
    latest: 'Latest',
  },
  questionCard: {
    removeSaved: 'Remove from saved',
    save: 'Save question',
    difficulty: 'Difficulty',
    voted: 'votes, you voted',
    vote: 'votes, vote up',
    hideAnswer: 'Hide answer',
    showAnswer: 'Show answer',
  },
  scheduler: {
    viewDay: 'Day',
    viewWeek: 'Week',
    navigateLabel: 'Navigate',
    previousDay: 'Previous day',
    previousWeek: 'Previous week',
    nextDay: 'Next day',
    nextWeek: 'Next week',
    viewLabel: 'View',
    scheduleLabel: 'Schedule',
    addEventOn: 'Add event on {date}',
    eventLabel: '{title}, {start} to {end}',
  },
  scoreCard: {
    label: 'Score',
  },
  skillBar: {
    label: 'Skill level',
    valueTextWithLevel: '{level}, {percent}%',
  },
  stat: {
    trendLabel: 'Trend',
  },
  table: {
    addRow: 'Add row',
    empty: 'Nothing here yet.',
    resetWidths: 'Reset widths',
    bulkActionsLabel: 'Bulk actions',
    selected: '{count} selected',
    selectAll: 'Select all',
    details: 'Details',
    selectRow: 'Select row',
    collapseRow: 'Collapse row',
    expandRow: 'Expand row',
    resizeColumn: 'Resize {name}',
  },
  timeline: {
    addLabel: 'Add event',
    errorText: 'That didn’t work — try again.',
  },
  timelineActions: {
    actionsLabel: 'Actions',
    actionLabel: '{action}: {title}',
  },
  timelineConfirm: {
    question: '{action}?',
  },
});
