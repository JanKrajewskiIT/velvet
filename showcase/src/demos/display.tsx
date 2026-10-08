import { createSignal, For, type JSX } from 'solid-js';
import { Button, CATEGORY_TONES, Text, TONES } from '../../../src';
import {
  Badge,
  BrandLogo,
  type BadgeVariant,
  Card,
  Icon,
  IconAliases,
  IconCategories,
  IconFilled,
  filledIcon,
  Markdown,
  MarkdownEditDialog,
  MarkdownEditor,
  QRCode,
  StructuredCard,
  Tag,
  Watermark,
} from '../../../src/components/display';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const BADGE_VARIANTS: BadgeVariant[] = ['soft', 'solid', 'outline'];
const SAVE_DELAY_MS = 800;
const INVITE_URL = 'https://velvet.example/invite/8f3k2q';

const MARKDOWN_SAMPLE = `# Release notes

Velvet renders **bold**, _italic_, ~~struck~~ and \`inline code\`, plus [links](https://example.com), [reference links][docs] and https://example.com/autolinks.

1. Nested lists
   - with task items
     - [x] Ship the editor
     - [ ] Write the docs
2. Hard line break  
   after two trailing spaces

Setext heading
--------------

> Quotes nest **inline** formatting.

| Token | Role |
| :--- | ---: |
| \`--fg-primary\` | text |
| \`--action-primary\` | brand |

\`\`\`ts
const answer = 42;
\`\`\`

<script>alert('escaped, not executed')</script>

[docs]: https://example.com/docs "Documentation"
`;

const MEDIA_STYLE: JSX.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'grid',
  'place-items': 'center',
  color: 'var(--fg-tertiary)',
  background: 'var(--bg-sunken)',
};

const MediaPlaceholder = (props: { label: string }) => <div style={MEDIA_STYLE}>{props.label}</div>;

const EditorDemo = () => {
  const [value, setValue] = createSignal('## Draft\n\nStart typing…');
  return (
    <MarkdownEditor label="Description" hint="Supports Markdown." value={value()} onChange={setValue} maxLength={400} />
  );
};

const EditDialogDemo = () => {
  const [open, setOpen] = createSignal(false);
  const [text, setText] = createSignal('Some **saved** text.');
  const save = (next: string) =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setText(next);
        resolve();
      }, SAVE_DELAY_MS),
    );
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Edit description
      </Button>
      <Markdown size="sm">{text()}</Markdown>
      <MarkdownEditDialog
        open={open()}
        onClose={() => setOpen(false)}
        title="Edit description"
        value={text()}
        onSave={save}
      />
    </>
  );
};

const FilterTags = () => {
  const [active, setActive] = createSignal(new Set(['Design']));
  const toggle = (name: string) =>
    setActive((current) => {
      const next = new Set(current);
      if (!next.delete(name)) next.add(name);
      return next;
    });
  return (
    <For each={['Design', 'Engineering', 'Research']}>
      {(name) => (
        <Tag selected={active().has(name)} onClick={() => toggle(name)}>
          {name}
        </Tag>
      )}
    </For>
  );
};

const RemovableTags = () => {
  const [tags, setTags] = createSignal(['solid', 'typescript', 'tokens']);
  return (
    <For each={tags()}>
      {(name) => <Tag onRemove={() => setTags((current) => current.filter((item) => item !== name))}>{name}</Tag>}
    </For>
  );
};

