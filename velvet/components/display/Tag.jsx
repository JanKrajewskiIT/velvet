import React from 'react';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Tag({ icon, selected, onClick, onRemove, removeLabel, disabled = false, size = 'md', variant = 'outline', tone, shape = 'rounded', className, children, ...rest }) {
  const selectable = !!onClick;
  const El = selectable ? 'button' : 'span';
  return (
    <El type={selectable ? 'button' : undefined} onClick={onClick} aria-pressed={selectable ? !!selected : undefined} data-tone={tone} className={cx('vui-tag', size === 'sm' && 'vui-tag--sm', variant !== 'outline' && 'vui-tag--' + variant, shape === 'pill' && 'vui-tag--pill', selectable && 'vui-tag--selectable', selected && 'vui-tag--selected', disabled && 'vui-tag--disabled', className)} disabled={selectable ? disabled : undefined} aria-disabled={!selectable && disabled ? true : undefined} {...rest}>
      {renderIcon(icon)}
      {children}
      {onRemove && (
        <CloseButton as="span" variant="tag" disabled={disabled} label={removeLabel || (typeof children === 'string' ? 'Remove ' + children : 'Remove')} onClick={onRemove} />
      )}
    </El>
  );
}
