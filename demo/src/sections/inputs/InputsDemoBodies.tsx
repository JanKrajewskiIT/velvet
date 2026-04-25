import {
  ActionRow,
  addToast,
  AffixButton,
  AffixInput,
  Autocomplete,
  Badge,
  Button,
  CalendarEventButton,
  CalendarHeader,
  Checkbox,
  CheckboxIndicator,
  ChipOptionSwitcher,
  CodeText,
  ColorPicker,
  CopyButton,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  DropdownButton,
  DropdownMenu,
  DropdownOption,
  FileDropZone,
  FormField,
  FormGrid,
  FormLayout,
  HierarchicalOptionNavigator,
  IconButton,
  IconOptionSwitcher,
  ImportSourcesDialog,
  InlineEditableText,
  Input,
  LocaleSwitcher,
  MultiSelect,
  NumberInput,
  OptionMenuChip,
  OtpInput,
  PasswordInput,
  RadioGroup,
  RangeSlider,
  Rating,
  RichTextEditor,
  RoundIconButton,
  SearchInput,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TagInput,
  Text,
  TextArea,
  ThemeToggle,
  TimePicker,
} from '@jankrajewskiit/ui';
import { IoAdd, IoClose, IoDocument, IoDownload, IoEllipsisHorizontal, IoPencil, IoTrash } from 'solid-icons/io';
import { Show } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../../components/ShowcaseSection';
import type { DemoRoleValue } from '../../fixtures/inputsFixtures';
import type { SectionId } from '../../nav/demoNavConfig';
import { useInputsDemo } from './InputsDemoContext';

interface InputsDemoBodiesProps {
  sectionId: () => SectionId;
}