export const displayDemos: DemoEntry[] = [
  {
    id: 'badge',
    group: 'Display',
    title: 'Badge',
    description: 'Small non-interactive status or count label.',
    render: () => (
      <>
        <For each={BADGE_VARIANTS}>
          {(variant) => (
            <Example title={`Variant: ${variant}`} code={`<Badge tone="success" variant="${variant}">Active</Badge>`}>
              <For each={TONES}>
                {(tone) => (
                  <Badge tone={tone} variant={variant}>
                    {tone}
                  </Badge>
                )}
              </For>
            </Example>
          )}
        </For>
        <Example title="Dot, pulse, icon, size" code={'<Badge tone="danger" dot pulse>Live</Badge>'}>
          <Badge tone="success" dot>
            Online
          </Badge>
          <Badge tone="danger" dot pulse>
            Live
          </Badge>
          <Badge tone="info" icon="sparkles">
            New
          </Badge>
          <Badge size="sm" tone="brand">
            Small
          </Badge>
        </Example>
      </>
    ),
  },
  {
    id: 'brand-logo',
    group: 'Display',
    title: 'BrandLogo',
    description: 'Brand mark: the Recron signet and wordmark, or the type-only velvet/ui placeholder.',
    render: () => (
      <>
        <Example title="Velvet" code={'<BrandLogo variant="wordmark" size="lg" glow={false} />'}>
          <BrandLogo />
          <BrandLogo variant="mark" />
          <BrandLogo variant="wordmark" size="lg" />
          <BrandLogo glow={false} size={28} />
        </Example>
        <Example title="Recron" code={'<BrandLogo brand="recron" size="lg" />'}>
          <BrandLogo brand="recron" size="sm" />
          <BrandLogo brand="recron" />
          <BrandLogo brand="recron" variant="mark" size="lg" />
        </Example>
        <Example title="Inverse on a brand fill" code={'<BrandLogo brand="recron" tone="inverse" />'}>
          <div style={{ background: 'var(--action-primary)', padding: '16px', 'border-radius': 'var(--radius-md)' }}>
            <BrandLogo brand="recron" tone="inverse" />
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'card',
    group: 'Display',
    title: 'Card',
    description: 'Content container: Surface plus header, body and footer regions.',
    render: () => (
      <>
        <Example title="Regions" stack code={'<Card title="Title" description="…" actions={…} footer={…}>Body</Card>'}>
          <Card
            title="Billing"
            description="Manage plan and invoices."
            actions={
              <Button size="sm" variant="ghost" iconLeft="settings">
                Manage
              </Button>
            }
            footer={
              <>
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </>
            }
          >
            Your workspace is on the Team plan.
          </Card>
        </Example>
        <Example title="Padding and footer alignment" stack code={'<Card padding="sm" footerAlign="between" …>'}>
          <Card padding="sm" title="Small padding" footerAlign="start" footer={<Button size="sm">Start</Button>}>
            Body
          </Card>
          <Card
            padding="lg"
            title="Large padding"
            footerAlign="between"
            footer={
              <>
                <Text variant="caption">Updated today</Text>
                <Button size="sm">Open</Button>
              </>
            }
          >
            Body
          </Card>
          <Card padding="none" title="No padding">
            Body
          </Card>
        </Example>
        <Example title="Surface behaviour" code={'<Card hoverable tonal tone="teal" accent>…</Card>'}>
          <Card hoverable tonal tone="teal" accent title="Tonal">
            Tinted hover
          </Card>
          <Card interactive title="Interactive">
            Whole card is one action
          </Card>
          <Card selected title="Selected">
            Brand-tinted
          </Card>
        </Example>
      </>
    ),
  },
  {
    id: 'icon',
    group: 'Display',
    title: 'Icon',
    description: 'Velvet icons as inline SVG: inherits currentColor, 24px grid, 1.75 stroke.',
    render: () => (
      <>
        <Example title="Sizes and stroke" code={'<Icon name="star" size={32} strokeWidth={1.5} />'}>
          <Icon name="star" />
          <Icon name="star" size={24} />
          <Icon name="star" size={32} strokeWidth={1.5} />
          <Icon name="star" size={14} strokeWidth={2} />
          <Icon name="heart" size={24} color="var(--fg-danger)" label="Favourite" />
        </Example>
        <Example title="Filled twins (selected state)" code={'<Icon name={filledIcon("bell", selected)} />'}>
          <For each={IconFilled}>
            {(name) => (
              <>
                <Icon name={filledIcon(name)} size={22} />
                <Icon name={filledIcon(name, true)} size={22} />
              </>
            )}
          </For>
        </Example>
        <For each={Object.entries(IconCategories)}>
          {([category, names]) => (
            <Example title={category}>
              <For each={names}>{(name) => <Icon name={name} size={22} label={name} />}</For>
            </Example>
          )}
        </For>
        <Example title="Legacy aliases" code={'IconAliases.close // "x"'}>
          <For each={Object.entries(IconAliases)}>
            {([alias, canonical]) => (
              <Tag icon={<Icon name={alias as keyof typeof IconAliases} />} size="sm">
                {alias} → {canonical}
              </Tag>
            )}
          </For>
        </Example>
      </>
    ),
  },
  {
    id: 'markdown',
    group: 'Display',
    title: 'Markdown',
    description: 'Markdown as Velvet prose. HTML in the source is escaped and only safe URLs are kept.',
    render: () => (
      <>
        <Example title="Sizes" stack code={'<Markdown size="sm">**Bold** text</Markdown>'}>
          <Markdown size="sm">{'Small: **comments** and cards'}</Markdown>
          <Markdown>{'Medium: the default'}</Markdown>
          <Markdown size="lg">{'Large: **articles**'}</Markdown>
        </Example>
        <Example title="Full syntax and escaping" stack code={'<Markdown source={text} />'}>
          <Markdown source={MARKDOWN_SAMPLE} />
        </Example>
      </>
    ),
  },
  {
    id: 'markdown-editor',
    group: 'Display',
    title: 'MarkdownEditor & MarkdownEditDialog',
    description: 'Write, split and preview a Markdown field with a toolbar, shortcuts and list continuation.',
    render: () => (
      <>
        <Example title="Editor" stack code={'<MarkdownEditor label="Description" maxLength={400} />'}>
          <EditorDemo />
        </Example>
        <Example title="States" stack code={'<MarkdownEditor error="Required" defaultMode="write" />'}>
          <MarkdownEditor label="Invalid" error="A description is required." defaultMode="write" height={140} />
          <MarkdownEditor label="Disabled" disabled defaultValue="Locked" defaultMode="write" height={120} />
          <MarkdownEditor label="Read only" readOnly defaultValue="**Read** only" defaultMode="preview" height={120} />
        </Example>
        <Example
          title="In a dialog"
          stack
          code={'<MarkdownEditDialog open={open()} onClose={close} value={text} onSave={save} />'}
        >
          <EditDialogDemo />
        </Example>
      </>
    ),
  },
  {
    id: 'qr-code',
    group: 'Display',
    title: 'QRCode',
    description: 'Scannable QR code generated in the browser. Pair it with a visible link.',
    render: () => (
      <>
        <Example title="Sizes" code={'<QRCode value="https://…" size={120} />'}>
          <QRCode value={INVITE_URL} size={96} />
          <QRCode value={INVITE_URL} />
          <QRCode value={INVITE_URL} size={220} />
        </Example>
        <Example title="Error correction and logo" code={'<QRCode value="…" level="Q" logo="sparkles" />'}>
          <QRCode value={INVITE_URL} level="L" />
          <QRCode value={INVITE_URL} level="Q" />
          <QRCode value={INVITE_URL} logo="sparkles" />
        </Example>
        <Example title="Too long" code={'<QRCode value={veryLongText} />'}>
          <QRCode value={'x'.repeat(4000)} />
        </Example>
      </>
    ),
  },
  {
    id: 'structured-card',
    group: 'Display',
    title: 'StructuredCard',
    description: 'Card laid out in hairline-divided regions: media, header, body, footer.',
    render: () => (
      <Example
        title="Regions"
        code={'<StructuredCard media={…} mediaTag={…} title="…" footer={…}>Body</StructuredCard>'}
      >
        <StructuredCard
          hoverable
          tonal
          tone="teal"
          accent
          title="Project Atlas"
          meta={
            <>
              <Icon name="clock" />
              Updated 2h ago
            </>
          }
          badge={
            <Badge tone="success" dot>
              Active
            </Badge>
          }
          footer={<Button size="sm">Open</Button>}
          footerAlign="end"
        >
          Header and footer carry hairlines from the same border the card uses.
        </StructuredCard>
        <StructuredCard
          hoverable
          tonal
          tone="violet"
          media={<MediaPlaceholder label="media · 16:9" />}
          mediaTag={<Badge variant="solid">Guide</Badge>}
          mediaMeta={
            <>
              <Icon name="clock" />6 min read
            </>
          }
          footer={
            <>
              <Text variant="caption">Maria Nowak</Text>
              <Button size="sm" variant="link">
                Read
              </Button>
            </>
          }
        >
          The scrim keeps overlaid tags legible on any image.
        </StructuredCard>
        <StructuredCard
          interactive
          as="button"
          tone="blue"
          accent
          media={<MediaPlaceholder label="cover · 4:3" />}
          mediaRatio="4 / 3"
          title="Interactive"
          meta="Whole card is one action"
          badge={<Badge tone="info">New</Badge>}
        />
      </Example>
    ),
  },
  {
    id: 'tag',
    group: 'Display',
    title: 'Tag',
    description: 'Chip for filters, categories and removable selections.',
    render: () => (
      <>
        <Example title="Variants and shapes" code={'<Tag variant="soft" tone="success" shape="pill">Hired</Tag>'}>
          <Tag>Outline</Tag>
          <Tag variant="soft" tone="success">
            Soft
          </Tag>
          <Tag variant="dashed">Dashed</Tag>
          <Tag shape="pill" variant="soft" tone="brand">
            Pill
          </Tag>
          <Tag size="sm" icon="tag">
            Small
          </Tag>
        </Example>
        <Example title="Tones" code={'<Tag variant="soft" tone="teal">teal</Tag>'}>
          <For each={[...TONES, ...CATEGORY_TONES]}>
            {(tone) => (
              <Tag variant="soft" tone={tone}>
                {tone}
              </Tag>
            )}
          </For>
        </Example>
        <Example title="Selectable filters" code={'<Tag selected={on()} onClick={toggle}>Design</Tag>'}>
          <FilterTags />
          <Tag onClick={() => undefined} disabled>
            Disabled
          </Tag>
        </Example>
        <Example title="Removable" code={'<Tag onRemove={remove}>solid</Tag>'}>
          <RemovableTags />
          <Tag onRemove={() => undefined} disabled>
            Locked
          </Tag>
        </Example>
      </>
    ),
  },
  {
    id: 'watermark',
    group: 'Display',
    title: 'Watermark',
    description: 'Repeating diagonal text over its children. A deterrent, not access control.',
    render: () => (
      <>
        <Example title="Text" stack code={'<Watermark text="Draft">…</Watermark>'}>
          <Watermark
            text="Draft"
            style={{ padding: '32px', border: '1px solid var(--border-default)', 'border-radius': 'var(--radius-md)' }}
          >
            <Text variant="h4">Quarterly report</Text>
            <Text>Content stays readable and selectable beneath the stamp.</Text>
          </Watermark>
        </Example>
        <Example
          title="Multi-line, tuned"
          stack
          code={'<Watermark lines={["anna@velvet.io", "2026-10-06"]} rotate={-30} opacity={0.1} />'}
        >
          <Watermark
            lines={['anna@velvet.io', '2026-10-06']}
            rotate={-30}
            gap={[64, 48]}
            opacity={0.1}
            style={{ padding: '32px', border: '1px solid var(--border-default)', 'border-radius': 'var(--radius-md)' }}
          >
            <Text variant="h4">Shared document</Text>
            <Text>The viewer's email identifies the copy.</Text>
          </Watermark>
        </Example>
      </>
    ),
  },
];
