import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { formsEn } from '../en/forms';

export const formsPl: TranslationOf<typeof formsEn> = {
  autocomplete: {
    placeholder: 'Szukaj…',
    emptyText: 'Brak wyników.',
    customLabel: 'Użyj „{text}”',
  },
  calendar: {
    previousMonth: 'Poprzedni miesiąc',
    nextMonth: 'Następny miesiąc',
  },
  cascader: {
    placeholder: 'Wybierz…',
    dialogLabel: 'Wybierz',
    searchLabel: 'Szukaj opcji',
    noMatches: 'Brak wyników',
  },
  cascaderColumns: {
    level: 'Poziom {level}',
  },
  colorPanel: {
    areaLabel: 'Nasycenie i jasność',
    areaValue: 'Nasycenie {saturation}%, jasność {brightness}%',
    hueLabel: 'Odcień',
    hexLabel: 'Kolor w zapisie HEX',
    presetsLabel: 'Gotowe kolory',
  },
  colorPicker: {
    label: 'Kolor',
    selected: 'Wybrany',
    dialogLabel: 'Wybór koloru',
    triggerLabel: '{name}: {value}',
  },
  dateField: {
    clearLabel: 'Wyczyść datę',
  },
  datePicker: {
    placeholder: 'Wybierz datę',
    dialogLabel: 'Wybór daty',
  },
  dateRangePicker: {
    placeholder: 'Wybierz daty',
    dialogLabel: 'Wybór zakresu dat',
    presetsLabel: 'Gotowe zakresy',
    pickStartDate: 'Wybierz datę początkową',
    summary: '{range} · {count, plural, one {# dzień} few {# dni} many {# dni} other {# dnia}}',
  },
  dateTimePicker: {
    placeholder: 'Wybierz datę i godzinę',
    dialogLabel: 'Wybór daty i godziny',
    timeLabel: 'Godzina',
    now: 'Teraz',
  },
  editableCollection: {
    countLabel: '{count, plural, one {# element} few {# elementy} many {# elementów} other {# elementu}}',
    levelLabel: 'Poziom',
    requiredText: 'To pole nie może być puste',
    placeholder: 'Nazwa',
    addLabel: 'Dodaj element',
    emptyText: 'Nic tu jeszcze nie ma.',
    label: 'Elementy',
    reorderItem: 'Zmień kolejność elementu {index} (↑↓)',
    reorderHint: 'Przeciągnij lub użyj ↑ ↓',
    itemLabel: 'Element {index}',
    levelForItem: '{level} elementu {index}',
    importanceLabel: 'Ważność elementu {index}',
    moveUp: 'Przesuń w górę',
    moveDown: 'Przesuń w dół',
    removeItem: 'Usuń element {index}',
  },
  errorSummary: {
    title:
      '{count, plural, one {Do poprawienia jest # problem} few {Do poprawienia są # problemy} many {Do poprawienia jest # problemów} other {Do poprawienia jest # problemu}}',
  },
  fileUpload: {
    rejectedType: '{name} — nieobsługiwany typ pliku',
    rejectedCount: '{name} — osiągnięto limit liczby plików',
    title: 'Upuść pliki tutaj lub przeglądaj',
    releaseToUpload: 'Upuść, aby przesłać',
    rejected: '{names} — przekracza {limit}',
  },
  fileUploadRow: {
    uploaded: 'Przesłano',
    uploadFailed: 'Nie udało się przesłać',
    uploading: 'Przesyłanie: {name}',
    cancelUpload: 'Anuluj: {name}',
    removeFile: 'Usuń: {name}',
  },
  inlineEdit: {
    placeholder: 'Kliknij, aby dodać…',
    saveErrorText: 'Nie udało się zapisać — spróbuj ponownie.',
  },
  mentionInput: {
    listLabel: 'Sugestie',
  },
  multiSelect: {
    createLabel: 'Dodaj',
    createOption: '{verb} „{label}”',
    placeholder: 'Wybierz…',
    emptyText: 'Brak wyników.',
    searchPrompt: 'Zacznij pisać, aby wyszukać.',
    selectedCount: 'Wybrano: {count}',
    selectedCountOfMax: 'Wybrano: {count} z {max}',
    removeItem: 'Usuń: {label}',
  },
  rangePresets: {
    last7Days: 'Ostatnie 7 dni',
    last30Days: 'Ostatnie 30 dni',
    thisMonth: 'Ten miesiąc',
    lastMonth: 'Poprzedni miesiąc',
    thisYear: 'Ten rok',
  },
  numberInput: {
    invalidNumber: 'Wpisz prawidłową liczbę.',
    decreaseLabel: 'Zmniejsz',
    increaseLabel: 'Zwiększ',
  },
  optionListStatus: {
    errorText: 'Nie udało się wczytać opcji',
  },
  formValue: {
    required: 'To pole jest wymagane.',
  },
  otpInput: {
    cellLabel: 'Cyfra {index} z {length}',
  },
  passwordInput: {
    label: 'Hasło',
    showLabel: 'Pokaż hasło',
    hideLabel: 'Ukryj hasło',
    strength: {
      tooWeak: 'Zbyt słabe',
      weak: 'Słabe',
      fair: 'Średnie',
      good: 'Dobre',
      strong: 'Mocne',
    },
  },
  phoneInput: {
    label: 'Telefon',
    countryLabel: 'Kraj',
    invalidNumber:
      'Wpisz prawidłowy numer ({country}): {count, plural, one {# cyfra} few {# cyfry} many {# cyfr} other {# cyfry}}',
  },
  rangeInput: {
    fromLabel: 'Od',
    toLabel: 'Do',
    invertedError: 'Dolna granica jest większa niż górna',
    unitLabel: 'Waluta',
    periodLabel: 'Okres',
  },
  rating: {
    label: 'Ocena',
    valueLabel: '{value} z {max}',
    starLabel: '{star} z {max}',
  },
  ratingSummary: {
    noun: 'recenzja',
    reviewCount: '{total} {count, plural, one {recenzja} few {recenzje} many {recenzji} other {recenzji}}',
    label: 'Rozkład ocen',
    averageLabel: 'Średnia ocena',
    rowLabel:
      '{star, plural, one {# gwiazdka} few {# gwiazdki} many {# gwiazdek} other {# gwiazdki}}: {count} ({percent}%)',
  },
  richTextEditor: {
    placeholder: 'Napisz coś…',
    toolbar: 'Formatowanie',
    tools: {
      bold: 'Pogrubienie',
      italic: 'Kursywa',
      underline: 'Podkreślenie',
      strike: 'Przekreślenie',
      code: 'Kod w tekście',
      heading: 'Nagłówek',
      subheading: 'Podnagłówek',
      bulletedList: 'Lista punktowana',
      numberedList: 'Lista numerowana',
      quote: 'Cytat',
      codeBlock: 'Blok kodu',
      link: 'Link',
      redo: 'Ponów',
    },
  },
  richTextLinkPopover: {
    dialog: 'Edytuj link',
    address: 'Adres linku',
    placeholder: 'Wklej lub wpisz link',
    remove: 'Usuń link',
    invalid: 'Wpisz adres internetowy, na przykład velvet.design, lub adres e-mail',
  },
  searchInput: {
    placeholder: 'Szukaj…',
    emptyText: 'Brak wyników.',
    clearLabel: 'Wyczyść wyszukiwanie',
  },
  select: {
    placeholder: 'Wybierz…',
  },
  signaturePad: {
    placeholder: 'Podpisz tutaj',
    canvasLabel: 'Podpis',
    signedLabel: 'podpisany',
    emptyLabel: 'pusty',
  },
  slider: {
    valueLabel: 'Wartość',
    thumbMinimum: 'Minimum',
    thumbMaximum: 'Maksimum',
  },
  tagInput: {
    placeholder: 'Dodaj…',
    removeLabel: 'Usuń: {tag}',
  },
  timePicker: {
    optionsLabel: 'Godziny do wyboru',
    invalidTime: 'Wpisz godzinę, na przykład {example}',
    outsideRange: 'Wpisz godzinę między {min} a {max}',
  },
  timeStepper: {
    label: 'Godzina',
    hours: 'Godziny',
    minutes: 'Minuty',
    increaseHours: 'Zwiększ godziny',
    decreaseHours: 'Zmniejsz godziny',
    increaseMinutes: 'Zwiększ minuty',
    decreaseMinutes: 'Zmniejsz minuty',
    switchTo: 'Przełącz na {period}',
  },
  transferList: {
    availableTitle: 'Dostępne',
    selectedTitle: 'Wybrane',
    label: 'Przenoszenie elementów między listami',
    searchAvailablePlaceholder: 'Szukaj…',
    searchSelectedPlaceholder: 'Szukaj wśród wybranych…',
    emptyAvailable: 'Wszystko zostało dodane',
    emptySelected: 'Nic jeszcze nie wybrano — wybierz z listy po lewej',
    duplicateValues:
      'Zduplikowane wartości elementów — przenoszenie jest wyłączone, dopóki każda wartość nie będzie unikalna.',
    itemsAdded:
      '{count, plural, one {Dodano # element} few {Dodano # elementy} many {Dodano # elementów} other {Dodano # elementu}} do: {title}',
    itemsRemoved:
      '{count, plural, one {Przeniesiono # element} few {Przeniesiono # elementy} many {Przeniesiono # elementów} other {Przeniesiono # elementu}} do: {title}',
    movedToPosition: 'Przeniesiono na pozycję {position}',
    reordered: 'Zmieniono kolejność',
    limitProgress: 'Wybrano {count} z {max}',
    limitReached: '{count} z {max} — osiągnięto limit',
  },
  transferPanel: {
    selectAll: 'Zaznacz wszystko: {title}',
    searchLabel: 'Szukaj: {title}',
    noMatchesFor: 'Brak wyników dla „{query}”',
    clearSearch: 'Wyczyść wyszukiwanie',
    deselect: 'Odznacz',
  },
  treeSelect: {
    placeholder: 'Wybierz…',
    searchLabel: 'Szukaj opcji',
    treeLabel: 'Opcje',
    noMatches: 'Brak wyników',
    selectedCount: 'Wybrano: {count}',
  },
};
