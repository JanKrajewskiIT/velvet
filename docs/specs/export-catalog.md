# Root Export Catalog

Status: Source capability inventory transcribed from `src/index.ts` baseline 3.1.3 and reconciled with the restored barrel. Names/types identify source behavior only; per `USER-DEC-009`, the replacement may choose different public names and signatures. This is a traceability/scope catalog, not a target API prescription.

## Auth And Foundation

Owner: [foundation.md](foundation.md). Acceptance: `ACC-PKG-001`–`ACC-PKG-005`, `ACC-AUTH-001`–`ACC-AUTH-002`, `ACC-I18N-001`, `ACC-UTIL-001`, `ACC-HOOK-001`.

- `AuthActionButton`, `AuthActionButtonProps`, `AuthContextValue`, `AuthGuard`, `AuthGuardProps`, `OidcAuthConfig`, `Role`, `UnauthorizedBehavior`, `useAuth`
- `classNames`, `getContrastTextColor`, `emptyToNull`, `numberToString`, `orEmpty`, `parseFloatOrNull`, `getInputSizeClass`
- `filterRows`, `sortRows`, `TabularFilterColumn`, `TabularSortColumn`, `TabularSortDirection`
- `ComponentSize`, `DivCoreNativeProps`, default type export `Props`
- `MountVelvetAppOptions`, `mountVelvetApp`, `VelvetConfigInput`, `VELVET_LOCALE_STORAGE_KEY`, `VELVET_THEME_STORAGE_KEY`, `VelvetProvider`, `VelvetProviderProps`
- `ThemeChoice`, `ThemeProvider`, `useTheme`
- `en`, `pl`, `VelvetUiFoundationDictionary`, `defineDictionaries`, `defineDictionary`, `I18nProvider`, `SUPPORTED_LOCALES`, `useI18n`
- i18n types: `ComposedDictionaries`, `DictionaryInput`, `DictionaryNode`, `DotPath`, `FlatDictionary`, `I18nContextValue`, `I18nDictionary`, `I18nKey`, `I18nProviderProps`, `Locale`, `LocaleDictionariesInput`, `MessageParams`, `RichMessageParams`, `TagHandler`, `TranslateFn`, `TranslateRichFn`, `TranslateStaticFn`, `TranslationOf`, `VelvetI18nDictionary`, `VelvetI18nKey`

## Buttons, Typography, Surfaces, And Forms

Owner: [primitives-forms.md](primitives-forms.md). Acceptance: `ACC-PRIM-001`, `ACC-SURFACE-001`, `ACC-FORM-001`–`ACC-FORM-004`, `ACC-COMP-004`, `ACC-THEME-001`.

- Buttons: `AffixButton`, `Button`, `ButtonVariant`, `CopyButton`, `IconButton`, `LocaleSwitcher`, `RoundIconButton`, `RoundIconButtonElevation`, `RoundIconButtonOwnProps`, `ThemeToggle`, `ThemeToggleVariant`
- Typography/media primitive: `CodeText`, `Heading`, `LabelText`, `Text`, `TypographyTone`, `TextVariant`, `HeadingVariant`, `Icon`, `IconOwnProps`, `IconVariant`
- Surfaces/layout: `Accordion`, `AccordionOwnProps`, `AccordionIcon`, `AccordionItem`, `AccordionItemOwnProps`, `AccordionTone`, `Card`, `CardOwnProps`, `DataCard`, `Divider`, `FeatureCard`, `FeatureCardProps`, `FeatureCardTone`, `Footer`, `Grid`, `MainLayout`, `ResizablePanel`, `Stack`, `Surface`, `SurfaceElevation`, `SurfaceOwnProps`, `SurfaceRadius`, `SurfaceTone`
- Flashcard surfaces: `FlashcardPracticeCard`, `FlashcardPracticeCardProps`, `FlashcardPracticeSession`, `FlashcardPracticeResult`, `FlashcardPracticeSessionProps`, `FlashcardPracticeSummary`, `FlashcardPracticeSummaryProps`, `FlipCard`, `FlipAxis`, `PracticeSetupPanel`, `PracticeSetupPanelCategory`, `PracticeSetupPanelProps`, `PracticeSetupPanelSubmitValue`, `StatCard`
- Forms: `ActionRow`, `FormField`, `FormFieldProps`, `FormGrid`, `FormLayout`
- Inputs: `AffixInput`, `FileDropZone`, `ImportSourcesDialog`, `FileImportSource`, `ImportSourceOption`, `ImportSourcesDialogProps`, `ImportSourcesDialogSubmitPayload`, `UrlImportSource`, `InlineEditableText`, `Input`, `NumberInput`, `OtpInput`, `PasswordInput`, `RichTextEditor`, `SearchInput`, `TagInput`, `TextArea`
- Pickers: `ColorPicker`, `RangeSlider`, `RangeSliderProps`, `SliderRangeValue`, `Rating`, `RatingProps`, `Slider`, `SliderMark`, `SliderProps`
- Switchers: `Checkbox`, `CheckboxIndicator`, `ChipOptionSwitcher`, `ChipOptionSwitcherItem`, `ChipOptionSwitcherProps`, `HierarchicalOptionChildItem`, `HierarchicalOptionItem`, `HierarchicalOptionNavigator`, `HierarchicalOptionNavigatorProps`, `IconOptionSwitcher`, `IconOptionSwitcherItem`, `IconOptionSwitcherProps`, `RadioGroup`, `RadioOption`, `SegmentedControl`, `SegmentedControlOption`, `Switch`

