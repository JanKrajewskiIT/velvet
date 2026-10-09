import { createSignal } from 'solid-js';
import { Button, IconButton, Text } from '../../../src';
import {
  type CommandGroup,
  CommandPalette,
  ContextMenu,
  DropdownButton,
  Menu,
  MenuChip,
  type MenuItem,
  Toolbar,
  type ToolbarItem,
} from '../../../src/components/menus';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const COMMAND_GROUPS: CommandGroup[] = [
  {
    label: 'Suggestions',
    items: [
      { label: 'New project', icon: 'plus', shortcut: 'N', keywords: ['create'] },
      { label: 'Invite teammates', icon: 'users', keywords: ['member', 'add'] },
      { label: 'Toggle theme', icon: 'moon', shortcut: '⇧T', keywords: ['dark', 'light'] },
    ],
  },
  {
    label: 'Navigate',
    items: [
      { label: 'Dashboard', icon: 'layout-dashboard', shortcut: 'G D' },
      { label: 'Projects', icon: 'folder', shortcut: 'G P' },
      { label: 'Inbox', icon: 'inbox', shortcut: 'G I' },
      { label: 'Settings', icon: 'settings', shortcut: 'G S' },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Anna Kowalska', icon: 'user', description: 'Owner' },
      { label: 'Marek Nowak', icon: 'user', description: 'Admin' },
    ],
  },
];

const MenuDemo = () => {
  const [last, setLast] = createSignal('—');
  const pick = (name: string) => () => setLast(name);
  const projectItems: MenuItem[] = [
    { section: 'Project' },
    { label: 'Rename', icon: 'pencil', shortcut: 'F2', onSelect: pick('Rename') },
    { label: 'Duplicate', icon: 'copy', shortcut: '⌘D', onSelect: pick('Duplicate') },
    { label: 'Share link', icon: 'link', description: 'Anyone with the link can view', onSelect: pick('Share') },
    { divider: true },
    { label: 'Archive', icon: 'inbox', disabled: true },
    { label: 'Delete', icon: 'trash-2', danger: true, shortcut: '⌫', onSelect: pick('Delete') },
  ];
  const rowItems: MenuItem[] = [
    { label: 'Edit', icon: 'pencil', onSelect: pick('Edit') },
    { label: 'Move to…', icon: 'folder', onSelect: pick('Move') },
    { divider: true },
    { label: 'Remove', icon: 'trash-2', danger: true, onSelect: pick('Remove') },
  ];
  return (
    <>
      <Example
        title="Sections, shortcuts, danger, disabled"
        code={'<Menu trigger="Project" items={[{ label: "Rename", icon: "pencil" }, …]} />'}
      >
        <Menu trigger="Project" width={230} items={projectItems} />
        <Menu
          align="end"
          items={rowItems}
          trigger={(trigger) => <IconButton {...trigger} icon="more-horizontal" label="Row actions" />}
        />
        <Text tone="secondary">Last action: {last()}</Text>
      </Example>
    </>
  );
};

const CheckboxMenuDemo = () => {
  const [grid, setGrid] = createSignal(true);
  const [rulers, setRulers] = createSignal(false);
  const items = (): MenuItem[] => [
    { label: 'Snap to grid', checked: grid(), keepOpen: true, onSelect: () => setGrid(!grid()) },
    { label: 'Show rulers', checked: rulers(), keepOpen: true, onSelect: () => setRulers(!rulers()) },
  ];
  return (
    <Example
      title="Checkable items that keep the menu open"
      code={'{ label: "Snap to grid", checked: true, keepOpen: true }'}
    >
      <Menu trigger="View" items={items()} />
    </Example>
  );
};

const ContextMenuDemo = () => {
  const [message, setMessage] = createSignal('Right-click the canvas');
  const [snap, setSnap] = createSignal(true);
  const items = (): MenuItem[] => [
    { label: 'Paste', icon: 'copy', shortcut: '⌘V', onSelect: () => setMessage('Pasted') },
    { label: 'Select all', shortcut: '⌘A', onSelect: () => setMessage('Selected all') },
    { divider: true },
    { label: 'Snap to grid', checked: snap(), keepOpen: true, onSelect: () => setSnap(!snap()) },
    { divider: true },
    { label: 'Clear canvas', icon: 'trash-2', danger: true, onSelect: () => setMessage('Cleared') },
  ];
  return (
    <Example title="Region" stack code={'<ContextMenu items={items}>Right-click the canvas</ContextMenu>'}>
      <ContextMenu
        items={items()}
        style={{
          height: '240px',
          'box-sizing': 'border-box',
          'border-radius': '14px',
          border: '1.5px dashed var(--border-strong)',
          background: 'var(--bg-subtle)',
          display: 'grid',
          'place-items': 'center',
          color: 'var(--fg-secondary)',
        }}
      >
        {message()} (or focus and press Shift+F10)
      </ContextMenu>
    </Example>
  );
};

