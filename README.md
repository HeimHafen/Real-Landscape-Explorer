# Real Landscape Explorer — V1

## Ein neuer Anfang: Nur die Landschaft

Dies ist ein **vollständig neues**, eigenständiges GitHub-Pages-Projekt. Es enthält **keine Burg, keine Gebäude und keine Blockfigur**.

**Wichtige Einordnung:** Das 3D-Gelände ist eine *frei gestaltete, von isländischem Vulkanland inspirierte* Landschaft. Es ist **kein 1:1-Scan des Fagradalsfjall** und keine amtliche Geodatendarstellung. Der Maßstab im 3D-Modell ist jedoch echt: **1 Einheit = 1 Meter**.

## Inhalt

- `index.html` — **vollständiges, eigenständig startfähiges Spiel**, einschließlich 3D-Gelände, WebGL2-Renderer, Materialien, Touch-Steuerung und Kollisionen. Die Datei allein reicht für GitHub Pages; keine CDNs.
- `assets/landscape.glb` — das **separate, editierbare GLB-3D-Modell** mit zwei Meshes (Terrain und Felsen), im normalen glTF-2.0-Format. Die Spielversion hat es bereits eingebettet, daher ist das separate GLB für den Spielstart nicht notwendig.
- `assets/model-info.json` — technische Modellspezifikation.
- `source/` — modularer Quellcode für spätere Weiterentwicklung. Die `modular-index.html` muss dann ins Root als `index.html` und die beiden Dateien `app.js`, `style.css` neben ihr gelegt werden.
- `terrain-datenansicht.png` — **topografische Prüfgrafik**, ausdrücklich kein Screenshot aus dem Spiel.

## Maße und Steuerung

- Fläche: **3.600 × 3.600 Meter = 12,96 km²**, in einem zusammenhängenden Geländemesh.
- 148.225 Geländepunkte, 294.912 Gelände-Dreiecke; zusätzlich 829 einzeln modellierte Felsformationen und 66.320 Fels-Dreiecke.
- Bewegen: **WASD** oder **iPhone-Joystick links**.
- Umsehen: **Mausziehen** oder **Fingerziehen auf der rechten Bildschirmfläche**.
- `Shift` oder Schaltfläche **LAUFEN**: schneller gehen; `Leertaste`: springen.
- **WANDERN / AUSSICHT** oder `V`: zwischen Fußmodus und freier Luftkamera wechseln. Im Luftmodus `Leertaste` = aufwärts und `X` = abwärts.
- **GRAFIK AUTO / ECO**: reduzierte Bildauflösung, wenn die Bildrate auf dem iPhone sinkt.
- `R` bzw. `↺`: Startposition.
- Die Kamera folgt im Fußmodus dem wirklichen Geländeverlauf und hält etwa 1,74 m Augenhöhe.

## Neues GitHub-Repository erstellen

1. Auf GitHub ein **neues, leeres, öffentliches Repository** namens `Real-Landscape-Explorer` erstellen.
2. Die Datei **`index.html` aus diesem ZIP ins Hauptverzeichnis** laden — allein diese Datei genügt zum Spielen.
3. Optional `README.md` und `assets/landscape.glb` mit hochladen, wenn du die 3D-Originaldatei im Repository aufbewahren willst.
4. **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
5. Die URL lautet nach Veröffentlichung (mit deinem bekannten GitHub-Account): `https://heimhafen.github.io/Real-Landscape-Explorer/`.

**Wichtig:** In der iOS-Dateien-App kann das lokale Öffnen einer HTML-Datei JavaScript blockieren. Für das Spiel den Link über GitHub Pages im Browser öffnen.

## Qualität und Grenzen

Die Datei ist ein **reales, frei begehbares 3D-Mesh** und keine perspektivische Bildfläche. Materialoberflächen kombinieren lokal mitgelieferte fotografische Mikrotexturen mit prozeduraler Farbgestaltung. Es handelt sich aber **noch nicht um ein fotorealistisches photogrammetrisches Gelände**. Nahaufnahmen, Beleuchtung und Felsgeometrie sind gegenüber AAA-Spielen eingeschränkt. Das Modell ist großflächig und in realen Metern skaliert, **aber seine Formen sind erfunden**.

Die 3D-Datei wurde mit trimesh geöffnet und geprüft. JavaScript-Syntax, Paketstruktur und die integrierten Modellbytes wurden getestet. **Eine tatsächliche iPhone-Safari-Bildrate oder WebGL-Grafikaufnahme kann aus dieser Arbeitsumgebung nicht bestätigt werden.** Sollte WebGL2 nicht funktionieren, zeigt die Seite eine konkrete Fehlermeldung statt eines endlosen Ladebildschirms.

## Fotos und Lizenz

3D-Geometrie und Programmcode wurden für dieses Projekt erstellt. Die fotografische Felsmikrotextur ist eine bearbeitete CC0-Testbildvorlage aus `scikit-image.data`, abgeleitet aus der im zuvor verwendeten Projekt dokumentierten CC0-Fotovorlage. Kein Markenlogo und keine eingeschränkt lizenzierten Google-Earth- oder Apple-Maps-Bilder sind integriert.

## Später: Echte geografische Geländedaten

Für eine reale 1:1-Landschaft können wir das Terrain durch amtliche DEM-Daten ersetzen, ohne die Bewegungssteuerung grundsätzlich neu zu bauen. Geeignete Quellen sind beispielsweise die Fagradalsfjall-Vermessungen (2021) auf Zenodo, DOI `10.5281/zenodo.6598466`, oder Mapzen Terrain Tiles auf AWS, jeweils mit eigener Lizenzprüfung. Das ist **nicht** Teil von V1.