## Composite Widgets And Overlays

Owners: [composite-widgets.md](composite-widgets.md), [overlays-feedback.md](overlays-feedback.md), [domain-composites.md](domain-composites.md). Acceptance: `ACC-WIDGET-001`–`ACC-WIDGET-006`, `ACC-COMP-001`–`ACC-COMP-005`, `ACC-OVERLAY-001`–`ACC-OVERLAY-003`, `ACC-HOOK-001`, `ACC-ASYNC-001`, `ACC-QUALITY-001`.

- Selection/dropdowns: `Autocomplete`, `DropdownButton`, `DropdownMenu`, `DropdownMenuProps`, `MultiSelect`, `MultiSelectOption`, `OptionMenuChip`, `OptionMenuChipOption`, `OptionMenuChipProps`, `Select`, `SelectOption`, `DropdownChevronFieldTrigger`, `DropdownDivider`, `DropdownFieldTrigger`, `DropdownFieldTriggerProps`, `DropdownInputTrigger`, `DropdownOption`, `DropdownOptionProps`, `DropdownSurface`, `DropdownSurfaceProps`, `DropdownTriggerContent`, `DropdownTriggerContentProps`
- Command/data composites: `AiResultPanel`, `AtsAnalysisCategory`, `AtsAnalysisPanel`, `AtsAnalysisPanelProps`, `AtsAnalysisRecommendation`, `AtsAnalysisResult`, `AtsRecommendationSeverity`, `CodeBlock`, `CommandItem`, `CommandPalette`, `CommandPaletteTrigger`, `CommandPaletteTriggerProps`, `EditableCollection`, `EditableCollectionProps`, `EditableCollectionRenderContext`, `KanbanBoard`, `KanbanColumn`, `KanbanItemBase`, `MarkdownEditDialog`, `MarkdownRenderer`, `TransferItem`, `TransferList`, `TransferListProps`
- Overlays: `ConfirmAction`, `ConfirmActionProps`, `ConfirmActionRenderContext`, `ConfirmDialog`, `ContextMenu`, `Dialog`, `DialogActions`, `DialogBody`, `DialogTitle`, `Floating`, `FloatingProps`, `Popover`, `Sheet`, `Tooltip`, `Tour`, `TourStep`
- Public hooks: `useClickOutside`, `useEscapeKey`, `useFloating`, `UseFloatingOptions`, `UseFloatingReturn`, `useFocusTrap`

## Feedback And Loaders

Owner: [overlays-feedback.md](overlays-feedback.md). Acceptance: `ACC-FEEDBACK-001`–`ACC-FEEDBACK-003`, `ACC-ASYNC-001`, `ACC-QUALITY-001`.

- Feedback: `AccessDenied`, `Alert`, `Badge`, `Banner`, `Chip`, `CircularProgress`, `ClosableChip`, `ColorLabel`, `ColorLabelManagerDialog`, `ColorLabelManagerDialogProps`, `ColorLabelSelectionDialog`, `ColorLabelSelectionDialogProps`, `Countdown`, `DualFilterBar`, `DualFilterBarOption`, `DualFilterBarProps`, `EmptyState`, `ErrorFallback`, `ErrorMessage`, `InlineEmptyState`, `Kbd`, `NotFound`, `NotFoundProps`, `NotificationCenter`, `Page`, `Progress`, `SelectableChipItem`, `SelectableChips`, `SelectableChipsProps`, `SelectableChipVariant`, `Skeleton`
- Toast: `ToastMessage`, `ToastNotification`, `addToast`, `clearNotifications`, `markAllNotificationsRead`, `markNotificationRead`, `notifications`, `removeNotification`, `removeToast`, `useToast`, `useToastNotifications`, `ToastProvider`, `ToastViewport`
- Loaders (16 component exports): `BikeLoader`, `BikeLoaderMessages`, `BikeLoaderProps`, `BouncingDotsLoader`, `BouncingDotsLoaderMessages`, `BouncingDotsLoaderProps`, `ConcentricPulseLoader`, `ConcentricPulseLoaderMessages`, `ConcentricPulseLoaderProps`, `CornerPulseLoader`, `CornerPulseLoaderMessages`, `CornerPulseLoaderProps`, `DualPlaneSpinner`, `DualPlaneSpinnerMessages`, `DualPlaneSpinnerProps`, `EllipsisLoader`, `EllipsisLoaderMessages`, `EllipsisLoaderProps`, `EqualizerLoader`, `EqualizerLoaderMessages`, `EqualizerLoaderProps`, `HoneycombLoader`, `HoneycombLoaderMessages`, `HoneycombLoaderProps`, `JellyTriangleLoader`, `JellyTriangleLoaderMessages`, `JellyTriangleLoaderProps`, `OrbitSquaresLoader`, `OrbitSquaresLoaderMessages`, `OrbitSquaresLoaderProps`, `PageLoader`, `PageLoaderMessages`, `PageLoaderProps`, `PulseRingLoader`, `PulseRingLoaderMessages`, `PulseRingLoaderProps`, `RippleDotsLoader`, `RippleDotsLoaderMessages`, `RippleDotsLoaderProps`, `ShapeTrailLoader`, `ShapeTrailLoaderMessages`, `ShapeTrailLoaderProps`, `ShapeTrailLoaderShape`, `ShuffleGridLoader`, `ShuffleGridLoaderMessages`, `ShuffleGridLoaderProps`, `Spinner`, `SpinnerMessages`, `SpinnerProps`

