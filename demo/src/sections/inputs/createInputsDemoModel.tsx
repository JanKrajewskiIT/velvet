import { addToast, type MultiSelectOption } from '@jankrajewskiit/ui';
import { IoAddSharp, IoCalendar, IoMail, IoSearch } from 'solid-icons/io';
import { createMemo, createSignal } from 'solid-js';

import { DEMO_FRAMEWORK_OPTIONS, DEMO_INPUT_PRESET_COLORS, type DemoRoleValue } from '../../fixtures/inputsFixtures';
import { useDemoDictionary } from '../../hooks/useDemoDictionary';
import { renderRichText } from '../../i18n/renderRichText';

const PRESET_COLORS = DEMO_INPUT_PRESET_COLORS;
const FRAMEWORK_OPTIONS: MultiSelectOption[] = DEMO_FRAMEWORK_OPTIONS;

export const createInputsDemoModel = () => {
  const { t } = useDemoDictionary();
  const releaseNotesTitle = () => t('demo.text.inputs.inlineEditableText.initialValue');
  const releaseNotesHtml = () => t('demo.text.inputs.richTextEditor.sampleHtml');
  const [loading, setLoading] = createSignal(false);
  const [text, setText] = createSignal('');
  const [editableTitle, setEditableTitle] = createSignal(releaseNotesTitle());
  const [selected, setSelected] = createSignal('');
  const [frameworks, setFrameworks] = createSignal(['solid', 'vue']);
  const [tags, setTags] = createSignal(['solid-js', 'vite']);
  const [autoValues, setAutoValues] = createSignal(['TypeScript']);
  const [color, setColor] = createSignal('#1467ff');
  const [newsletter, setNewsletter] = createSignal(true);
  const [notifications, setNotifications] = createSignal(false);
  const [termsAccepted, setTermsAccepted] = createSignal(false);
  const [marketingEmails, setMarketingEmails] = createSignal(true);
  const [focusMode, setFocusMode] = createSignal(false);
  const [role, setRole] = createSignal<DemoRoleValue>('editor');
  const [viewMode, setViewMode] = createSignal('list');
  const [sliderEnhancedValue, setSliderEnhancedValue] = createSignal(55);
  const [sliderNoBubbleValue, setSliderNoBubbleValue] = createSignal(30);
  const [priceRange, setPriceRange] = createSignal({ min: 20, max: 80 });
  const [priceRangeNoBubbles, setPriceRangeNoBubbles] = createSignal({ min: 15, max: 65 });
  const [rating, setRating] = createSignal(3);
  const [segment, setSegment] = createSignal('list');
  const [billingCycle, setBillingCycle] = createSignal('monthly');
  const [iconCategory, setIconCategory] = createSignal('solid');
  const [chipCategory, setChipCategory] = createSignal<string | null>('solid-basics');
  const [hierarchicalMainCategory, setHierarchicalMainCategory] = createSignal<string | null>('frontend');
  const [hierarchicalChildCategory, setHierarchicalChildCategory] = createSignal<string | null>('solidjs');
  const [otp, setOtp] = createSignal('');
  const [date, setDate] = createSignal('');
  const [time, setTime] = createSignal('');
  const [time15, setTime15] = createSignal('');
  const [quantity, setQuantity] = createSignal(5);
  const [search, setSearch] = createSignal('');
  const [affixValue, setAffixValue] = createSignal('hello@velvetui.dev');
  const [range, setRange] = createSignal({ start: '', end: '' });
  const [dateTime, setDateTime] = createSignal('');
  const [menuOption, setMenuOption] = createSignal('in-review');
  const [calendarPreviewUrl, setCalendarPreviewUrl] = createSignal('');
  const [richText, setRichText] = createSignal(releaseNotesHtml());
  const [droppedFile, setDroppedFile] = createSignal<string | null>(null);
  const [droppedFiles, setDroppedFiles] = createSignal<string[]>([]);
  const [importOpen, setImportOpen] = createSignal(false);
  const [importBusy, setImportBusy] = createSignal(false);

  const optionMenuItems = createMemo(() => [
    { value: 'draft', label: t('demo.text.inputs.optionMenuChip.option.draft'), variant: 'subtle' as const },
    { value: 'in-review', label: t('demo.text.inputs.optionMenuChip.option.inReview'), variant: 'info' as const },
    { value: 'approved', label: t('demo.text.inputs.optionMenuChip.option.approved'), variant: 'success' as const },
    { value: 'archived', label: t('demo.text.inputs.optionMenuChip.option.archived'), variant: 'warning' as const },
  ]);

  const chipSelectorItems = createMemo(() => [
    { id: 'solid-basics', label: 'SolidJS / Basics' },
    { id: 'solid-performance', label: 'SolidJS / Performance' },
    { id: 'ts-advanced', label: 'TypeScript / Advanced' },
    { id: 'css-architecture', label: 'CSS / Architecture' },
  ]);

  const iconSelectorItems = createMemo(() => [
    { id: 'solid', label: 'SolidJS', icon: <IoSearch /> },
    { id: 'testing', label: 'Testing', icon: <IoMail /> },
    { id: 'architecture', label: 'Architecture', icon: <IoCalendar /> },
    { id: 'delivery', label: 'Delivery', icon: <IoAddSharp /> },
  ]);

  const categoryNavigatorItems = createMemo(() => [
    {
      id: 'frontend',
      label: 'Frontend',
      icon: <IoSearch />,
      children: [
        { id: 'solidjs', label: 'SolidJS' },
        { id: 'reactivity', label: 'Reactivity' },
        { id: 'styling', label: 'Styling' },
      ],
    },
    {
      id: 'backend',
      label: 'Backend',
      icon: <IoMail />,
      children: [
        { id: 'apis', label: 'APIs' },
        { id: 'auth', label: 'Auth' },
        { id: 'queues', label: 'Queues' },
      ],
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <IoCalendar />,
      children: [
        { id: 'ownership', label: 'Ownership' },
        { id: 'communication', label: 'Communication' },
      ],
    },
  ]);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  const handleSelectChange = (event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement }) => {
    setSelected(event.currentTarget.value);
  };

  const handleCalendarEventOpen = (url: string) => {
    setCalendarPreviewUrl(url);
    addToast({ type: 'info', message: t('demo.toast.inputs.calendarUrlGenerated') });
  };

  const closeImportDialog = () => {
    setImportOpen(false);
    setImportBusy(false);
  };

  const handleImportSubmit = async () => {
    setImportBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setImportBusy(false);
    setImportOpen(false);
    addToast({ type: 'success', message: t('demo.toast.inputs.importFinished') });
  };

  const calendarEventPreview = () => ({
    title: 'VelvetUi planning session',
    start: dateTime() || new Date().toISOString(),
    durationMinutes: 60,
    details: 'Review component roadmap and release notes.',
    location: 'Google Meet',
    synced: false,
  });

  return {
    t,
    renderRichText,
    releaseNotesTitle,
    releaseNotesHtml,
    loading,
    setLoading,
    text,
    setText,
    editableTitle,
    setEditableTitle,
    selected,
    setSelected,
    frameworks,
    setFrameworks,
    tags,
    setTags,
    autoValues,
    setAutoValues,
    color,
    setColor,
    newsletter,
    setNewsletter,
    notifications,
    setNotifications,
    termsAccepted,
    setTermsAccepted,
    marketingEmails,
    setMarketingEmails,
    focusMode,
    setFocusMode,
    role,
    setRole,
    viewMode,
    setViewMode,
    sliderEnhancedValue,
    setSliderEnhancedValue,
    sliderNoBubbleValue,
    setSliderNoBubbleValue,
    priceRange,
    setPriceRange,
    priceRangeNoBubbles,
    setPriceRangeNoBubbles,
    rating,
    setRating,
    segment,
    setSegment,
    billingCycle,
    setBillingCycle,
    iconCategory,
    setIconCategory,
    chipCategory,
    setChipCategory,
    hierarchicalMainCategory,
    setHierarchicalMainCategory,
    hierarchicalChildCategory,
    setHierarchicalChildCategory,
    otp,
    setOtp,
    date,
    setDate,
    time,
    setTime,
    time15,
    setTime15,
    quantity,
    setQuantity,
    search,
    setSearch,
    affixValue,
    setAffixValue,
    range,
    setRange,
    dateTime,
    setDateTime,
    menuOption,
    setMenuOption,
    calendarPreviewUrl,
    setCalendarPreviewUrl,
    richText,
    setRichText,
    droppedFile,
    setDroppedFile,
    droppedFiles,
    setDroppedFiles,
    importOpen,
    setImportOpen,
    importBusy,
    setImportBusy,
    optionMenuItems,
    chipSelectorItems,
    iconSelectorItems,
    categoryNavigatorItems,
    simulateLoad,
    handleSelectChange,
    handleCalendarEventOpen,
    closeImportDialog,
    handleImportSubmit,
    calendarEventPreview,
    PRESET_COLORS,
    FRAMEWORK_OPTIONS,
  };
};
