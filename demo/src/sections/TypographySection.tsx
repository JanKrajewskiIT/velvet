import { CodeText, Heading, LabelText, Text } from '@jankrajewskiit/ui';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { useDemoDictionary } from '../hooks/useDemoDictionary';
import { renderRichText } from '../i18n/renderRichText';

const TypographySection = () => {
  const { t } = useDemoDictionary();
  const blockCodeTitle = () => t('demo.text.typography.blockCode.sectionTitle');
  const blockCodeHelperText = () => t('demo.text.typography.blockCode.helperText');

  return (
    <div>
      <ShowcaseSection
        title={t('demo.showcase.typography.headingVariants.title')}
        subtitle={t('demo.showcase.typography.headingVariants.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.typography.scale.title')}>
            <Heading variant="displayLg">{t('demo.text.typography.scale.displayLarge')}</Heading>
            <Heading variant="displayMd">{t('demo.text.typography.scale.displayMedium')}</Heading>
            <Heading level={1} variant="h1">
              {t('demo.text.typography.scale.h1')}
            </Heading>
            <Heading level={2} variant="h2">
              {t('demo.text.typography.scale.h2')}
            </Heading>
            <Heading level={3} variant="h3">
              {t('demo.text.typography.scale.h3')}
            </Heading>
            <Heading level={4} variant="titleLg">
              {t('demo.text.typography.scale.titleLarge')}
            </Heading>
            <Heading level={5} variant="titleMd">
              {t('demo.text.typography.scale.titleMedium')}
            </Heading>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.typography.textVariants.title')}
        subtitle={t('demo.showcase.typography.textVariants.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.typography.roles.title')}>
            <Text variant="bodyLg">{t('demo.text.typography.roles.bodyLarge')}</Text>
            <Text variant="bodyMd">{t('demo.text.typography.roles.bodyMedium')}</Text>
            <Text variant="bodySm">{t('demo.text.typography.roles.bodySmall')}</Text>
            <Text variant="labelLg">{t('demo.text.typography.roles.labelLarge')}</Text>
            <Text variant="labelMd">{t('demo.text.typography.roles.labelMedium')}</Text>
            <Text variant="caption">{t('demo.text.typography.roles.caption')}</Text>
            <Text variant="overline">{t('demo.text.typography.roles.overline')}</Text>
          </PreviewGroup>
          <PreviewGroup title={t('demo.text.typography.tones.title')}>
            <Text tone="default">{t('demo.text.typography.tones.default')}</Text>
            <Text tone="secondary">{t('demo.text.typography.tones.secondary')}</Text>
            <Text tone="muted">{t('demo.text.typography.tones.muted')}</Text>
            <Text tone="tertiary">{t('demo.text.typography.tones.tertiary')}</Text>
            <Text tone="primary">{t('demo.text.typography.tones.primary')}</Text>
          </PreviewGroup>
          <PreviewGroup title="LabelText">
            <LabelText label={t('demo.text.typography.roles.labelLarge')} />
            <LabelText
              label={t('demo.text.typography.scale.titleMedium')}
              description={t('demo.text.typography.tones.muted')}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.typography.codeTextVariants.title')}
        subtitle={t('demo.showcase.typography.codeTextVariants.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.typography.inlineCode.title')}>
            <Text>
              {renderRichText(t('demo.text.typography.inlineCode.message'), {
                textCode: (
                  <CodeText as="span" class="codeInline">
                    &lt;Text variant="bodySm" /&gt;
                  </CodeText>
                ),
                headingCode: (
                  <CodeText as="span" class="codeInline">
                    &lt;Heading variant="h2" /&gt;
                  </CodeText>
                ),
              })}
            </Text>
          </PreviewGroup>
          <PreviewGroup title={t('demo.text.typography.blockCode.title')}>
            <CodeText as="pre" variant="block" size="md" class="installBlock">
              {`import { Heading, Text, CodeText } from '@jankrajewskiit/ui';

<Heading variant="h2">${blockCodeTitle()}</Heading>
<Text variant="bodySm" tone="muted">${blockCodeHelperText()}</Text>`}
            </CodeText>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>{t('demo.text.typography.meta')}</ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default TypographySection;
