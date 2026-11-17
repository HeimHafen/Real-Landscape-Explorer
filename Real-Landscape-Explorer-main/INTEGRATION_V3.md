# Integration V3 – 17. November 2026

## In dieser Testfassung umgesetzt

**01 – Original erhalten.** Die bisherige Weisse-Wand-Landschaft mitsamt 1K/2K/4K-Materialien, Kollisionsdaten, Wander-/Aussichtsmodus und Grundsteuerung ist weiterhin verfügbar. Der Originalscan wurde nicht durch ein künstliches Low-Poly-Berggelände ersetzt.

**02 – Bergwald.** Das vom Nutzer bereitgestellte Waldmodell wurde mit allen zehn Materialgruppen und Fototexturen eingebaut. Das bereitgestellte Grasmodell wurde ebenfalls in mehrere Vegetationspatches platziert. Die Materialien verwenden Alpha-Masken für Pflanzen und Bäume.

**03 – Mauseklippe.** Der eingesandte Harzer Scan wurde trianguliert, texturiert, UV-/Normalen-erhaltend vereinfacht und in ein Felsensemble auf künstlerisch gestaltetem Untergrund gesetzt. Die steile Scan-Unterkante wurde so weit versenkt, dass ihre technisch bedingte gerade Seitenwand nicht mehr die Ansicht dominiert.

**04 – Ruine Hinterhaus.** Das eingesandte 3D-Scanmodell wurde als hochauflösende Desktop-Variante und leichtere Mobilvariante verarbeitet. Die unnatürliche schwarze Unterseiten-Materialgruppe wird in der Laufzeitdarstellung ausgelassen. Eine landschaftlich modellierte Anhöhe kaschiert Scan-Unterseiten. Sichtbare Scanlöcher und fehlende reale Architekturteile können dadurch nicht vollständig beseitigt werden.

**05 – Bedienung.** Ortswahl, gezielte Startkameras, lazy loading der 3D-Dateien, zwei Ruinen-Detailstufen, Progressive Render-FPS-Anpassung und Smartphone-/Desktop-Steuerung eingebunden. Keine externen Skriptpakete.

## Ausstehend bis zu einer echten finalen Qualitätsfreigabe

- Gebäude, Felsen und Vegetation mit **Mesh-Kollisionen** bzw. sinnvoll modellierten begehbaren Pfaden versehen.
- Sichtbare Fotogrammetrie-Löcher der Ruine durch manuelle 3D-Retopologie gezielt schließen, ohne historische Details zu erfinden; Ruine im Nahbereich sowie von innen auf Korrektheit prüfen.
- Realistische Geländeübergänge, Baumverteilung und Bodenvegetation anhand von Live-Grafikansichten im Spiel verfeinern.
- Profiling auf echtem iPhone-Safari und mehreren Android-/Desktop-Geräten, Laden bei schwachem Netz.
- Rechte der nichtkommerziellen Ruine und des standardlizenzierten Waldmodells vor öffentlicher / gewerblicher Weiterverwendung klären.

**Status: technisch integriert und in Chromium funktionsgeprüft, aber ausdrücklich noch kein fehlerfreies oder geografisch 1:1 detailgetreues Fertigmodell.**
