import { filledIcon } from '../display/IconFilled';

/** Active navigation icons switch to their `-filled` twin when one exists. */
export const glyphForState = (name: string, active: boolean): string => filledIcon(name, active);
