import { For, type JSX } from 'solid-js';
import { Avatar, Checkmark, Dot, Glyph, IconTile, Swatch } from '../../../src';
import { Example } from '../Example';
import { autoFillColumns, gridStyle } from './foundations-a-parts';
import { Specimen } from './foundations-b-parts';

const ICON_SIZES = [
  '--size-icon-xs',
  '--size-icon-sm',
  '--size-icon-md',
  '--size-icon-lg',
  '--size-icon-xl',
  '--size-icon-2xl',
];
const AVATAR_SIZES = [
  { token: '--size-avatar-xs', size: 'xs' },
  { token: '--size-avatar-sm', size: 'sm' },
  { token: '--size-avatar-md', size: 'md' },
  { token: '--size-avatar-lg', size: 'lg' },
  { token: '--size-avatar-xl', size: 'xl' },
] as const;
const HIT_TARGETS = [
  { token: '--hit-target-sm', icon: '--size-icon-sm', radius: '--radius-xs' },
  { token: '--hit-target-min', icon: '--size-icon-lg', radius: '--radius-sm' },
];
const TILE_SIZES = [
  { token: '--size-icon-tile-sm', size: 'sm' },
  { token: '--size-icon-tile-md', size: 'md' },
  { token: '--size-icon-tile-lg', size: 'lg' },
  { token: '--size-icon-tile-xl', size: 'xl' },
  { token: '--size-icon-tile-2xl', size: '2xl' },
  { token: '--size-icon-tile-3xl', size: '3xl' },
] as const;

const groupStyle: JSX.CSSProperties = { ...gridStyle(autoFillColumns), 'align-items': 'end' };
const separatedGroupStyle: JSX.CSSProperties = {
  ...groupStyle,
  'padding-top': 'var(--space-4)',
  'border-top': 'var(--border-width) solid var(--border-subtle)',
};

const IconSizes = () => (
  <div style={groupStyle}>
    <For each={ICON_SIZES}>
      {(token) => (
        <Specimen name={token}>
          <Glyph name="sparkles" style={{ 'font-size': `var(${token})`, color: 'var(--fg-secondary)' }} />
        </Specimen>
      )}
    </For>
  </div>
);

const AvatarSizes = () => (
  <div style={separatedGroupStyle}>
    <For each={AVATAR_SIZES}>
      {(avatar) => (
        <Specimen name={avatar.token}>
          <Avatar initials="AN" size={avatar.size} />
        </Specimen>
      )}
    </For>
  </div>
);

const SmallControls = () => (
  <div style={separatedGroupStyle}>
    <Specimen name="--size-dot-sm · --size-dot · --size-dot-lg">
      <span style={{ display: 'flex', 'align-items': 'center', gap: 'var(--space-1-5)' }}>
        <Dot size="sm" tone="brand" />
        <Dot tone="brand" />
        <Dot size="lg" tone="brand" />
      </span>
    </Specimen>
    <Specimen name="--size-check">
      <Checkmark checked />
    </Specimen>
    <Specimen name="--size-check-sm">
      <Checkmark checked size="sm" />
    </Specimen>
    <Specimen name="--size-swatch">
      <Swatch tone="brand" />
    </Specimen>
    <For each={HIT_TARGETS}>
      {(target) => (
        <Specimen name={target.token}>
          <span
            style={{
              display: 'grid',
              'place-items': 'center',
              width: `var(${target.token})`,
              height: `var(${target.token})`,
              border: 'var(--border-width) dashed var(--border-strong)',
              'border-radius': `var(${target.radius})`,
            }}
          >
            <Glyph name="x" style={{ 'font-size': `var(${target.icon})` }} />
          </span>
        </Specimen>
      )}
    </For>
  </div>
);

const IconTiles = () => (
  <div style={separatedGroupStyle}>
    <For each={TILE_SIZES}>
      {(tile) => (
        <Specimen name={tile.token}>
          <IconTile icon="sparkles" size={tile.size} />
        </Specimen>
      )}
    </For>
  </div>
);

export const FixedSizesExample = () => (
  <Example title="Fixed sizes" stack>
    <IconSizes />
    <AvatarSizes />
    <SmallControls />
    <IconTiles />
  </Example>
);
