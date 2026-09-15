// Plugin Vite che espone l'API mock di LibroTeca dentro al dev server.
// Endpoint serviti (stessa origine del front-end, es. http://localhost:5173):
//   GET /api/subjects
//   GET /api/books?page=&limit=&subject=&q=&fail=
//   GET /api/books/:id
//   GET /covers/:id.svg   (copertina placeholder generata)
//
// NON modificare: l'esame presuppone questo contratto.

import type { Plugin, Connect } from "vite";
import type { ServerResponse } from "node:http";
import { subjects, books, toListItem } from "./data";

const DELAY_MS = 600; // ritardo artificiale per rendere visibile lo stato di caricamento

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(body));
}

function coverSvg(id: string): string {
  const n = parseInt(id.replace(/\D/g, ""), 10) || 0;
  const hue = (n * 61) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
  <rect width="300" height="450" fill="hsl(${hue} 40% 34%)"/>
  <rect x="18" y="18" width="264" height="414" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
  <text x="150" y="235" fill="#ffffff" font-family="system-ui, sans-serif" font-size="30"
        font-weight="600" text-anchor="middle">${id}</text>
  <text x="150" y="275" fill="#ffffff" opacity="0.7" font-family="system-ui, sans-serif"
        font-size="14" text-anchor="middle">LibroTeca</text>
</svg>`;
}

export function mockApi(): Plugin {
  return {
    name: "libroteca-mock-api",
    configureServer(server) {
      server.middlewares.use(
        (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
          if (!req.url) return next();

          let url: URL;
          try {
            url = new URL(req.url, "http://localhost");
          } catch {
            return next();
          }
          const p = url.pathname;

          // --- Copertina placeholder ---
          if (p.startsWith("/covers/")) {
            const id = p.slice("/covers/".length).replace(/\.svg$/, "");
            res.statusCode = 200;
            res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(coverSvg(id));
            return;
          }

          if (!p.startsWith("/api/")) return next();

          // --- GET /api/subjects ---
          if (p === "/api/subjects") {
            setTimeout(() => sendJson(res, 200, subjects), DELAY_MS);
            return;
          }

          // --- GET /api/books/:id ---
          const detail = p.match(/^\/api\/books\/([^/]+)$/);
          if (detail) {
            const id = detail[1];
            setTimeout(() => {
              const book = books.find((b) => b.id === id);
              if (!book) return sendJson(res, 404, { error: "Libro non trovato" });
              sendJson(res, 200, book);
            }, DELAY_MS);
            return;
          }

          // --- GET /api/books ---
          if (p === "/api/books") {
            const fail = url.searchParams.get("fail");
            const pageRaw = parseInt(url.searchParams.get("page") || "1", 10);
            const limitRaw = parseInt(url.searchParams.get("limit") || "12", 10);
            const subject = url.searchParams.get("subject");
            const q = (url.searchParams.get("q") || "").trim().toLowerCase();

            setTimeout(() => {
              if (fail === "1") {
                return sendJson(res, 500, { error: "Errore del server (simulato)" });
              }
              if (Number.isNaN(limitRaw) || limitRaw < 1 || limitRaw > 24) {
                return sendJson(res, 400, { error: "Parametro 'limit' non valido (ammessi 1–24)" });
              }
              const page = Number.isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw;

              let result = books;
              if (subject) result = result.filter((b) => b.subjectCodes.includes(subject));
              if (q) result = result.filter((b) => b.title.toLowerCase().includes(q));

              const total = result.length;
              const start = (page - 1) * limitRaw;
              const data = result.slice(start, start + limitRaw).map(toListItem);

              sendJson(res, 200, { data, page, limit: limitRaw, total });
            }, DELAY_MS);
            return;
          }

          return next();
        }
      );
    },
  };
}
