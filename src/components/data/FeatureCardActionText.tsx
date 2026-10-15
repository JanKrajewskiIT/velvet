import { useTranslate } from '../../i18n/useTranslate';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './FeatureCardActionText.module.css';

export const FeatureCardActionText = () => {
  const translate = useTranslate();
  return (
    <Text as="span" variant="label" tone="inherit" class={styles.root}>
      {translate('velvet.data.featureCard.learnMore')}
      <Glyph name="arrow-right" />
    </Text>
  );
};
