import { DEMO_LAST_SECTION_STORAGE_KEY, isValidSectionId, type SectionId } from './demoNavConfig';

/** Prefers `?section=`; otherwise last stored section; default `overview`. */
export const readInitialDemoSection = (): SectionId => {
  if (typeof window === 'undefined') return 'overview';
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('section');
    if (fromUrl && isValidSectionId(fromUrl)) return fromUrl;
    const stored = sessionStorage.getItem(DEMO_LAST_SECTION_STORAGE_KEY);
    if (stored && isValidSectionId(stored)) return stored;
  } catch {
    // private mode or blocked storage
  }
  return 'overview';
};
