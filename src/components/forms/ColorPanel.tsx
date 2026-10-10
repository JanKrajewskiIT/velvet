import { createEffect, createSignal, For, on, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { clamp } from '../../utils/math';
import { Control } from '../primitives/Control';
import { hexToHsv, type Hsv, hsvToHex } from './colorMath';

export interface ColorPanelProps {
  hex: string;
  onChange: (hex: string) => void;
  swatches: readonly string[];
}

const MAX_HUE = 359.9;
const HEX_LENGTH = 7;

const AREA_KEYS: Readonly<Record<string, readonly [axis: 's' | 'v', sign: 1 | -1]>> = {
  ArrowRight: ['s', 1],
  ArrowLeft: ['s', -1],
  ArrowUp: ['v', 1],
  ArrowDown: ['v', -1],
};

const HUE_KEYS: Readonly<Record<string, number>> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };

/** Saturation/brightness area, hue strip, hex input and preset swatches. Area and hue are keyboard sliders (arrows, Shift ×10). */
export const ColorPanel = (props: ColorPanelProps) => {
  const translate = useTranslate();
  const [hsv, setHsv] = createSignal<Hsv>(untrack(() => hexToHsv(props.hex)) ?? { h: 0, s: 0, v: 0 });
  /** Hex text while the user is typing; `null` shows the committed value. */
  const [typed, setTyped] = createSignal<string | null>(null);
  let area: HTMLDivElement | undefined;
  let hue: HTMLDivElement | undefined;

  createEffect(
    on(
      () => props.hex,
      (hex) => {
        const parsed = hexToHsv(hex);
        if (parsed && hsvToHex(hsv()) !== hex.toLowerCase()) setHsv(parsed);
        setTyped(null);
      },
      { defer: true },
    ),
  );

  const push = (next: Hsv) => {
    setHsv(next);
    setTyped(null);
    props.onChange(hsvToHex(next));
  };
  const dragArea = (e: PointerEvent) => {
    if (!area) return;
    const rect = area.getBoundingClientRect();
    push({
      ...hsv(),
      s: clamp((e.clientX - rect.left) / rect.width, 0, 1),
      v: clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1),
    });
  };
  const dragHue = (e: PointerEvent) => {
    if (!hue) return;
    const rect = hue.getBoundingClientRect();
    push({ ...hsv(), h: clamp((e.clientX - rect.left) / rect.width, 0, 1) * MAX_HUE });
  };
  const startDrag = (e: PointerEvent & { currentTarget: HTMLElement }, drag: (e: PointerEvent) => void) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag(e);
  };
  const keyStep = (e: KeyboardEvent) => (e.shiftKey ? 0.1 : 0.01);

  const onAreaKey = (e: KeyboardEvent) => {
    const key = AREA_KEYS[e.key];
    if (!key) return;
    e.preventDefault();
    const [axis, sign] = key;
    push({ ...hsv(), [axis]: clamp(hsv()[axis] + sign * keyStep(e), 0, 1) });
  };
  const onHueKey = (e: KeyboardEvent) => {
    const direction = HUE_KEYS[e.key];
    if (direction === undefined) return;
    e.preventDefault();
    push({ ...hsv(), h: (hsv().h + direction * (e.shiftKey ? 10 : 1) + 360) % 360 });
  };
  const onHexInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const value = `#${e.currentTarget.value.replace(/[^0-9a-f]/giu, '')}`;
    setTyped(value);
    const parsed = hexToHsv(value);
    if (parsed && value.length === HEX_LENGTH) {
      setHsv(parsed);
      props.onChange(value.toLowerCase());
    }
  };
  const pickSwatch = (swatch: string) => {
    const parsed = hexToHsv(swatch);
    if (parsed) setHsv(parsed);
    props.onChange(swatch.toLowerCase());
  };

  return (
    <div class="vui-color">
      <div
        ref={(element) => {
          area = element;
        }}
        class="vui-color__area"
        style={{ background: `hsl(${hsv().h} 100% 50%)` }}
        onPointerDown={(e) => startDrag(e, dragArea)}
        onPointerMove={(e) => e.buttons && dragArea(e)}
      >
        <span
          role="slider"
          tabIndex={0}
          aria-label={translate('velvet.forms.colorPanel.areaLabel')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv().s * 100)}
          aria-valuetext={translate('velvet.forms.colorPanel.areaValue', {
            saturation: Math.round(hsv().s * 100),
            brightness: Math.round(hsv().v * 100),
          })}
          class="vui-color__thumb"
          style={{ left: `${hsv().s * 100}%`, top: `${(1 - hsv().v) * 100}%`, background: hsvToHex(hsv()) }}
          onKeyDown={onAreaKey}
        />
      </div>
      <div
        ref={(element) => {
          hue = element;
        }}
        class="vui-color__hue"
        onPointerDown={(e) => startDrag(e, dragHue)}
        onPointerMove={(e) => e.buttons && dragHue(e)}
      >
        <span
          role="slider"
          tabIndex={0}
          aria-label={translate('velvet.forms.colorPanel.hueLabel')}
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(hsv().h)}
          class="vui-color__hthumb"
          style={{ left: `${(hsv().h / 360) * 100}%`, background: `hsl(${hsv().h} 100% 50%)` }}
          onKeyDown={onHueKey}
        />
      </div>
      <div class="vui-color__row">
        <span class="vui-color__preview" style={{ background: props.hex }} />
        <Control size="sm" style={{ flex: 1 }}>
          <span class="vui-control__affix">#</span>
          <input
            class="vui-control__input vui-color__hex"
            aria-label={translate('velvet.forms.colorPanel.hexLabel')}
            value={(typed() ?? props.hex).replace('#', '')}
            maxLength={6}
            spellcheck={false}
            onInput={onHexInput}
            onBlur={() => setTyped(null)}
          />
        </Control>
      </div>
      <Show when={props.swatches.length > 0}>
        <div class="vui-color__swatches" role="listbox" aria-label={translate('velvet.forms.colorPanel.presetsLabel')}>
          <For each={props.swatches}>
            {(swatch) => (
              <button
                type="button"
                role="option"
                aria-selected={swatch.toLowerCase() === props.hex.toLowerCase()}
                aria-label={swatch}
                class="vui-swatch vui-swatch--fill"
                style={{ '--swatch': swatch }}
                onClick={() => pickSwatch(swatch)}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
