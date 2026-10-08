// Byte-mode QR encoder (ISO/IEC 18004), versions 1-40, ECC L/M/Q/H, automatic mask selection.

/** Error-correction codewords per block, indexed `[levelRow][version]`. */
const ECC_CODEWORDS_PER_BLOCK: readonly (readonly number[])[] = [
  [
    -1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
  [
    -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28,
    28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  ],
  [
    -1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
  [
    -1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
];

/** Number of error-correction blocks, indexed `[levelRow][version]`. */
const BLOCK_COUNT: readonly (readonly number[])[] = [
  [
    -1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19,
    19, 20, 21, 22, 24, 25,
  ],
  [
    -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31,
    33, 35, 37, 38, 40, 43, 45, 47, 49,
  ],
  [
    -1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43,
    45, 48, 51, 53, 56, 59, 62, 65, 68,
  ],
  [
    -1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48,
    51, 54, 57, 60, 63, 66, 70, 74, 77, 81,
  ],
];

/** `[format-bit code, table row]` of each level. */
const LEVELS = { L: [1, 0], M: [0, 1], Q: [3, 2], H: [2, 3] } as const;

export type QRLevel = keyof typeof LEVELS;

export const DEFAULT_QR_LEVEL: QRLevel = 'M';

type Grid = boolean[][];
type MaskFn = (x: number, y: number) => boolean;

const MAX_VERSION = 40;
const BYTE_MODE = 4;
const PAD_BYTES = [0xec, 0x11] as const;

const MASKS: readonly MaskFn[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

const lookup = (table: readonly (readonly number[])[], levelRow: number, version: number): number =>
  table[levelRow]?.[version] ?? 0;

const galoisMultiply = (x: number, y: number): number => {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
};

const rawModules = (version: number): number => {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const alignment = Math.floor(version / 7) + 2;
    result -= (25 * alignment - 10) * alignment - 55;
    if (version >= 7) result -= 36;
  }
  return result;
};

const dataCodewords = (version: number, levelRow: number): number =>
  Math.floor(rawModules(version) / 8) -
  lookup(ECC_CODEWORDS_PER_BLOCK, levelRow, version) * lookup(BLOCK_COUNT, levelRow, version);

const createGrid = (size: number): Grid => Array.from({ length: size }, () => new Array<boolean>(size).fill(false));

const cell = (grid: Grid, x: number, y: number): boolean => grid[y]?.[x] ?? false;

const writeCell = (grid: Grid, x: number, y: number, value: boolean): void => {
  const row = grid[y];
  if (row) row[x] = value;
};

const lengthBits = (version: number): number => (version < 10 ? 8 : 16);

const pickVersion = (byteCount: number, levelRow: number): number | null => {
  for (let version = 1; version <= MAX_VERSION; version++) {
    if (BYTE_MODE + lengthBits(version) + byteCount * 8 <= dataCodewords(version, levelRow) * 8) return version;
  }
  return null;
};

const encodeBits = (bytes: readonly number[], version: number, levelRow: number): number[] => {
  const bits: number[] = [];
  const put = (value: number, count: number): void => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  put(BYTE_MODE, 4);
  put(bytes.length, lengthBits(version));
  bytes.forEach((byte) => put(byte, 8));
  const capacity = dataCodewords(version, levelRow) * 8;
  put(0, Math.min(4, capacity - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let index = 0; bits.length < capacity; index ^= 1) put(PAD_BYTES[index] ?? 0, 8);
  return bits;
};

const bitsToBytes = (bits: readonly number[]): number[] => {
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] ?? 0);
    bytes.push(byte);
  }
  return bytes;
};

/** Reed-Solomon remainder function for `degree` error-correction codewords. */
const createRemainder = (degree: number): ((data: readonly number[]) => number[]) => {
  const divisor = new Array<number>(degree).fill(0);
  divisor[degree - 1] = 1;
  for (let i = 0, root = 1; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      divisor[j] = galoisMultiply(divisor[j] ?? 0, root);
      if (j + 1 < degree) divisor[j] = (divisor[j] ?? 0) ^ (divisor[j + 1] ?? 0);
    }
    root = galoisMultiply(root, 2);
  }
  return (data) => {
    const result = divisor.map(() => 0);
    data.forEach((byte) => {
      const factor = byte ^ (result.shift() ?? 0);
      result.push(0);
      divisor.forEach((coefficient, i) => {
        result[i] = (result[i] ?? 0) ^ galoisMultiply(coefficient, factor);
      });
    });
    return result;
  };
};

/** Splits data into blocks, appends error correction and interleaves the codewords. */
const interleaveCodewords = (data: readonly number[], version: number, levelRow: number): number[] => {
  const blockCount = lookup(BLOCK_COUNT, levelRow, version);
  const eccLength = lookup(ECC_CODEWORDS_PER_BLOCK, levelRow, version);
  const raw = Math.floor(rawModules(version) / 8);
  const shortBlocks = blockCount - (raw % blockCount);
  const shortLength = Math.floor(raw / blockCount);
  const remainder = createRemainder(eccLength);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < blockCount; i++) {
    const block = data.slice(k, k + shortLength - eccLength + (i < shortBlocks ? 0 : 1));
    k += block.length;
    const ecc = remainder(block);
    if (i < shortBlocks) block.push(0);
    blocks.push(block.concat(ecc));
  }
  const result: number[] = [];
  const blockLength = blocks[0]?.length ?? 0;
  for (let i = 0; i < blockLength; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLength - eccLength || j >= shortBlocks) result.push(block[i] ?? 0);
    });
  }
  return result;
};

