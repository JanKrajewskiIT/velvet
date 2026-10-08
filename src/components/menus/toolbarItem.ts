import type { MenuItem } from './menuItem';

export interface ToolbarItem {
  label?: string;
  /** Glyph name. */
  icon?: string;
  onClick?: () => void;
  /** Toggle state: aria-pressed on the button, a check in the overflow menu. */
  active?: boolean;
  disabled?: boolean;
  shortcut?: string;
  /** Show the label next to the icon. */
  showLabel?: boolean;
  divider?: boolean;
  /** Pushes following items to the right (dropped when overflowing). */
  spacer?: boolean;
}

/** An icon without a visible label: the label moves to aria-label and title. */
export const isIconOnly = (item: ToolbarItem): boolean => !!item.icon && !item.showLabel;

/** Items that render as a button and take part in keyboard navigation (disabled ones are skipped by the caller). */
export const isToolbarButton = (item: ToolbarItem): boolean => !item.divider && !item.spacer;

/** Overflowed items as menu items: spacers dropped, leading and trailing dividers trimmed. */
export const overflowMenuItems = (hidden: ToolbarItem[]): MenuItem[] => {
  const kept = hidden.filter((item) => !item.spacer);
  return kept
    .filter((item, index) => !(item.divider && (index === 0 || index === kept.length - 1)))
    .map((item) =>
      item.divider
        ? { divider: true }
        : {
            label: item.label,
            icon: item.icon,
            disabled: item.disabled,
            shortcut: item.shortcut,
            checked: item.active,
            onSelect: item.onClick,
          },
    );
};

const BAR_PADDING_PX = 8;
const ITEM_GAP_PX = 2;
const OVERFLOW_BUTTON_PX = 36;

/** How many leading items fit in `barWidth` next to an overflow button, never ending on a divider. `widths[i]` is the measured width of `items[i]`. */
export const countFittingItems = (items: ToolbarItem[], widths: number[], barWidth: number): number => {
  const available = barWidth - BAR_PADDING_PX;
  let used = 0;
  let count = 0;
  for (const [index, width] of widths.entries()) {
    const needed = width + ITEM_GAP_PX;
    const reserved = index < widths.length - 1 ? OVERFLOW_BUTTON_PX : 0;
    if (used + needed + reserved > available) break;
    used += needed;
    count = index + 1;
  }
  while (count > 0 && items[count - 1]?.divider) count--;
  return count;
};
