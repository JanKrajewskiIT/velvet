const KIB = 1024;
const MIB = KIB * 1024;
const SINGLE_DECIMAL_BELOW = 10 * KIB;

/** `512` → "512 B", `1536` → "1.5 KB", `5242880` → "5.0 MB". */
export const formatBytes = (bytes: number): string => {
  if (bytes < KIB) return `${bytes} B`;
  if (bytes < MIB) return `${(bytes / KIB).toFixed(bytes < SINGLE_DECIMAL_BELOW ? 1 : 0)} KB`;
  return `${(bytes / MIB).toFixed(1)} MB`;
};
