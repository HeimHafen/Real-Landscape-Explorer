# Real Landscape Explorer – Weisse Wand V2

## Geprüfte Grundlage
- Unveränderte Positionen, UV-Koordinaten und Topologie der fotografisch rekonstruierten Weissen Wand. Original 442.766 Dreiecke.
- Originale Fototexturen in 1K/2K/4K.
- **Neu:** Nahtlose fotografische Nahdetail-Ergänzungen aus CC0-Bodenmaterialien. Sie verändern die Bildwirkung, aber nicht die gescannte Geländeform.
- **Neu:** Begehbarkeitskarte für zusammenhängende, tatsächlich vermessene Flächen. Steile Hänge, Scanlücken und großflächige schwach rekonstruierte Dreiecke werden im Fußmodus gesperrt. Der Aussichtmodus bleibt für das ganze Gelände verfügbar.
- **Neu:** verbesserter Aussichtspunkt, kameraangepasste Bodenkollision und dezenteres Sonnenlicht / Dunst.

## GitHub Pages – Austausch
Alle Dateien dieses ZIP inklusive **assets/** ins Hauptverzeichnis von `Real-Landscape-Explorer` kopieren und gleichnamige Dateien überschreiben. Keine zusätzliche geschachtelte Projektmappe anlegen. Branch `main`, Pages `/(root)`.

Die alten Dateien `assets/height.bin`, `assets/coverage.bin` und alle Foto-Originale bleiben Teil des Pakets. Die neue `assets/walkable.bin` ist erforderlich. Nach Push `/Real-Landscape-Explorer/?v=ww2` öffnen.

## Steuerung
- Desktop: WASD, Mausziehen; **V** Wechsel Fußmodus/Aussicht; **R** Start; **Shift** schneller; in Aussicht **Leertaste/X** Flug-Höhe.
- iPhone: Joystick links, Blick mit Wischgeste rechts, Tasten rechts für Aussicht, Gehen/Laufen, Fotoauflösung, Neustart.

## Ehrliche technische Grenzen
Die Originalaufnahme entstand aus Drohnenfotos. Auch die 4K-Textur enthält nah am Boden nicht überall genug Auflösung. V2 ergänzt sichtbares Gras/Geröll mittels lokaler CC0-Fototexturen; diese Nahdetails sind **keine** zusätzlichen Original-Scandaten. Viele Felswände bleiben bewusst im Gehmodus gesperrt. Der Maßstab wurde für das Spiel angenähert, nicht in realen Koordinaten eingemessen.

**Prüfstatus:** Originalgeometrie, Materialdateien, JS-Syntax, Kollision und ZIP werden lokal überprüft. Eine echte Live-Spielaufnahme auf iPhone-Safari kann erst auf dem Gerät verifiziert werden.

Siehe `CREDITS.md` für Quellen und Lizenzbedingungen.
