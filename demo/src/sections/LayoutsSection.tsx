import {
  Button,
  Footer,
  MainLayout,
  Navbar,
  type NavItem,
  SectionCard,
  StatCard,
} from '@jankrajewskiit/ui';
import { FaSolidQuestion } from 'solid-icons/fa';
import { IoCalendar, IoHome, IoPersonCircle, IoSettings } from 'solid-icons/io';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

const RECRON_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: IoHome },
  { label: 'Questions', href: '/questions', icon: FaSolidQuestion },
  { label: 'Organizer', href: '/organizer', icon: IoCalendar },
  { label: 'Portfolio', href: '/portfolio', icon: IoPersonCircle },
  { label: 'Settings', href: '/settings', icon: IoSettings },
];

const LayoutsSection = () => {
  const year = new Date().getFullYear();

  return (
    <div>
      <ShowcaseSection
        title="Layouts"
        subtitle="Recron-inspired app shell using Navbar, MainLayout and Footer"
      >
        <PreviewPanel class="layoutPreviewPanel">
          <div class="layoutPreviewShell">
            <MainLayout
              navbar={
                <Navbar
                  navItems={RECRON_NAV_ITEMS}
                  toggleMenuLabel="Toggle navigation"
                  navLabel="Main navigation"
                  logo={<strong class="layoutLogo">Recron</strong>}
                  actions={<Button variant="ghost">Upgrade</Button>}
                />
              }
              footer={
                <Footer
                  copyrightText={`(c) ${String(year)} Recron`}
                  privacyLabel="Privacy"
                  privacyHref="/privacy"
                  builtWithText="Built with VelvetUi"
                />
              }
            >
              <div class="recronHero">
                <h3 class="recronTitle">Recruitment dashboard</h3>
                <p class="mutedText">
                  Example shell composition matching Recron structure: top nav,
                  central workspace and footer.
                </p>
              </div>

              <div class="recronStatGrid">
                <StatCard value="24" label="Open offers" colorClass="info" />
                <StatCard
                  value="7"
                  label="Interviews this week"
                  colorClass="warning"
                />
                <StatCard
                  value="81%"
                  label="Portfolio completion"
                  colorClass="success"
                />
              </div>

              <SectionCard title="Current focus" defaultOpen>
                <ul class="overviewList">
                  <li>Prioritize interviews with upcoming deadlines</li>
                  <li>Sync organizer changes with calendar events</li>
                  <li>Update portfolio summary before next application</li>
                </ul>
              </SectionCard>
            </MainLayout>
          </div>
        </PreviewPanel>

        <ShowcaseMeta>
          Layout components use slots: <span class="codeInline">navbar</span>{' '}
          and <span class="codeInline">footer</span> in{' '}
          <span class="codeInline">MainLayout</span>.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection
        title="Layout Composition Snippet"
        subtitle="Template for Recron-like app structure"
      >
        <PreviewPanel>
          <pre class="installBlock">
            <code>{`<MainLayout
  navbar={<Navbar navItems={navItems} toggleMenuLabel="Toggle menu" />}
  footer={
    <Footer
      copyrightText="(c) 2026 Recron"
      privacyLabel="Privacy"
      privacyHref="/privacy"
      builtWithText="Built with VelvetUi"
    />
  }
>
  <Dashboard />
</MainLayout>`}</code>
          </pre>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default LayoutsSection;
