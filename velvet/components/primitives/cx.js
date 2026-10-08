// Joins truthy class names: cx('vui-btn', on && 'vui-btn--on') → "vui-btn vui-btn--on"
export const cx = (...a) => a.filter(Boolean).join(' ');
