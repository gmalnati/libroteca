# Interfacce Grafiche — Fase A
## Esame del 16 settembre 2026

**Durata:** 2 ore e 30 minuti
**Risorse consentite:** rete, documentazione e assistenti IA sono ammessi in questa fase.
**Consegna:** un'applicazione React funzionante (archivio zip) che soddisfi i requisiti sotto indicati.
Punto di partenza per la prova. Contiene già: progetto Vite + React + **TypeScript**,
`react-router-dom` installato, l'**API mock integrata nel dev server** (un solo comando,
nessun server da avviare a parte), i tipi del contratto, i token di stile e i breakpoint.
Le pagine sono vuote: il tuo lavoro è implementarle secondo la consegna.

## Requisiti
- Node.js 20.19 o superiore (richiesto da Vite 7).

## Avvio
```bash
npm install
npm run dev
```
L'app e l'API mock girano sulla stessa origine (di norma `http://localhost:5173`).
Verifica che l'API risponda aprendo nel browser:
`http://localhost:5173/api/books?page=1&limit=12`

## Script
- `npm run dev` — dev server (il controllo dei tipi NON blocca lo sviluppo).
- `npm run build` — esegue `tsc` (controllo dei tipi) e poi la build di produzione.
- `npm run type-check` — solo controllo dei tipi.

## TypeScript
Il progetto è in TypeScript in modalità `strict`. I componenti sono `.tsx`, i file di
supporto `.ts`. I tipi del contratto della mock (`Subject`, `Book`, `BookListItem`) sono in
`mock/data.ts`: puoi importarli o, meglio, **definire i tuoi tipi** per i dati che il
front-end consuma. Le variabili d'ambiente sono già tipizzate in `src/vite-env.d.ts`.

## Variabili d'ambiente (`.env`)
- `VITE_API_BASE_URL` — URL base dell'API (default `http://localhost:5173/api`).
- `VITE_ASSET_BASE_URL` — URL base degli asset; va combinato con il `coverPath` di ogni
  libro per ottenere l'URL completo della copertina (default `http://localhost:5173`).

> Se Vite avvia il dev server su una porta diversa da 5173, aggiorna i due valori in `.env`.

Si leggono nel codice con `import.meta.env.VITE_API_BASE_URL` ecc.

## Contratto dell'API mock
Le risposte sono in JSON e arrivano con ~600 ms di ritardo (per rendere visibile il
caricamento). **Non modificare** la mock: va consumata così com'è.

### `GET /api/subjects`
```json
[{ "code": "s01", "name": "Romanzo" }, ...]
```

### `GET /api/books?page=&limit=&subject=&q=&fail=`
- `page` (1-based, default 1), `limit` (default 12, **max 24**; oltre → `400`)
- `subject` filtra per `code`; `q` cerca nel titolo
- `fail=1` → risposta `500` (per testare la gestione errori)
- nessun risultato → `data: []`, `total: 0`

Risposta:
```json
{ "data": [ /* libri in forma lista */ ], "page": 1, "limit": 12, "total": 143 }
```
Libro in forma lista:
```json
{ "id": "b0042", "title": "...", "authors": ["..."], "year": 2004, "pages": 312,
  "priceCents": 1890, "subjectCodes": ["s01","s04"], "coverPath": "/covers/b0042.svg" }
```

### `GET /api/books/:id`
Forma lista + `description` e `awards` (array di stringhe, eventualmente vuoto). Id inesistente → `404`.

### Trasformazioni richieste
- `priceCents` (centesimi) → prezzo formattato (es. `1890` → `18,90 €`)
- URL della copertina = `VITE_ASSET_BASE_URL` + `coverPath`
- `subjectCodes` → nomi leggibili tramite `/api/subjects`

## Struttura
```
mock/            API mock (NON modificare il contratto)
  data.ts        tipi + materie + 143 libri
  plugin.ts      endpoint + copertina placeholder
src/
  main.tsx       root React + <BrowserRouter>
  App.tsx        QUI definisci le rotte
  pages/         segnaposto: Catalog, BookDetail, Shelf, NotFound (.tsx)
  components/     (vuota) i tuoi componenti
  styles/        tokens.css (variabili + breakpoint) · base.css (reset)
  vite-env.d.ts  tipi delle variabili d'ambiente
tsconfig.json
```

## Consegna
File `.zip` **senza** `node_modules` con un `README` se servono note.
Assicurati che `npm run build` passi (tipi inclusi). In Fase B dovrai aprire e spiegare questo codice dal vivo.
