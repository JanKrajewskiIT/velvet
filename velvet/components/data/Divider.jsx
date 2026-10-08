import React from 'react';
export function Divider({ label, orientation = 'horizontal', className }) {
  const cls = ['vui-divider', !label && orientation === 'horizontal' && 'vui-divider--plain', orientation === 'vertical' && 'vui-divider--vertical', className].filter(Boolean).join(' ');
  return <div role="separator" aria-orientation={orientation} className={cls}>{label}</div>;
}
