import { createSignal, For } from 'solid-js';
import {
  AudioPlayer,
  Carousel,
  ImageCropper,
  ImageGrid,
  Lightbox,
  type LightboxImage,
  Marquee,
  MediaFrame,
  Button,
  Text,
  VideoPlayer,
  type CropArea,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const SVG_SIZE = { width: 800, height: 600 };
const TONE_SAMPLE_RATE = 8000;
const TONE_SECONDS = 4;
const TONE_HZ = 440;
const TONE_AMPLITUDE = 0.25;
const WAV_HEADER_BYTES = 44;
const BITS_PER_SAMPLE = 16;
const BYTES_PER_SAMPLE = BITS_PER_SAMPLE / 8;

const svgDataUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Gradient tile with a label, generated in code so the showcase needs no network. */
const placeholderImage = (label: string, hue: number, { width, height } = SVG_SIZE) =>
  svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 62%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360} 65% 38%)"/></linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/>` +
      `<circle cx="${width * 0.72}" cy="${height * 0.3}" r="${height * 0.14}" fill="rgba(255,255,255,.35)"/>` +
      `<text x="50%" y="56%" text-anchor="middle" font-family="sans-serif" font-size="${height * 0.09}" fill="#fff">${label}</text></svg>`,
  );

const IMAGE_LABELS = ['Harbour', 'Orchard', 'Canyon', 'Meadow', 'Glacier', 'Dunes', 'Lagoon', 'Summit'];

const sampleImages = (count: number): LightboxImage[] =>
  IMAGE_LABELS.slice(0, count).map((label, i) => ({
    src: placeholderImage(label, i * 43),
    alt: label,
    caption: `${label} at first light`,
  }));

const toneDataUri = () => {
  const samples = TONE_SAMPLE_RATE * TONE_SECONDS;
  const bytes = new Uint8Array(WAV_HEADER_BYTES + samples * BYTES_PER_SAMPLE);
  const view = new DataView(bytes.buffer);
  const ascii = (offset: number, text: string) =>
    [...text].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  ascii(0, 'RIFF');
  view.setUint32(4, bytes.length - 8, true);
  ascii(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, TONE_SAMPLE_RATE, true);
  view.setUint32(28, TONE_SAMPLE_RATE * BYTES_PER_SAMPLE, true);
  view.setUint16(32, BYTES_PER_SAMPLE, true);
  view.setUint16(34, BITS_PER_SAMPLE, true);
  ascii(36, 'data');
  view.setUint32(40, samples * BYTES_PER_SAMPLE, true);
  for (let i = 0; i < samples; i++) {
    const envelope = Math.min(1, i / 400, (samples - i) / 400);
    view.setInt16(
      WAV_HEADER_BYTES + i * BYTES_PER_SAMPLE,
      Math.sin((2 * Math.PI * TONE_HZ * i) / TONE_SAMPLE_RATE) * TONE_AMPLITUDE * envelope * 0x7fff,
      true,
    );
  }
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return `data:audio/wav;base64,${btoa(binary)}`;
};

const CAPTIONS_VTT =
  'data:text/vtt;charset=utf-8,' +
  encodeURIComponent('WEBVTT\n\n00:00.000 --> 00:04.000\nA placeholder caption track.\n');
