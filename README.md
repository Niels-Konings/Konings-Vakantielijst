# Vakantie Koningslijst

Een single-file PWA om de caravan in te pakken, met synchronisatie tussen telefoons via JSONBin.io.

## Bestanden

- `index.html` - de hele app
- `manifest.json` - PWA manifest
- `sw.js` - service worker voor offline gebruik
- `icon-*.png` - app iconen
- `favicon.png` - browser tab icoon

## Eenmalige setup voor synchronisatie

De app werkt direct als offline-only, maar voor sync tussen telefoons:

### 1. JSONBin account maken (gratis)
- Ga naar [jsonbin.io](https://jsonbin.io)
- Log in met GitHub (1 klik)
- Geen creditcard nodig, 10.000 requests gratis

### 2. API Key kopieren
- Klik in het menu links op "API Keys"
- Kopieer de "X-MASTER-KEY" waarde

### 3. Een Bin aanmaken
- Klik in het menu op "Bins"
- Klik op "CREATE BIN"
- Plak `{}` als inhoud
- Klik op het opslaan-icoon
- Kopieer de "BIN ID" van de aangemaakte bin (te zien bovenin)

### 4. In de code invullen
Open `index.html` en zoek deze 2 regels (rond regel 590):
```js
const JSONBIN_API_KEY = 'PLAK_HIER_JE_X_MASTER_KEY';
const JSONBIN_BIN_ID = 'PLAK_HIER_JE_BIN_ID';
```

Vervang de placeholders door je echte waardes:
```js
const JSONBIN_API_KEY = '$2a$10$abc123...';
const JSONBIN_BIN_ID = '67abc123def456...';
```

### 5. Commit en push
Sla op via "Commit changes" in de GitHub web editor. Na ongeveer 1 minuut is GitHub Pages bijgewerkt.

## Hoe sync werkt

- Iedereen die de app opent leest en schrijft naar dezelfde gedeelde lijst
- Wijzigingen worden binnen 1 seconde naar de server gestuurd (debounced)
- De app haalt elke 5 seconden de laatste versie op om wijzigingen van anderen te zien
- Bij conflicten wint de laatste wijziging (last-write-wins op basis van timestamp)
- Werkt ook offline, synct automatisch bij verbinding
- Sync-status zichtbaar bovenaan met groen/oranje/rood indicator

## Privacy en beveiliging

De API key staat in de broncode, dus zichtbaar voor wie de pagina source bekijkt. Voor een prive inpaklijst tussen familie is dat in de praktijk geen probleem (worst case: iemand verpest je lijst). Wil je echte beveiliging? Gebruik dan Supabase met Row Level Security in plaats van JSONBin.

## Deploy naar GitHub Pages

1. Maak een nieuwe repo aan op github.com
2. Upload alle bestanden via "Add file > Upload files"
3. Ga naar Settings > Pages
4. Bij "Source" kies "Deploy from a branch", branch `main` / root, Save
5. Wacht 1 a 2 minuten, app staat op `https://niels-konings.github.io/<reponaam>/`

## Op telefoon installeren

- iPhone (Safari): deel-icoon, "Zet op beginscherm"
- Android (Chrome): menu, "App installeren"
