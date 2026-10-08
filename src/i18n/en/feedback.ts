import { defineDictionary } from '@jankrajewskiit/i18n';

export const feedbackEn = defineDictionary({
  banner: {
    label: 'Announcement',
  },
  bottomSheet: {
    label: 'Sheet',
  },
  confirmDialog: {
    title: 'Are you sure?',
    errorMessage: 'Something went wrong — try again.',
    typeToConfirm: 'Type <code>{text}</code> to confirm',
  },
  countdown: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec',
    remaining: '{summary} remaining',
  },
  errorState: {
    title: 'Something went wrong',
    description: 'We couldn’t load this. Check your connection and try again.',
    retryLabel: 'Try again',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
  },
  loadingOverlay: {
    label: 'Loading…',
  },
  notificationCenter: {
    title: 'Notifications',
    unreadLabel: '{title}, {count} unread',
    newCount: '{count} new',
    markAllRead: 'Mark all read',
    viewAll: 'View all activity',
  },
  notificationList: {
    emptyText: 'You’re all caught up.',
    unread: 'Unread',
  },
  setupChecklist: {
    title: 'Get started',
    progress: '{done} of {total} done',
    stepDone: '(done)',
  },
  statusPage: {
    error: 'Error {code}',
    notFound: {
      tag: 'Not found',
      title: 'Page not found',
      description: 'The page you’re looking for doesn’t exist or has moved.',
    },
    forbidden: {
      tag: 'Access denied',
      title: 'You don’t have access',
      description: 'Ask a workspace admin to invite you, or switch to an account that has access.',
    },
    serverError: {
      tag: 'Server error',
      title: 'Something broke on our side',
      description: 'We’ve been notified and are looking into it. Try again in a moment.',
    },
    offline: {
      title: 'You’re offline',
      description: 'Reconnect to keep working — your changes are saved locally.',
    },
    success: {
      title: 'All done',
      description: 'Everything went through. You can carry on.',
    },
    warning: {
      title: 'Finished with warnings',
      description: 'Some items need your attention before they’re complete.',
    },
    info: {
      title: 'Request submitted',
      description: 'We’ll let you know as soon as it’s been reviewed.',
    },
  },
  tour: {
    done: 'Done',
    missing: 'This part of the page isn’t visible right now.',
  },
});
