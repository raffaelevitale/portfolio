import { addFields, exists, items, json, normalize, report, saveImage, slug } from "./studio-assets.mjs";

const rows = [];
for (const album of await items("ALBUMS")) {
  let source = album.coverSource;
  try {
    if (album.cover) {
      rows.push([album.title, album.artist, source, await exists(album.cover) ? "Già presente" : "File mancante"]);
      continue;
    }
    const url = new URL(album.spotifyUrl);
    if (url.origin !== "https://open.spotify.com" || !/^\/album\/[a-zA-Z0-9]+\/?$/.test(url.pathname)) throw new Error("Link Spotify album non valido");
    const data = await json(`https://open.spotify.com/oembed?url=${encodeURIComponent(url.href)}`);
    if (data.provider_name !== "Spotify" || normalize(data.title ?? "") !== normalize(album.title)) throw new Error("Album oEmbed non corrispondente");
    if (!data.thumbnail_url) throw new Error("Copertina oEmbed assente");
    const thumbnail = new URL(data.thumbnail_url);
    if (thumbnail.protocol !== "https:" || !/(?:^|\.)(?:scdn\.co|spotifycdn\.com)$/.test(thumbnail.hostname)) throw new Error("Fonte della copertina oEmbed non riconosciuta");
    source = thumbnail.href;
    const cover = `/studio/albums/${slug(`${album.artist}-${album.title}`)}.jpg`;
    await saveImage(source, cover);
    await addFields("ALBUMS", "spotifyUrl", album.spotifyUrl, { cover, coverSource: source });
    rows.push([album.title, album.artist, source, "Scaricata"]);
  } catch (error) { rows.push([album.title, album.artist, source, `Da verificare: ${error.message}`]); }
}
await report("album-covers-report.md", "Copertine album statici", rows.length ? "Fonte: Spotify oEmbed. Diritti delle copertine ai rispettivi titolari." : "ALBUMS è vuoto: aggiungere i preferiti con i link Spotify, poi ripetere lo script.", ["Titolo", "Artista", "URL sorgente", "Esito"], rows);
