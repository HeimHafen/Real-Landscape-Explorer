# REAL LANDSCAPE EXPLORER – WEISSE WAND V1

Eine **begehbare 3D-Welt**, die aus der vom Nutzer bereitgestellten Sketchfab-GLB **„Weisse Wand Mountain peek 2517 m 8257 ft“** von **Shahriar Shahrabi** erstellt wurde.

## Was wirklich im Projekt steckt

- Die tatsächlich vorhandenen und in den Spielraum transformierten **442.766 3D-Dreiecke** des fotografischen Geländemodells (keine neu erfundene Ersatzlandschaft).
- Originale Fototextur, für die Grafikschalter in 1K, 2K und 4K aufbereitet. Standard: 2K für Smartphones.
- Gesonderte, **aus den Geländedreiecken berechnete** Kollisionshöhenkarte mit 1024 × 1024 Messpunkten sowie Abdeckungsmaske für modellierte Flächen. Kollisionen an steilen Hängen oder unvollständigen Scans sind **eine Annäherung**, keine vollständige Physiksimulation.
- First-Person-Bewegung, WASD, iPhone-Joystick, Umsehen, Laufen und Aussicht-/Flugmodus.
- Keine externen Bibliotheken oder CDN-Texturen nötig. Benötigt WebGL 2.

## Wichtige Grenzen

- Der exportierte Sketchfab-Scan ist nicht eindeutig in Vermessungsmetern kalibriert. **Die Spiellandschaft wurde näherungsweise auf eine größte horizontale Ausdehnung von 2,2 km skaliert.** Das ist keine verifizierte 1:1-Georeferenzierung. Die im Spiel angezeigte „Modellhöhe“ ist **keine reale Höhe über dem Meeresspiegel**.
- Aufnahmen aus der Luft wirken aus der Nähe naturgemäß oft weniger detailreich. Für überzeugende Bodenperspektiven wären zusätzliche Bodenscans nötig.
- Für den Export unvollständig erfasste Geländeabschnitte sind gesperrt; auch sehr steile Klippen sind nicht überall begehbar.
- iPhone-Safari wurde mit diesem Paket **nicht** live getestet. JavaScript-Syntax, GLB-Konvertierung, Dateiformat, Kollisionsdaten und ZIP-Integrität wurden geprüft. Die tatsächliche Bildrate muss auf dem Gerät ermittelt werden.

## In dein bestehendes GitHub-Repository hochladen

1. Diese ZIP vollständig entpacken.
2. In `Real-Landscape-Explorer` im Branch `main` die neue `index.html`, `README.md`, `CREDITS.md` und den kompletten Ordner `assets/` in das **Stammverzeichnis** hochladen. Gleichnamige Dateien ersetzen.
3. Vergewissern, dass Dateien **exakt** so liegen:

```
Real-Landscape-Explorer/
├── index.html
├── README.md
├── CREDITS.md
├── terrain-overview.png
└── assets/
    ├── terrain.bin
    ├── height.bin
    ├── coverage.bin
    ├── meta.json
    ├── weisse-wand-1k.jpg
    ├── weisse-wand-2k.jpg
    └── weisse-wand-4k.jpg
```

4. Commit und Push auf `refs/heads/main` (kein Force Push).
5. GitHub → Settings → Pages → `Deploy from a branch` → `main` und `/(root)`.
6. Laden: `https://heimhafen.github.io/Real-Landscape-Explorer/?v=weisse-wand-1`.

Die alten, nicht mehr verwendeten V1-/V2-Dateien können nach erfolgreichem Funktionstest entfernt werden.

**Wichtig:** Nur `index.html` hochzuladen reicht diesmal **nicht** – das tatsächliche 3D-Modell liegt im `assets`-Ordner. Die Startseite zeigt im Fehlerfall eine Meldung mit der Ursache.

## Steuerung

- iPhone: Joystick links, rechts auf der Landschaft wischen; Schaltflächen `AUSSICHT`, `LAUFEN`, `GRAFIK`, `START`.
- Computer: WASD, Mauswischen, Shift schneller, V Aussicht/Wandern, R Start. Im Aussichtflug: Leertaste aufwärts und X abwärts.
- Die Landschaft lässt sich ohne Account und ohne laufende Datenverbindung nach einmaligem Herunterladen vom GitHub-Server darstellen, wenn sie lokal vorliegt; GitHub Pages selbst benötigt natürlich eine Verbindung zum Laden der Dateien.

## Lizenz und Attribution

Siehe `CREDITS.md`. Der Ursprungsscan ist unter **Creative Commons Attribution 4.0** lizenziert, weshalb bei Verwendung der Urheber und die Quelle angegeben werden müssen. Die gelieferte Version verändert die Speicherung, Skalierung und Texturauflösung des Originals.
