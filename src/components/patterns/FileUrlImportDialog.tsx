import { createEffect, createMemo, createSignal, createUniqueId, type JSX, on, Show } from 'solid-js';

import { createOperation } from '../../hooks/createOperation';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { Dialog } from '../feedback/Dialog';
import { FileUpload, type UploadFile } from '../forms/FileUpload';
import { Input } from '../forms/Input';
import { Tabs } from '../navigation/Tabs';
import { Text } from '../primitives/Text';
import styles from './FileUrlImportDialog.module.css';

export interface UrlImportSource {
  value: string;
  label: JSX.Element;
  kind: 'url';
  placeholder?: string;
  hint?: JSX.Element;
}

export interface FileImportSource {
  value: string;
  label: JSX.Element;
  kind: 'file';
  accept?: string;
  dropLabel?: JSX.Element;
  hint?: JSX.Element;
}

export type FileUrlImportSource = UrlImportSource | FileImportSource;

export type FileUrlImportPayload = { source: string; url: string } | { source: string; file: File };

export interface FileUrlImportDialogProps {
  open: boolean;
  sources: readonly FileUrlImportSource[];
  onClose: () => void;
  onSubmit: (payload: FileUrlImportPayload) => void | Promise<void>;
  title?: JSX.Element;
  description?: JSX.Element;
  submitLabel?: JSX.Element;
  cancelLabel?: JSX.Element;
  errorMessage?: JSX.Element;
  busy?: boolean;
  onError?: (error: unknown) => void;
  class?: string;
}

const IMPORT_URL_PROTOCOLS = new Set(['http:', 'https:']);

const acceptsFile = (file: File, accept?: string): boolean => {
  if (!accept) return true;
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept.split(',').some((entry) => {
    const type = entry.trim().toLowerCase();
    if (type.startsWith('.')) return name.endsWith(type);
    if (type.endsWith('/*')) return mime.startsWith(type.slice(0, -1));
    return mime === type;
  });
};

const validUrl = (value: string): boolean => {
  try {
    return IMPORT_URL_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
};

/** Modal for importing from one configured URL or local-file source. The consumer owns fetching and parsing. */
export const FileUrlImportDialog = (props: FileUrlImportDialogProps) => {
  const translate = useTranslate();
  const [sourceId, setSourceId] = createSignal('');
  const [url, setUrl] = createSignal('');
  const [file, setFile] = createSignal<File>();
  const operation = createOperation();
  const [failure, setFailure] = createSignal<JSX.Element>();
  const formId = `vui-file-url-import-${createUniqueId()}`;
  const source = createMemo(() => props.sources.find((option) => option.value === sourceId()) ?? props.sources[0]);
  const busy = () => !!props.busy || operation.busy();
  const error = () => props.errorMessage ?? failure();
  const canSubmit = () => {
    const current = source();
    if (!props.open || busy() || !current) return false;
    return current.kind === 'url' ? validUrl(url().trim()) : !!file();
  };

  createEffect(
    on(
      () => props.open,
      (open) => {
        operation.invalidate();
        if (!open) return;
        setSourceId(props.sources[0]?.value ?? '');
        setUrl('');
        setFile(undefined);
        setFailure(undefined);
      },
    ),
  );
  createEffect(on(source, operation.invalidate, { defer: true }));

  const selectSource = (value: string) => {
    if (busy()) return;
    operation.invalidate();
    setSourceId(value);
    setUrl('');
    setFile(undefined);
    setFailure(undefined);
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const current = source();
    if (!canSubmit() || !current) return;
    const selectedFile = file();
    let payload: FileUrlImportPayload;
    if (current.kind === 'url') payload = { source: current.value, url: url().trim() };
    else {
      if (!selectedFile) return;
      payload = { source: current.value, file: selectedFile };
    }
    const run = operation.begin();
    if (!run) return;
    setFailure(undefined);
    try {
      await props.onSubmit(payload);
    } catch (error) {
      if (!run.isCurrent() || !props.open || source() !== current) return;
      setFailure(translate('velvet.patterns.fileUrlImportDialog.failed'));
      props.onError?.(error);
    } finally {
      run.finish();
    }
  };

  const selectedFiles = (): UploadFile[] => {
    const current = file();
    return current ? [{ id: 'selected-file', name: current.name, size: current.size }] : [];
  };

  return (
    <Dialog
      open={props.open}
      onClose={busy() ? undefined : props.onClose}
      dismissible={!busy()}
      title={props.title ?? translate('velvet.patterns.fileUrlImportDialog.title')}
      description={props.description ?? translate('velvet.patterns.fileUrlImportDialog.description')}
      size="md"
      class={cx('vui-file-url-import', props.class)}
      footer={
        <>
          <Button variant="secondary" disabled={busy()} onClick={props.onClose}>
            {props.cancelLabel ?? translate('velvet.common.cancel')}
          </Button>
          <Button type="submit" form={formId} loading={busy()} disabled={!canSubmit()}>
            {props.submitLabel ?? translate('velvet.patterns.fileUrlImportDialog.submit')}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        class={styles.fileUrlImportPartForm}
        onSubmit={(event) => {
          void submit(event).catch(reportAsyncError);
        }}
      >
        <Show
          when={props.sources.length > 0}
          fallback={
            <Text as="p" variant="body-sm" tone="inherit" class={styles.fileUrlImportPartEmpty}>
              {translate('velvet.patterns.fileUrlImportDialog.emptySources')}
            </Text>
          }
        >
          <Tabs
            items={props.sources.map((option) => ({ value: option.value, label: option.label, disabled: busy() }))}
            value={source()?.value}
            onValueChange={selectSource}
            block
          />
          <Show when={source()} keyed>
            {(current) => {
              const option = current;
              return option.kind === 'url' ? (
                <Input
                  type="url"
                  label={option.label}
                  placeholder={option.placeholder ?? translate('velvet.patterns.fileUrlImportDialog.urlPlaceholder')}
                  hint={option.hint ?? translate('velvet.patterns.fileUrlImportDialog.urlHint')}
                  value={url()}
                  required
                  disabled={busy()}
                  onInput={(event) => setUrl(event.currentTarget.value)}
                />
              ) : (
                <FileUpload
                  multiple={false}
                  accept={option.accept}
                  title={option.dropLabel ?? option.label}
                  hint={option.hint ?? translate('velvet.patterns.fileUrlImportDialog.fileHint')}
                  files={selectedFiles()}
                  onFiles={(files) => {
                    const selected = files[0];
                    if (selected && !acceptsFile(selected, option.accept)) {
                      setFile(undefined);
                      setFailure(translate('velvet.patterns.fileUrlImportDialog.fileTypeRejected'));
                      return;
                    }
                    setFile(selected);
                    setFailure(undefined);
                  }}
                  onRemove={() => setFile(undefined)}
                  disabled={busy()}
                />
              );
            }}
          </Show>
          <Show when={error()}>
            {(message) => (
              <Text as="div" variant="body-sm" tone="danger" class="vui-file-url-import__error" role="alert">
                {message()}
              </Text>
            )}
          </Show>
        </Show>
      </form>
    </Dialog>
  );
};
