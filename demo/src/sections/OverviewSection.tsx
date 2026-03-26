import { CodeText, Heading, Text, useI18n } from '@jankrajewskiit/ui';
import { createMemo, For } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';
import { renderRichText } from '../i18n/renderRichText';

const OverviewSection = () => {
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey): string => dictionary()[key];
  const stats = createMemo(() => [
    { label: t('demo.text.overview.stats.components'), value: '58+' },
    { label: t('demo.text.overview.stats.categories'), value: '9' },
    { label: t('demo.text.overview.stats.themeModes'), value: '3' },
    { label: t('demo.text.overview.stats.hooks'), value: '3' },
    { label: t('demo.text.overview.stats.toolingPresets'), value: '7' },
  ]);

  return (
    <>
      <ShowcaseSection
        title={t('demo.showcase.overview.whatIs.title')}
        subtitle={t('demo.showcase.overview.whatIs.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.overview.coreIdea.title')}>
            <Text as="p" variant="bodySm" tone="muted" class="mutedText">
              {renderRichText(t('demo.text.overview.coreIdea.message'), {
                packageName: (
                  <CodeText as="span" class="codeInline">
                    @jankrajewskiit/ui
                  </CodeText>
                ),
              })}
            </Text>
          </PreviewGroup>

          <PreviewGroup
            title={t('demo.text.overview.highlights.title')}
            subtitle={t('demo.text.overview.highlights.subtitle')}
          >
            <ul class="overviewList">
              <li>{t('demo.text.overview.highlights.itemPeers')}</li>
              <li>{t('demo.text.overview.highlights.itemThemes')}</li>
              <li>{t('demo.text.overview.highlights.itemStyles')}</li>
              <li>{t('demo.text.overview.highlights.itemCategories')}</li>
            </ul>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.overview.installation.title')}
        subtitle={t('demo.showcase.overview.installation.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.overview.install.title')}>
            <CodeText as="pre" variant="block" size="md" class="installBlock">
              npm install @jankrajewskiit/ui solid-js @solidjs/router
            </CodeText>
          </PreviewGroup>

          <PreviewGroup title={t('demo.text.overview.importStyles.title')}>
            <CodeText as="pre" variant="block" size="md" class="installBlock">
              import '@jankrajewskiit/ui/styles';
            </CodeText>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>{t('demo.text.overview.importStyles.meta')}</ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.overview.libraryStats.title')}
        subtitle={t('demo.showcase.overview.libraryStats.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.overview.packageShape.title')}>
            <div class="pageStats">
              <For each={stats()}>
                {(stat) => (
                  <div class="statPill">
                    <Text as="span" variant="overline" tone="tertiary" class="stat-label">
                      {stat.label}
                    </Text>
                    <Heading as="span" level={4} variant="titleLg" class="stat-value">
                      {stat.value}
                    </Heading>
                  </div>
                )}
              </For>
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>
    </>
  );
};

export default OverviewSection;
