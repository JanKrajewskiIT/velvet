import React from 'react';
import { cx } from './cx.js';
export function ListItem({ as, leading, title, description, meta, trailing, selected = false, disabled = false, size = 'md', align = 'center', clamp = 1, href, onClick, className, children, ...rest }) {
  // An interactive trailing slot (IconButton, Menu) can't nest inside <button> — fall back to a div with button semantics.
  const nested = !as && !href && onClick && trailing != null && trailing !== false;
  const Tag = as || (href ? 'a' : onClick && !nested ? 'button' : 'div');
  const action = Tag === 'button' || Tag === 'a' || Tag === 'label' || nested;
  const btnProps = nested ? { role: 'button', tabIndex: disabled ? -1 : 0, onKeyDown: (e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(e); } } } : null;
  return (
    <Tag className={cx('vui-list-item', 'vui-list-item--' + size, action && 'vui-list-item--action', selected && 'vui-list-item--selected', align === 'start' && 'vui-list-item--top', disabled && 'vui-list-item--disabled', className)}
      href={href} type={Tag === 'button' ? 'button' : undefined} disabled={Tag === 'button' ? disabled : undefined} aria-disabled={Tag !== 'button' && disabled ? true : undefined} aria-current={selected && Tag !== 'label' ? 'true' : undefined} onClick={onClick} {...btnProps} {...rest}>
      {leading != null && leading !== false && <span className="vui-list-item__leading">{leading}</span>}
      <span className="vui-list-item__main">
        {title != null && <span className="vui-list-item__title">{title}</span>}
        {description != null && description !== false && <span className={cx('vui-list-item__desc', clamp > 1 && 'vui-list-item__desc--clamp')} style={clamp > 1 ? { WebkitLineClamp: clamp } : undefined}>{description}</span>}
        {meta != null && meta !== false && <span className="vui-list-item__meta">{meta}</span>}
        {children}
      </span>
      {trailing != null && trailing !== false && <span className="vui-list-item__trailing">{trailing}</span>}
    </Tag>
  );
}
