import type { TransferSide } from './transferItem';

const MIME = 'application/x-vui-transfer';

export interface TransferPayload {
  from: TransferSide;
  values: string[];
}

const isPayload = (data: unknown): data is TransferPayload =>
  typeof data === 'object' &&
  data !== null &&
  'from' in data &&
  (data.from === 'left' || data.from === 'right') &&
  'values' in data &&
  Array.isArray(data.values) &&
  data.values.every((value) => typeof value === 'string');

export const writeTransferPayload = (transfer: DataTransfer, payload: TransferPayload): void => {
  transfer.setData(MIME, JSON.stringify(payload));
  transfer.effectAllowed = 'move';
};

export const hasTransferPayload = (transfer: DataTransfer): boolean => transfer.types.includes(MIME);

/** The dragged payload, or `null` when the drop did not originate from a TransferList. */
export const readTransferPayload = (transfer: DataTransfer): TransferPayload | null => {
  const raw = transfer.getData(MIME);
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    // The payload comes from outside this component (another page or app can set the same type); not ours, so there is nothing to move.
    return null;
  }
  return isPayload(data) ? data : null;
};
