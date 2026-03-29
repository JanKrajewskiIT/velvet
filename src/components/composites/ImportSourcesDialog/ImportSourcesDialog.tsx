import { IoClose, IoCloudUpload, IoDocument } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, Match, Show, Switch } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import ErrorMessage from '~/components/feedback/ErrorMessage/ErrorMessage';
import Spinner from '~/components/feedback/Spinner/Spinner';
import FormField from '~/components/forms/FormField/FormField';
import FormLayout from '~/components/forms/FormLayout/FormLayout';
import FileDropZone from '~/components/inputs/FileDropZone/FileDropZone';
import Input from '~/components/inputs/Input/Input';
import Tabs from '~/components/navigation/Tabs/Tabs';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';

import styles from './ImportSourcesDialog.module.css';

interface UrlImportSource {
  value: string;
  label: string;
  kind: 'url';
  inputLabel: string;
  inputPlaceholder?: string;
  helperText?: string;
}

interface FileImportSource {
  value: string;
  label: string;
  kind: 'file';
  accept?: string;
  dropLabel: string;
  dropHint?: string;
  clearLabel: string;
}

type ImportSourceOption = UrlImportSource | FileImportSource;

interface ImportSourcesDialogSubmitPayload {
  source: string;
  url?: string;
  file?: File;
}

interface ImportSourcesDialogProps {
  open: boolean;
  title: string;
  sources: readonly ImportSourceOption[];
  submitLabel: string;
  cancelLabel: string;
  loadingLabel?: string;
  errorMessage?: string;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (payload: ImportSourcesDialogSubmitPayload) => void | Promise<void>;
}

const ImportSourcesDialog = (props: Props<ImportSourcesDialogProps>) => {
  const firstSourceValue = createMemo(() => props.sources[0]?.value ?? '');
  const [activeSource, setActiveSource] = createSignal('');
  const [urlValues, setUrlValues] = createSignal<Record<string, string>>({});
  const [fileValues, setFileValues] = createSignal<Record<string, File | null>>({});

  createEffect(() => {
    if (!props.open) {
      setActiveSource(firstSourceValue());
      setUrlValues({});
      setFileValues({});
      return;
    }

    const selected = activeSource();
    const exists = props.sources.some((source) => source.value === selected);
    if (!exists) {
      setActiveSource(firstSourceValue());
    }
  });

  const currentSource = createMemo(() => props.sources.find((source) => source.value === activeSource()));
  const currentUrl = createMemo(() => urlValues()[activeSource()] ?? '');
  const currentFile = createMemo(() => fileValues()[activeSource()] ?? null);
  const showTabs = createMemo(() => props.sources.length > 1);

  const isSubmitDisabled = createMemo(() => {
    const source = currentSource();
    if (!source || props.busy) return true;
    if (source.kind === 'url') {
      return !currentUrl().trim();
    }
    return currentFile() === null;
  });

  const handleUrlChange = (value: string) => {
    setUrlValues((current) => ({ ...current, [activeSource()]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFileValues((current) => ({ ...current, [activeSource()]: file }));
  };

  const handleSubmit = async () => {
    const source = currentSource();
    if (!source) return;

    if (source.kind === 'url') {
      const url = currentUrl().trim();
      if (!url) return;
      await props.onSubmit({ source: source.value, url });
      return;
    }

    const file = currentFile();
    if (!file) return;
    await props.onSubmit({ source: source.value, file });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} class={props.class}>
      <DialogTitle label={props.title} />
      <DialogBody>
        <div class={styles.content}>
          <Show when={showTabs()}>
            <Tabs
              variant="pill"
              tabs={props.sources.map((source) => ({ value: source.value, label: source.label }))}
              value={activeSource()}
              onChange={setActiveSource}
              disabled={props.busy}
            />
          </Show>

          <Switch>
            <Match when={currentSource()?.kind === 'url'}>
              <FormLayout>
                <FormField label={(currentSource() as UrlImportSource | undefined)?.inputLabel ?? ''}>
                  <Input
                    type="url"
                    value={currentUrl()}
                    placeholder={(currentSource() as UrlImportSource | undefined)?.inputPlaceholder}
                    disabled={props.busy}
                    onInput={(event) => handleUrlChange(event.currentTarget.value)}
                  />
                </FormField>
                <Show when={(currentSource() as UrlImportSource | undefined)?.helperText}>
                  {(helperText) => (
                    <Text as="p" tone="muted" class={styles.helperText}>
                      {helperText()}
                    </Text>
                  )}
                </Show>
              </FormLayout>
            </Match>
            <Match when={currentSource()?.kind === 'file'}>
              <FormLayout>
                <Show
                  when={currentFile() === null}
                  fallback={
                    <div class={styles.selectedFile}>
                      <IoDocument />
                      <Text as="span" class={styles.selectedFileName}>
                        {currentFile()?.name ?? ''}
                      </Text>
                      <IconButton
                        icon={IoClose}
                        label={(currentSource() as FileImportSource | undefined)?.clearLabel ?? props.cancelLabel}
                        size="sm"
                        disabled={props.busy}
                        onClick={() => handleFileChange(null)}
                      />
                    </div>
                  }
                >
                  <FileDropZone
                    accept={(currentSource() as FileImportSource | undefined)?.accept}
                    icon={<IoCloudUpload />}
                    label={(currentSource() as FileImportSource | undefined)?.dropLabel ?? ''}
                    hint={(currentSource() as FileImportSource | undefined)?.dropHint}
                    disabled={props.busy}
                    onFile={(file) => handleFileChange(file)}
                  />
                </Show>
              </FormLayout>
            </Match>
          </Switch>

          <Show when={props.errorMessage}>{(message) => <ErrorMessage message={message()} />}</Show>
        </div>
      </DialogBody>
      <DialogActions>
        <Button variant="ghost" label={props.cancelLabel} disabled={props.busy} onClick={props.onClose} />
        <Button disabled={isSubmitDisabled()} onClick={() => void handleSubmit()}>
          <Show when={props.busy} fallback={props.submitLabel}>
            <>
              <Spinner size="sm" />
              {props.loadingLabel ?? props.submitLabel}
            </>
          </Show>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export type {
  FileImportSource,
  ImportSourceOption,
  ImportSourcesDialogProps,
  ImportSourcesDialogSubmitPayload,
  UrlImportSource,
};
export default ImportSourcesDialog;
