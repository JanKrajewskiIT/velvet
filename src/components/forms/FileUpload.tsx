import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { partitionFiles, type RejectedFile } from './fileAcceptance';
import styles from './FileUpload.module.css';
import { FileUploadRow, type UploadFile } from './FileUploadRow';
import { formatBytes } from './formatBytes';

export type { UploadFile };
export type { RejectedFile, UploadRejectionReason } from './fileAcceptance';

export interface FileUploadProps {
  files?: UploadFile[];
  onFiles?: (files: File[]) => void;
  onRemove?: (id: string | number) => void;
  onRetry?: (id: string | number) => void;
  /** input accept — e.g. "image/*,.pdf". */
  accept?: string;
  /** @default true */
  multiple?: boolean;
  /** Bytes. Larger files are rejected with an inline error. */
  maxSize?: number;
  maxFiles?: number;
  onReject?: (files: readonly RejectedFile[]) => void;
  /** @default localized "Drop files here or browse" */
  title?: JSX.Element;
  /** e.g. "PNG, JPG or PDF — up to 20 MB". */
  hint?: JSX.Element;
  /** Shown under the zone when `files` is empty. */
  emptyText?: JSX.Element;
  disabled?: boolean;
  class?: string;
}

/** Dropzone (drag, click or Enter/Space to browse) + file list with progress, retry and remove. Upload itself is yours: receive File[] in `onFiles`, then drive each row through `files`. */
export const FileUpload = (props: FileUploadProps) => {
  const p = mergeProps({ files: [], multiple: true } satisfies Partial<FileUploadProps>, props);
  const translate = useTranslate();
  const i18n = useI18n();
  const [over, setOver] = createSignal(false);
  const [rejected, setRejected] = createSignal<string | null>(null);
  let input: HTMLInputElement | undefined;
  let dragDepth = 0;
  const canPick = () => !p.disabled && !!p.onFiles;
  createEffect(() => {
    if (!canPick()) {
      dragDepth = 0;
      setOver(false);
    }
  });

  const take = (list: FileList | null | undefined) => {
    if (!canPick()) return;
    const { accepted, rejected } = partitionFiles(Array.from(list ?? []), p, p.files.length);
    const errors = rejected.map(({ file, reason }) =>
      reason === 'size'
        ? translate('velvet.forms.fileUpload.rejected', {
            names: file.name,
            limit: formatBytes(p.maxSize ?? 0, i18n.locale()),
          })
        : reason === 'type'
          ? translate('velvet.forms.fileUpload.rejectedType', { name: file.name })
          : translate('velvet.forms.fileUpload.rejectedCount', { name: file.name }),
    );
    setRejected(errors.length ? errors.join(' · ') : null);
    if (rejected.length) p.onReject?.(rejected);
    if (accepted.length) p.onFiles?.(accepted);
  };
  const browse = () => {
    if (canPick()) input?.click();
  };

  return (
    <div class={cx(styles.upload, p.class)}>
      <div
        role="button"
        tabIndex={canPick() ? 0 : -1}
        aria-disabled={!canPick() || undefined}
        class={cx(
          styles.uploadPartZone,
          over() && styles.uploadPartZoneVariantOver,
          !canPick() && styles.uploadPartZoneVariantDisabled,
        )}
        onClick={browse}
        onKeyDown={(e) => {
          if (!canPick() || (e.key !== 'Enter' && e.key !== ' ')) return;
          e.preventDefault();
          browse();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!canPick()) return;
          dragDepth++;
          setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          dragDepth = Math.max(0, dragDepth - 1);
          if (!dragDepth) setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth = 0;
          setOver(false);
          if (canPick()) take(e.dataTransfer?.files);
        }}
      >
        <span class={styles.uploadPartIcon}>
          <Glyph name="upload" />
        </span>
        <Text as="span" variant="label" tone="inherit" class={styles.uploadPartTitle}>
          {over()
            ? translate('velvet.forms.fileUpload.releaseToUpload')
            : p.title === undefined
              ? translate('velvet.forms.fileUpload.title')
              : p.title}
        </Text>
        <Show when={p.hint}>
          <Text as="span" variant="caption" tone="inherit" class={styles.uploadPartHint}>
            {p.hint}
          </Text>
        </Show>
        <input
          ref={(element) => {
            input = element;
          }}
          type="file"
          hidden
          accept={p.accept}
          multiple={p.multiple}
          disabled={!canPick()}
          onChange={(e) => {
            take(e.currentTarget.files);
            e.currentTarget.value = '';
          }}
        />
      </div>
      <Show when={rejected()}>
        <Text as="span" variant="caption" tone="inherit" class={cx(styles.hint, styles.hintVariantError)} role="alert">
          {rejected()}
        </Text>
      </Show>
      <Show
        when={p.files.length > 0}
        fallback={
          <Show when={p.emptyText}>
            <EmptyText class={styles.uploadPartEmpty}>{p.emptyText}</EmptyText>
          </Show>
        }
      >
        <ul class={styles.uploadPartList}>
          <For each={p.files}>
            {(file) => <FileUploadRow file={file} disabled={p.disabled} onRemove={p.onRemove} onRetry={p.onRetry} />}
          </For>
        </ul>
      </Show>
    </div>
  );
};
