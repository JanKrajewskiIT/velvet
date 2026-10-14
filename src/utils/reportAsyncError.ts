/** Reports unexpected failures after an operation's own visible error handling. Never exposes its payload. */
export const reportAsyncError = (_error: unknown): void => {
  console.error('An asynchronous Velvet UI operation failed.');
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('velvet:async-error'));
};
