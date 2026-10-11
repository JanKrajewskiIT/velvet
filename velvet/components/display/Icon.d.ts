import * as React from 'react';
/** Velvet Icons glyph as inline SVG. Inherits currentColor; 24px grid, 1.75 stroke. For plain HTML use <i class="vui-icon icon-NAME">. */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Velvet icon name, e.g. "arrow-right". See VelvetIcons for the full list. */
  name: 'plus'|'minus'|'x'|'check'|'chevron-down'|'chevron-up'|'chevron-left'|'chevron-right'|'arrow-right'|'arrow-left'|'arrow-up'|'arrow-down'|'external-link'|'menu'|'more-horizontal'|'more-vertical'|'search'|'settings'|'sliders'|'filter'|'home'|'layout-dashboard'|'layout-grid'|'list'|'kanban'|'folder'|'file'|'inbox'|'mail'|'bell'|'calendar'|'clock'|'user'|'users'|'shield'|'lock'|'log-out'|'eye'|'eye-off'|'pencil'|'trash-2'|'copy'|'link'|'download'|'upload'|'refresh'|'tag'|'image'|'bar-chart'|'globe'|'monitor'|'sun'|'moon'|'heart'|'star'|'sparkles'|'play'|'info'|'circle-check'|'circle-x'|'triangle-alert'|'grip-vertical'|'command'|'code'|'maximize'|'pause'|'send'|'bold'|'italic'|'underline'|'strikethrough'|'list-ordered'|'align-left'|'align-center'|'align-right'|'chevrons-left'|'chevrons-right'|'circle-help'|'zoom-in'|'languages'|'map-pin'|'pin'|'message-square'|'palette'|'database'|'rotate-ccw'|'log-in'|'chevrons-up-down'|'caret-up'|'caret-down'|'swap-vertical'|'check-double'|'clipboard'|'cloud-upload'|'share'|'git-branch'|'git-merge'|'save'|'alert-circle'|'unlock'|'zap'|'target'|'shield-check'|'file-text'|'book-open'|'briefcase'|'calendar-plus'|'phone'|'star-filled'|'user-circle'|'handshake'|'trending-up'|'dollar-sign'|'wand'|'sitemap'|'server'|'building'|'graduation-cap'|'thumbs-up'|'close'|'trash'|'edit'|'alert-triangle'|'check-circle'|'x-circle'|'help-circle'|'grid'|'user-plus'|'key'|'paperclip'|'bookmark'|'flag'|'folder-open'|'arrow-up-right'|'at-sign'|'layers'|'megaphone'|'id-card'|'compass'|'video'|'mic'|'volume'|'stop'|'skip-forward'|'home-filled'|'bell-filled'|'user-filled'|'folder-filled'|'briefcase-filled'|'person-filled'|'desktop-filled'|'graduation-cap-filled'|'bookmark-filled'|'heart-filled'|'message-square-filled'|'attach'|'badge'|'chat'|'message'|'warning'|'success'|'error'|'help'|'logout'|'expand';
  /** Pixel size. @default 1.15em */
  size?: number | string;
  color?: string;
  /** @default 1.75 — use 1.5 at ≥32px, 2 at ≤14px */
  strokeWidth?: number;
  /** Accessible label; omit for decorative icons */
  label?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
/** Raw SVG inner markup per icon name */
export declare const VelvetIcons: Record<string, string>;
/** Icon names grouped by category */
export declare const IconCategories: Record<string, string[]>;
/** Legacy alias names (close, trash, edit, alert-triangle, check-circle, x-circle, help-circle, grid, attach, badge, chat, message, warning, success, error, help, logout, expand) → canonical Velvet name. Prefer canonical names in new code. */
export declare const IconAliases: Record<string, string>;
/** Base names that have a `<name>-filled` twin (home, bell, user, folder, bookmark, heart, message-square, star). Filled = selected state only (active BottomNav tab, mobile Navbar rail, pressed ToggleButton) — never decoration. */
export declare const IconFilled: string[];
/** Returns `<name>-filled` when `on` and a filled twin exists, else `name`. */
export declare function filledIcon(name: string, on?: boolean): string;
