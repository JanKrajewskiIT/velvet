import React from 'react';
import { Meter } from '../primitives/Meter.jsx';
import { IconTile } from '../primitives/IconTile.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Button } from '../actions/Button.jsx';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export const formatBytes = (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(b < 10240 ? 1 : 0) + ' KB' : (b / 1048576).toFixed(1) + ' MB');
const isImage = (n) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(n);
export function FileUpload({ files = [], onFiles, onRemove, onRetry, accept, multiple = true, maxSize, title = 'Drop files here or browse', hint, emptyText, disabled, className }) {
  const [over, setOver] = React.useState(false);
  const [rejected, setRejected] = React.useState(null);
  const input = React.useRef(null);
  const depth = React.useRef(0);
  const take = (list) => {
    let arr = Array.from(list || []);
    if (!multiple) arr = arr.slice(0, 1);
    const tooBig = maxSize ? arr.filter((f) => f.size > maxSize) : [];
    if (tooBig.length) setRejected(tooBig.map((f) => f.name).join(', ') + ' — over ' + formatBytes(maxSize));
    else setRejected(null);
    arr = arr.filter((f) => !maxSize || f.size <= maxSize);
    if (arr.length && onFiles) onFiles(arr);
  };
  return (
    <div className={cx('vui-upload', className)}>
      <div role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined}
        className={cx('vui-upload__zone', over && 'vui-upload__zone--over', disabled && 'vui-upload__zone--disabled')}
        onClick={() => !disabled && input.current && input.current.click()}
        onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); input.current && input.current.click(); } }}
        onDragEnter={(e) => { e.preventDefault(); if (disabled) return; depth.current++; setOver(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false); }}
        onDrop={(e) => { e.preventDefault(); depth.current = 0; setOver(false); if (!disabled) take(e.dataTransfer.files); }}>
        <span className="vui-upload__icon"><Glyph name="upload" /></span>
        <span className="vui-upload__title">{over ? 'Release to upload' : title}</span>
        {hint && <span className="vui-upload__hint">{hint}</span>}
        <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { take(e.target.files); e.target.value = ''; }} />
      </div>
      {rejected && <span className="vui-hint vui-hint--error" role="alert">{rejected}</span>}
      {files.length > 0 ? (
        <ul className="vui-upload__list">
          {files.map((f) => {
            const st = f.status || 'done';
            return (
              <li key={f.id} className={cx('vui-upload__file', 'vui-upload__file--' + st)}>
                <IconTile icon={isImage(f.name) ? 'image' : 'file'} className="vui-upload__thumb" />
                <div className="vui-upload__meta">
                  <div className="vui-upload__row">
                    <span className="vui-upload__name">{f.name}</span>
                    <span className="vui-upload__status">
                      {st === 'uploading' && Math.round(f.progress || 0) + '%'}
                      {st === 'done' && <><Glyph name="circle-check" />{f.size != null ? formatBytes(f.size) : 'Uploaded'}</>}
                      {st === 'error' && <><Glyph name="circle-x" />{f.error || 'Upload failed'}</>}
                    </span>
                  </div>
                  {st === 'uploading' && <Meter size="sm" value={Math.round(f.progress || 0)} label={'Uploading ' + f.name} className="vui-upload__bar" />}
                </div>
                {st === 'error' && onRetry && <Button variant="ghost" size="sm" iconLeft="refresh" onClick={() => onRetry(f.id)}>Retry</Button>}
                {onRemove && <IconButton icon={(st === 'uploading' ? 'x' : 'trash-2')} label={(st === 'uploading' ? 'Cancel ' : 'Remove ') + f.name} size="sm" onClick={() => onRemove(f.id)} />}
              </li>
            );
          })}
        </ul>
      ) : emptyText ? <EmptyText className="vui-upload__empty">{emptyText}</EmptyText> : null}
    </div>
  );
}
