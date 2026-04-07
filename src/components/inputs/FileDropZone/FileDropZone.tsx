import { createSignal, type JSX } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FileDropZone.module.css';

interface FileDropZoneProps {
  accept?: string;
  icon?: JSX.Element;
  label: string;
  hint?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
}

const FileDropZone = (props: Props<FileDropZoneProps>) => {
  const [dragActive, setDragActive] = createSignal(false);
  let fileInputRef: HTMLInputElement | undefined;

  const isMimeAccepted = (fileType: string, acceptType: string) => {
    if (acceptType.endsWith('/*')) {
      const baseType = acceptType.slice(0, acceptType.length - 1);
      return fileType.startsWith(baseType);
    }

    return fileType === acceptType;
  };

  const isAccepted = (file: File) => {
    if (!props.accept) return true;
    return props.accept.split(',').some((type) => {
      const trimmed = type.trim();
      if (trimmed.startsWith('.')) {
        return file.name.toLowerCase().endsWith(trimmed.toLowerCase());
      }
      return isMimeAccepted(file.type, trimmed);
    });
  };

  const emitFiles = (files: File[]) => {
    const first = files[0];
    if (!first) return;

    props.onFiles?.(files);
    props.onFile?.(first);
  };

  const handleFiles = (list: FileList | null) => {
    if (!list || props.disabled) return;

    const accepted = Array.from(list).filter(isAccepted);
    if (accepted.length === 0) return;

    if (props.multiple) {
      emitFiles(accepted);
      return;
    }

    const firstAccepted = accepted[0];
    if (!firstAccepted) return;
    emitFiles([firstAccepted]);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer?.files ?? null);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (props.disabled) return;
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    handleFiles(target.files);
    target.value = '';
  };

  return (
    <>
      <button
        type="button"
        class={classNames(
          styles.dropZone,
          dragActive() && styles.dropZoneActive,
          props.disabled && styles.dropZoneDisabled,
          props.class,
        )}
        onClick={() => fileInputRef?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={props.disabled}
      >
        {props.icon && <span class={styles.dropIcon}>{props.icon}</span>}
        <Text as="span" variant="labelLg" class={styles.dropText}>
          {props.label}
        </Text>
        {props.hint && (
          <Text as="span" variant="caption" tone="muted" class={styles.dropHint}>
            {props.hint}
          </Text>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        style={{ display: 'none' }}
        onInput={handleFileInput}
      />
    </>
  );
};

export default FileDropZone;
