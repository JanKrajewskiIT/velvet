import * as React from 'react';
export interface UploadFile {
  id: string | number;
  name: string;
  /** Bytes */
  size?: number;
  /** @default 'done' */
  status?: 'uploading' | 'done' | 'error';
  /** 0–100 while uploading */
  progress?: number;
  /** Error message shown in the row */
  error?: string;
}
/** Dropzone (drag, click or Enter/Space to browse) + file list with progress, retry and remove. Upload itself is yours: receive File[] in onFiles, then drive each row through `files`. */
export interface FileUploadProps {
  files?: UploadFile[];
  onFiles?: (files: File[]) => void;
  onRemove?: (id: string | number) => void;
  onRetry?: (id: string | number) => void;
  /** input accept — e.g. "image/*,.pdf" */
  accept?: string;
  /** @default true */
  multiple?: boolean;
  /** Bytes. Larger files are rejected with an inline error. */
  maxSize?: number;
  /** @default 'Drop files here or browse' */
  title?: React.ReactNode;
  /** e.g. "PNG, JPG or PDF — up to 20 MB" */
  hint?: React.ReactNode;
  /** Shown under the zone when files is empty */
  emptyText?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
export declare function FileUpload(props: FileUploadProps): JSX.Element;
export declare function formatBytes(bytes: number): string;
