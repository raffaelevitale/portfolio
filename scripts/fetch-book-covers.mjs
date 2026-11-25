import { addFields, exists, items, json, normalize, report, saveImage, slug } from "./studio-assets.mjs";

const CATALOG_TITLES = new Map([
  ["L'arte della vittoria", "Shoe Dog"],
  ["Pensieri lenti e veloci", "Thinking, Fast and Slow"],
  ["Il negativo", "The Negative"],
  ["A Man and His Watch", "A Man & His Watch"],
]);
const ITALIAN = new Set(["L'arte della vittoria", "Pensieri lenti e veloci", "La caffettiera del masochista", "Il negativo", "Le mie gioie terribili"]);

const titleKey = (title) => normalize(title.split(/[:：]/)[0].replace(/&/g, " and "));
const isbnFor = (entry) => [...(entry.isbn_13 ?? []), ...(entry.isbn_10 ?? [])]
  .find((value) => /^(\d{13}|\d{9}[\dX])$/.test(value));
const coverFor = (entry) => entry.covers?.find((id) => Number.isInteger(id) && id > 0);

function authorMatches(author, names = []) {
  const parts = normalize(author).split(" ").filter((part) => part.length > 1 && part !== "and");
  const words = new Set(names.flatMap((name) => normalize(name).split(" ")));
  return parts.every((part) => words.has(part));
}

async function searchWorks(title, author) {
  const query = new URLSearchParams({ title, author, limit: "5", fields: "key,title,author_name" });
  const { docs = [] } = await json(`https://openlibrary.org/search.json?${query}`);
  return docs.filter((doc) => titleKey(doc.title ?? "") === titleKey(title)
    && authorMatches(author, doc.author_name) && /^\/works\/OL\d+W$/.test(doc.key));
}

async function editionsFor(work, book) {
  const language = ITALIAN.has(book.title) ? "ita" : "eng";
  const { entries = [] } = await json(`https://openlibrary.org${work.key}/editions.json?limit=100`);
  return entries.filter((entry) => {
    const title = titleKey(entry.title ?? "");
    const sameTitle = title === titleKey(book.title);
    const listedLanguage = entry.languages?.some((lang) => lang.key === `/languages/${language}`);
    const knownLanguage = listedLanguage || (!entry.languages?.length && (language === "ita" || entries.length === 1));
    return sameTitle && knownLanguage && /^\/books\/OL\d+M$/.test(entry.key)
      && !/audio/i.test([entry.physical_format, ...(entry.publishers ?? [])].join(" "))
      && (isbnFor(entry) || coverFor(entry));
  });
}

async function findEditions(book) {
  const exact = await searchWorks(book.title, book.author);
  const alternative = CATALOG_TITLES.get(book.title);
  const works = exact.length || !alternative ? exact : await searchWorks(alternative, book.author);
  if (!works.length) throw new Error("Nessuna opera con titolo e autore verificabili");

  // L'opera può essere indicizzata in inglese: conta il titolo dell'edizione.
  const candidates = [];
  for (const work of works) {
    const editions = await editionsFor(work, book);
    if (editions.length) candidates.push(editions);
  }
  if (candidates.length > 1) throw new Error("Ricerca ambigua: più opere con edizioni corrispondenti");
  if (!candidates.length) throw new Error("Nessuna edizione verificabile con titolo e lingua richiesti");
  return [...candidates[0]].sort((a, b) => (
    Number(Boolean(isbnFor(b) && coverFor(b))) - Number(Boolean(isbnFor(a) && coverFor(a)))
    || Number(Boolean(coverFor(b))) - Number(Boolean(coverFor(a)))
  ));
}

const rows = [];
for (const book of await items("BOOKS")) {
  let isbn = book.isbn;
  let source = book.coverDownload ?? book.coverSource;
  try {
    if (book.cover) {
      const present = await exists(book.cover);
      const recover = !present && book.coverDownload?.startsWith("https://covers.openlibrary.org/");
      if (recover) await saveImage(book.coverDownload, book.cover);
      rows.push([book.title, isbn, source, present ? "Già presente" : recover ? "Ripristinata" : "File mancante: controllare il campo cover"]);
      continue;
    }
    let failure = new Error("Copertina non disponibile");
    let saved = false;
    for (const edition of (await findEditions(book)).slice(0, 5)) {
      isbn = isbnFor(edition);
      const coverId = coverFor(edition);
      const urls = [
        isbn && `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
        coverId && `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`,
      ].filter(Boolean);
      for (const url of urls) {
        source = url;
        const cover = `/studio/books/${slug(book.title)}.jpg`;
        try {
          await saveImage(url, cover);
        } catch (error) {
          failure = error;
          continue;
        }
        const publisher = edition.publishers?.[0];
        await addFields("BOOKS", "title", book.title, {
          isbn, cover,
          coverCredit: publisher ? `${publisher} (editore) · Open Library (fonte)` : "Open Library (fonte)",
          coverSource: `https://openlibrary.org${edition.key}`,
          coverDownload: url,
        });
        rows.push([book.title, isbn, url, "Scaricata"]);
        saved = true;
        break;
      }
      if (saved) break;
    }
    if (!saved) throw failure;
  } catch (error) {
    rows.push([book.title, isbn, source, `Da verificare: ${error.message}`]);
  }
}
await report(
  "book-covers-report.md",
  "Copertine libri",
  "Fonte: Open Library. La licenza delle copertine non è dichiarata nel catalogo. L’ISBN è riportato soltanto se presente nell’edizione.",
  ["Titolo", "ISBN trovato", "URL sorgente", "Esito"],
  rows,
);