const DropdownButtonDemo = () => {
  const [status, setStatus] = createSignal('');
  return (
    <Example
      title="Split and plain"
      code={'<DropdownButton icon="check" onClick={save} items={[…]}>Save</DropdownButton>'}
    >
      <DropdownButton
        icon="check"
        onClick={() => setStatus('Saved')}
        items={[
          { label: 'Save as draft', icon: 'file', onSelect: () => setStatus('Draft saved') },
          { label: 'Save & publish', icon: 'globe', onSelect: () => setStatus('Published') },
        ]}
      >
        Save
      </DropdownButton>
      <DropdownButton
        variant="secondary"
        icon="download"
        onClick={() => setStatus('Exported CSV')}
        items={[
          { label: 'Export as CSV', onSelect: () => setStatus('CSV') },
          { label: 'Export as PDF', onSelect: () => setStatus('PDF') },
        ]}
      >
        Export
      </DropdownButton>
      <DropdownButton variant="ghost" items={[{ label: 'Newest first' }, { label: 'Oldest first' }]}>
        Sort
      </DropdownButton>
      <DropdownButton variant="soft" disabled onClick={() => setStatus('Never')} items={[{ label: 'Unavailable' }]}>
        Disabled
      </DropdownButton>
      <Text tone="secondary">{status()}</Text>
    </Example>
  );
};

const MenuChipDemo = () => (
  <Example title="Filter bar" code={'<MenuChip label="Status" options={[{ value: "open", label: "Open" }]} />'}>
    <MenuChip
      label="Status"
      defaultValue="open"
      options={[
        { value: 'open', label: 'Open' },
        { value: 'review', label: 'In review' },
        { value: 'closed', label: 'Closed' },
      ]}
    />
    <MenuChip label="Owner" icon="user" options={['Anna', 'Marek', 'Julia']} />
    <MenuChip label="Due" icon="calendar" options={['Today', 'This week', 'Overdue']} />
  </Example>
);

const ToolbarDemo = () => {
  const [bold, setBold] = createSignal(true);
  const [italic, setItalic] = createSignal(false);
  const [underline, setUnderline] = createSignal(false);
  const [align, setAlign] = createSignal('left');
  const alignItem = (value: string): ToolbarItem => ({
    label: `Align ${value}`,
    icon: `align-${value}`,
    active: align() === value,
    onClick: () => setAlign(value),
  });
  const items = (): ToolbarItem[] => [
    { label: 'Bold', icon: 'bold', active: bold(), onClick: () => setBold(!bold()), shortcut: '⌘B' },
    { label: 'Italic', icon: 'italic', active: italic(), onClick: () => setItalic(!italic()), shortcut: '⌘I' },
    {
      label: 'Underline',
      icon: 'underline',
      active: underline(),
      onClick: () => setUnderline(!underline()),
      shortcut: '⌘U',
    },
    { label: 'Strikethrough', icon: 'strikethrough' },
    { divider: true },
    alignItem('left'),
    alignItem('center'),
    alignItem('right'),
    { divider: true },
    { label: 'Bulleted list', icon: 'list' },
    { label: 'Numbered list', icon: 'list-ordered' },
    { label: 'Link', icon: 'link' },
    { label: 'Image', icon: 'image' },
    { label: 'Code', icon: 'code', disabled: true },
  ];
  return (
    <>
      <Example title="Full width" stack code={'<Toolbar label="Formatting" items={items} />'}>
        <Toolbar label="Formatting" items={items()} />
      </Example>
      <Example title="Narrow: overflow menu" stack code={'<div style="width: 260px"><Toolbar items={items} /></div>'}>
        <div style={{ width: '260px' }}>
          <Toolbar label="Formatting (narrow)" items={items()} />
        </div>
      </Example>
    </>
  );
};

const CommandPaletteDemo = () => {
  const [open, setOpen] = createSignal(false);
  const [chosen, setChosen] = createSignal('');
  const groups = (): CommandGroup[] =>
    COMMAND_GROUPS.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item, onSelect: () => setChosen(item.label) })),
    }));
  return (
    <Example
      title="Modal palette"
      code={'<CommandPalette open={open()} onClose={() => setOpen(false)} groups={groups} />'}
    >
      <Button variant="secondary" iconLeft="search" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <Text tone="secondary">{chosen() ? `Chosen: ${chosen()}` : 'Type to filter, ↑↓ to move, Enter to run'}</Text>
      <CommandPalette open={open()} onClose={() => setOpen(false)} groups={groups()} />
    </Example>
  );
};

export const menusDemos: DemoEntry[] = [
  {
    id: 'menu',
    group: '21 Menus',
    title: 'Menu',
    description:
      'Dropdown of actions attached to a trigger. Arrow keys, Home/End and typeahead move; Enter selects; Escape closes and refocuses the trigger.',
    render: () => (
      <>
        <MenuDemo />
        <CheckboxMenuDemo />
      </>
    ),
  },
  {
    id: 'context-menu',
    group: '21 Menus',
    title: 'ContextMenu',
    description: 'Right-click, Shift+F10 or the Menu key opens a menu at the pointer, clamped to the viewport.',
    render: () => <ContextMenuDemo />,
  },
  {
    id: 'dropdown-button',
    group: '21 Menus',
    title: 'DropdownButton',
    description: 'Split button (main action plus alternatives) or a single button that opens a menu.',
    render: () => <DropdownButtonDemo />,
  },
  {
    id: 'menu-chip',
    group: '21 Menus',
    title: 'MenuChip',
    description: 'Filter chip that opens a single-choice menu. Tinted when a value is set.',
    render: () => <MenuChipDemo />,
  },
  {
    id: 'toolbar',
    group: '15 Actions',
    title: 'Toolbar',
    description:
      'Tool row that never wraps: what does not fit collapses into an overflow menu. One tab stop, arrow keys move focus.',
    render: () => <ToolbarDemo />,
  },
  {
    id: 'command-palette',
    group: '21 Menus',
    title: 'CommandPalette',
    description: 'Modal palette with fuzzy-filtered, grouped results, match highlight and combobox keyboard handling.',
    render: () => <CommandPaletteDemo />,
  },
];
