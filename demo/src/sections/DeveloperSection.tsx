import { For } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseSection } from '../components/ShowcaseSection';

interface DocSnippet {
  title: string;
  file: string;
  code: string;
}

const TOOLING_SNIPPETS: DocSnippet[] = [
  {
    title: 'ESLint preset',
    file: 'eslint.config.mjs',
    code: `import { createEslintConfig } from '@jankrajewskiit/ui/eslint-config';

export default createEslintConfig({
  tsconfigRootDir: import.meta.dirname,
});`,
  },
  {
    title: 'Prettier preset',
    file: '.prettierrc',
    code: `"@jankrajewskiit/ui/prettier-config"`,
  },
  {
    title: 'Prettier (JSON)',
    file: '.prettierrc.json',
    code: `{
  "extends": "@jankrajewskiit/ui/prettier-config"
}`,
  },
  {
    title: 'Stylelint preset',
    file: '.stylelintrc.json',
    code: `{
  "extends": "@jankrajewskiit/ui/stylelint-config"
}`,
  },
  {
    title: 'TypeScript app config',
    file: 'tsconfig.app.json',
    code: `{
  "extends": "@jankrajewskiit/ui/tsconfig/app-vite",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "~/*": ["src/*"] }
  },
  "include": ["src"]
}`,
  },
  {
    title: 'TypeScript node config',
    file: 'tsconfig.node.json',
    code: `{
  "extends": "@jankrajewskiit/ui/tsconfig/node-vite",
  "include": ["vite.config.ts"]
}`,
  },
  {
    title: 'Vite config preset',
    file: 'vite.config.ts',
    code: `import { defineConfig } from 'vite';
import { createSolidAppViteConfig } from '@jankrajewskiit/ui/vite-config';

export default defineConfig(
  createSolidAppViteConfig({
    server: { port: 5173 },
    preview: { port: 5173 },
  })
);`,
  },
  {
    title: 'lint-staged preset',
    file: '.lintstagedrc.mjs',
    code: `import { createLintStagedConfig } from '@jankrajewskiit/ui/lint-staged-config';

export default createLintStagedConfig();`,
  },
  {
    title: 'Husky pre-commit',
    file: '.husky/pre-commit',
    code: `. "$(dirname -- "$0")/../node_modules/@jankrajewskiit/ui/config/husky-pre-commit.sh"`,
  },
  {
    title: 'package.json scripts',
    file: 'package.json',
    code: `"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "lint:css": "stylelint \\"src/**/*.css\\"",
  "lint:css:fix": "stylelint \\"src/**/*.css\\" --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc -b",
  "prepare": "husky"
}`,
  },
];

const USAGE_SNIPPETS: DocSnippet[] = [
  {
    title: 'useClickOutside',
    file: 'hooks/useClickOutside.ts',
    code: `import { useClickOutside } from '@jankrajewskiit/ui';

const [ref, setRef] = createSignal<HTMLElement | null>(null);
useClickOutside(ref, () => closeMenu());`,
  },
  {
    title: 'useEscapeKey',
    file: 'hooks/useEscapeKey.ts',
    code: `import { useEscapeKey } from '@jankrajewskiit/ui';

useEscapeKey(() => closeModal());`,
  },
  {
    title: 'useFocusTrap',
    file: 'hooks/useFocusTrap.ts',
    code: `import { useFocusTrap } from '@jankrajewskiit/ui';

const [container, setContainer] = createSignal<HTMLElement | null>(null);
useFocusTrap(container, { enabled: () => dialogOpen() });`,
  },
  {
    title: 'ConfirmAction',
    file: 'features/DeleteAction.tsx',
    code: `import { ConfirmAction, Button } from '@jankrajewskiit/ui';

<ConfirmAction
  title="Delete item"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm={removeItem}
>
  {({ openConfirm }) => (
    <Button variant="danger" onClick={openConfirm}>
      Delete
    </Button>
  )}
</ConfirmAction>;`,
  },
  {
    title: 'EditableCollection',
    file: 'features/TeamMembersForm.tsx',
    code: `import { EditableCollection, Input, IconButton } from '@jankrajewskiit/ui';

<EditableCollection
  items={members()}
  getId={(item) => item.id}
  onAdd={addMember}
  onRemove={removeMember}
  addLabel="Add member"
  confirmTitle="Remove member"
  confirmMessage="Do you want to remove this member?"
  confirmLabel="Remove"
  cancelLabel="Cancel"
  renderItem={(item, { requestRemove }) => (
    <>
      <Input value={item.name} onInput={(e) => rename(item.id, e.currentTarget.value)} />
      <IconButton title="Remove" icon={<TrashIcon />} onClick={requestRemove} />
    </>
  )}
/>;`,
  },
  {
    title: 'RequireAuth',
    file: 'routing/ProtectedRoute.tsx',
    code: `import { RequireAuth } from '@jankrajewskiit/ui';

<RequireAuth
  isLoading={auth.isLoading()}
  isAuthenticated={auth.isAuthenticated()}
  roles={['admin', 'editor']}
  hasAnyRole={auth.hasAnyRole}
  onUnauthenticated={() => auth.signIn(window.location.pathname)}
>
  <AdminPage />
</RequireAuth>;`,
  },
  {
    title: 'AuthRedirect',
    file: 'routing/RedirectAfterAuth.tsx',
    code: `import { AuthRedirect } from '@jankrajewskiit/ui';

<AuthRedirect
  onRedirect={() => {
    navigate('/dashboard', { replace: true });
  }}
  fallback={<Spinner label="Redirecting..." />}
/>`,
  },
];

