const RELATIVE_BASE = 'https://relative.invalid/';
const NETWORK_SCHEMES: readonly string[] = ['http:', 'https:'];
const MEDIA_SCHEMES: readonly string[] = [...NETWORK_SCHEMES, 'blob:'];
const DATA_MEDIA = /^data:(?:(?:image|audio|video)\/[\w.+-]+|text\/vtt)[;,]/iu;

/** A string the URL parser rejects is not a URL we can vouch for, so it reads as "no scheme" and fails the allow-list. */
const protocolOf = (url: string): string | undefined => {
  try {
    return new URL(url, RELATIVE_BASE).protocol;
  } catch {
    return undefined;
  }
};

/** `src` for img / audio / video / track: relative, http(s), blob, or a data URL of a media type. Anything else (`javascript:` …) is dropped. */
export const safeMediaUrl = (url: string | undefined): string | undefined => {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  const protocol = protocolOf(trimmed);
  if (protocol !== undefined && MEDIA_SCHEMES.includes(protocol)) return trimmed;
  return protocol === 'data:' && DATA_MEDIA.test(trimmed) ? trimmed : undefined;
};

/** `src` for an iframe: relative or http(s) only — no `data:`, `blob:` or script schemes. */
export const safeEmbedUrl = (url: string | undefined): string | undefined => {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  const protocol = protocolOf(trimmed);
  return protocol !== undefined && NETWORK_SCHEMES.includes(protocol) ? trimmed : undefined;
};
