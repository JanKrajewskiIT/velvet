import { Skeleton, Text } from '@jankrajewskiit/ui';

import { useDemoDictionary } from '../hooks/useDemoDictionary';

const DemoSectionFallback = () => {
  const { t } = useDemoDictionary();

  return (
    <div class="demoSectionFallback">
      <Text as="p" variant="bodySm" tone="muted">
        {t('demo.text.common.loadingSection')}
      </Text>
      <Skeleton variant="text" width="90%" height={18} />
      <Skeleton variant="text" width="72%" height={14} />
      <Skeleton variant="rectangular" height={200} animation="pulse" />
    </div>
  );
};

export default DemoSectionFallback;
