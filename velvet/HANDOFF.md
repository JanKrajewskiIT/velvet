# Velvet UI — handoff package

Paczka z Velvet UI Design System dla innego LLM-a lub programisty, który ma to zaimplementować w kodzie.
Wygenerowano 2026-11-10 z artefaktu „Velvet UI Design System (nowy format)” (https://claude.ai/artifact/G6b7UUevXNJzLDGj7rs21s).

## Co jest w środku

```
velvet-ui-handoff/
  HANDOFF.md           ← ten plik
  package-info.json    ← wersja paczki: sumy SHA-256 tokenów i bundla (do porównania po aktualizacji)
  velvet/              ← wyeksportowany projekt design systemu, tylko do odczytu
    README.md            księga marki: głos, kolor, typografia, motion, ikony
    tokens.json / tokens.css
    components/          bundle.css, bundle.js (referencja React), index.d.ts, 260 folderów komponentów (README + preview.html)
    docs/                AGENTS.md, AGENTS-solid.md, rules.md, components.md, solid-porting.md, skrypty lint/sync
    fonts/               Hanken Grotesk, JetBrains Mono, Space Grotesk (woff2)
    assets/icons/        156 ikon SVG
    guidelines/, showcase/
```

Pominięte celowo (pliki narzędzi projektowych, niepotrzebne do implementacji): `design-system.json`, `manifest.json`, `api/`, `SKILL.md`, `index.html`, `artifact-type/`.

## Jak tego użyć

1. Rozpakuj paczkę do repozytorium docelowej aplikacji tak, aby folder `velvet/` leżał w korzeniu (albo w `vendor/`).
2. Skopiuj `velvet/docs/AGENTS.md` do korzenia repozytorium. Dla SolidJS skopiuj też `velvet/docs/AGENTS-solid.md`. Ścieżki w tych plikach są względne względem `velvet/`.
3. Folder `velvet/` jest tylko do odczytu. Aktualizacja design systemu = podmiana całego folderu w osobnym commicie, potem porównanie `sourceHashes` z linii 1 `components/bundle.js` (opisane w `AGENTS.md`, sekcja 9).
4. Skrypty kontrolne działają z korzenia `velvet/` (`node docs/lint-tokens.mjs`, `node docs/sync-sections.mjs --check`). Uwaga: w obecnej wersji źródła oba zgłaszają uwagi, patrz „Znane problemy źródła” niżej.

## Szablon polecenia dla LLM-a (stack neutralny)

```
Implement the Velvet UI design system in <STACK> in this repository.
Read velvet/docs/AGENTS.md first and follow it exactly (also velvet/docs/AGENTS-solid.md if the stack is SolidJS).
Work on ONE component per task, starting with tokens/base and the helpers/atoms listed in velvet/docs/components.md.
Do not change CSS class names, DOM structure or props. Verify against velvet/components/<Name>/preview.html.
Component to port now: <Name>
```

## Znane problemy źródła (stan na 2026-11-10, nie wynikają z eksportu)

Paczka jest wierną kopią artefaktu; sprawdzone na rozpakowanym archiwum i na źródle, wynik identyczny:

- `node docs/lint-tokens.mjs` kończy się kodem 1: 5 odczytów tokenów `ref-*` w `components/bundle.css` (`--font-size-xs`, `--font-size-md`, `--font-size-3xl`, `--font-size-2xs`, `--dur-slower`). Kolorów na sztywno 0, odstępów poza siatką 0. Reguła design systemu (`docs/rules.md`) mówi, że CSS komponentów czyta tokeny comp/sys, nie ref.
- `node docs/sync-sections.mjs --check` zgłasza, że `docs/components.md` zmieniłby się po ponownym wygenerowaniu, czyli ten plik jest nieaktualny względem bundla.

Agent implementujący nie powinien tego „naprawiać” w `velvet/` (folder jest tylko do odczytu). To sprawy do poprawy w samym design systemie, po czym trzeba wygenerować paczkę ponownie.

## Uwagi

- Dokumentacja w paczce jest po angielsku (tak jak w design systemie), żeby agenci pracowali na niej bez tłumaczenia.
- Design system opisuje wygląd i zachowanie UI. Logika aplikacji, dane i integracje do niego nie należą.
