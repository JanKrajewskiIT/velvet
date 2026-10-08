import { createSignal } from 'solid-js';
import {
  Calendar,
  ColorPicker,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  FileUpload,
  Text,
  TimePicker,
  TimeStepper,
  type DateRange,
  type UploadFile,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const DAY_MS = 864e5;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const BYTES_PER_KB = 1024;
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS);

const INITIAL_FILES: UploadFile[] = [
  { id: 1, name: 'brand-guidelines.pdf', size: 2_400_000, status: 'done' },
  { id: 2, name: 'hero.png', size: 860_000, status: 'uploading', progress: 62 },
  { id: 3, name: 'archive.zip', size: 18_000_000, status: 'error', error: 'File is larger than 5 MB' },
];
const SWATCHES = ['#8b0036', '#0057b8', '#1b873f', '#c77700', '#6f42c1'];

const CalendarDemo = () => {
  const [day, setDay] = createSignal<Date | null>(new Date());
  const [range, setRange] = createSignal<DateRange>({ start: null, end: null });
  return (
    <>
      <div>
        <Calendar value={day()} onValueChange={setDay} marks={[daysFromNow(2), daysFromNow(5)]} />
        <Text variant="caption" tone="secondary">
          {day()?.toDateString() ?? 'No date'}
        </Text>
      </div>
      <div>
        <Calendar mode="range" months={2} value={range()} onValueChange={setRange} min={new Date()} />
        <Text variant="caption" tone="secondary">
          {range().start?.toDateString() ?? '…'} → {range().end?.toDateString() ?? '…'}
        </Text>
      </div>
    </>
  );
};

const UploadDemo = () => {
  const [files, setFiles] = createSignal(INITIAL_FILES);
  const add = (added: File[]) =>
    setFiles([
      ...files(),
      ...added.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        status: 'done' as const,
      })),
    ]);
  return (
    <div class="sc-field--wide">
      <FileUpload
        files={files()}
        onFiles={add}
        onRemove={(id) => setFiles(files().filter((file) => file.id !== id))}
        onRetry={(id) =>
          setFiles(
            files().map((file) =>
              file.id === id
                ? { id: file.id, name: file.name, size: file.size, status: 'uploading' as const, progress: 10 }
                : file,
            ),
          )
        }
        accept="image/*,.pdf,.zip"
        maxSize={MAX_UPLOAD_BYTES}
        hint={`PNG, JPG, PDF or ZIP — up to ${MAX_UPLOAD_BYTES / BYTES_PER_KB / BYTES_PER_KB} MB`}
      />
    </div>
  );
};

export const formsPickerDemos: DemoEntry[] = [
  {
    id: 'calendar',
    group: 'Forms',
    title: 'Calendar',
    description:
      'Month grid, single or range with a hover preview. Arrows move by day or week, PageUp/Down by month (Shift = year).',
    render: () => (
      <Example title="Single with marks · range, two months" code={'<Calendar mode="range" months={2} />'}>
        <CalendarDemo />
      </Example>
    ),
  },
  {
    id: 'date-picker',
    group: 'Forms',
    title: 'DatePicker',
    description: 'Date field that opens a calendar popover with Today and Clear. Esc closes and refocuses.',
    render: () => (
      <>
        <Example title="Single date" code={'<DatePicker label="Due date" clearable />'}>
          <div class="sc-field">
            <DatePicker
              label="Due date"
              hint="Weekends are disabled"
              isDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
            />
          </div>
          <div class="sc-field">
            <DatePicker label="Starts" defaultValue={new Date()} size="sm" />
          </div>
        </Example>
        <Example title="Range with presets" code={'<DateRangePicker label="Reporting period" />'}>
          <div class="sc-field--wide">
            <DateRangePicker label="Reporting period" />
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'date-time-picker',
    group: 'Forms',
    title: 'DateTimePicker',
    description: 'Calendar and time slots in one popover.',
    render: () => (
      <Example title="24h and 12h" code={'<DateTimePicker hour12 step={15} />'}>
        <div class="sc-field">
          <DateTimePicker label="Meeting" min={new Date()} />
        </div>
        <div class="sc-field">
          <DateTimePicker label="Reminder" hour12 step={15} />
        </div>
      </Example>
    ),
  },
  {
    id: 'time-picker',
    group: 'Forms',
    title: 'TimePicker & TimeStepper',
    description: 'Typed time field with a slot list, and an inline hour / minute stepper for popovers and touch.',
    render: () => (
      <Example title="TimePicker 24h / 12h · TimeStepper" code={'<TimeStepper hour12 minuteStep={5} />'}>
        <div class="sc-field">
          <TimePicker label="Start" defaultValue="09:30" step={15} />
        </div>
        <div class="sc-field">
          <TimePicker label="End" hour12 defaultValue="17:00" />
        </div>
        <TimeStepper label="Alarm" defaultValue="07:45" hour12 minuteStep={5} />
      </Example>
    ),
  },
  {
    id: 'color-picker',
    group: 'Forms',
    title: 'ColorPicker',
    description: 'Colour field with a saturation / hue popover, hex input and presets; or a curated swatch grid.',
    render: () => (
      <Example title="Full, swatches and inline" code={'<ColorPicker variant="swatches" swatches={[…]} />'}>
        <ColorPicker label="Accent" defaultValue="#8b0036" />
        <ColorPicker label="Label colour" variant="swatches" swatches={SWATCHES} defaultValue="#0057b8" />
        <ColorPicker label="Inline" inline defaultValue="#1b873f" />
      </Example>
    ),
  },
  {
    id: 'file-upload',
    group: 'Forms',
    title: 'FileUpload',
    description: 'Dropzone and file list with progress, retry and remove. The upload itself is yours.',
    render: () => (
      <Example title="Done, uploading and error rows" stack>
        <UploadDemo />
      </Example>
    ),
  },
];
