# Generelle MR
## Beschreibe deine Änderungen
>
## User Story ID und Link
- User Story ID:
- Issue Link:
## Checklist bevor Merge Request

- [ ] Ich habe den Master Branch gepullt und in meinen Feature Branch gemerged
- [ ] Ich habe eine self-review meines Codes gemacht
- [ ] Der Code ist richtig formatiert
- [ ] Das Feature ist vollständig fertig und bereit für eine Review
- [ ] Diese MR hat als Zielbranch den develop Branch
- [ ] Ich habe alle console und debug logs entfernt
- [ ] Ich habe einen Wiki Eintrag zu diesem Feature erstellt

- [ ] Tests sind vorhanden und grün (falls zutreffend)
---
# Frontend Spezifisch
## Perceivable (Wahrnehmbar):

- [ ] Alle Medien (Audios, Videos) haben verständliche Untertitel
- [ ] Alle Animationen sind durch `prefers-reducedmotion` steuerbar
- [ ] Alle Formularfelder haben sichtbare Labels
### Layout und Informationshierarchie
- [ ] Ich habe sicher gestellt das Layout responsive interagiert
	- [ ] Inhalte sind bei 200 % und 400% Zoom nutzbar (WCAG 1.4.4, Level AA)
	- [ ] Kein horizontales Scrollen bei Viewport-Breite von 320 CSS-Pixel (WCAG 1.4.10, Level AA)
	- [ ] Touch-Targets sind mindestens 44×44px (WCAG 2.5.8)
- [ ] Eine Seite/Ein Abschnitt hat eine klare Hauptaufgabe
- [ ] Die Visuelle Hierarchie unterstützt die semantische Hierarchie
- [ ] Abstände und Gruppierungen sind so gewählt, dass sie Struktur und Orientierung vermitteln
### Farben
- [ ] Text und UI-Elemente wurden auf Ausreichender Kontrast geprüft
- [ ] Es gibt keine Informationen die nur durch Farbe vermittelt werden
## Fonts / Text
- [ ] Ich hab die Typografie auf Skalierbarkeit getestet (wie bei layout 200%-400%)
- [ ] Verwendete Fonts sind Serifenlos
- [ ] Bei der gewählten Font sind Buchstaben und Zahlen sind klar unterscheidbar
- [ ] Verwendete Fonts sind nicht Kursiv
- [ ] Lange Texte wurden nicht in nur Großbuchstaben geschrieben
- [ ] Lange Texte sind linksbündig für bessere Lesbarkeit
- [ ] Semantische Hervorhebung (fett, kursiv) wurden gezielt und sparsam eingesetzt
- [ ] Bei Hyperlinks ist der Text ist der Informationsträger
- [ ] Die gewählte Font ist einfach und flüssig zu lesen
### Bilder
- [ ] Alle Bilder verfügen über einen aussagekräftigen Alt-Text
- [ ] Alle Bilder verfügen über passende Fallbacks
## Bedienbarkeit (Operable):
- [ ] Alle Funktionen sind ohne Maus erreichbar
- [ ] Die Fokus Reihenfolge der Tastaturbedienung folgt der visuellen und inhaltlichen Logik
- [ ] Es sind keine „Tastatur-Fallen" in Menüs, Dialogen oder Widgets vorhanden
- [ ] Bei der Tastaturbedienung sind Skip-Link und Landmarken für schnellere Navigation implementiert
- [ ] Bei Tastaturbedienung ist Sichtbarer Fokusabstand auf allen interaktiven Elementen gegeben → Fokus-Indikator: mindestens 2px breit, Kontrast 3:1 gegen Hintergrund (WCAG 2.4.13)
- [ ] Alle implementierte Klick-/Touchflächen sind mindestens 44×44px
- [ ] Es gibt keine unnötigen Zeitlimits oder Auto-Weiterleitungen
## Verständlichkeit (Understandable):
- [ ] Es wurde einfache und direkte Sprache verwendet
- [ ] Die Überschriftenhierarchie ist klar und konsistent
- [ ] Es wurde eindeutige Beschriftungen und keine vagen Beschriftungen/Platzhalter verwendet
- [ ] Konsistentes Verhalten: Gleiche Aktionen → gleiche Muster
---
- [ ] Ich habe präzise, verständliche Fehlermeldungen mit Lösungshinweisen implementiert
- [ ] Fehlertexte sind nah am Feld und visuell hervorgehoben
- [ ] Fehlertexte sind deskriptiv und kronkret
- [ ] Bei Fehlertexten gibt es eine Handlungsanweisung
- [ ] Alle komplexen UI-Elemente wurden mit Aria-Attributen versehen („Dieser Button ist gerade geöffnet", „Dieses Feld ist Pflichtfeld")
- [ ] In Formularen mit mehreren Feldern existiert eine Fehlerzusammenfassung am anfang des Formulars mit Ankerlinks zu den entsprechenden Feldern
- [ ] Statusmeldungen (Erfolg/Fehler) Screenreader
- [ ] Live-Validierung dezent und nicht übermäßig aggressiv (Fehlermeldungen anzeigen so dass sie helfen, ohne zu nerven oder zu stressen)
## Robustheit (Robust):
- [ ] Semantische Struktur als Grundlage für Assistive Technologien implementieren Semantische Rolle = Ist das ein Button, ein Link, eine Überschrift?