const alignmentPositions = (version: number, size: number): number[] => {
  if (version <= 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const positions = [6];
  for (let p = size - 7; positions.length < count; p -= step) positions.splice(1, 0, p);
  return positions;
};

interface Layout {
  modules: Grid;
  reserved: Grid;
}

const setFunctionModule = (layout: Layout, x: number, y: number, dark: boolean): void => {
  writeCell(layout.modules, x, y, dark);
  writeCell(layout.reserved, x, y, true);
};

const drawFunctionPatterns = (layout: Layout, version: number, size: number): void => {
  for (let i = 0; i < size; i++) {
    setFunctionModule(layout, 6, i, i % 2 === 0);
    setFunctionModule(layout, i, 6, i % 2 === 0);
  }
  const finder = (x: number, y: number): void => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size)
          setFunctionModule(layout, xx, yy, distance !== 2 && distance !== 4);
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);
  const positions = alignmentPositions(version, size);
  const last = positions.length - 1;
  positions.forEach((a, i) =>
    positions.forEach((b, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++)
          setFunctionModule(layout, a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }),
  );
};

const drawFormat = (layout: Layout, size: number, formatBits: number, mask: number): void => {
  const data = (formatBits << 3) | mask;
  let remainder = data;
  for (let i = 0; i < 10; i++) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
  const bits = ((data << 10) | remainder) ^ 0x5412;
  const bit = (i: number): boolean => ((bits >>> i) & 1) !== 0;
  for (let i = 0; i <= 5; i++) setFunctionModule(layout, 8, i, bit(i));
  setFunctionModule(layout, 8, 7, bit(6));
  setFunctionModule(layout, 8, 8, bit(7));
  setFunctionModule(layout, 7, 8, bit(8));
  for (let i = 9; i < 15; i++) setFunctionModule(layout, 14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) setFunctionModule(layout, size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) setFunctionModule(layout, 8, size - 15 + i, bit(i));
  setFunctionModule(layout, 8, size - 8, true);
};

const drawVersion = (layout: Layout, size: number, version: number): void => {
  if (version < 7) return;
  let remainder = version;
  for (let i = 0; i < 12; i++) remainder = (remainder << 1) ^ ((remainder >>> 11) * 0x1f25);
  const bits = (version << 12) | remainder;
  for (let i = 0; i < 18; i++) {
    const dark = ((bits >>> i) & 1) !== 0;
    const a = size - 11 + (i % 3);
    const c = Math.floor(i / 3);
    setFunctionModule(layout, a, c, dark);
    setFunctionModule(layout, c, a, dark);
  }
};

const placeCodewords = (layout: Layout, size: number, codewords: readonly number[]): void => {
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!cell(layout.reserved, x, y) && bitIndex < codewords.length * 8) {
          writeCell(layout.modules, x, y, (((codewords[bitIndex >>> 3] ?? 0) >>> (7 - (bitIndex & 7))) & 1) !== 0);
          bitIndex++;
        }
      }
    }
  }
};

const applyMask = (layout: Layout, size: number, mask: number): void => {
  const covers = MASKS[mask];
  if (!covers) return;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!cell(layout.reserved, x, y) && covers(x, y)) writeCell(layout.modules, x, y, !cell(layout.modules, x, y));
    }
  }
};

const penaltyScore = (modules: Grid, size: number): number => {
  let penalty = 0;
  const scanRuns = (get: (a: number, b: number) => boolean): void => {
    for (let a = 0; a < size; a++) {
      let run = 1;
      for (let b = 1; b < size; b++) {
        if (get(a, b) === get(a, b - 1)) {
          run++;
          if (run === 5) penalty += 3;
          else if (run > 5) penalty++;
        } else run = 1;
      }
    }
  };
  scanRuns((row, column) => cell(modules, column, row));
  scanRuns((column, row) => cell(modules, column, row));
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const dark = cell(modules, x, y);
      if (dark === cell(modules, x + 1, y) && dark === cell(modules, x, y + 1) && dark === cell(modules, x + 1, y + 1))
        penalty += 3;
    }
  }
  let darkCount = 0;
  modules.forEach((row) =>
    row.forEach((dark) => {
      if (dark) darkCount++;
    }),
  );
  return penalty + Math.floor(Math.abs(darkCount * 20 - size * size * 10) / (size * size)) * 10;
};

/** Encoder used by QRCode. Returns the module matrix (`true` = dark) or `null` if the text is too long for version 40. */
export const encodeQR = (text: string, level: QRLevel = DEFAULT_QR_LEVEL): boolean[][] | null => {
  const bytes = Array.from(new TextEncoder().encode(text));
  const [formatBits, levelRow] = LEVELS[level];
  const version = pickVersion(bytes.length, levelRow);
  if (version === null) return null;
  const codewords = interleaveCodewords(bitsToBytes(encodeBits(bytes, version, levelRow)), version, levelRow);
  const size = version * 4 + 17;
  const layout: Layout = { modules: createGrid(size), reserved: createGrid(size) };
  drawFunctionPatterns(layout, version, size);
  drawFormat(layout, size, formatBits, 0);
  drawVersion(layout, size, version);
  placeCodewords(layout, size, codewords);
  let bestMask = 0;
  let bestPenalty = Infinity;
  for (let mask = 0; mask < MASKS.length; mask++) {
    applyMask(layout, size, mask);
    drawFormat(layout, size, formatBits, mask);
    const penalty = penaltyScore(layout.modules, size);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMask = mask;
    }
    applyMask(layout, size, mask);
  }
  applyMask(layout, size, bestMask);
  drawFormat(layout, size, formatBits, bestMask);
  return layout.modules;
};