const PEAKS = Array.from(
  { length: 40 },
  (_, i) => 0.25 + 0.7 * Math.abs(Math.sin(i / 3.1)) * Math.abs(Math.cos(i / 9)),
);
const BRANDS = ['Northwind', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne', 'Acme'];
const BLOCKED_SCHEME_SRC = 'javascript:alert(1)';

const MediaFrameDemo = () => {
  const [plays, setPlays] = createSignal(0);
  const poster = placeholderImage('Poster', 200);
  return (
    <>
      <Example
        title="Image · ratios"
        code={'<MediaFrame src={url} alt="Harbour" ratio="photo" caption="Harbour" credit="Photo: A. Smith" />'}
      >
        <div style={{ width: '260px' }}>
          <MediaFrame
            src={placeholderImage('Harbour', 20)}
            alt="Harbour"
            ratio="photo"
            caption="Harbour"
            credit="Photo: A. Smith"
          />
        </div>
        <div style={{ width: '160px' }}>
          <MediaFrame src={placeholderImage('Portrait', 120)} alt="Portrait" ratio="portrait" badge="New" />
        </div>
        <div style={{ width: '260px' }}>
          <MediaFrame
            src={placeholderImage('Wide', 280)}
            alt="Wide"
            ratio="wide"
            overlay={<Text variant="label">Overlay on a scrim</Text>}
          />
        </div>
      </Example>
      <Example
        title="Video thumbnail"
        code={'<MediaFrame kind="video" poster={poster} title="Studio tour" badge="2:14" onPlay={…} />'}
      >
        <div style={{ width: '320px' }}>
          <MediaFrame
            kind="video"
            poster={poster}
            title="Studio tour"
            badge="2:14"
            onPlay={() => setPlays(plays() + 1)}
          />
        </div>
        <Text variant="body-sm">Play pressed {plays()} times</Text>
      </Example>
      <Example
        title="Loading, empty, failed"
        code={'<MediaFrame loading />\n<MediaFrame showRatio ratio="square" />\n<MediaFrame src="/missing.jpg" />'}
      >
        <div style={{ width: '200px' }}>
          <MediaFrame loading ratio="photo" />
        </div>
        <div style={{ width: '200px' }}>
          <MediaFrame showRatio ratio="square" />
        </div>
        <div style={{ width: '200px' }}>
          <MediaFrame src="/definitely-missing.jpg" ratio="photo" alt="Missing" />
        </div>
        <div style={{ width: '200px' }}>
          {/* eslint-disable-next-line solid/jsx-no-script-url -- demonstrates that MediaFrame refuses script URLs */}
          <MediaFrame src={BLOCKED_SCHEME_SRC} ratio="photo" alt="Blocked scheme" />
        </div>
      </Example>
    </>
  );
};

const LightboxDemo = () => {
  const images = sampleImages(5);
  const [index, setIndex] = createSignal<number | null>(null);
  return (
    <>
      <Example
        title="Controlled Lightbox"
        code={'<Lightbox images={images} index={index()} onIndexChange={setIndex} onClose={() => setIndex(null)} />'}
      >
        <Button onClick={() => setIndex(0)}>Open viewer</Button>
        <Lightbox images={images} index={index()} onIndexChange={setIndex} onClose={() => setIndex(null)} />
      </Example>
      <Example title="ImageGrid · uniform with spans" stack code={'<ImageGrid images={images} columns={3} />'}>
        <ImageGrid images={images.map((image, i) => (i === 0 ? { ...image, span: 2, badge: 'Cover' } : image))} />
      </Example>
      <Example title="ImageGrid · feature" stack code={'<ImageGrid layout="feature" images={images} />'}>
        <ImageGrid layout="feature" images={images} />
      </Example>
      <Example
        title="ImageGrid · masonry, max with +N"
        stack
        code={'<ImageGrid layout="masonry" max={6} images={images} />'}
      >
        <ImageGrid
          layout="masonry"
          max={4}
          images={sampleImages(8).map((image, i) => ({ ...image, ratio: i % 2 ? '3 / 4' : '4 / 3' }))}
        />
      </Example>
    </>
  );
};

const CropperDemo = () => {
  const [area, setArea] = createSignal<CropArea>();
  const source = placeholderImage('Crop me', 160, { width: 1200, height: 800 });
  return (
    <>
      <Example
        title="Rectangle and circle"
        stack
        code={'<ImageCropper src={url} aspect={16 / 9} onCropChange={setArea} />'}
      >
        <ImageCropper src={source} alt="Placeholder landscape" aspect={16 / 9} onCropChange={setArea} />
        <ImageCropper src={source} alt="Placeholder landscape" shape="circle" height={280} rotatable={false} />
        <Text variant="body-sm">
          {area()
            ? `x ${area()?.x} · y ${area()?.y} · ${area()?.width}×${area()?.height} · zoom ${area()?.zoom.toFixed(2)}`
            : 'Waiting for image'}
        </Text>
      </Example>
    </>
  );
};

export const mediaDemos: DemoEntry[] = [
  {
    id: 'media-frame',
    group: '24 Media',
    title: 'MediaFrame',
    description:
      'Fixed-ratio frame for an image, video or embed with loading, empty and failed states. Unsafe URL schemes are treated as a failed load.',
    render: () => <MediaFrameDemo />,
  },
  {
    id: 'video-player',
    group: '24 Media',
    title: 'VideoPlayer',
    description:
      'Velvet controls over a video. Keyboard on the focused player: Space / K, ← →, J / L, M, F, C. No video is bundled; pass your own src.',
    render: () => (
      <Example
        title="Player with captions track"
        code={
          '<VideoPlayer src={url} poster={poster} title="Studio tour" tracks={[{ src: vtt, srcLang: "en", label: "English", kind: "captions" }]} />'
        }
      >
        <div style={{ width: 'min(100%, 640px)' }}>
          <VideoPlayer
            src="/placeholder-video.mp4"
            poster={placeholderImage('Studio tour', 210, { width: 1280, height: 720 })}
            title="Studio tour"
            tracks={[{ src: CAPTIONS_VTT, srcLang: 'en', label: 'English', kind: 'captions' }]}
          />
        </div>
      </Example>
    ),
  },
  {
    id: 'audio-player',
    group: '24 Media',
    title: 'AudioPlayer',
    description:
      'Waveform scrubber row: click or drag, ← → 5 s, PgUp / PgDn 15 s, Space plays. The tone is generated in code.',
    render: () => {
      const tone = toneDataUri();
      return (
        <>
          <Example
            title="Default with cover and peaks"
            stack
            code={'<AudioPlayer src={url} title="Interview" artist="Studio B" cover={art} peaks={peaks} />'}
          >
            <AudioPlayer
              src={tone}
              title="Interview, part 1"
              artist="Studio B"
              cover={placeholderImage('Cover', 300, { width: 112, height: 112 })}
              peaks={PEAKS}
            />
            <AudioPlayer src={tone} title="Decorative waveform" />
          </Example>
          <Example title="Compact voice note" stack code={'<AudioPlayer size="sm" src={url} title="Voice note" />'}>
            <AudioPlayer size="sm" src={tone} title="Voice note" />
          </Example>
        </>
      );
    },
  },
  {
    id: 'carousel',
    group: '24 Media',
    title: 'Carousel',
    description:
      'Arrows, dots, swipe and ←→ keys. Off-screen slides are inert; autoplay pauses on hover and focus and is off under reduced motion.',
    render: () => {
      const slides = sampleImages(6).map((image) => (
        <MediaFrame src={image.src} alt={image.alt} ratio="photo" caption={image.caption} />
      ));
      return (
        <>
          <Example
            title="Single slide with autoplay"
            stack
            code={'<Carousel label="Highlights" autoplay={4000} loop slides={slides} />'}
          >
            <Carousel label="Highlights" autoplay={4000} loop slides={slides.slice(0, 4)} />
          </Example>
          <Example title="Three per view" stack code={'<Carousel perView={3} gap={12} slides={slides} />'}>
            <Carousel label="Gallery" perView={3} gap={12} slides={slides} />
          </Example>
        </>
      );
    },
  },
  {
    id: 'marquee',
    group: '24 Media',
    title: 'Marquee',
    description:
      'Infinite scroller for logo walls. The duplicate copy is aria-hidden; pauses on hover and is static under reduced motion.',
    render: () => (
      <>
        <Example title="Logo wall" stack code={'<Marquee label="Customer logos">…</Marquee>'}>
          <Marquee label="Customer logos">
            <For each={BRANDS}>{(brand) => <Text variant="title">{brand}</Text>}</For>
          </Marquee>
        </Example>
        <Example title="Right, no fade" stack code={'<Marquee direction="right" fade={false} speed={80} />'}>
          <Marquee label="Customer logos, reversed" direction="right" fade={false} speed={80}>
            <For each={BRANDS}>{(brand) => <Text variant="title">{brand}</Text>}</For>
          </Marquee>
        </Example>
      </>
    ),
  },
  {
    id: 'lightbox',
    group: '24 Media',
    title: 'Lightbox & ImageGrid',
    description: 'Full-screen image viewer (focus trapped and restored, ←→ / Esc) and the grids that open it.',
    render: () => <LightboxDemo />,
  },
  {
    id: 'image-cropper',
    group: '24 Media',
    title: 'ImageCropper',
    description:
      'Fixed-aspect crop: drag or arrows to pan, Slider / wheel / + − to zoom, rotate in 90° steps. Reports the crop in source pixels.',
    render: () => <CropperDemo />,
  },
];
