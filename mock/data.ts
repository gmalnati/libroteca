// Dati della mock LibroTeca — generati in modo deterministico (nessuna casualità).
// NON modificare: l'esame presuppone questo contratto dati.

export interface Subject {
  code: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  year: number;
  pages: number;
  priceCents: number; // prezzo in centesimi (es. 1290 = 12,90 €)
  subjectCodes: string[];
  coverPath: string;
  description: string;
  awards: string[];
}

/** Forma restituita dall'endpoint di lista (senza description e awards). */
export type BookListItem = Omit<Book, "description" | "awards">;

export const subjects: Subject[] = [
  { code: "s01", name: "Romanzo" },
  { code: "s02", name: "Saggistica" },
  { code: "s03", name: "Fantasy" },
  { code: "s04", name: "Giallo" },
  { code: "s05", name: "Poesia" },
  { code: "s06", name: "Storia" },
  { code: "s07", name: "Scienza" },
  { code: "s08", name: "Fumetto" },
];

const adjectives = [
  "Ultimo", "Segreto", "Perduto", "Lontano", "Silenzioso", "Luminoso",
  "Profondo", "Nascosto", "Selvaggio", "Fragile", "Antico", "Infinito",
];

const nouns = [
  "Custode", "Confine", "Giardino", "Ricordo", "Sentiero", "Faro",
  "Rifugio", "Labirinto", "Orizzonte", "Segreto", "Viaggio", "Silenzio",
];

const authorPool = [
  "Elsa Fontana", "Karim Naceur", "Bianca Serra", "Diego Ferri", "Yuki Mori",
  "Camille Roux", "Marco Venturi", "Nina Volkov", "Samir Aziz", "Greta Holm",
  "Haruki Endo", "Chiara Longo", "Igor Petrov", "Meera Rao", "Leon Adler",
];

const awardPool = [
  "Premio Strega (finalista)", "Booker Shortlist", "Premio Campiello",
  "National Book Award", "Premio Bancarella",
];

function pad(n: number): string {
  return "b" + String(n).padStart(4, "0");
}

export const books: Book[] = Array.from({ length: 143 }, (_, idx) => {
  const i = idx + 1;
  const title = `Il ${adjectives[(i * 3) % adjectives.length]} ${nouns[(i * 7) % nouns.length]}`;
  const authors =
    i % 4 === 0
      ? [authorPool[(i * 2) % authorPool.length], authorPool[(i * 5) % authorPool.length]]
      : [authorPool[(i * 3) % authorPool.length]];
  const year = 1950 + (i % 75);
  const pages = 90 + ((i * 17) % 520);
  const priceCents = 990 + ((i * 53) % 3000);
  const s1 = subjects[i % subjects.length].code;
  const s2 = subjects[(i * 5) % subjects.length].code;
  const subjectCodes = s1 === s2 ? [s1] : [s1, s2];
  const id = pad(i);
  const coverPath = `/covers/${id}.svg`;
  const description =
    `"${title}" è un'opera pubblicata nel ${year}, lunga ${pages} pagine, ` +
    `che accompagna il lettore tra atmosfere sospese e personaggi memorabili.`;
  const awardCount = i % 3; // 0, 1 o 2 riconoscimenti (a volte nessuno)
  const awards = Array.from({ length: awardCount }, (_, k) => awardPool[(i + k) % awardPool.length]);
  return { id, title, authors, year, pages, priceCents, subjectCodes, coverPath, description, awards };
});

export function toListItem(b: Book): BookListItem {
  const { description: _description, awards: _awards, ...rest } = b;
  return rest;
}
