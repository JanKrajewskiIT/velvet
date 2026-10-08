import * as React from 'react';
/** Colour field → popover with saturation/brightness area, hue strip, hex input and preset swatches. Area and hue are keyboard sliders (arrows, Shift ×10). inline renders the panel directly. */
export interface ColorPickerProps {
  label?: string;
  /** Hex, e.g. "#8b0036" */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (hex: string) => void;
  /** Preset hexes. Defaults to brand + data-viz hues. [] hides. */
  swatches?: string[];
  inline?: boolean;
  /** full = area + hue + hex + presets · swatches = curated swatch grid only (selected ring + check) with a "Selected" value chip. @default 'full' */
  variant?: 'full' | 'swatches';
  /** swatches variant: show the Selected value chip. @default true */
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}
export declare function ColorPicker(props: ColorPickerProps): JSX.Element;
export declare function hexToHsv(hex: string): { h: number; s: number; v: number } | null;
export declare function hsvToHex(hsv: { h: number; s: number; v: number }): string;
