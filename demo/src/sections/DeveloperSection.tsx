import { Card, CodeText, Heading, useI18n } from '@jankrajewskiit/ui';
import { createMemo, For } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';

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

const createUsageSnippets = (t: (key: DemoI18nMessageKey) => string): DocSnippet[] => [
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
  title="${t('demo.text.overlays.confirmDialog.deleteItem')}"
  message="${t('demo.text.overlays.confirmDialog.deleteItemMessage')}"
  confirmLabel="${t('demo.text.overlays.confirmDialog.delete')}"
  variant="danger"
  onConfirm={removeItem}
>
  {({ openConfirm }) => (
    <Button variant="danger" onClick={openConfirm}>
      ${t('demo.text.overlays.confirmDialog.delete')}
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
  renderItem={(item, { requestRemove }) => (
    <>
      <Input value={item.name} onInput={(e) => rename(item.id, e.currentTarget.value)} />
      <IconButton label="${t('demo.text.composites.editableCollection.remove')}" icon={<TrashIcon />} onClick={requestRemove} />
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
  fallback={<Spinner label="${t('demo.text.developer.snippets.redirecting')}" />}
/>`,
  },
];

const DeveloperSection = () => {
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey): string => dictionary()[key];
  const usageSnippets = createMemo(() => createUsageSnippets(t));

  return (
    <div>
      <ShowcaseSection
        title={t('demo.showcase.developer.componentCategories.title')}
        subtitle={t('demo.showcase.developer.componentCategories.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <ul class="overviewList">
              <li>{t('demo.text.developer.categories.inputs')}</li>
              <li>{t('demo.text.developer.categories.forms')}</li>
              <li>{t('demo.text.developer.categories.dataDisplay')}</li>
              <li>{t('demo.text.developer.categories.navigation')}</li>
              <li>{t('demo.text.developer.categories.feedback')}</li>
              <li>{t('demo.text.developer.categories.overlays')}</li>
              <li>{t('demo.text.developer.categories.layout')}</li>
              <li>{t('demo.text.developer.categories.composites')}</li>
              <li>{t('demo.text.developer.categories.app')}</li>
            </ul>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.developer.sharedToolingPresets.title')}
        subtitle={t('demo.showcase.developer.sharedToolingPresets.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <div class="docsGrid">
              <For each={TOOLING_SNIPPETS}>
                {(snippet) => (
                  <Card class="docsCard">
                    <div class="docsCardHeader">
                      <Heading as="p" level={4} variant="titleMd" class="docsCardTitle">
                        {snippet.title}
                      </Heading>
                      <CodeText as="span" class="codeInline">
                        {snippet.file}
                      </CodeText>
                    </div>
                    <CodeText as="pre" variant="block" size="md" class="installBlock">
                      {snippet.code}
                    </CodeText>
                  </Card>
                )}
              </For>
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.developer.usageSnippets.title')}
        subtitle={t('demo.showcase.developer.usageSnippets.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <div class="docsGrid">
              <For each={usageSnippets()}>
                {(snippet) => (
                  <Card class="docsCard">
                    <div class="docsCardHeader">
                      <Heading as="p" level={4} variant="titleMd" class="docsCardTitle">
                        {snippet.title}
                      </Heading>
                      <CodeText as="span" class="codeInline">
                        {snippet.file}
                      </CodeText>
                    </div>
                    <CodeText as="pre" variant="block" size="md" class="installBlock">
                      {snippet.code}
                    </CodeText>
                  </Card>
                )}
              </For>
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.developer.designPrinciples.title')}
        subtitle={t('demo.showcase.developer.designPrinciples.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <ul class="overviewList">
              <li>{t('demo.text.developer.principles.appAgnostic')}</li>
              <li>{t('demo.text.developer.principles.userFacingText')}</li>
              <li>{t('demo.text.developer.principles.layoutSlots')}</li>
              <li>{t('demo.text.developer.principles.classProp')}</li>
              <li>{t('demo.text.developer.principles.sharedTooling')}</li>
            </ul>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default DeveloperSection;
