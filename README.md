# REAL LANDSCAPE EXPLORER – V2: Geologischer Realismus

## Was es ist

**Komplett neues V2-Landschaftsupdate auf Basis von V1.** Die alte, zusammenhängende 3,6 × 3,6 km Vulkanlandschaft ist erhalten geblieben, ebenso die Touch-/WASD-Steuerung und die frei bewegliche Kamera. Neue Materialzonen und über 5.000 geologisch gruppierte Felsobjekte verbessern die Nah- und Fernwirkung.

**Ehrliche Einordnung:** Die Geländeform ist weiterhin **fiktiv**. Dies ist **kein** 1:1-Laserscan/Fotogrammetrie-Modell von Island. Eine reale Maßstabseinheit entspricht zwar einem Meter, aber geografisch entspricht es keinem realen Ort.

## Was neu ist

- 4 Materialebenen: lokale (nicht CDN-abhängige) geologische Farbkarte, echter fotografischer Fels, fotografisches Geröll/Asche und fotografische Normalkarte.
- Steilhänge werden mit triplanar projizierten Fotos strukturiert (keine gestreckte Textur an Hängen).
- Aufgelockerte Lava- und mineralische Zonen, feinere Nahoberflächen, trockenes Geröll, spärliche graugrüne Verwitterungszonen.
- **5.149** unterschiedliche Felsen in unregelmäßigen Ablagerungsfächern, davon 1.050 zusätzlich um den neuen Startbereich, plus breite Ausläufer und vereinzelte größere Felsformationen.
- Angenehmere Lichtbalance, gedämpfter Dunst, neutralere Wolken und höhere Detailwirkung aus Augenhöhe.
- Adaptive ECO-Umschaltung nach fünf Sekunden unter 30 FPS. Per Button auch manuell umschaltbar.
- Kamera startet näher an einer geologisch interessanteren Flanke und blickt in die Kraterlandschaft.
- `index.html` ist weiterhin ein eigenständig startbares Browser-Spiel mit **vollständig eingebettetem GLB-Modell**, ohne zusätzliche Verzeichnisse und ohne JavaScript-CDN.

## Paket

- `index.html`: **einzige nötige Datei**, vollständig, für direkten Upload ins GitHub-Repository-Root
- `assets/landscape.glb`: getrennte editierbare GLB-Datei für spätere Asset-Entwicklung
- `assets/model-info.json`: Dreieckszahlen, Modellinformation, Herkunft
- `source/`: Modularversion für Software-Entwicklung (beim eigenen Build `modular-index.html` als `index.html` verwenden und `app.js`, `style.css`, `assets/` gemeinsam hochladen)

## GitHub / Working Copy

1. **V1-Repository behalten**: `Real-Landscape-Explorer`.
2. `index.html` aus V2 im Stammverzeichnis **überschreiben**, optional `README.md`.
3. Working Copy Commit → `refs/heads/main` Push, **Force Push aus**.
4. `https://heimhafen.github.io/Real-Landscape-Explorer/?v=2` öffnen.
5. Wenn Safari noch V1 zeigt: einmal neu laden, gegebenenfalls Website-Daten/Cache löschen.

## Wichtige Grenzen

- Kein garantierter Fotorealismus/AAA-Niveau; die Modelloberfläche verwendet verbesserte fotografische 2D-Materialien, aber keine echte Terrain-Fotogrammetrie.
- Ein Safari-Test auf dem physischen iPhone wurde aus dieser Umgebung **nicht durchgeführt**; WebGL2-Shader sind syntaktisch vorbereitet, aber die Bildrate kann je nach Hardware stark abweichen.
- Das eigenständige `index.html` ist groß, weil das gesamte GLB als Base64 eingebettet ist. Bei Ladeproblemen kann die modulare Variante genutzt werden (eigenständiges `assets/landscape.glb`).
- Grosse 3D-Felsformationen sind nur näherungsweise kollidierend; die Terrainkollision verwendet die echte gerenderte Höhenfläche.

## Fototexturen und Rechte

Die fotobasierten Stein- und Normal-Texturen stammen aus den bereits im V1-Projekt verwendeten CC0-Fotomaterialien. Hier wurden sie farblich angepasst und ins GLB eingebettet. Kein fremdes Kartenbild wurde ohne Lizenz übernommen.

## Ausblick

Für noch deutlich höheren Realismus brauchen wir als nächstes eine kleine Fokuszone mit **hochaufgelösten photogrammetrischen 3D-Scans oder realen amtlichen Geländedaten**, dazu korrekte natürliche Oberflächen und geprüfte mobile Performance, statt immer mehr generierte Fernlandschaft.
