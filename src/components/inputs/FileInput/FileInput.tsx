import { FiUpload } from 'solid-icons/fi';
import { createSignal, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './FileInput.module.css';

interface FileInputOwnProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  children?: JSX.Element;
}

const FileInput = (props: Props<FileInputOwnProps>) => {
  let fileInputRef!: HTMLInputElement;
  const [isDragging, setIsDragging] = createSignal(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    props.onFiles(Array.from(fileList));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!props.disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!props.disabled) handleFiles(e.dataTransfer?.files ?? null);
  };

  const handleClick = () => {
    if (!props.disabled) fileInputRef.click();
  };

  const handleChange = () => {
    handleFiles(fileInputRef.files);
    fileInputRef.value = '';
  };

  return (
    <button
      type="button"
      class={`${styles.dropZone} ${isDragging() ? styles.dragging : ''} ${props.disabled ? styles.disabled : ''} ${props.class ?? ''}`}
      disabled={props.disabled}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        class={styles.hiddenInput}
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        onChange={handleChange}
      />
      <Show
        when={props.children}
        fallback={
          <div class={styles.content}>
            <FiUpload class={styles.icon} />
            <span class={styles.label}>{props.label ?? 'Drop files here or click to browse'}</span>
          </div>
        }
      >
        {props.children}
      </Show>
    </button>
  );
};

export default FileInput;
