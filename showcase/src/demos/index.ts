import type { DemoEntry } from '../registry';
import { actionDemos } from './actions';
import { chartsDemos } from './charts';
import { dataADemos } from './data-a';
import { dataBDemos } from './data-b';
import { displayDemos } from './display';
import { feedbackOverlayDemos } from './feedback-overlays';
import { feedbackStatusDemos } from './feedback-status';
import { feedbackDemos } from './feedback';
import { foundationADemos } from './foundations-a';
import { foundationBDemos } from './foundations-b';
import { foundationCDemos } from './foundations-c';
import { formsChoiceDemos } from './forms-choice';
import { formsPickerDemos } from './forms-pickers';
import { formsStructureDemos } from './forms-structure';
import { formsTextDemos } from './forms-text';
import { layoutDemos } from './layout';
import { mediaDemos } from './media';
import { menusDemos } from './menus';
import { navigationDemos } from './navigation';
import { patternsADemos } from './patterns-a';
import { patternsBDemos } from './patterns-b';
import { patternsAuthDemos } from './patterns-auth';
import { primitiveDemos } from './primitives';

export const DEMOS: readonly DemoEntry[] = [
  ...foundationADemos,
  ...foundationBDemos,
  ...foundationCDemos,
  ...primitiveDemos,
  ...actionDemos,
  ...formsTextDemos,
  ...formsChoiceDemos,
  ...formsPickerDemos,
  ...formsStructureDemos,
  ...menusDemos,
  ...displayDemos,
  ...navigationDemos,
  ...feedbackOverlayDemos,
  ...feedbackStatusDemos,
  ...feedbackDemos,
  ...dataADemos,
  ...dataBDemos,
  ...chartsDemos,
  ...mediaDemos,
  ...layoutDemos,
  ...patternsADemos,
  ...patternsBDemos,
  ...patternsAuthDemos,
];
