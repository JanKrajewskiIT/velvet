import { AuthRedirect, Button, FormField, LocaleSwitcher, RequireAuth, Select } from '@jankrajewskiit/ui';
import { createSignal, Show } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

type DemoRole = 'viewer' | 'editor' | 'admin';

const AppSection = () => {
  const [locale, setLocale] = createSignal<'EN' | 'PL'>('EN');
  const [redirectLog, setRedirectLog] = createSignal('No redirects yet.');
  const [redirectRun, setRedirectRun] = createSignal(0);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(true);
  const [role, setRole] = createSignal<DemoRole>('viewer');

  const triggerRedirect = () => {
    setRedirectRun((current) => current + 1);
  };

  return (
    <div>
      <ShowcaseSection title="LocaleSwitcher" subtitle="Language toggle button">
        <PreviewPanel>
          <div class="row">
            <LocaleSwitcher
              label={locale()}
              switchLabel="Switch locale"
              onSwitch={() => setLocale((current) => (current === 'EN' ? 'PL' : 'EN'))}
            />
            <ShowcaseMeta>
              Current locale: <span class="codeInline">{locale()}</span>
            </ShowcaseMeta>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="RequireAuth" subtitle="Authorization gate with role-based access">
        <PreviewPanel class="col">
          <div class="row">
            <Button
              variant={isAuthenticated() ? 'ghost' : 'primary'}
              onClick={() => setIsAuthenticated((current) => !current)}
            >
              {isAuthenticated() ? 'Set unauthenticated' : 'Set authenticated'}
            </Button>
            <Button variant={isLoading() ? 'primary' : 'ghost'} onClick={() => setIsLoading((current) => !current)}>
              {isLoading() ? 'Loading: ON' : 'Loading: OFF'}
            </Button>
            <FormField label="Role" id="demo-role-select">
              <Select id="demo-role-select" value={role()} onChange={(e) => setRole(e.currentTarget.value as DemoRole)}>
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </Select>
            </FormField>
          </div>

          <RequireAuth
            isLoading={isLoading()}
            isAuthenticated={isAuthenticated()}
            roles={['admin']}
            hasAnyRole={(...roles) => roles.includes(role())}
            accessDeniedTitle="Admin area"
            accessDeniedDescription="Only users with role admin can see this content."
            accessDeniedGoHomeLabel="Back"
            unauthenticatedFallback={
              <div class="docsCallout">
                User is unauthenticated. In a real app provide redirect logic in AuthRedirect or onUnauthenticated
                callback.
              </div>
            }
          >
            <div class="docsCallout docsCalloutSuccess">
              Protected content visible for <strong>{role()}</strong> role.
            </div>
          </RequireAuth>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="AuthRedirect" subtitle="Redirect side-effect on mount">
        <PreviewPanel class="col">
          <div class="row">
            <Button variant="ghost" onClick={triggerRedirect}>
              Trigger AuthRedirect demo
            </Button>
            <span class="statusChip">{redirectLog()}</span>
          </div>

          <Show when={redirectRun()} keyed>
            {(runId) => (
              <AuthRedirect
                onRedirect={() => {
                  setRedirectLog(`AuthRedirect onMount #${String(runId)} at ${new Date().toLocaleTimeString()}`);
                }}
                fallback={<p class="mutedText">Running redirect side-effect #{String(runId)}...</p>}
              />
            )}
          </Show>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default AppSection;
