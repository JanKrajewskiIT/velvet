import {
  addToast,
  I18nProvider,
  LocaleSwitcher,
  SidebarNav,
  type SidebarNavGroup,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
} from '@jankrajewskiit/ui';
import { useSearchParams } from '@solidjs/router';
import { createEffect, createMemo, createSignal } from 'solid-js';

import DemoPageHeader from './components/DemoPageHeader';
import DemoSectionSwitch from './components/DemoSectionSwitch';
import { useDemoDictionary } from './hooks/useDemoDictionary';
import {
  DEMO_LAST_SECTION_STORAGE_KEY,
  DEMO_NAV_GROUP_COUNT,
  DEMO_SECTION_PAGE_COUNT,
  HEADER_SECTION_IDS,
  isValidSectionId,
  NAV_GROUPS,
  OVERVIEW_TRACKS,
  PAGE_META_KEYS,
  type SectionId,
} from './nav/demoNavConfig';
import { readInitialDemoSection } from './nav/readInitialDemoSection';

export type { SectionId } from './nav/demoNavConfig';

const AppContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useDemoDictionary();
  const [activeSection, setActiveSection] = createSignal<SectionId>(readInitialDemoSection());

  createEffect(() => {
    const raw = searchParams.section;
    const s = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
    if (s && isValidSectionId(s) && s !== activeSection()) {
      setActiveSection(s);
    }
  });

  createEffect(() => {
    const id = activeSection();
    const raw = searchParams.section;
    const cur = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
    if (cur !== id) {
      setSearchParams({ section: id }, { replace: true });
    }
  });

  createEffect(() => {
    const id = activeSection();
    try {
      sessionStorage.setItem(DEMO_LAST_SECTION_STORAGE_KEY, id);
    } catch {
      // private mode
    }
  });

  const meta = () => PAGE_META_KEYS[activeSection()];
  const activeGroupLabel = createMemo(() => {
    const group = NAV_GROUPS.find((entry) => entry.items.some((item) => item.id === activeSection()));
    return t(group?.labelKey ?? 'demo.nav.start');
  });
  const navGroups = createMemo((): SidebarNavGroup[] => {
    return NAV_GROUPS.map((group) => ({
      label: t(group.labelKey),
      items: group.items.map((item) => ({
        id: item.id,
        label: t(item.labelKey),
      })),
    }));
  });
  const quickJumpSections = createMemo(() =>
    HEADER_SECTION_IDS.map((id) => ({
      id,
      label: t(PAGE_META_KEYS[id].titleKey),
    })),
  );
  const overviewTracks = createMemo(() =>
    OVERVIEW_TRACKS.map((item) => ({
      id: item.id,
      label: t(item.groupKey),
      description: t(PAGE_META_KEYS[item.id].descriptionKey),
      count: NAV_GROUPS.find((group) => group.labelKey === item.groupKey)?.items.length ?? 0,
    })),
  );
  const featuredSections = createMemo(() =>
    HEADER_SECTION_IDS.map((id) => {
      const group = NAV_GROUPS.find((entry) => entry.items.some((item) => item.id === id));
      return {
        id,
        label: t(PAGE_META_KEYS[id].titleKey),
        description: t(PAGE_META_KEYS[id].descriptionKey),
        eyebrow: t(group?.labelKey ?? 'demo.nav.start'),
      };
    }),
  );

  const clearRememberedSection = () => {
    try {
      sessionStorage.removeItem(DEMO_LAST_SECTION_STORAGE_KEY);
    } catch {
      // private mode
    }
    addToast({ type: 'info', message: t('demo.page.clearRememberedSection.toast') });
  };

  return (
    <div class="layout">
      <SidebarNav
        groups={navGroups()}
        activeId={activeSection()}
        onSelect={(id) => setActiveSection(id as SectionId)}
        label={t('demo.sidebar.title')}
        subtitle={t('demo.sidebar.subtitle')}
        actions={
          <>
            <LocaleSwitcher variant="ghost" />
            <ThemeToggle variant="light" />
          </>
        }
      />

      <main class="main">
        <DemoPageHeader
          t={t}
          titleKey={meta().titleKey}
          descriptionKey={meta().descriptionKey}
          activeGroupLabel={activeGroupLabel()}
          navGroupCount={DEMO_NAV_GROUP_COUNT}
          sectionPageCount={DEMO_SECTION_PAGE_COUNT}
          quickJumpSections={quickJumpSections()}
          activeSection={activeSection()}
          onSelectSection={setActiveSection}
          onClearRememberedSection={clearRememberedSection}
        />

        <DemoSectionSwitch
          activeSection={activeSection()}
          onNavigate={setActiveSection}
          overviewTracks={overviewTracks()}
          featuredSections={featuredSections()}
        />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <I18nProvider storageKey="velvet-demo-library-locale">
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </I18nProvider>
  );
};

const InnerApp = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
