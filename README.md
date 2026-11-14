# fotos.freudenau.de

Statische Fotogalerie mit Hugo. Bilder aus Capture One in einen Ordner legen, pushen, fertig.
Hugo verkleinert alles automatisch auf WebP (Thumbnails 640px, Großansicht 2400px).
Die Originale werden **nie** hochgeladen, und die erzeugten Bilder enthalten keine EXIF-Daten (kein GPS).

## Struktur

```
content/
├── _index.md                 Startseite (Einleitungstext)
├── gesehen-in-berlin/        fortlaufende Serie (ein Album)
│   ├── index.md
│   └── *.jpg                 ← Bilder einfach hier reinlegen
└── parks/                    Bereich mit mehreren Alben
    ├── _index.md
    ├── tiergarten/
    │   ├── index.md
    │   └── *.jpg
    └── sanssouci/
        ├── index.md
        └── *.jpg
```

- **Neues Album:** Ordner mit `index.md` anlegen (z.B. `content/parks/treptower-park/index.md`) und Bilder reinlegen.
- **Neuer Bereich** (wie „Parks“): Ordner mit `_index.md` anlegen; Alben darin als Unterordner.
- Sortiert wird nach **Aufnahmedatum aus den EXIF-Daten**, standardmäßig neueste zuerst. Mit `sort: "asc"` im Front Matter drehst du die Reihenfolge um.
- **Titelbild** eines Albums: `cover: "dateiname.jpg"`, sonst nimmt Hugo das erste Bild.
- **Bildunterschriften** (optional) im Front Matter:

  ```yaml
  resources:
    - src: "DSCF1234.jpg"
      params:
        caption: "Kreuzberg, Oranienstraße"
  ```

## Export aus Capture One

- JPG, lange Kante etwa 3000px, Qualität ca. 90 %. Größer bringt nichts, weil Hugo ohnehin auf 2400px verkleinert; das hält auch das Git-Repo klein.
- EXIF-Aufnahmedatum mit exportieren (für die Sortierung). GPS kannst du weglassen.

## Lokal ansehen

```bash
brew install hugo
hugo server
```

Dann <http://localhost:1313> öffnen. Änderungen erscheinen sofort.

## Deploy

Ziel: `/home/www/freudenau/subfotos` bei Webhostone, per rsync über SSH.
Übertragen werden nur geänderte Dateien, gelöschte Fotos verschwinden auch auf dem Server.

### Variante A: automatisch per GitHub Action (bei jedem Push auf `main`)

1. Deploy-Key erzeugen (ohne Passphrase):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/webhostone_fotos -C "github-deploy fotos.freudenau.de" -N ""
   ```
2. Den Public Key bei Webhostone hinterlegen (Kundenmenü → SSH-Keys) oder anhängen:
   ```bash
   ssh-copy-id -i ~/.ssh/webhostone_fotos.pub USER@HOST
   ```
3. Host-Fingerprint holen:
   ```bash
   ssh-keyscan -p 22 HOST
   ```
4. Im GitHub-Repo unter *Settings → Secrets and variables → Actions* anlegen:

   | Secret            | Inhalt                                    |
   |-------------------|-------------------------------------------|
   | `SSH_HOST`        | SSH-Server von Webhostone                 |
   | `SSH_USER`        | SSH-Benutzer                              |
   | `SSH_PORT`        | nur falls nicht 22                        |
   | `SSH_PRIVATE_KEY` | Inhalt von `~/.ssh/webhostone_fotos`      |
   | `SSH_KNOWN_HOSTS` | Ausgabe von `ssh-keyscan` (Schritt 3)     |

### Variante B: lokal vom Mac

```bash
cp .deploy.env.example .deploy.env   # Zugangsdaten eintragen
./deploy.sh
```

## Subdomain

Im Webhostone-Kundenmenü die Subdomain `fotos.freudenau.de` auf das Verzeichnis
`/home/www/freudenau/subfotos` zeigen lassen und ein SSL-Zertifikat (Let's Encrypt) aktivieren.
Die `.htaccess` erzwingt HTTPS und setzt lange Cache-Zeiten für Bilder.

## Aussehen anpassen

Farben, Schrift, Zeilenhöhe des Rasters und Abstände stehen als Variablen oben in
`assets/css/main.css`, damit du sie an freudenau.de angleichen kannst.
