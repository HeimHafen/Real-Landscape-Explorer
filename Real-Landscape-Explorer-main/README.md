# Real Landscape Explorer – Naturwelten V3 (Testfassung)

Ein eigenständiges, lokal ladendes WebGL-2-Spiel für GitHub Pages mit vier auswählbaren Schauplätzen. Auf der **Weissen Wand** bleibt die ursprüngliche photogrammetrische Landschaft erhalten. **Bergwald**, **Mauseklippe** und **Ruine Hinterhaus** sind voneinander getrennte, *künstlerisch angeordnete* Landschaftsbereiche, keine geographisch zusammenhängende Landschaftsrekonstruktion. Vier vom Nutzer bereitgestellte GLB-Dateien wurden in echte, strukturierte 3D-Geometrien mit UVs, Texturen und materialabhängiger Alphamaske umgewandelt. Die unbearbeiteten sehr großen GLBs werden zur Laufzeit nicht benötigt und liegen deshalb nicht zusätzlich im ZIP.

## Installieren / Repo aktualisieren

1. ZIP entpacken und den **Inhalt** des Ordners `Real-Landscape-Explorer-main/` direkt in das Wurzelverzeichnis des GitHub-Repositories übertragen. Insbesondere den kompletten Ordner `assets/scenes/` mit allen `.bin`, `.json`, `.png` und `.jpg` übertragen. Keine zweite verschachtelte Projektmappe anlegen.
2. `index.html` und das gesamte vorhandene `assets/` überschreiben. Das neue Laufzeitsystem steckt **in `index.html`**. `app.js` und der alte `source/`-Ordner sind nur noch Bestandsdateien des Ausgangsprojekts und werden von `index.html` nicht eingebunden.
3. In GitHub Pages den gewünschten Branch (z. B. `main`), Ordner `/ (root)` veröffentlichen und die Seite mit einem frischen Querystring `?v=naturwelten3` öffnen.
4. **Vor einem öffentlichen Upload die Nutzungsrechte klären** (siehe `CREDITS.md`). Gerade die **Ruine ist CC BY-NC**; der **Bergwald** hat laut Originaldatei eine **Sketchfab-Standardlizenz**. Für Rechteprüfung zunächst eine private lokale Testumgebung benutzen, statt die Modelle unbedacht öffentlich verfügbar zu machen.

Kein Build-Prozess, keine externen CDNs, kein serverseitiges Backend. Zum lokalen Entwickeln benötigt der Browser einen lokalen HTTP-Server, etwa `python -m http.server 8000`; `file://` ist wegen Browser-Sicherheitsbeschränkungen ungeeignet.

## Die vier 3D-Bereiche

| Menüpunkt | Eingebundene Daten | Funktion |
|---|---|---|
| **01 Weisse Wand** | Bestehender Originalscan: 442.766 Dreiecke; Fototexturen 1K/2K/4K | Originale Hang- und Wanderansicht |
| **02 Bergwald** | „The landscape is a forest in the mountains“ + „Simple grass chunks“ | Importierte Bäume, Felsen und Grasvegetation in einem eigenen Tal |
| **03 Mauseklippe** | Photogrammetrischer Harzer Granitscan; optimiert auf **130.614 Dreiecke** | Begehbare Umgebung und einbetttetes Felsensemble |
| **04 Ruine Hinterhaus** | Historischer Ruinenscan; **572.346 Dreiecke auf Desktop**, **297.599 auf Mobilgeräten** | Großes ruinöses Ensemble auf einer künstlerisch modellierten Anhöhe |

Technik: Die Zusatzmodelle laden bedarfsweise und werden durch echte WebGL-Dreieckspuffer (Positionen, Normalen, UVs, Materialgruppen, Texturen) gerendert. Externe GLB-Bibliotheken sind nicht erforderlich. Für die Ruine existieren zwei Detailstufen. Das Handy-Laden verwendet ein kleineres Geometriemodell; eine Reduktion ist wegen der ursprünglichen photogrammetrischen Datenqualität sichtbar. Der originale Gelände-Scan wird außerhalb seines Schauplatzes nicht unnötig mitgerendert. Die Fotooberflächen der neuen Landschaftsabschnitte nutzen die im Bestandsprojekt verfügbaren Nahmaterialien.

## Steuerung

- **Orte:** oben links `ORTE` auswählen und den gewünschten Bereich anklicken.
- **Desktop:** `WASD` oder Pfeiltasten zum Gehen, Mausziehen zum Umsehen; `V` für Aussicht, `R` für den Start des aktuellen Schauplatzes; `Shift` zum Laufen; im Aussichtmodus `Leertaste/X` für Höhenänderung.
- **Telefon:** links Joystick, rechts Wischbewegung, rechts die Buttons für Aussicht, Tempo, Grafik und Neustart.
- Startposition und Blickrichtung sind speziell für Hoch- und Querformat abgestimmt.

## Wichtige technische Grenzen – bitte nicht als „fertiges 1:1“ bezeichnen

- **Kein geographisches Gesamtscanmodell:** Weisse Wand, Mauseklippe und Ruine Hinterhaus stammen aus verschiedenen Regionen; die neuen Bereiche sind künstlerische Ausstellungsorte. Das regionale Gelände ist prozedural und **nicht aus vermessenen Höhendaten** gebaut. Alle angezeigten Höhen außerhalb der Weissen Wand sind virtuelle Spielhöhen.
- **Kollision:** Nur die Bodenhöhe wird für Gehen/Fliegen verlässlich begrenzt. Exakte Dreiecks-Kollisionen mit Wänden, Türmen, Felsspalten, Bäumen sowie Treppen fehlen noch. Diese Objekte sind **kein vollständig erkundbarer Innenraum** und keine präzisen begehbaren Architekturmodelle.
- **Scanqualität:** Stark reduziertes Photogrammetrie-Material kann sichtbare Löcher, unvollständige Flächen oder Artefakte besitzen. Insbesondere die Ruine ist keine handretopologisierte, wasserdichte Architektur-Rekonstruktion.
- **Performance:** Abhängigkeit von GPU, Gerät, freiem Arbeitsspeicher und WebGL-2-Unterstützung. Die Grafik schaltet bei wenigen Bildern pro Sekunde auf eine sparsamere interne Renderauflösung. FPS eines Software-Renderers sind **keine** belastbare Prognose für einen echten iPhone-GPU-Test.
- **Rechte:** `CREDITS.md` prüfen; eine öffentliche Veröffentlichung, insbesondere eine kommerzielle, ist mit den vorliegenden Lizenzen **nicht pauschal freigegeben**.

## Verifikationsstand

- Die 3D-Dateien wurden aus den vom Nutzer im Chat hochgeladenen Originalen erzeugt, alle Materialbilder lokal gespeichert und die Vertex-/Indexformate validiert.
- Desktop-Browser und telefonähnliche Hochformatansicht in **Chromium/WebGL 2** lokal aufgerufen: Ladevorgang, Ansicht, Ortsmenü und alle drei Zusatzbereiche wurden durchgespielt und Screenshots erstellt.
- **Nicht getestet:** echtes iPhone/Safari auf Hardware, längere Laufzeit auf zahlreichen Geräten, vollständige bauliche Kollisionen, Publikationsrechte.

Änderungen zu V2: `INTEGRATION_V3.md`.
