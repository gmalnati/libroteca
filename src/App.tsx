// =============================================================================
//  Punto di partenza dell'applicazione.
//
//  DA IMPLEMENTARE (vedi consegna):
//   - un layout con header persistente (navigazione + contatore libreria);
//   - le rotte:  /  (catalogo) · /books/:id (dettaglio) · /shelf · * (404);
//   - lo stato della vista catalogo (pagina, materia, ricerca) nella query string;
//   - lo stato globale della libreria personale, condiviso fra le rotte.
//
//  Le pagine vuote sono in src/pages/. Sono solo segnaposto: organizza il codice
//  come preferisci. Tipizza tu i dati che arrivano dall'API.
// =============================================================================

export default function App() {
  return (
    <div className="app-shell">
      <h1>LibroTeca — starter</h1>
      <p>
        Lo starter è pronto. Definisci le rotte in <code>src/App.tsx</code> e
        comincia dalle pagine in <code>src/pages/</code>.
      </p>
      <p>
        Verifica che l'API risponda aprendo{" "}
        <a href="/api/books?page=1&limit=12">/api/books?page=1&amp;limit=12</a>.
      </p>
    </div>
  );
}
