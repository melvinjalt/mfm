# MFM — marknadssida

Landningssida för MFM, tjänsten som skapar färdiga hemsidor åt småföretag
utifrån en kort beskrivning.

Statisk sida utan byggsteg, svart/vit design i Apple-stil:

- `index.html` — allt innehåll (svenska)
- `styles.css` — design tokens, typografi och animationer
- `script.js` — scrolldriven byggsekvens, manifest-text som tänds ord för ord, scrollavslöjanden

## Köra lokalt

Öppna `index.html` direkt i webbläsaren, eller:

```sh
python3 -m http.server 8000
# http://localhost:8000
```
