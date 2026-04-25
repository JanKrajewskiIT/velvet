import type { DemoI18nMessageKey } from '../../i18n/messages';

export const createDataDisplayMarkdown = (
  t: (key: DemoI18nMessageKey, params?: Record<string, string | number>) => string,
  buttonLabel: string,
) => `
## VelvetUI

${t('demo.text.dataDisplay.markdown.description')}

- ${t('demo.text.dataDisplay.markdown.bulletTheming')}
- ${t('demo.text.dataDisplay.markdown.bulletStrictMode')}
- ${t('demo.text.dataDisplay.markdown.bulletThemeSupport')}

\`\`\`tsx
import { Button } from '@jankrajewskiit/ui';
<Button variant="primary">${buttonLabel}</Button>
\`\`\`
`;
