export interface SignaturePoint {
  x: number;
  y: number;
  w: number;
}

export type SignatureStroke = ReadonlyArray<SignaturePoint>;

interface PointerSample {
  clientX: number;
  clientY: number;
  pointerType: string;
  pressure: number;
}

const PEN_PRESSURE_BASE = 0.45;
const PEN_PRESSURE_RANGE = 1.1;
const SPEED_WIDTH_MIN = 0.55;
const SPEED_WIDTH_MAX = 1.35;
const SPEED_WIDTH_BASE = 1.4;
const SPEED_WIDTH_SLOPE = 0.045;
const WIDTH_SMOOTHING = 0.6;

export const MIN_POINT_DISTANCE_PX = 0.8;

const midpoint = (a: SignaturePoint, b: SignaturePoint) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Pen width follows pressure for a stylus and drawing speed for mouse and touch, smoothed against the previous point. */
export const samplePoint = (
  sample: PointerSample,
  canvas: HTMLCanvasElement,
  penWidth: number,
  last?: SignaturePoint,
): SignaturePoint => {
  const rect = canvas.getBoundingClientRect();
  const x = sample.clientX - rect.left;
  const y = sample.clientY - rect.top;
  let width = penWidth;
  if (sample.pointerType === 'pen' && sample.pressure)
    width = penWidth * (PEN_PRESSURE_BASE + sample.pressure * PEN_PRESSURE_RANGE);
  else if (last)
    width =
      penWidth *
      Math.max(
        SPEED_WIDTH_MIN,
        Math.min(SPEED_WIDTH_MAX, SPEED_WIDTH_BASE - Math.hypot(x - last.x, y - last.y) * SPEED_WIDTH_SLOPE),
      );
  if (last) width = last.w * WIDTH_SMOOTHING + width * (1 - WIDTH_SMOOTHING);
  return { x, y, w: width };
};

const paintStroke = (ctx: CanvasRenderingContext2D, stroke: SignatureStroke) => {
  const [first] = stroke;
  if (!first) return;
  if (stroke.length === 1) {
    ctx.beginPath();
    ctx.arc(first.x, first.y, first.w / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  for (let i = 1; i < stroke.length; i++) {
    const previous = stroke[i - 1];
    const point = stroke[i];
    if (!previous || !point) continue;
    const beforePrevious = stroke[i - 2];
    const from = beforePrevious ? midpoint(beforePrevious, previous) : previous;
    const to = i === stroke.length - 1 ? point : midpoint(previous, point);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(previous.x, previous.y, to.x, to.y);
    ctx.lineWidth = (previous.w + point.w) / 2;
    ctx.stroke();
  }
};

/** Resizes the backing store to the CSS size, then redraws every stroke in the canvas's current text colour. */
export const paintSignature = (canvas: HTMLCanvasElement, strokes: ReadonlyArray<SignatureStroke>): void => {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.round(rect.width * ratio);
  const height = Math.round(rect.height * ratio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  const ink = getComputedStyle(canvas).color;
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const stroke of strokes) paintStroke(ctx, stroke);
};