const InputsDemoBodies = (props: InputsDemoBodiesProps) => {
  const model = useInputsDemo();

  return (
    <div>
      <Show when={props.sectionId() === 'inputs-buttons'}>
        {(() => {
          const { t, renderRichText, loading, simulateLoad } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.buttonVariants.title')}
                subtitle={t('demo.showcase.inputs.buttonVariants.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.inputs.buttonVariants.variants.title')}>
                    <div class="row">
                      <Button variant="primary">{t('demo.text.inputs.buttons.primary')}</Button>
                      <Button variant="danger">{t('demo.text.inputs.buttons.danger')}</Button>
                      <Button variant="ghost">{t('demo.text.inputs.buttons.ghost')}</Button>
                      <Button variant="dashed">{t('demo.text.inputs.buttons.dashed')}</Button>
                      <Button variant="outline">{t('demo.text.inputs.buttons.outline')}</Button>
                      <Button variant="subtle">{t('demo.text.inputs.buttons.subtle')}</Button>
                    </div>
                  </PreviewGroup>
                  <PreviewGroup title={t('demo.text.inputs.buttonVariants.states.title')}>
                    <div class="row">
                      <Button variant="primary" disabled>
                        {t('demo.text.inputs.buttons.disabled')}
                      </Button>
                      <Button variant="primary" loading={loading()} onClick={simulateLoad}>
                        {loading() ? t('demo.text.inputs.buttons.saving') : t('demo.text.inputs.buttons.clickToLoad')}
                      </Button>
                    </div>
                  </PreviewGroup>
                  <PreviewGroup title={t('demo.text.inputs.buttonVariants.sizes.title')}>
                    <div class="row">
                      <Button variant="primary" size="sm">
                        {t('demo.text.inputs.buttons.small')}
                      </Button>
                      <Button variant="primary" size="md">
                        {t('demo.text.inputs.buttons.medium')}
                      </Button>
                      <Button variant="primary" size="lg">
                        {t('demo.text.inputs.buttons.large')}
                      </Button>
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.affixButton.title')}
                subtitle={t('demo.showcase.inputs.affixButton.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.inputs.affixButton.examples.title')}>
                    <div class="row">
                      <AffixButton
                        variant="ghost"
                        text={t('demo.text.inputs.affixButton.documents')}
                        prefix={<IoDocument />}
                        suffix={
                          <Badge content={12}>
                            <span class="affixButtonBadgeSpacer" />
                          </Badge>
                        }
                      />
                      <AffixButton
                        variant="primary"
                        text={t('demo.text.inputs.affixButton.exportReport')}
                        prefix={<IoDownload />}
                        suffix={<IoEllipsisHorizontal />}
                      />
                      <AffixButton
                        variant="dashed"
                        text={t('demo.text.inputs.affixButton.createTag')}
                        prefix={<IoAdd />}
                        suffix={<IoClose />}
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  <CodeText as="span" class="codeInline">
                    AffixButton
                  </CodeText>{' '}
                  {t('demo.text.inputs.affixButton.meta')}
                </ShowcaseMeta>
              </ShowcaseSection>
              <ShowcaseSection
                title={t('demo.showcase.inputs.iconButton.title')}
                subtitle={t('demo.showcase.inputs.iconButton.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <IconButton icon={<IoPencil />} label={t('demo.text.inputs.iconButton.edit')} />
                      <IconButton icon={<IoTrash />} label={t('demo.text.inputs.iconButton.delete')} />
                      <IconButton icon={<IoAdd />} label={t('demo.text.inputs.iconButton.add')} size="sm" />
                      <IconButton icon={<IoDownload />} label={t('demo.text.inputs.iconButton.download')} size="md" />
                      <IconButton icon={<IoClose />} label={t('demo.text.inputs.iconButton.close')} disabled />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>
              <ShowcaseSection
                title={t('demo.showcase.inputs.roundIconButton.title')}
                subtitle={t('demo.showcase.inputs.roundIconButton.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <RoundIconButton
                        icon={<IoAdd />}
                        label={t('demo.text.inputs.roundIconButton.create')}
                        size="sm"
                      />
                      <RoundIconButton
                        icon={<IoDownload />}
                        label={t('demo.text.inputs.roundIconButton.export')}
                        size="md"
                        elevation="popover"
                      />
                      <RoundIconButton
                        icon={<IoPencil />}
                        label={t('demo.text.inputs.roundIconButton.edit')}
                        size="lg"
                        elevation="glow"
                      />
                      <RoundIconButton
                        icon={<IoClose />}
                        label={t('demo.text.inputs.roundIconButton.close')}
                        disabled
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>
              <ShowcaseSection
                title={t('demo.showcase.inputs.copyButton.title')}
                subtitle={t('demo.showcase.inputs.copyButton.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <CopyButton text="npm install @jankrajewskiit/ui" />
                      <CopyButton text="Hello World" variant="outline" />
                      <CopyButton text={t('demo.text.inputs.copyButton.smallCopyText')} size="sm" />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.localeSwitcher.title')}
                subtitle={t('demo.showcase.inputs.localeSwitcher.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup
                    title={t('demo.text.inputs.localeSwitcher.surfaceVariant.title')}
                    subtitle={t('demo.text.inputs.localeSwitcher.surfaceVariant.subtitle')}
                  >
                    <div class="row">
                      <LocaleSwitcher variant="primary" />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.themeToggle.title')}
                subtitle={t('demo.showcase.inputs.themeToggle.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <ThemeToggle variant="light" />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {renderRichText(t('demo.text.inputs.themeToggle.metaWithHook'), {
                    useTheme: (
                      <CodeText as="span" class="codeInline">
                        useTheme()
                      </CodeText>
                    ),
                  })}
                </ShowcaseMeta>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-dropdowns'}>
        {(() => {
          const {
            t,
            menuOption,
            setMenuOption,
            optionMenuItems,
            selected,
            handleSelectChange,
            frameworks,
            setFrameworks,
            autoValues,
            setAutoValues,
            FRAMEWORK_OPTIONS,
          } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.dropdownButton.title')}
                subtitle={t('demo.showcase.inputs.dropdownButton.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <DropdownButton label={t('demo.text.inputs.dropdownButton.actions')} variant="primary">
                        <DropdownOption
                          role="menuitem"
                          label={t('demo.text.inputs.dropdownButton.edit')}
                          onClick={() => {}}
                        />
                        <DropdownOption
                          role="menuitem"
                          label={t('demo.text.inputs.dropdownButton.duplicate')}
                          onClick={() => {}}
                        />
                        <DropdownOption
                          role="menuitem"
                          label={t('demo.text.inputs.dropdownButton.archive')}
                          onClick={() => {}}
                        />
                      </DropdownButton>
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.dropdownMenu.title')}
                subtitle={t('demo.showcase.inputs.dropdownMenu.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <DropdownMenu
                        trigger={<IoEllipsisHorizontal />}
                        label={t('demo.text.inputs.dropdownMenu.moreOptions')}
                      >
                        <DropdownOption
                          role="menuitem"
                          prefix={<IoPencil />}
                          label={t('demo.text.inputs.dropdownMenu.settings')}
                          onClick={() => {}}
                        />
                        <DropdownOption
                          role="menuitem"
                          prefix={<IoDownload />}
                          label={t('demo.text.inputs.dropdownMenu.export')}
                          onClick={() => {}}
                        />
                        <DropdownOption
                          role="menuitem"
                          prefix={<IoTrash />}
                          tone="error"
                          label={t('demo.text.inputs.dropdownMenu.delete')}
                          onClick={() => {}}
                        />
                      </DropdownMenu>
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.optionMenuChip.title')}
                subtitle={t('demo.showcase.inputs.optionMenuChip.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <OptionMenuChip
                      value={menuOption()}
                      options={optionMenuItems()}
                      menuLabel={t('demo.text.inputs.optionMenuChip.menuLabel')}
                      onChange={setMenuOption}
                    />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.select.title')}
                subtitle={t('demo.showcase.inputs.select.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.select.chooseOption')}>
                      {(fieldProps) => (
                        <Select
                          {...fieldProps}
                          value={selected()}
                          onChange={handleSelectChange}
                          options={[
                            { value: '', label: t('demo.text.inputs.select.selectPlaceholder') },
                            { value: 'a', label: t('demo.text.inputs.select.optionA') },
                            { value: 'b', label: t('demo.text.inputs.select.optionB') },
                            { value: 'c', label: t('demo.text.inputs.select.optionC') },
                          ]}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.multiSelect.title')}
                subtitle={t('demo.showcase.inputs.multiSelect.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.multiSelect.frameworks')}>
                      {(fieldProps) => (
                        <MultiSelect
                          {...fieldProps}
                          value={frameworks()}
                          options={FRAMEWORK_OPTIONS}
                          onChange={setFrameworks}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.multiSelect.selected')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {frameworks().join(', ') || t('demo.text.inputs.common.none')}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.autocomplete.title')}
                subtitle={t('demo.showcase.inputs.autocomplete.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.autocomplete.technologies')}>
                      {(fieldProps) => (
                        <Autocomplete
                          {...fieldProps}
                          values={autoValues()}
                          options={[
                            'TypeScript',
                            'JavaScript',
                            'SolidJS',
                            'React',
                            'Vue',
                            'Svelte',
                            'Vite',
                            'Tailwind',
                          ]}
                          onChange={setAutoValues}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-fields'}>
        {(() => {
          const {
            t,
            text,
            setText,
            editableTitle,
            setEditableTitle,
            richText,
            setRichText,
            search,
            setSearch,
            affixValue,
            setAffixValue,
            quantity,
            setQuantity,
            otp,
            setOtp,
            tags,
            setTags,
          } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.input.title')}
                subtitle={t('demo.showcase.inputs.input.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <form class="inputFieldStack" onSubmit={(e) => e.preventDefault()}>
                      <FormField label={t('demo.text.inputs.fields.textInput')}>
                        {(fieldProps) => (
                          <Input
                            {...fieldProps}
                            type="text"
                            placeholder={t('demo.text.inputs.fields.enterText')}
                            value={text()}
                            onInput={(e) => setText(e.currentTarget.value)}
                          />
                        )}
                      </FormField>
                      <FormField label={t('demo.text.inputs.fields.disabledInput')}>
                        {(fieldProps) => (
                          <Input
                            {...fieldProps}
                            type="text"
                            value={t('demo.text.inputs.fields.disabledValue')}
                            disabled
                          />
                        )}
                      </FormField>
                    </form>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.inputSizes.title')}
                subtitle={t('demo.showcase.inputs.inputSizes.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="inputSizesStack">
                      <FormField label={t('demo.text.inputs.inputSizes.small')}>
                        {(fieldProps) => (
                          <Input {...fieldProps} size="sm" placeholder={t('demo.text.inputs.inputSizes.smallInput')} />
                        )}
                      </FormField>
                      <FormField label={t('demo.text.inputs.inputSizes.medium')}>
                        {(fieldProps) => (
                          <Input {...fieldProps} size="md" placeholder={t('demo.text.inputs.inputSizes.mediumInput')} />
                        )}
                      </FormField>
                      <FormField label={t('demo.text.inputs.inputSizes.large')}>
                        {(fieldProps) => (
                          <Input {...fieldProps} size="lg" placeholder={t('demo.text.inputs.inputSizes.largeInput')} />
                        )}
                      </FormField>
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.affixInput.title')}
                subtitle={t('demo.showcase.inputs.affixInput.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.affixInput.emailWithActions')}>
                      {(fieldProps) => (
                        <AffixInput
                          {...fieldProps}
                          value={affixValue()}
                          onInput={(e) => setAffixValue(e.currentTarget.value)}
                          placeholder={t('demo.text.inputs.affixInput.emailPlaceholder')}
                          prefix={<IoDocument />}
                          suffix={
                            <IconButton
                              icon={<IoClose />}
                              label={t('demo.text.inputs.affixInput.clearValue')}
                              onClick={() => setAffixValue('')}
                              size="sm"
                              variant="subtle"
                            />
                          }
                        />
                      )}
                    </FormField>
                    <FormField label={t('demo.text.inputs.affixInput.searchStyle')}>
                      {(fieldProps) => (
                        <AffixInput
                          {...fieldProps}
                          size="sm"
                          placeholder={t('demo.text.inputs.affixInput.filterByKeyword')}
                          prefix={<IoAdd />}
                          suffix={<IoEllipsisHorizontal />}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.textArea.title')}
                subtitle={t('demo.showcase.inputs.textArea.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.textArea.description')}>
                      {(fieldProps) => (
                        <TextArea
                          {...fieldProps}
                          placeholder={t('demo.text.inputs.textArea.enterLongerDescription')}
                          rows={4}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.numberInput.title')}
                subtitle={t('demo.showcase.inputs.numberInput.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <NumberInput value={quantity()} onChange={setQuantity} min={0} max={100} size="md" />
                    <NumberInput value={1} onChange={() => {}} disabled size="sm" />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.searchInput.title')}
                subtitle={t('demo.showcase.inputs.searchInput.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <SearchInput value={search()} onInput={setSearch} />
                    <SearchInput value="" onInput={() => {}} disabled />
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.searchInput.searchValue')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {search()}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.passwordInput.title')}
                subtitle={t('demo.showcase.inputs.passwordInput.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.passwordInput.password')}>
                      {(fieldProps) => (
                        <PasswordInput
                          {...fieldProps}
                          placeholder={t('demo.text.inputs.passwordInput.enterPassword')}
                        />
                      )}
                    </FormField>
                    <FormField label={t('demo.text.inputs.passwordInput.disabled')}>
                      {(fieldProps) => <PasswordInput {...fieldProps} value="secret123" disabled />}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.tagInput.title')}
                subtitle={t('demo.showcase.inputs.tagInput.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.tagInput.tags')}>
                      {(fieldProps) => <TagInput {...fieldProps} value={tags()} onChange={setTags} />}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.otpInput.title')}
                subtitle={t('demo.showcase.inputs.otpInput.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <OtpInput value={otp()} onChange={setOtp} length={6} />
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.otpInput.enteredValue')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {otp()}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.inlineEditableText.title')}
                subtitle={t('demo.showcase.inputs.inlineEditableText.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <InlineEditableText
                      value={editableTitle()}
                      onChange={setEditableTitle}
                      placeholder={t('demo.text.inputs.inlineEditableText.setTitle')}
                    />
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.inlineEditableText.currentValue')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {editableTitle()}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.richTextEditor.title')}
                subtitle={t('demo.showcase.inputs.richTextEditor.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <RichTextEditor value={richText()} onChange={setRichText} />
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.richTextEditor.htmlLength')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {String(richText().length)}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-switchers'}>
        {(() => {
          const {
            t,
            notifications,
            setNotifications,
            newsletter,
            setNewsletter,
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
            chipSelectorItems,
            iconSelectorItems,
            categoryNavigatorItems,
          } = model;
          return (
            <>
              <ShowcaseSection title="CheckboxIndicator" subtitle="Low-level visual indicator used by Checkbox">
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <CheckboxIndicator checked={false} />
                      <CheckboxIndicator checked />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.checkbox.title')}
                subtitle={t('demo.showcase.inputs.checkbox.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <Checkbox
                      checked={newsletter()}
                      onChange={(e) => setNewsletter(e.currentTarget.checked)}
                      label={t('demo.text.inputs.checkbox.subscribeNewsletter')}
                      description={t('demo.text.inputs.checkbox.monthlyUpdates')}
                    />
                    <Checkbox
                      checked={termsAccepted()}
                      onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
                      label={t('demo.text.inputs.checkbox.acceptTerms')}
                    />
                    <Checkbox
                      checked={marketingEmails()}
                      onChange={(e) => setMarketingEmails(e.currentTarget.checked)}
                      label={t('demo.text.inputs.checkbox.productNews')}
                      description={t('demo.text.inputs.checkbox.unsubscribeAnytime')}
                    />
                    <Checkbox
                      checked={false}
                      onChange={() => {}}
                      label={t('demo.text.inputs.checkbox.uncheckedDefault')}
                    />
                    <Checkbox
                      checked
                      disabled
                      onChange={() => {}}
                      label={t('demo.text.inputs.checkbox.checkedDisabled')}
                    />
                    <Checkbox
                      checked={false}
                      disabled
                      onChange={() => {}}
                      label={t('demo.text.inputs.checkbox.uncheckedDisabled')}
                    />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.radioGroup.title')}
                subtitle={t('demo.showcase.inputs.radioGroup.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <RadioGroup<DemoRoleValue>
                      name="demo-role"
                      value={role()}
                      onChange={setRole}
                      direction="column"
                      options={[
                        {
                          value: 'admin',
                          label: t('demo.text.inputs.radio.admin'),
                          description: t('demo.text.inputs.radio.fullAccess'),
                        },
                        {
                          value: 'editor',
                          label: t('demo.text.inputs.radio.editor'),
                          description: t('demo.text.inputs.radio.canEdit'),
                        },
                        {
                          value: 'viewer',
                          label: t('demo.text.inputs.radio.viewer'),
                          description: t('demo.text.inputs.radio.readOnly'),
                        },
                      ]}
                    />
                    <RadioGroup
                      name="demo-horizontal"
                      value={viewMode()}
                      onChange={setViewMode}
                      direction="row"
                      options={[
                        { value: 'list', label: t('demo.text.inputs.segmented.list') },
                        { value: 'grid', label: t('demo.text.inputs.segmented.grid') },
                        { value: 'board', label: t('demo.text.inputs.segmented.board') },
                      ]}
                    />
                    <RadioGroup
                      name="demo-disabled"
                      value={billingCycle()}
                      onChange={setBillingCycle}
                      direction="column"
                      options={[
                        { value: 'monthly', label: t('demo.text.inputs.radio.monthlyBilling') },
                        {
                          value: 'yearly',
                          label: t('demo.text.inputs.radio.yearlyBilling'),
                          description: t('demo.text.inputs.radio.save20'),
                        },
                      ]}
                    />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.switch.title')}
                subtitle={t('demo.showcase.inputs.switch.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <Switch
                      checked={notifications()}
                      onChange={setNotifications}
                      label={t('demo.text.inputs.switch.enablePush')}
                      description={t('demo.text.inputs.switch.receiveAlerts')}
                      aria-label={t('demo.text.inputs.switch.enablePush')}
                    />
                    <Switch
                      checked={focusMode()}
                      onChange={setFocusMode}
                      label={t('demo.text.inputs.switch.focusMode')}
                      description={t('demo.text.inputs.switch.hideSidebar')}
                      aria-label={t('demo.text.inputs.switch.focusMode')}
                    />
                    <Switch
                      checked={true}
                      onChange={() => {}}
                      label={t('demo.text.inputs.switch.onControlled')}
                      aria-label={t('demo.text.inputs.switch.on')}
                    />
                    <Switch
                      checked={false}
                      onChange={() => {}}
                      label={t('demo.text.inputs.switch.off')}
                      aria-label={t('demo.text.inputs.switch.off')}
                    />
                    <Switch
                      checked
                      disabled
                      onChange={() => {}}
                      label={t('demo.text.inputs.switch.disabledOn')}
                      aria-label={t('demo.text.inputs.switch.disabledOn')}
                    />
                    <Switch
                      checked={false}
                      disabled
                      onChange={() => {}}
                      label={t('demo.text.inputs.switch.disabledOff')}
                      aria-label={t('demo.text.inputs.switch.disabledOff')}
                    />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.segmentedControl.title')}
                subtitle={t('demo.showcase.inputs.segmentedControl.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <SegmentedControl
                      value={segment()}
                      onChange={setSegment}
                      options={[
                        { value: 'list', label: t('demo.text.inputs.segmented.list') },
                        { value: 'grid', label: t('demo.text.inputs.segmented.grid') },
                        { value: 'board', label: t('demo.text.inputs.segmented.board') },
                      ]}
                    />
                    <SegmentedControl
                      value={billingCycle()}
                      onChange={setBillingCycle}
                      size="sm"
                      options={[
                        { value: 'monthly', label: t('demo.text.inputs.segmented.monthly') },
                        { value: 'yearly', label: t('demo.text.inputs.segmented.yearly') },
                      ]}
                    />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.iconOptionSwitcher.title')}
                subtitle={t('demo.showcase.inputs.iconOptionSwitcher.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="recronDemoWide recronDemoSurface">
                      <IconOptionSwitcher
                        aria-label={t('demo.text.inputs.iconOptionSwitcher.ariaLabel')}
                        items={iconSelectorItems()}
                        selectedId={iconCategory()}
                        onSelect={setIconCategory}
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.chipOptionSwitcher.title')}
                subtitle={t('demo.showcase.inputs.chipOptionSwitcher.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="recronDemoWide recronDemoSurface">
                      <ChipOptionSwitcher
                        items={chipSelectorItems()}
                        selectedId={chipCategory()}
                        onSelect={setChipCategory}
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.groupedOptionNavigator.title')}
                subtitle={t('demo.showcase.inputs.groupedOptionNavigator.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="recronDemoWide recronDemoSurface">
                      <HierarchicalOptionNavigator
                        items={categoryNavigatorItems()}
                        selectedMainId={hierarchicalMainCategory()}
                        selectedChildId={hierarchicalChildCategory()}
                        align="center"
                        onMainSelect={(id) => {
                          setHierarchicalMainCategory(id);
                          const selectedItem = categoryNavigatorItems().find((item) => item.id === id);
                          const firstChild = selectedItem?.children[0]?.id ?? null;
                          setHierarchicalChildCategory(firstChild);
                        }}
                        onChildSelect={setHierarchicalChildCategory}
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-pickers'}>
        {(() => {
          const {
            t,
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
            color,
            setColor,
            PRESET_COLORS,
          } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.slider.title')}
                subtitle={t('demo.showcase.inputs.slider.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField
                      label={t('demo.text.inputs.slider.satisfaction')}
                      description={`${t('demo.text.inputs.slider.currentValue')}: ${String(sliderEnhancedValue())}`}
                    >
                      {(fieldProps) => (
                        <Slider
                          {...fieldProps}
                          value={sliderEnhancedValue()}
                          onChange={setSliderEnhancedValue}
                          min={0}
                          max={100}
                          step={5}
                          marks={[
                            { value: 0, label: '0' },
                            { value: 25, label: '25' },
                            { value: 50, label: '50' },
                            { value: 75, label: '75' },
                            { value: 100, label: '100' },
                          ]}
                        />
                      )}
                    </FormField>
                    <FormField label={t('demo.text.inputs.slider.withoutValueBubble')}>
                      {(fieldProps) => (
                        <Slider
                          {...fieldProps}
                          value={sliderNoBubbleValue()}
                          onChange={setSliderNoBubbleValue}
                          min={0}
                          max={100}
                          marks={[
                            { value: 0, label: t('demo.text.inputs.slider.low') },
                            { value: 50, label: t('demo.text.inputs.slider.mid') },
                            { value: 100, label: t('demo.text.inputs.slider.high') },
                          ]}
                        />
                      )}
                    </FormField>
                    <FormField label={t('demo.text.inputs.common.disabled')}>
                      {(fieldProps) => (
                        <Slider {...fieldProps} value={70} onChange={() => {}} min={0} max={100} disabled />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.rangeSlider.title')}
                subtitle={t('demo.showcase.inputs.rangeSlider.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField
                      label={t('demo.text.inputs.rangeSlider.priceRange')}
                      description={`${String(priceRange().min)} - ${String(priceRange().max)}`}
                    >
                      {(fieldProps) => (
                        <RangeSlider
                          {...fieldProps}
                          value={priceRange()}
                          onChange={setPriceRange}
                          min={0}
                          max={100}
                          step={5}
                          marks={[
                            { value: 0, label: '0' },
                            { value: 25, label: '25' },
                            { value: 50, label: '50' },
                            { value: 75, label: '75' },
                            { value: 100, label: '100' },
                          ]}
                        />
                      )}
                    </FormField>
                    <FormField label={t('demo.text.inputs.rangeSlider.withoutValueBubbles')}>
                      {(fieldProps) => (
                        <RangeSlider
                          {...fieldProps}
                          value={priceRangeNoBubbles()}
                          onChange={setPriceRangeNoBubbles}
                          min={0}
                          max={100}
                          marks={[
                            { value: 0, label: t('demo.text.inputs.slider.low') },
                            { value: 50, label: t('demo.text.inputs.slider.mid') },
                            { value: 100, label: t('demo.text.inputs.slider.high') },
                          ]}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.rating.title')}
                subtitle={t('demo.showcase.inputs.rating.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <Rating value={rating()} onChange={setRating} />
                      <Rating value={3.5} />
                      <Rating value={4} size="sm" />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.colorPicker.title')}
                subtitle={t('demo.showcase.inputs.colorPicker.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.colorPicker.brandColor')}>
                      {(fieldProps) => (
                        <ColorPicker {...fieldProps} colors={PRESET_COLORS} value={color()} onChange={setColor} />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.colorPicker.selectedColor')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {color()}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-datetime'}>
        {(() => {
          const {
            t,
            date,
            setDate,
            range,
            setRange,
            time,
            setTime,
            time15,
            setTime15,
            dateTime,
            setDateTime,
            calendarPreviewUrl,
            handleCalendarEventOpen,
            calendarEventPreview,
          } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.datePicker.title')}
                subtitle={t('demo.showcase.inputs.datePicker.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <CalendarHeader monthLabel="March 2026" onPrevious={() => {}} onNext={() => {}} />
                    <FormField label={t('demo.text.inputs.dateTime.startDate')}>
                      {(fieldProps) => <DatePicker {...fieldProps} value={date()} onChange={setDate} />}
                    </FormField>
                    <FormField label={t('demo.text.inputs.common.disabled')}>
                      {(fieldProps) => <DatePicker {...fieldProps} value="" onChange={() => {}} disabled />}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.dateRangePicker.title')}
                subtitle={t('demo.showcase.inputs.dateRangePicker.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <DateRangePicker value={range()} onChange={setRange} />
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.dateTime.range')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {range().start || t('demo.text.inputs.dateTime.notSetDash')} →{' '}
                    {range().end || t('demo.text.inputs.dateTime.notSetDash')}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.timePicker.title')}
                subtitle={t('demo.showcase.inputs.timePicker.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.dateTime.meetingTime')}>
                      {(fieldProps) => <TimePicker {...fieldProps} value={time()} onChange={setTime} step={30} />}
                    </FormField>
                    <FormField label={t('demo.text.inputs.dateTime.preciseTime')}>
                      {(fieldProps) => <TimePicker {...fieldProps} value={time15()} onChange={setTime15} step={15} />}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.dateTimePicker.title')}
                subtitle={t('demo.showcase.inputs.dateTimePicker.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.dateTime.publishAt')}>
                      {(fieldProps) => (
                        <DateTimePicker {...fieldProps} value={dateTime()} onChange={setDateTime} step={15} />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.dateTime.dateTime')}:{' '}
                  <CodeText as="span" class="codeInline">
                    {dateTime() || t('demo.text.inputs.dateTime.notSet')}
                  </CodeText>
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title="CalendarEventButton"
                subtitle={t('demo.recron.showcase.calendarEventButton.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="row">
                      <CalendarEventButton
                        event={calendarEventPreview()}
                        addLabel={t('demo.recron.interview.calendar.addLabel')}
                        syncedLabel={t('demo.recron.interview.calendar.syncedLabel')}
                        onOpen={handleCalendarEventOpen}
                      />
                    </div>
                    <Show when={calendarPreviewUrl()}>
                      {(url) => (
                        <Text as="p" variant="bodySm" tone="muted">
                          {url()}
                        </Text>
                      )}
                    </Show>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-other'}>
        {(() => {
          const {
            t,
            droppedFile,
            setDroppedFile,
            droppedFiles,
            setDroppedFiles,
            importOpen,
            setImportOpen,
            importBusy,
            closeImportDialog,
            handleImportSubmit,
          } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.fileDropZone.title')}
                subtitle={t('demo.showcase.inputs.fileDropZone.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="previewUploadFull">
                      <FileDropZone
                        label={t('demo.text.inputs.fileDropZone.dropSingle')}
                        hint={t('demo.text.inputs.fileDropZone.singleHint')}
                        accept=".pdf,.jpg,.png,image/*"
                        icon={<IoDocument size={28} />}
                        onFile={(f) => {
                          setDroppedFile(f.name);
                          addToast({
                            type: 'success',
                            message: `${t('demo.text.inputs.fileDropZone.picked')}: ${f.name}`,
                          });
                        }}
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
                {droppedFile() && (
                  <ShowcaseMeta>
                    {t('demo.text.inputs.fileDropZone.selectedFile')}:{' '}
                    <CodeText as="span" class="codeInline">
                      {droppedFile()}
                    </CodeText>
                  </ShowcaseMeta>
                )}
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.fileDropZoneMultiple.title')}
                subtitle={t('demo.showcase.inputs.fileDropZoneMultiple.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <div class="previewUploadFull">
                      <FileDropZone
                        accept="*"
                        multiple
                        label={t('demo.text.inputs.fileDropZone.dropMultiple')}
                        hint={t('demo.text.inputs.fileDropZone.multipleHint')}
                        icon={<IoDocument size={28} />}
                        onFiles={(files) => {
                          setDroppedFiles(files.map((file) => file.name));
                          addToast({
                            type: 'success',
                            message: t('demo.text.inputs.fileDropZone.pickedCountMessage', { count: files.length }),
                          });
                        }}
                      />
                    </div>
                  </PreviewGroup>
                </PreviewPanel>
                {droppedFiles().length > 0 && (
                  <ShowcaseMeta>
                    {t('demo.text.inputs.fileDropZone.selectedFiles')}:{' '}
                    <CodeText as="span" class="codeInline">
                      {droppedFiles().join(', ')}
                    </CodeText>
                  </ShowcaseMeta>
                )}
              </ShowcaseSection>

              <ShowcaseSection
                title="ImportSourcesDialog"
                subtitle={t('demo.recron.showcase.importSourcesDialog.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <Button label={t('demo.recron.hero.action.import')} onClick={() => setImportOpen(true)} />
                    <ImportSourcesDialog
                      open={importOpen()}
                      title={t('demo.recron.hero.action.import')}
                      sources={[
                        {
                          value: 'portfolio-url',
                          label: t('demo.recron.ai.import.source.url.label'),
                          kind: 'url',
                          inputLabel: t('demo.recron.ai.import.source.url.inputLabel'),
                          inputPlaceholder: 'https://example.com/cv',
                          helperText: t('demo.recron.ai.import.source.url.helperText'),
                        },
                        {
                          value: 'portfolio-file',
                          label: t('demo.recron.ai.import.source.file.label'),
                          kind: 'file',
                          accept: '.pdf,.docx',
                          dropLabel: t('demo.recron.ai.import.source.file.dropLabel'),
                          dropHint: t('demo.recron.ai.import.source.file.dropHint'),
                          clearLabel: t('demo.recron.ai.import.source.file.clearLabel'),
                        },
                      ]}
                      submitLabel={t('demo.recron.ai.import.submitLabel')}
                      busy={importBusy()}
                      onClose={closeImportDialog}
                      onSubmit={handleImportSubmit}
                    />
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
      <Show when={props.sectionId() === 'inputs-form-layout'}>
        {(() => {
          const {
            t,
            renderRichText,
            tags,
            setTags,
            color,
            setColor,
            notifications,
            setNotifications,
            frameworks,
            setFrameworks,
            FRAMEWORK_OPTIONS,
            PRESET_COLORS,
            search,
            setSearch,
            selected,
            setSelected,
            range,
            setRange,
            dateTime,
            setDateTime,
            quantity,
            setQuantity,
          } = model;
          return (
            <>
              <ShowcaseSection
                title={t('demo.showcase.inputs.formField.title')}
                subtitle={t('demo.showcase.inputs.formField.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormField label={t('demo.text.inputs.formField.fullName')}>
                      {(fieldProps) => (
                        <Input
                          {...fieldProps}
                          type="text"
                          placeholder={t('demo.text.inputs.formField.fullNamePlaceholder')}
                        />
                      )}
                    </FormField>
                    <FormField label={t('demo.text.inputs.formField.emailAddress')}>
                      {(fieldProps) => (
                        <Input
                          {...fieldProps}
                          type="email"
                          placeholder={t('demo.text.inputs.formField.emailPlaceholder')}
                        />
                      )}
                    </FormField>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.formGrid.title')}
                subtitle={t('demo.showcase.inputs.formGrid.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormLayout>
                      <FormGrid>
                        <FormField label={t('demo.text.inputs.formGrid.firstName')}>
                          {(fieldProps) => (
                            <Input
                              {...fieldProps}
                              type="text"
                              placeholder={t('demo.text.inputs.formGrid.firstNamePlaceholder')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.formGrid.lastName')}>
                          {(fieldProps) => (
                            <Input
                              {...fieldProps}
                              type="text"
                              placeholder={t('demo.text.inputs.formGrid.lastNamePlaceholder')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.formGrid.email')}>
                          {(fieldProps) => (
                            <Input
                              {...fieldProps}
                              type="email"
                              placeholder={t('demo.text.inputs.formGrid.emailPlaceholder')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.formGrid.role')}>
                          {(fieldProps) => (
                            <Select
                              {...fieldProps}
                              options={[
                                { value: '', label: t('demo.text.inputs.formGrid.selectRole') },
                                { value: 'admin', label: t('demo.text.inputs.radio.admin') },
                                { value: 'user', label: t('demo.text.inputs.radio.user') },
                              ]}
                            />
                          )}
                        </FormField>
                      </FormGrid>
                    </FormLayout>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.formLayout.title')}
                subtitle={t('demo.showcase.inputs.formLayout.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormLayout>
                      <FormField
                        label={t('demo.text.inputs.formLayout.workspaceName')}
                        description={t('demo.text.inputs.formLayout.workspaceNameDescription')}
                      >
                        {(fieldProps) => (
                          <Input
                            {...fieldProps}
                            type="text"
                            placeholder={t('demo.text.inputs.formLayout.workspaceNamePlaceholder')}
                          />
                        )}
                      </FormField>
                      <FormField
                        label={t('demo.text.inputs.formLayout.internalNotes')}
                        description={t('demo.text.inputs.formLayout.internalNotesDescription')}
                      >
                        {(fieldProps) => (
                          <TextArea
                            {...fieldProps}
                            rows={3}
                            placeholder={t('demo.text.inputs.formLayout.internalNotesPlaceholder')}
                          />
                        )}
                      </FormField>
                      <FormField
                        label={t('demo.text.inputs.formLayout.searchScope')}
                        description={t('demo.text.inputs.formLayout.searchScopeDescription')}
                      >
                        {(fieldProps) => (
                          <SearchInput
                            {...fieldProps}
                            value={search()}
                            onInput={setSearch}
                            placeholder={t('demo.text.inputs.formLayout.searchRecords')}
                            debounce={300}
                          />
                        )}
                      </FormField>
                      <ActionRow align="start">
                        <Button variant="primary">{t('demo.text.inputs.actions.saveDraft')}</Button>
                        <Button variant="ghost">{t('demo.text.inputs.actions.discard')}</Button>
                      </ActionRow>
                    </FormLayout>
                  </PreviewGroup>
                </PreviewPanel>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.completeForm.title')}
                subtitle={t('demo.showcase.inputs.completeForm.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <FormLayout>
                      <FormGrid>
                        <FormField label={t('demo.text.inputs.completeForm.teamName')}>
                          {(fieldProps) => (
                            <Input
                              {...fieldProps}
                              type="text"
                              placeholder={t('demo.text.inputs.completeForm.teamNamePlaceholder')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.contactEmail')}>
                          {(fieldProps) => (
                            <Input
                              {...fieldProps}
                              type="email"
                              placeholder={t('demo.text.inputs.completeForm.contactEmailPlaceholder')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.passwordInput.password')}>
                          {(fieldProps) => (
                            <PasswordInput
                              {...fieldProps}
                              placeholder={t('demo.text.inputs.completeForm.setWorkspacePassword')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.formGrid.role')}>
                          {(fieldProps) => (
                            <Select
                              {...fieldProps}
                              value={selected()}
                              onChange={(e) => setSelected(e.currentTarget.value)}
                              options={[
                                { value: '', label: t('demo.text.inputs.formGrid.selectRole') },
                                { value: 'owner', label: t('demo.text.inputs.completeForm.owner') },
                                { value: 'editor', label: t('demo.text.inputs.radio.editor') },
                                { value: 'viewer', label: t('demo.text.inputs.radio.viewer') },
                              ]}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.techStack')}>
                          {(fieldProps) => (
                            <MultiSelect
                              {...fieldProps}
                              options={FRAMEWORK_OPTIONS}
                              value={frameworks()}
                              onChange={setFrameworks}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.releaseWindow')}>
                          {(fieldProps) => <DateRangePicker {...fieldProps} value={range()} onChange={setRange} />}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.launchDateTime')}>
                          {(fieldProps) => (
                            <DateTimePicker {...fieldProps} value={dateTime()} onChange={setDateTime} step={15} />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.seats')}>
                          {(fieldProps) => (
                            <NumberInput {...fieldProps} value={quantity()} onChange={setQuantity} min={1} max={50} />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.tagInput.tags')}>
                          {(fieldProps) => (
                            <TagInput
                              {...fieldProps}
                              value={tags()}
                              onChange={setTags}
                              placeholder={t('demo.text.inputs.completeForm.pressEnterTag')}
                            />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.accentColor')}>
                          {(fieldProps) => (
                            <ColorPicker {...fieldProps} colors={PRESET_COLORS} value={color()} onChange={setColor} />
                          )}
                        </FormField>
                        <FormField label={t('demo.text.inputs.completeForm.summary')}>
                          {(fieldProps) => (
                            <TextArea
                              {...fieldProps}
                              placeholder={t('demo.text.inputs.completeForm.summaryPlaceholder')}
                              rows={4}
                            />
                          )}
                        </FormField>
                      </FormGrid>
                      <FormField label={t('demo.text.inputs.completeForm.notifications')}>
                        {(fieldProps) => (
                          <Switch
                            id={fieldProps.id}
                            aria-describedby={fieldProps['aria-describedby']}
                            aria-invalid={fieldProps['aria-invalid']}
                            checked={notifications()}
                            onChange={setNotifications}
                          />
                        )}
                      </FormField>
                      <ActionRow align="end">
                        <Button variant="ghost">{t('demo.text.inputs.actions.cancel')}</Button>
                        <Button variant="outline">{t('demo.text.inputs.actions.saveDraft')}</Button>
                        <Button variant="primary">{t('demo.text.inputs.completeForm.createWorkspace')}</Button>
                      </ActionRow>
                    </FormLayout>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {renderRichText(t('demo.text.inputs.completeForm.meta'), {
                    formLayout: (
                      <CodeText as="span" class="codeInline">
                        FormLayout
                      </CodeText>
                    ),
                    formGrid: (
                      <CodeText as="span" class="codeInline">
                        FormGrid
                      </CodeText>
                    ),
                    formField: (
                      <CodeText as="span" class="codeInline">
                        FormField
                      </CodeText>
                    ),
                    actionRow: (
                      <CodeText as="span" class="codeInline">
                        ActionRow
                      </CodeText>
                    ),
                  })}
                </ShowcaseMeta>
              </ShowcaseSection>

              <ShowcaseSection
                title={t('demo.showcase.inputs.actionRow.title')}
                subtitle={t('demo.showcase.inputs.actionRow.subtitle')}
              >
                <PreviewPanel>
                  <PreviewGroup title={t('demo.text.common.examples')}>
                    <ActionRow align="start">
                      <Button variant="primary">{t('demo.text.inputs.actions.saveDraft')}</Button>
                      <Button variant="ghost">{t('demo.text.inputs.actions.cancel')}</Button>
                    </ActionRow>
                    <ActionRow align="end">
                      <Button variant="dashed">{t('demo.text.inputs.actions.export')}</Button>
                      <Button variant="primary">{t('demo.text.inputs.actions.submit')}</Button>
                    </ActionRow>
                  </PreviewGroup>
                </PreviewPanel>
                <ShowcaseMeta>
                  {t('demo.text.inputs.actionRow.use')}{' '}
                  <CodeText as="span" class="codeInline">
                    align
                  </CodeText>{' '}
                  {t('demo.text.inputs.actionRow.meta')}
                </ShowcaseMeta>
              </ShowcaseSection>
            </>
          );
        })()}
      </Show>
    </div>
  );
};

export default InputsDemoBodies;
