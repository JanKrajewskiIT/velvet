import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Breadcrumb } from '../navigation/Breadcrumb.jsx';
import { Tabs } from '../navigation/Tabs.jsx';
import { Badge } from '../display/Badge.jsx';
import { cx } from '../primitives/cx.js';
export function PageHeader({ breadcrumb, eyebrow, onBack, backLabel = 'Back', title, status, description, meta, actions, tabs, activeTab, defaultTab, onTabChange, className }) {
  const st = status == null ? null : typeof status === 'object' && !React.isValidElement(status) ? <Badge tone={status.tone || 'success'} dot>{status.label}</Badge> : typeof status === 'string' ? <Badge tone="success" dot>{status}</Badge> : status;
  return (
    <header className={cx('vui-page-header', 'vui-page-header--card', tabs && tabs.length && 'vui-page-header--tabs', className)}>
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} className="vui-page-header__crumb" />}
      {!breadcrumb && eyebrow && <div className="vui-page-header__eyebrow">{eyebrow}</div>}
      <div className="vui-page-header__main">
        {onBack && <IconButton icon="arrow-left" label={backLabel} variant="secondary" className="vui-page-header__back" onClick={onBack} />}
        <div className="vui-page-header__titlewrap">
          <div className="vui-page-header__titlerow">
            <h1 className="vui-page-header__title">{title}</h1>
            {st}
          </div>
          {description && <p className="vui-page-header__desc">{description}</p>}
          {meta && meta.length > 0 && (
            <ul className="vui-page-header__meta">
              {meta.map((m, i) => <li key={i}>{m.icon && <Glyph name={m.icon} />}<span>{m.label}</span></li>)}
            </ul>
          )}
        </div>
        {actions && <div className="vui-page-header__actions">{actions}</div>}
      </div>
      {tabs && tabs.length > 0 && <Tabs className="vui-page-header__tabs" items={tabs} value={activeTab} defaultValue={defaultTab ?? (tabs[0] && tabs[0].value)} onChange={onTabChange} />}
    </header>
  );
}
