import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { mediaEn } from '../en/media';

export const mediaPl: TranslationOf<typeof mediaEn> = {
  audioPlayer: {
    seekTitled: 'Pozycja odtwarzania — {title}',
  },
  carousel: {
    label: 'Karuzela',
    roleDescription: 'karuzela',
    slideRoleDescription: 'slajd',
    slide: '{index} z {count}',
    previous: 'Poprzedni slajd',
    next: 'Następny slajd',
    goTo: 'Przejdź do slajdu {index}',
    pauseAutoplay: 'Wstrzymaj automatyczne przewijanie',
    resumeAutoplay: 'Wznów automatyczne przewijanie',
  },
  imageCropper: {
    area: 'Obszar kadrowania. Przeciągnij lub użyj klawiszy strzałek, aby przesunąć obraz, a plusa i minusa, aby go powiększyć lub pomniejszyć.',
    rotateLeft: 'Obróć o 90° w lewo',
    zoom: 'Powiększenie',
    reset: 'Resetuj',
  },
  imageGrid: {
    openGallery: 'Otwórz galerię, jeszcze {count}',
    openImage: 'Otwórz: {alt}',
    openUntitled: 'Otwórz obraz {index}',
  },
  lightbox: {
    label: 'Obraz {index} z {count}',
    zoomIn: 'Powiększ',
    zoomOut: 'Pomniejsz',
    previous: 'Poprzedni obraz',
    next: 'Następny obraz',
    thumb: 'Obraz {index}',
  },
  mediaFrame: {
    error: 'Nie udało się wczytać multimediów',
    empty: 'Brak multimediów',
    embed: 'Osadzone multimedia',
    play: 'Odtwórz wideo',
    playTitled: 'Odtwórz: {title}',
  },
  player: {
    play: 'Odtwórz',
    pause: 'Wstrzymaj',
    mute: 'Wycisz',
    unmute: 'Wyłącz wyciszenie',
    seek: 'Pozycja odtwarzania',
    volume: 'Głośność',
    position: '{time} z {duration}',
    speed: 'Prędkość odtwarzania {rate}',
  },
  videoPlayer: {
    label: 'Odtwarzacz wideo',
    labelTitled: '{title} — odtwarzacz wideo',
    playKey: 'Odtwórz ({key})',
    pauseKey: 'Wstrzymaj ({key})',
    muteKey: 'Wycisz ({key})',
    unmuteKey: 'Wyłącz wyciszenie ({key})',
    captionsKey: 'Napisy ({key})',
    fullscreenKey: 'Pełny ekran ({key})',
    exitFullscreenKey: 'Zamknij pełny ekran ({key})',
  },
};
