import { Button, Heading, IndexedContentCard, Text, useI18n } from '@jankrajewskiit/ui';
import { createMemo } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';

const RecronExtractsSection = () => {
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey): string => dictionary()[key];

  return (
    <div>
      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.identity.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.identity.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.identity.description')}
        </Text>
      </div>

      <div class="demoSubsectionIntro">
        <Text as="p" variant="overline" tone="primary">
          {t('demo.recron.lane.knowledge.eyebrow')}
        </Text>
        <Heading level={2} variant="titleLg">
          {t('demo.recron.lane.knowledge.title')}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {t('demo.recron.lane.knowledge.description')}
        </Text>
      </div>

      <ShowcaseSection title="IndexedContentCard" subtitle={t('demo.recron.showcase.indexedContentCard.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title="Example">
            <div class="recronDemoWide recronDemoSurface">
              <IndexedContentCard
                index={0}
                label={t('demo.recron.knowledge.indexedCard.label')}
                summary={t('demo.recron.knowledge.indexedCard.summary')}
                tone="warning"
                animationOrder={1}
                actions={<Button size="sm" variant="ghost" label={t('demo.recron.knowledge.indexedCard.action')} />}
                detail={<Text as="p">{t('demo.recron.knowledge.indexedCard.detail')}</Text>}
              />
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default RecronExtractsSection;
