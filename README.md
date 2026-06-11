# MFM — säljsida

Sidan vi visar när vi ringer säkerhetsbolag: "kolla hur mycket snyggare den
här är än er hemsida". Fokus på synlighet, leads och att vi är tre grabbar
som själva jobbar i branschen. Inga priser — målet är ett bokat samtal.

Statisk sida utan byggsteg, svart/vit design i Apple-stil:

- `index.html` — allt innehåll (svenska)
- `styles.css` — design tokens, typografi och animationer
- `script.js` — scrolldriven före/efter-sekvens, dashboard med kurva och
  räknare, manifest-text som tänds ord för ord, scrollavslöjanden

## Köra lokalt

Öppna `index.html` direkt i webbläsaren, eller:

```sh
python3 -m http.server 8000
# http://localhost:8000
```