## Navigation, Data, Date/Time, And Charts

Owners: [navigation-media.md](navigation-media.md), [data-display.md](data-display.md), [datetime-scheduling.md](datetime-scheduling.md). Acceptance: `ACC-NAV-001`–`ACC-NAV-004`, `ACC-DATA-001`–`ACC-DATA-004`, `ACC-DATE-001`–`ACC-DATE-003`, `ACC-MEDIA-001`–`ACC-MEDIA-002`.

- Navigation: `BackToTop`, `BottomNav`, `BottomNavItem`, `BreadcrumbItem`, `Breadcrumbs`, `MenuBar`, `Navbar`, `NavItem`, `Pagination`, `Sidebar`, `SidebarItem`, `SidebarItemButton`, `SidebarNav`, `SidebarNavGroup`, `SidebarNavItem`, `SpeedDial`, `SpeedDialAction`, `SpeedDialProps`, `Stepper`, `TabButton`, `Tabs`, `Wizard`, `WizardStep`
- Media: `Avatar`, `AvatarOwnProps`, `AvatarSize`, `AvatarStatus`, `AvatarGroup`, `Carousel`, `ImageGrid`, `ImageGridItem`, `Lightbox`, `LightboxImage`, `Marquee`, `MediaNavButton`, `MediaNavButtonOwnProps`
- Data: `FilterBar`, `FilterBarFilter`, `FilterBarOption`, `FilterBarValue`, `List`, `ListItem`, `StatusTimeline`, `StatusTimelineItem`, `StatusTimelineProps`, `StatusTimelineStatusTone`, `Timeline`, `TimelineCard`, `TimelineCardData`, `TimelineCardEditDialog`, `TimelineCardEditDialogProps`, `TimelineCardLabels`, `TimelineCardOption`, `TimelineCardProps`, `TreeNode`, `TreeView`, `TreeViewProps`, `VirtualizedList`
- Date/time: `CalendarHeader`, `CalendarHeaderProps`, `CalendarEventButton`, `CalendarEventButtonEvent`, `buildGoogleCalendarUrl`, `DatePicker`, `DatePickerProps`, `DateRange`, `DateRangePicker`, `DateRangePickerProps`, `DateTimeFieldTrigger`, `DateTimeFieldTriggerProps`, `DateTimePicker`, `DateTimePickerProps`, `Scheduler`, `SchedulerEvent`, `SchedulerProps`, `TimePicker`, `TimePickerProps`
- Charts/tables: `ComparisonInsightsAxis`, `ComparisonInsightsColumn`, `ComparisonInsightsDataset`, `ComparisonInsightsDialog`, `ComparisonInsightsDialogProps`, `ComparisonInsightsRow`, `ComparisonSelectionBar`, `ComparisonSelectionBarProps`, `RadarChart`, `ScoreRing`, `DataTable`, `DataTableColumn`, `DataTableProps`, `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`

## Reconciliation Notes

- `CAT-001`: This manually transcribed source-name catalog has been compared line-by-line with `src/index.ts` at baseline 3.1.3.
- `CAT-002`: Every source name/capability must map to functional behavior and an acceptance scenario in an owning spec; source signature is evidence only.
- `CAT-003`: Internal/deep-path exports are out of scope unless their behavior contributes to a listed user-facing capability. Their names/structure are not target requirements.
- `CAT-004`: Manual review maps every root catalog entry to an owning behavioral spec; each export family links to black-box scenario groups above. One scenario may cover several source exports when they share an outcome; acceptance does not require one test or one target symbol per legacy export.