/**
 * Contenuti dello studio: libreria, orologi e modellini.
 *
 * Le collezioni rappresentano libri di interesse e oggetti ammirati,
 * non necessariamente già letti o posseduti.
 * Le voci con `draft: true` sono visibili solo in sviluppo.
 * Il commento personale è facoltativo.
 */

export const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

export type BookTag =
  | "Sviluppo"
  | "Design"
  | "Fotografia"
  | "Auto"
  | "Orologi"
  | "Vendita"
  | "Finanza"
  | "Psicologia"
  | "Crescita personale"
  | "AI"
  | "Business";

export interface Book {
  title: string;
  author: string;
  tag: BookTag;
  /** Colore della costa e testo. */
  color: string;
  ink: string;
  /** true = esposto di copertina. */
  faceOut?: boolean;
  isbn?: string;
  cover?: string;
  coverCredit?: string;
  coverSource?: string;
  coverDownload?: string;
  comment?: string;
  draft?: boolean;
}

export const BOOKS: readonly Book[] = [
  { title: "Atomic Habits", author: "James Clear", tag: "Crescita personale", color: "#e9dfca", ink: "#302719", faceOut: true, isbn: "1847941834", cover: "/studio/books/atomic-habits.jpg", coverCredit: "Random Hause Business (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL57360656M", coverDownload: "https://covers.openlibrary.org/b/isbn/1847941834-L.jpg?default=false" },
  { title: "The Psychology of Money", author: "Morgan Housel", tag: "Finanza", color: "#16443c", ink: "#f2e6c9", isbn: "9780857197689", cover: "/studio/books/the-psychology-of-money.jpg", coverCredit: "Harriman House (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL62588694M", coverDownload: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg?default=false" },
  { title: "Deep Work", author: "Cal Newport", tag: "Crescita personale", color: "#e9a739", ink: "#1d1916", isbn: "9780349411910", cover: "/studio/books/deep-work.jpg", coverCredit: "Little, Brown Book Group Limited (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL33544171M", coverDownload: "https://covers.openlibrary.org/b/isbn/9780349411910-L.jpg?default=false" },
  { title: "Zero to One", author: "Peter Thiel", tag: "Business", color: "#3975a4", ink: "#ffffff", faceOut: true, isbn: "9780553418286", cover: "/studio/books/zero-to-one.jpg", coverCredit: "Penguin Random House USA Ex (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL38565226M", coverDownload: "https://covers.openlibrary.org/b/isbn/9780553418286-L.jpg?default=false" },
  { title: "The Mom Test", author: "Rob Fitzpatrick", tag: "Vendita", color: "#f0d9c4", ink: "#3a1d10", isbn: "9781492180746", cover: "/studio/books/the-mom-test.jpg", coverCredit: "CreateSpace (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL31683609M", coverDownload: "https://covers.openlibrary.org/b/isbn/9781492180746-L.jpg?default=false" },
  { title: "L'arte della vittoria", author: "Phil Knight", tag: "Business", color: "#181818", ink: "#f2eee6" },
  { title: "Pensieri lenti e veloci", author: "Daniel Kahneman", tag: "Psicologia", color: "#e4dfd3", ink: "#222222", isbn: "9788804671954", cover: "/studio/books/pensieri-lenti-e-veloci.jpg", coverCredit: "Mondadori (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL27962257M", coverDownload: "https://covers.openlibrary.org/b/isbn/9788804671954-L.jpg?default=false" },
  { title: "Steve Jobs", author: "Walter Isaacson", tag: "Business", color: "#d4d4d4", ink: "#171717", faceOut: true, isbn: "9781982176860", cover: "/studio/books/steve-jobs.jpg", coverCredit: "Simon & Schuster (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL36010157M", coverDownload: "https://covers.openlibrary.org/b/isbn/9781982176860-L.jpg?default=false" },
  { title: "La caffettiera del masochista", author: "Donald A. Norman", tag: "Design", color: "#c8281e", ink: "#f6efe4" },
  { title: "Refactoring UI", author: "Wathan & Schoger", tag: "Design", color: "#3b3f8f", ink: "#f2eee6", cover: "/studio/books/refactoring-ui.jpg", coverCredit: "Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL31679681M", coverDownload: "https://covers.openlibrary.org/b/id/10527062-L.jpg?default=false" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", tag: "Sviluppo", color: "#e8e2d4", ink: "#1d1916", isbn: "9780201616224", cover: "/studio/books/the-pragmatic-programmer.jpg", coverCredit: "Addison-Wesley (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL7408140M", coverDownload: "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg?default=false" },
  { title: "Il negativo", author: "Ansel Adams", tag: "Fotografia", color: "#1c1b1a", ink: "#e9e2d3" },
  { title: "Life 3.0", author: "Max Tegmark", tag: "AI", color: "#101c33", ink: "#f2eee6", isbn: "9780141981802", cover: "/studio/books/life-3-0.jpg", coverCredit: "Penguin (editore) · Open Library (fonte)", coverSource: "https://openlibrary.org/books/OL26870593M", coverDownload: "https://covers.openlibrary.org/b/isbn/9780141981802-L.jpg?default=false" },
  { title: "Le mie gioie terribili", author: "Enzo Ferrari", tag: "Auto", color: "#a3171a", ink: "#f2e6c9" },
  { title: "A Man and His Watch", author: "Matt Hranek", tag: "Orologi", color: "#14213a", ink: "#d9c79c" },
];

export interface ShowcaseItem {
  name: string;
  detail: string;
  comment?: string;
  /** Colore principale nel modello 3D (quadrante o carrozzeria). */
  color: string;
  photo?: string;
  photoCredit?: string;
  photoLicense?: string;
  photoLicenseUrl?: string;
  photoSource?: string;
  model?: string;
  modelCredit?: string;
  modelLicense?: string;
  modelLicenseUrl?: string;
  modelSource?: string;
  draft?: boolean;
}

export const WATCHES: readonly ShowcaseItem[] = [
  { name: "Apple Watch", detail: "Series 8", color: "#1b1b1d", photo: "/studio/showcase/apple-watch.jpg", photoCredit: "Terminator216", photoLicense: "CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:Apple_Watch_Series_8_Midnight_Aluminium_Case.jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "Omega Speedmaster", detail: "Moonwatch Professional", color: "#151515", photo: "/studio/showcase/omega-speedmaster.jpg", photoCredit: "Daniel Zimmermann from Bayern, Deutschland (Germany)", photoLicense: "CC BY 2.0", photoSource: "https://commons.wikimedia.org/wiki/File:Speedmaster_(23456608783).jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by/2.0/" },
  { name: "Cartier Santos", detail: "Santos de Cartier", color: "#e9e4d8", photo: "/studio/showcase/cartier-santos.jpg", photoCredit: "Pittigrilli", photoLicense: "CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:Cartier_Santos_wristwatch.jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "Tissot PRX", detail: "Powermatic 80", color: "#173b35", photo: "/studio/showcase/tissot-prx.jpg", photoCredit: "Soulreaper", photoLicense: "CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:Tissot_PRX_35mm.jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "Rolex Datejust", detail: "41 mm", color: "#243c54" },
];

export const CARS: readonly ShowcaseItem[] = [
  { name: "Bentley Flying Spur", detail: "Mulliner", color: "#123d39", photo: "/studio/showcase/bentley-flying-spur.jpg", photoCredit: "RpM Tartar", photoLicense: "CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:Bentley_Flying_Spur_Mulliner_Hybrid._front_quarter_view_(1).jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "Aston Martin DB12", detail: "British Racing Green", color: "#174638", photo: "/studio/showcase/aston-martin-db12.jpg", photoCredit: "Calreyn88", photoLicense: "CC0 1.0", photoSource: "https://commons.wikimedia.org/wiki/File:2023_Aston_Martin_DB12_Auto.jpg", photoLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  { name: "Porsche 911 GT3", detail: "Touring Package", color: "#c9ccd1", photo: "/studio/showcase/porsche-911-gt3.jpg", photoCredit: "Calreyn88", photoLicense: "CC BY 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:2023_Porsche_911_GT3_Touring_2.jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  { name: "Ferrari 812 Superfast", detail: "Rosso Corsa", color: "#b3121b", photo: "/studio/showcase/ferrari-812-superfast.jpg", photoCredit: "Alexander-93", photoLicense: "CC BY-SA 4.0", photoSource: "https://commons.wikimedia.org/wiki/File:Ferrari_812_Superfast_IMG_8829.jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "Mercedes-Benz 300 SL", detail: "Gullwing · 1954", color: "#b7b9bd", photo: "/studio/showcase/mercedes-benz-300-sl.jpg", photoCredit: "Alexandre Prevot from Nancy, France", photoLicense: "CC BY-SA 2.0", photoSource: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_300_SL_(52687472408).jpg", photoLicenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
];

export interface Album {
  title: string;
  artist: string;
  spotifyUrl: string;
  cover?: string;
  coverSource?: string;
}

/** Preferiti esposti quando mancano le copertine live. */
export const ALBUMS: readonly Album[] = [
  { title: "Pianeti", artist: "Ultimo", spotifyUrl: "https://open.spotify.com/album/4kOACyHbEPgbnmyF5nCYB7", cover: "/studio/albums/ultimo-pianeti.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0268bf82a553744c54ee7a3efa" },
  { title: "Vangelo", artist: "Shiva", spotifyUrl: "https://open.spotify.com/album/2gqFeF2xx9zMEwUWRc5UK4", cover: "/studio/albums/shiva-vangelo.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02106c24b2e7323189f68e8a4c" },
  { title: "Dio lo sa", artist: "Geolier", spotifyUrl: "https://open.spotify.com/album/1bdXMUERNI9dwREDryk6C7", cover: "/studio/albums/geolier-dio-lo-sa.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02b68cc2f7d1956d743a7ee322" },
  { title: "Famoso", artist: "Sfera Ebbasta", spotifyUrl: "https://open.spotify.com/album/59znAGeM6NNmzTkkV6MHrT", cover: "/studio/albums/sfera-ebbasta-famoso.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02b87df8229fc018a11bf61b89" },
  { title: "Tutto è possibile", artist: "Geolier", spotifyUrl: "https://open.spotify.com/album/58OUscdI2nOUKFpoPlp2eb", cover: "/studio/albums/geolier-tutto-e-possibile.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028f6566879ccbdbc90b4fc974" },
  { title: "X2VR", artist: "Sfera Ebbasta", spotifyUrl: "https://open.spotify.com/album/3ilgQgVMtxAxN2Jmb1OM29", cover: "/studio/albums/sfera-ebbasta-x2vr.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023c0eada9fb45ba9d43116f1d" },
  { title: "Solo", artist: "Ultimo", spotifyUrl: "https://open.spotify.com/album/1CKeSCEj384RQmAUhcDUlw", cover: "/studio/albums/ultimo-solo.jpg", coverSource: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e1bed516757471f1266dee07" },
];

export function visible<T extends { draft?: boolean }>(items: readonly T[]): readonly T[] {
  return items.filter((item) => !item.draft || SHOW_DRAFTS);
}
