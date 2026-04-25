import { Button, Card, Heading, Text } from '@jankrajewskiit/ui';
import { For } from 'solid-js';

import type { DemoI18nMessageKey } from '../i18n/messages';
import type { SectionId } from '../nav/demoNavConfig';

export interface DemoQuickJumpItem {
  id: SectionId;
  label: string;
}

interface DemoPageHeaderProps {
  t: (key: DemoI18nMessageKey, params?: Record<string, string | number>) => string;
  titleKey: DemoI18nMessageKey;
  descriptionKey: DemoI18nMessageKey;
  activeGroupLabel: string;
  navGroupCount: number;
  sectionPageCount: number;
  quickJumpSections: DemoQuickJumpItem[];
  activeSection: SectionId;
  onSelectSection: (id: SectionId) => void;
  onClearRememberedSection: () => void;
}

const DemoPageHeader = (props: DemoPageHeaderProps) => {
  return (
    <Card class="pageHeader">
      <div class="pageHeaderIntro">
        <Text as="p" variant="overline" tone="primary" class="pageEyebrow">
          {props.t('demo.page.eyebrow')}
        </Text>
        <Heading level={1} variant="displayMd" class="pageTitle">
          {props.t(props.titleKey)}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted" class="pageDescription">
          {props.t(props.descriptionKey)}
        </Text>
        <div class="pageStats">
          <div class="statPill">
            <Text as="span" variant="overline" tone="tertiary">
              {props.t('demo.page.header.currentTrack')}
            </Text>
            <Heading as="span" level={4} variant="titleLg">
              {props.activeGroupLabel}
            </Heading>
          </div>
          <div class="statPill">
            <Text as="span" variant="overline" tone="tertiary">
              {props.t('demo.page.header.groups')}
            </Text>
            <Heading as="span" level={4} variant="titleLg">
              {props.navGroupCount}
            </Heading>
          </div>
          <div class="statPill">
            <Text as="span" variant="overline" tone="tertiary">
              {props.t('demo.page.header.pages')}
            </Text>
            <Heading as="span" level={4} variant="titleLg">
              {props.sectionPageCount}
            </Heading>
          </div>
        </div>
      </div>
      <div class="pageHeaderActions">
        <div class="pageHeaderActionsCopy">
          <Text as="p" variant="labelMd" tone="secondary">
            {props.t('demo.page.header.quickJump')}
          </Text>
          <Text as="p" variant="bodySm" tone="muted">
            {props.t('demo.page.header.demoPurpose')}
          </Text>
        </div>
        <div class="pageHeaderActionGrid">
          <For each={props.quickJumpSections}>
            {(section) => (
              <Button
                type="button"
                variant={props.activeSection === section.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => props.onSelectSection(section.id)}
              >
                {section.label}
              </Button>
            )}
          </For>
        </div>
        <div class="pageHeaderRemember">
          <Button type="button" variant="subtle" size="sm" onClick={() => props.onClearRememberedSection()}>
            {props.t('demo.page.clearRememberedSection')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DemoPageHeader;
