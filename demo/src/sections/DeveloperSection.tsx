import { For } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

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
];

const USAGE_SNIPPETS: DocSnippet[] = [
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
];

const DeveloperSection = () => {
  return (
    <div>
      <ShowcaseSection
        title="Developer Setup"
        subtitle="Install package, styles and peer dependencies"
      >
        <PreviewPanel class="col">
          <pre class="installBlock">
            <code>npm install @jankrajewskiit/ui solid-js @solidjs/router</code>
          </pre>
          <pre class="installBlock">
            <code>{`import '@jankrajewskiit/ui/styles';`}</code>
          </pre>
          <ShowcaseMeta>
            Package name: <span class="codeInline">@jankrajewskiit/ui</span>
          </ShowcaseMeta>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Shared Tooling Presets"
        subtitle="Drop-in standards for linting, formatting, tsconfig and Vite"
      >
        <div class="docsGrid">
          <For each={TOOLING_SNIPPETS}>
            {(snippet) => (
              <PreviewPanel class="docsCard">
                <div class="docsCardHeader">
                  <p class="docsCardTitle">{snippet.title}</p>
                  <span class="codeInline">{snippet.file}</span>
                </div>
                <pre class="installBlock">
                  <code>{snippet.code}</code>
                </pre>
              </PreviewPanel>
            )}
          </For>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Usage Snippets"
        subtitle="Examples for extracted components used across multiple projects"
      >
        <div class="docsGrid">
          <For each={USAGE_SNIPPETS}>
            {(snippet) => (
              <PreviewPanel class="docsCard">
                <div class="docsCardHeader">
                  <p class="docsCardTitle">{snippet.title}</p>
                  <span class="codeInline">{snippet.file}</span>
                </div>
                <pre class="installBlock">
                  <code>{snippet.code}</code>
                </pre>
              </PreviewPanel>
            )}
          </For>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Design Principles"
        subtitle="Rules that keep VelvetUi reusable across apps"
      >
        <PreviewPanel class="col">
          <ul class="overviewList">
            <li>
              Components are app-agnostic and avoid business logic coupling.
            </li>
            <li>User-facing text is passed via props by the consuming app.</li>
            <li>Layout components expose slots for flexible composition.</li>
            <li>Every public component supports an optional class prop.</li>
            <li>
              Shared tooling keeps lint, format and tsconfig consistent across
              repositories.
            </li>
          </ul>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default DeveloperSection;
