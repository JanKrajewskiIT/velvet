import { useI18n } from '@jankrajewskiit/i18n';
import { Match, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { Meter } from '../primitives/Meter';
import { Text } from '../primitives/Text';
import styles from './FileUploadRow.module.css';
import { formatBytes } from './formatBytes';

const UPLOAD_PART_FILE_CLASSES = {
  error: styles.uploadPartFileVariantError,
  done: styles.uploadPartFileVariantDone,
} as const;

export interface UploadFile {
  id: string | number;
  name: string;
  /** Bytes. */
  size?: number;
  /** @default 'done' */
  status?: 'uploading' | 'done' | 'error';
  /** 0–100 while uploading. */
  progress?: number;
  /** Error message shown in the row. */
  error?: string;
}

export interface FileUploadRowProps {
  file: UploadFile;
  disabled?: boolean;
  onRemove?: (id: string | number) => void;
  onRetry?: (id: string | number) => void;
}

const IMAGE_NAME = /\.(png|jpe?g|gif|webp|svg|avif)$/iu;

/** One file of the FileUpload list: thumbnail, name, status, progress and its retry / remove actions. */
export const FileUploadRow = (props: FileUploadRowProps) => {
  const translate = useTranslate();
  const i18n = useI18n();
  const status = () => props.file.status ?? 'done';
  const progress = () => Math.round(props.file.progress ?? 0);
  return (
    <li class={cx(styles.uploadPartFile, variantClass(UPLOAD_PART_FILE_CLASSES, status()))}>
      <IconTile icon={IMAGE_NAME.test(props.file.name) ? 'image' : 'file'} class={styles.uploadPartThumb} />
      <div class={styles.uploadPartMeta}>
        <div class={styles.uploadPartRow}>
          <Text as="span" variant="label" tone="inherit" class={styles.uploadPartName}>
            {props.file.name}
          </Text>
          <Text as="span" variant="caption" tone="inherit" class={styles.uploadPartStatus}>
            <Switch>
              <Match when={status() === 'uploading'}>{`${progress()}%`}</Match>
              <Match when={status() === 'done'}>
                <Glyph name="circle-check" />
                {props.file.size != null
                  ? formatBytes(props.file.size, i18n.locale())
                  : translate('velvet.forms.fileUploadRow.uploaded')}
              </Match>
              <Match when={status() === 'error'}>
                <Glyph name="circle-x" />
                {props.file.error || translate('velvet.forms.fileUploadRow.uploadFailed')}
              </Match>
            </Switch>
          </Text>
        </div>
        <Show when={status() === 'uploading'}>
          <Meter
            size="sm"
            value={progress()}
            label={translate('velvet.forms.fileUploadRow.uploading', { name: props.file.name })}
            class="vui-upload__bar"
          />
        </Show>
      </div>
      <Show when={status() === 'error' && props.onRetry}>
        {(retry) => (
          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh"
            disabled={props.disabled}
            onClick={() => !props.disabled && retry()(props.file.id)}
          >
            {translate('velvet.common.retry')}
          </Button>
        )}
      </Show>
      <Show when={props.onRemove}>
        {(remove) => (
          <IconButton
            icon={status() === 'uploading' ? 'x' : 'trash-2'}
            label={
              status() === 'uploading'
                ? translate('velvet.forms.fileUploadRow.cancelUpload', { name: props.file.name })
                : translate('velvet.forms.fileUploadRow.removeFile', { name: props.file.name })
            }
            size="sm"
            disabled={props.disabled}
            onClick={() => !props.disabled && remove()(props.file.id)}
          />
        )}
      </Show>
    </li>
  );
};
