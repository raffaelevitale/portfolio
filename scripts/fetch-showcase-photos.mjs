import { addFields, exists, items, json, normalize, report, saveImage, slug } from "./studio-assets.mjs";

const API = "https://commons.wikimedia.org/w/api.php";
// Le foto con più risultati vengono scelte dopo aver verificato il soggetto e la variante.
const REVIEWED = new Map([
  ["Apple Watch", ["Apple Watch Series 8 Midnight Aluminium Case.jpg", "Series 8, cassa Midnight"]],
  ["Omega Speedmaster", ["Speedmaster (23456608783).jpg", "Moonwatch Professional, ref. 311.30.42.30.01.005"]],
  ["Cartier Santos", ["Cartier Santos wristwatch.jpg", "Santos con cassa quadrata e bracciale in acciaio"]],
  ["Tissot PRX", ["Tissot PRX 35mm.jpg", "Scritta Powermatic 80 sul quadrante, variante da 35 mm"]],
  ["Bentley Flying Spur", ["Bentley Flying Spur Mulliner Hybrid. front quarter view (1).jpg", "Allestimento Mulliner Hybrid, carrozzeria blu"]],
  ["Aston Martin DB12", ["2023 Aston Martin DB12 Auto.jpg", "Carrozzeria verde, codice British Racing Green da confermare"]],
  ["Porsche 911 GT3", ["2023 Porsche 911 GT3 Touring 2.jpg", "Touring in grigio, vista posteriore"]],
  ["Ferrari 812 Superfast", ["Ferrari 812 Superfast IMG 8829.jpg", "Carrozzeria rossa, codice Rosso Corsa da confermare"]],
  ["Mercedes-Benz 300 SL", ["Mercedes-Benz 300 SL (52687472408).jpg", "Gullwing del 1954 in Silver Grey Metallic"]],
]);

function plain(html = "") {
  const entities = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return html.replace(/<[^>]*>/g, " ").replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (whole, entity) => {
    if (entity.startsWith("#")) {
      const code = entity.startsWith("#x") ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
    }
    return entities[entity] ?? whole;
  }).replace(/\s+/g, " ").trim();
}

function licensed(page) {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata;
  const credit = plain(metadata?.Artist?.value);
  const source = info?.descriptionurl;
  const ccUrl = metadata?.LicenseUrl?.value;
  const name = plain(metadata?.LicenseShortName?.value);
  if (!/\.(jpe?g|png|webp)$/i.test(page.title ?? "") || !credit || !source?.startsWith("https://commons.wikimedia.org/wiki/File:")) return null;
  const link = /^https?:\/\/creativecommons\.org\/(licenses\/(by(?:-sa)?)\/(\d\.\d)(?:\/([a-z]{2}))?|publicdomain\/zero\/1\.0)(?:\/deed\.[a-z-]+)?\/?$/i.exec(ccUrl ?? "");
  if (!link || !/^CC\s*(?:0\b|BY(?:-SA)?\s)/i.test(name)) return null;
  const license = link[2] ? `CC ${link[2].toUpperCase()} ${link[3]}${link[4] ? ` ${link[4].toUpperCase()}` : ""}` : "CC0 1.0";
  const images = [info.thumburl, info.thumburl?.replace(/\/640px-/, "/960px-"), info.url]
    .filter((url) => url?.startsWith("https://upload.wikimedia.org/"));
  return { title: page.title, images: [...new Set(images)], source, credit, license, licenseUrl: `https://creativecommons.org/${link[1]}/` };
}

async function query(params) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "query", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "640",
    format: "json", formatversion: "2", ...params,
  }).toString();
  const data = await json(url);
  if (data.error) throw new Error(data.error.info);
  return { url: url.href, photos: (data.query?.pages ?? []).map(licensed).filter(Boolean) };
}

async function savePhoto(selected, photo) {
  let failure = new Error("Immagine Wikimedia non disponibile");
  for (const url of selected.images) {
    try {
      await saveImage(url, photo);
      return;
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
}

const rows = [];
for (const group of ["WATCHES", "CARS"]) {
  for (const item of await items(group)) {
    const reviewed = REVIEWED.get(item.name);
    let source = item.photoSource;
    let credit = item.photoCredit;
    let license = item.photoLicense;
    let licenseUrl = item.photoLicenseUrl;
    try {
      if (item.photo) {
        rows.push([item.name, item.detail, source, credit, licenseUrl ? `${license} (${licenseUrl})` : license, reviewed?.[1], await exists(item.photo) ? "Già presente" : "File mancante"]);
        continue;
      }
      const search = await query({
        generator: "search", gsrnamespace: "6", gsrsearch: `"${item.name}" ${item.detail.replace(/·/g, " ")}`, gsrlimit: "20",
      });
      source = search.url;
      const model = normalize(item.name);
      const detail = normalize(item.detail);
      const candidates = search.photos.filter(({ title }) => normalize(title).includes(model));
      const exact = candidates.filter(({ title }) => normalize(title).includes(detail));
      let selected = exact.length === 1 ? exact[0] : undefined;
      if (reviewed) {
        const file = `File:${reviewed[0]}`;
        selected = search.photos.find(({ title }) => title === file) ?? (await query({ titles: file })).photos[0];
      }
      if (!selected) {
        throw new Error(candidates.length
          ? `Nessuna corrispondenza verificata per la variante. Candidati: ${candidates.map((match) => match.source).join(", ")}`
          : "Nessuna fotografia corrispondente con licenza ammessa");
      }
      ({ source, credit, license, licenseUrl } = selected);
      const photo = `/studio/showcase/${slug(item.name)}.jpg`;
      await savePhoto(selected, photo);
      await addFields(group, "name", item.name, { photo, photoCredit: credit, photoLicense: license, photoSource: source, photoLicenseUrl: licenseUrl });
      rows.push([item.name, item.detail, source, credit, `${license} (${licenseUrl})`, reviewed?.[1], "Scaricata"]);
    } catch (error) {
      rows.push([item.name, item.detail, source, credit, license, reviewed?.[1], `Da verificare: ${error.message}`]);
    }
  }
}
await report(
  "showcase-photos-report.md",
  "Fotografie vetrina",
  "Fonte: Wikimedia Commons. Licenze CC0, CC BY e CC BY-SA. Le immagini sono ridimensionate e convertite in JPEG.",
  ["Oggetto", "Dettaglio", "Fonte", "Autore", "Licenza", "Note di verifica", "Esito"],
  rows,
);
