import { createSignal, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Field } from '../primitives/Field';
import { Text } from '../primitives/Text';
import styles from './SignaturePad.module.css';
import {
  MIN_POINT_DISTANCE_PX,
  paintSignature,
  samplePoint,
  type SignaturePoint,
  type SignatureStroke,
} from './signatureStroke';

export interface SignaturePadProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  /** px. @default 180 */
  height?: number;
  /** Base stroke width in px. @default 2.5 */
  penWidth?: number;
  /** @default localized "Sign here" */
  placeholder?: string;
  /** Accessible name of the drawing surface. @default localized "Signature" */
  canvasLabel?: string;
  /** @default localized "signed" */
  signedLabel?: string;
  /** @default localized "empty" */
  emptyLabel?: string;
  /** @default localized "Undo" */
  undoLabel?: string;
  /** @default localized "Clear" */
  clearLabel?: string;
  /** Receives a PNG data URL (`null` when cleared) and the raw strokes. */
  onValueChange?: (dataUrl: string | null, strokes: ReadonlyArray<SignatureStroke>) => void;
  disabled?: boolean;
  id?: string;
  class?: string;
}

/** Draw-to-sign field. Strokes are smoothed and width follows speed or pen pressure; the ink follows `--fg-primary` and redraws on theme change. Drawing is not keyboard-accessible — always offer a typed alternative. */
export const SignaturePad = (props: SignaturePadProps) => {
  const p = mergeProps({ height: 180, penWidth: 2.5 } satisfies Partial<SignaturePadProps>, props);
  const translate = useTranslate();
  const canvasLabel = () => p.canvasLabel ?? translate('velvet.forms.signaturePad.canvasLabel');
  const signatureState = () =>
    strokes().length
      ? (p.signedLabel ?? translate('velvet.forms.signaturePad.signedLabel'))
      : (p.emptyLabel ?? translate('velvet.forms.signaturePad.emptyLabel'));
  const [strokes, setStrokes] = createSignal<ReadonlyArray<SignatureStroke>>([]);
  let canvas!: HTMLCanvasElement;
  let active: SignaturePoint[] | undefined;

  const redraw = () => paintSignature(canvas, active ? [...strokes(), active] : strokes());

  const commit = (next: ReadonlyArray<SignatureStroke>) => {
    setStrokes(next);
    redraw();
    p.onValueChange?.(next.length ? canvas.toDataURL('image/png') : null, next);
  };

  onMount(() => {
    const resize = new ResizeObserver(redraw);
    resize.observe(canvas);
    const theme = new MutationObserver(redraw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', redraw);
    onCleanup(() => {
      resize.disconnect();
      theme.disconnect();
      scheme.removeEventListener('change', redraw);
    });
  });

  const onPointerDown: JSX.EventHandler<HTMLCanvasElement, PointerEvent> = (event) => {
    if (p.disabled || event.button > 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    active = [samplePoint(event, canvas, p.penWidth)];
    redraw();
  };

  const onPointerMove: JSX.EventHandler<HTMLCanvasElement, PointerEvent> = (event) => {
    if (!active) return;
    const samples = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
    for (const sample of samples.length ? samples : [event]) {
      const last = active[active.length - 1];
      const point = samplePoint(sample, canvas, p.penWidth, last);
      if (!last || Math.hypot(point.x - last.x, point.y - last.y) > MIN_POINT_DISTANCE_PX) active.push(point);
    }
    redraw();
  };

  const endStroke = () => {
    if (!active) return;
    const finished = active;
    active = undefined;
    commit([...strokes(), finished]);
  };

  return (
    <Field
      label={p.label}
      hint={p.hint}
      error={p.error}
      optional={p.optional}
      required={p.required}
      id={p.id}
      class={cx('vui-sig', p.class)}
    >
      <div
        class={cx(
          styles.sigPartPad,
          !!p.error && styles.sigPartPadVariantInvalid,
          p.disabled && styles.sigPartPadVariantDisabled,
        )}
        style={{ height: `${p.height}px` }}
      >
        <canvas
          ref={(element) => {
            canvas = element;
          }}
          class={styles.sigPartCanvas}
          role="img"
          aria-label={`${canvasLabel()} — ${signatureState()}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
        <Show when={!strokes().length}>
          <Text as="span" variant="body-sm" tone="inherit" class={styles.sigPartPh} aria-hidden="true">
            {p.placeholder ?? translate('velvet.forms.signaturePad.placeholder')}
          </Text>
        </Show>
        <span class={styles.sigPartLine} aria-hidden="true" />
        <Show when={strokes().length > 0 && !p.disabled}>
          <div class={styles.sigPartTools}>
            <Button variant="ghost" size="xs" iconLeft="rotate-ccw" onClick={() => commit(strokes().slice(0, -1))}>
              {p.undoLabel ?? translate('velvet.common.undo')}
            </Button>
            <Button variant="ghost" size="xs" onClick={() => commit([])}>
              {p.clearLabel ?? translate('velvet.common.clear')}
            </Button>
          </div>
        </Show>
      </div>
    </Field>
  );
};