const DeveloperSection = () => {
  return (
    <div>
      <ShowcaseSection title="Component Categories" subtitle="9 categories organized by purpose">
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <ul class="overview-list">
              <li>
                <strong>inputs/</strong> (11) - Button, IconButton, Checkbox, Input, Radio, Switch, Autocomplete,
                ColorPicker, TagInput, DropdownButton, DropdownMenu
              </li>
              <li>
                <strong>forms/</strong> (4) - FormField, FormGrid, FormLayout, ActionRow (shown under Inputs in this
                demo)
              </li>
              <li>
                <strong>data-display/</strong> (6) - Table, Accordion, MarkdownRenderer, ScoreRing, RadarChart,
                SectionCard
              </li>
              <li>
                <strong>navigation/</strong> (4) - Tabs, Stepper, Pagination, Timeline
              </li>
              <li>
                <strong>feedback/</strong> (11) - Toast, Spinner, Skeleton, LoadingContainer, ErrorMessage, EmptyState,
                ErrorFallback, AccessDenied, Chip, TagChip, StatCard
              </li>
              <li>
                <strong>overlays/</strong> (8) - Dialog, Drawer, Tooltip, ConfirmDialog, ConfirmAction, ContextMenu,
                Lightbox, Tour
              </li>
              <li>
                <strong>layout/</strong> (3) - MainLayout, Navbar, Footer
              </li>
              <li>
                <strong>composites/</strong> (6) - DataTable, EditableCollection, FileDropZone, FlipCard, Wizard,
                AiResultPanel
              </li>
              <li>
                <strong>app/</strong> (4) - LocaleSwitcher, ThemeToggle, AuthRedirect, RequireAuth (shown under Inputs ·
                Buttons and Developer snippets)
              </li>
            </ul>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Shared Tooling Presets"
        subtitle="Drop-in standards for linting, formatting, tsconfig and Vite"
      >
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <div class="docs-grid">
              <For each={TOOLING_SNIPPETS}>
                {(snippet) => (
                  <div class="docs-card">
                    <div class="docs-card-header">
                      <p class="docs-card-title">{snippet.title}</p>
                      <span class="code-inline">{snippet.file}</span>
                    </div>
                    <pre class="install-block">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                )}
              </For>
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Usage Snippets"
        subtitle="Hooks (useClickOutside, useEscapeKey, useFocusTrap) and component patterns"
      >
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <div class="docs-grid">
              <For each={USAGE_SNIPPETS}>
                {(snippet) => (
                  <div class="docs-card">
                    <div class="docs-card-header">
                      <p class="docs-card-title">{snippet.title}</p>
                      <span class="code-inline">{snippet.file}</span>
                    </div>
                    <pre class="install-block">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                )}
              </For>
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Design Principles" subtitle="Rules that keep VelvetUi reusable across apps">
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <ul class="overview-list">
              <li>Components are app-agnostic and avoid business logic coupling.</li>
              <li>User-facing text is passed via props by the consuming app.</li>
              <li>Layout components expose slots for flexible composition.</li>
              <li>Every public component supports an optional class prop.</li>
              <li>Shared tooling keeps lint, format and tsconfig consistent across repositories.</li>
            </ul>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default DeveloperSection;
