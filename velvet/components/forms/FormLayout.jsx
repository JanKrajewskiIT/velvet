import React from 'react';
import { cx } from '../primitives/cx.js';
export function FormLayout({ as = 'form', gap = 'md', width, onSubmit, children, className, ...rest }) {
  const El = as;
  const submit = onSubmit ? (e) => { e.preventDefault(); onSubmit(e); } : undefined;
  return <El className={cx('vui-form', 'vui-form--gap-' + gap, className)} style={width ? { maxWidth: width } : undefined} onSubmit={El === 'form' ? submit : undefined} noValidate={El === 'form' || undefined} {...rest}>{children}</El>;
}
export function FormSection({ title, description, layout = 'stacked', divider = false, actions, children, className }) {
  const id = React.useId();
  return (
    <section className={cx('vui-formsec', 'vui-formsec--' + layout, divider && 'vui-formsec--divider', className)} aria-labelledby={title ? id : undefined}>
      {(title || description || actions) && (
        <header className="vui-formsec__head">
          <div className="vui-formsec__ht">{title && <h3 id={id} className="vui-formsec__title">{title}</h3>}{description && <p className="vui-formsec__desc">{description}</p>}</div>
          {actions && <div className="vui-formsec__actions">{actions}</div>}
        </header>
      )}
      <div className="vui-formsec__body">{children}</div>
    </section>
  );
}
export function FormGrid({ columns, minColumnWidth = 240, gap = 'md', children, className }) {
  const st = columns ? { gridTemplateColumns: 'repeat(' + columns + ',minmax(0,1fr))' } : { gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,' + (typeof minColumnWidth === 'number' ? minColumnWidth + 'px' : minColumnWidth) + '),1fr))' };
  return <div className={cx('vui-formgrid', 'vui-formgrid--gap-' + gap, columns && 'vui-formgrid--fixed', className)} style={st}>{children}</div>;
}
export function FormSpan({ span = 'full', children, className }) {
  return <div className={cx('vui-formspan', className)} style={{ gridColumn: span === 'full' ? '1 / -1' : 'span ' + span }}>{children}</div>;
}
export function ActionRow({ align = 'end', sticky = false, divider = false, start, children, className }) {
  return (
    <div className={cx('vui-actionrow', 'vui-actionrow--' + align, sticky && 'vui-actionrow--sticky', divider && 'vui-actionrow--divider', className)}>
      {start && <div className="vui-actionrow__start">{start}</div>}
      <div className="vui-actionrow__main">{children}</div>
    </div>
  );
}
