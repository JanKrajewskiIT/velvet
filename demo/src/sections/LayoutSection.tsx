import { Button, Footer, MainLayout, Navbar, type NavItem, ThemeToggle } from '@jankrajewskiit/ui';
import { Route, Router } from '@solidjs/router';
import { FaSolidQuestion } from 'solid-icons/fa';
import { IoCalendar, IoHome, IoPersonCircle, IoSettings } from 'solid-icons/io';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const DEMO_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: IoHome },
  { label: 'Questions', href: '/questions', icon: FaSolidQuestion },
  { label: 'Organizer', href: '/organizer', icon: IoCalendar },
  { label: 'Portfolio', href: '/portfolio', icon: IoPersonCircle },
  { label: 'Settings', href: '/settings', icon: IoSettings },
];

const LayoutSection = () => {
  const year = new Date().getFullYear();

  return (
    <div>
      <ShowcaseSection title="App Shell" subtitle="Navbar, MainLayout and Footer composition">
        <PreviewPanel class="layoutPreviewPanel">
          <Router>
            <Route
              path="/*"
              component={() => (
                <div class="layoutPreviewShell">
                  <MainLayout
                    navbar={
                      <Navbar
                        navItems={DEMO_NAV_ITEMS}
                        toggleMenuLabel="Toggle navigation"
                        navLabel="Main navigation"
                        logo={<strong class="layoutLogo">MyApp</strong>}
                        actions={<Button variant="ghost">Upgrade</Button>}
                      />
                    }
                    footer={
                      <Footer
                        copyrightText={`(c) ${String(year)} MyApp`}
                        privacyLabel="Privacy"
                        privacyHref="/privacy"
                        builtWithText="Built with VelvetUi"
                      />
                    }
                  >
                    <div class="recronHero">
                      <h3 class="recronTitle">Dashboard</h3>
                      <p class="mutedText">Example shell composition: top nav, central workspace and footer.</p>
                    </div>
                  </MainLayout>
                </div>
              )}
            />
          </Router>
        </PreviewPanel>

        <ShowcaseMeta>
          Layout components use slots: <span class="codeInline">navbar</span> and <span class="codeInline">footer</span>{' '}
          in <span class="codeInline">MainLayout</span>.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="ThemeToggle" subtitle="Light and dark mode switch">
        <PreviewPanel>
          <div class="row">
            <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" />
          </div>
        </PreviewPanel>
        <ShowcaseMeta>
          Wraps <span class="codeInline">useTheme()</span> from ThemeProvider. Supports light, dark and system modes.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Layout Composition Snippet" subtitle="Template for app structure">
        <PreviewPanel>
          <pre class="installBlock">
            <code>{`<MainLayout
  navbar={<Navbar navItems={navItems} toggleMenuLabel="Toggle menu" />}
  footer={
    <Footer
      copyrightText="(c) 2026 MyApp"
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

export default LayoutSection;
