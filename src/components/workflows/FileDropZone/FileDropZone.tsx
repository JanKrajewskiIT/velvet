import { createSignal, type JSX } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './FileDropZone.module.css';

interface FileDropZoneProps {
  accept?: string;
  icon?: JSX.Element;
  label: string;
  hint?: string;
  onFile: (file: File) => void;
}

const FileDropZone = (props: Props<FileDropZoneProps>) => {
  const [dragActive, setDragActive] = createSignal(false);
  let fileInputRef: HTMLInputElement | undefined;

  const isAccepted = (file: File) => {
    if (!props.accept) return true;
    return props.accept.split(',').some((type) => {
      const trimmed = type.trim();
      if (trimmed.startsWith('.')) {
        return file.name.toLowerCase().endsWith(trimmed.toLowerCase());
      }
      return file.type === trimmed;
    });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files[0];
    if (file && isAccepted(file)) {
      props.onFile(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && isAccepted(file)) {
      props.onFile(file);
    }
    target.value = '';
  };

  return (
    <>
      <button
        type="button"
        class={`${styles.dropZone} ${dragActive() ? styles.dropZoneActive : ''} ${props.class ?? ''}`}
        onClick={() => fileInputRef?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {props.icon && <span class={styles.dropIcon}>{props.icon}</span>}
        <span class={styles.dropText}>{props.label}</span>
        {props.hint && <span class={styles.dropHint}>{props.hint}</span>}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={props.accept}
        style={{ display: 'none' }}
        onInput={handleFileInput}
      />
    </>
  );
};

export default FileDropZone;
