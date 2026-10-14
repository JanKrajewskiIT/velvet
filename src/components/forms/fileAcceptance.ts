export type UploadRejectionReason = 'type' | 'size' | 'count';

export interface RejectedFile {
  file: File;
  reason: UploadRejectionReason;
}

export interface FileAcceptanceOptions {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

export const partitionFiles = (
  files: readonly File[],
  options: FileAcceptanceOptions,
  currentCount: number,
): { accepted: File[]; rejected: RejectedFile[] } => {
  const tokens = (options.accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (options.maxSize !== undefined && (!Number.isFinite(options.maxSize) || options.maxSize < 0))
    throw new RangeError('maxSize must be finite and non-negative.');
  if (options.maxFiles !== undefined && (!Number.isSafeInteger(options.maxFiles) || options.maxFiles < 0))
    throw new RangeError('maxFiles must be a non-negative integer.');
  const remaining = options.maxFiles === undefined ? Infinity : Math.max(0, options.maxFiles - currentCount);
  const capacity = Math.min(remaining, options.multiple === false ? 1 : Infinity);
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];
  for (const file of files) {
    const type = file.type.toLowerCase();
    const matches =
      !tokens.length ||
      tokens.some((token) =>
        token.startsWith('.')
          ? file.name.toLowerCase().endsWith(token)
          : token.endsWith('/*')
            ? type.startsWith(token.slice(0, -1))
            : type === token,
      );
    const reason = !matches
      ? 'type'
      : options.maxSize !== undefined && file.size > options.maxSize
        ? 'size'
        : accepted.length >= capacity
          ? 'count'
          : undefined;
    if (reason) rejected.push({ file, reason });
    else accepted.push(file);
  }
  return { accepted, rejected };
};
