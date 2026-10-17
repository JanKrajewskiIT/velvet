# Recron — backlog pomysłów

Zaprojektowane w szablonie (październik 2026): plany i kredyty AI, follow-upy, analityka na Today, kalkulator B2B/UoP, benchmark + plan negocjacji, publiczny link do CV ze statystykami, panel moderacji.

Domknięcie procesu (październik 2026): statusy Offer/Accepted, ekran przyjęcia oferty, warunki i terminy w ofercie, ludzie, wysłane dokumenty, debrief rozmowy → Prep, .ics, faktury z NIP.

Baseline i „po wygranej” (październik 2026): obecna praca jako punkt odniesienia (Salary + Compare), wykrywanie ghostingu (21 dni bez odpowiedzi → „No reply”), checklista od oferty do pierwszego dnia z kolizją okresu wypowiedzenia i wzorem wypowiedzenia, wynik negocjacji (prosiłem / dostałem), tryb dyskretny (ukrywa kwoty).

Ekran Salary (październik 2026): oczekiwania finansowe niezależne od oferty — kwota na rękę / UoP brutto / faktura B2B → równoważniki dla UoP i trzech form B2B, z założeniami (ZUS, koszty, płatne i chorobowe dni na B2B, 50% KUP, PPK). Zapisane oczekiwania wracają w liście ofert (kropka), Compare i zakładce Salary oferty.

## Statusy (decyzja)
- 6 statusów: New · Considering · Applied · **Offer** · **Accepted** · Rejected. „Withdrawn” to Rejected + „I passed” + powód „Withdrew” — nie osobny status.
- Na boardzie i w filtrach zawsze 5 kolumn; **Accepted pojawia się dopiero, gdy coś tam trafi** (stan końcowy). Kanban ma min. 200 px/kolumnę i przewija się poziomo, więc 6 kolumn mieści się w 1360 px.
- Etap rozmów (Screening → HR) pozostaje na rozmowach, nie w statusie — inaczej statusy by się mnożyły.
- Przejście do Accepted zawsze przez dialog: zamyka pozostałe aktywne procesy (Rejected · „Accepted another offer”), anuluje ich rozmowy, daje szablon wiadomości i zamyka wyszukiwanie na Today.

## Model kredytów (decyzja)
- Rozliczamy **kredyty**, nie tokeny ani requesty. 1 kredyt ≈ jedna typowa akcja AI; cięższe kosztują więcej (ATS 2, negocjacje 2). Tokeny są niezrozumiałe dla kandydata i zmieniają się z modelem — kredyt to stała obietnica, a marżę regulujemy ceną kredytu.
- **3 darmowe próby każdego narzędzia AI** (per funkcja) + 10 kredytów/mies. na Free. Próby uczą wartości konkretnej funkcji, miesięczna pula daje powód do powrotu.
- Zawsze darmowe: czytanie oferty z linku (aktywacja), kalkulator B2B/UoP (SEO/viral), tracking, prep, CV builder.
- Pro 29 zł/mies. (290 zł/rok) = 300 kredytów + funkcje Pro. Sprint pass 59 zł / 30 dni bez subskrypcji — szukanie pracy jest sezonowe.
- Paczki 50 / 150 / 400 kredytów, nie wygasają, zużywane po miesięcznych. Nieudany run = automatyczny zwrot.

## Do rozważenia później
- **Wtyczka do przeglądarki / forward maila** — „Zapisz w Recron” z LinkedIn/JustJoin/NoFluff; największy wpływ na aktywację.
- **Panel dla coachów i bootcampów (B2B)** — mentor widzi pipeline’y podopiecznych, komentuje CV, licencje zespołowe.
- **Symulacja rozmowy z AI (głos)** — premium w Prep, ~5 kredytów za sesję, ocena odpowiedzi STAR.
- **Kolumna „na rękę” w Compare** — netto UoP/B2B obok brutto przy porównaniu ofert.
- **Minimalna stawka w preferencjach** — ukrywanie/flagowanie ofert poniżej progu (dane: 4 oferty odrzucone przez „Salary too low”).
- **Tygodniowe podsumowanie mailem** z Insights (switch już jest w Settings).
- **Referral program** — zaproś znajomego = 20 kredytów dla obu.
- **Import z LinkedIn** (CV + historia aplikacji) — przycisk Import w CV już istnieje.
- **Sync statusów z maila** — wykrywanie odpowiedzi rekrutera / odmowy i podpowiedź zmiany statusu.
- **Moderacja: reputacja autorów** — auto-approve dla autorów z ≥10 zatwierdzonymi pytaniami, scalanie duplikatów.
- **Duplikaty i konflikty z agencjami** — ta sama rola przez agencję i bezpośrednio; ostrzeżenie „Hays już zgłosił Cię do Globex”, zgoda na każde zgłoszenie przez agencję.
- **Kontakty po zatrudnieniu** — przypomnienie o check-inie z rekruterami po 6 miesiącach (checklista już to obiecuje); osobny widok „People”.
- **Cykle wyszukiwania** — archiwum zamkniętego wyszukiwania i porównanie statystyk między cyklami; dziś `searchClosed` to tylko flaga.
- **Benchmark z wyników negocjacji** — anonimowe „asked vs got” zasila `bench` (pole już zbierane w Terms).
- **Tryb dyskretny także dla nazw firm** — dziś maskuje tylko kwoty.
- **Salary — dalej:** wspólne rozliczenie z małżonkiem, ulga na dzieci, IP Box (5%), dobrowolne chorobowe na B2B, VAT zwolniony do 200 tys.; eksport założeń dla księgowej (PDF); oczekiwania per poziom (mid / senior) i historia zmian.
- **Odrzucone wprost:** marketplace dla rekruterów — zmienia klienta produktu i podważa zaufanie kandydatów.

## Uwagi techniczne
- **Język:** UI po angielsku, domena polska (PLN, ZUS, NIP, ryczałt). Zdecydować o języku głównym; LocaleSwitcher jest w DS, Settings ma wybór języka.
- **Insights są statyczne** (`insights` w recron-data.js) — lejek, źródła i powody liczyć z `offers`/`interviews`, tak żeby status Offer i „No reply” z ghostingu od razu się w nich pojawiały.
- **Kursy i godziny:** `netOf` liczy EUR po 4,3 i stawkę godzinową × 168 h — pobierać kurs NBP i pozwolić ustawić liczbę godzin.
- **Powiadomienia** w Navbar są zahardkodowane — generować z terminów, rozmów i follow-upów.
- **Brak persystencji:** stan prototypu ginie po przeładowaniu; `addQuestions` (debrief → Prep) mutuje `D.questions` — przed portem zastąpić zapisem do API.
- `Heatmap` i `FunnelChart` zawieszały stronę, gdy siedziały w zagnieżdżonym DC obok nowych sekcji (Today → Insights). Karta „Your rhythm” została usunięta z Today, lejek i źródła są narysowane na `Meter`. Do zbadania w DS przed portem.
