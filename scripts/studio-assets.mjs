import { readFile, writeFile, mkdir, mkdtemp, rename, rm, stat } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import ts from "typescript";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
const CONTENT = join(ROOT, "lib/studio-content.ts");

export const normalize = (value) => value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export const slug = (value) => normalize(value).replace(/ /g, "-");

async function parseContent() {
  const source = await readFile(CONTENT, "utf8");
  const ast = ts.createSourceFile(CONTENT, source, ts.ScriptTarget.Latest, true);
  const arrays = new Map();
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) continue;
      arrays.set(declaration.name.text, declaration.initializer.elements.filter(ts.isObjectLiteralExpression).map((object) => ({
        object,
        data: Object.fromEntries(object.properties.filter(ts.isPropertyAssignment).filter((p) => ts.isIdentifier(p.name) && ts.isStringLiteral(p.initializer)).map((p) => [p.name.text, p.initializer.text])),
      })));
    }
  }
  return { source, arrays };
}

export async function items(name) {
  const { arrays } = await parseContent();
  return (arrays.get(name) ?? []).map(({ data }) => data);
}

/** Aggiunge solo campi non presenti, preservando righe e ordine del file scritto a mano. */
export async function addFields(array, identity, value, fields) {
  const { source, arrays } = await parseContent();
  const matches = (arrays.get(array) ?? []).filter(({ data }) => data[identity] === value);
  if (matches.length !== 1) throw new Error(`Voce non univoca: ${value}`);
  const { object } = matches[0];
  const names = new Set(object.properties.map((p) => p.name?.getText()));
  const entries = Object.entries(fields).filter(([key, data]) => data && !names.has(key));
  if (!entries.length) return;
  const last = object.properties.at(-1);
  const position = last ? last.end : object.getStart() + 1;
  const addition = `${last ? ", " : ""}${entries.map(([key, data]) => `${key}: ${JSON.stringify(data)}`).join(", ")}`;
  await writeFile(CONTENT, source.slice(0, position) + addition + source.slice(position));
}

export async function request(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { "User-Agent": "RaffaelePortfolio/1.0 (+https://raffaelevitale.it)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (error) {
    throw new Error(`${error.message}${error.cause?.code ? ` (${error.cause.code})` : ""}`);
  }
}

export async function json(url) { return (await request(url)).json(); }

export async function exists(publicPath) {
  try { return (await stat(resolve(ROOT, "public", `.${publicPath}`))).isFile(); } catch { return false; }
}

/** sips verifica e converte l'immagine prima di pubblicarla, senza lasciare file parziali. */
export async function saveImage(url, publicPath) {
  const response = await request(url);
  if (!response.headers.get("content-type")?.startsWith("image/")) throw new Error("Risposta non immagine");
  const folder = await mkdtemp(join(tmpdir(), "studio-asset-"));
  const input = join(folder, "source");
  const output = join(folder, basename(publicPath));
  try {
    await writeFile(input, Buffer.from(await response.arrayBuffer()));
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "80", "-Z", "512", input, "--out", output], { stdio: "pipe" });
    const dimensions = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", output], { encoding: "utf8" });
    const values = [...dimensions.matchAll(/pixel(?:Width|Height): (\d+)/g)].map((m) => Number(m[1]));
    if (values.length !== 2 || Math.min(...values) < 20 || Math.max(...values) > 512) throw new Error("Dimensioni non valide");
    const destination = join(ROOT, "public", publicPath);
    await mkdir(dirname(destination), { recursive: true });
    await rename(output, destination);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
}

export const cell = (s) => String(s ?? "—").replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
export async function report(filename, title, notes, headers, rows) {
  const lines = [`# ${title}`, "", `Esecuzione: ${new Date().toISOString()}`, "", notes, "", `| ${headers.join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`), ""];
  await writeFile(join(ROOT, "scripts", filename), lines.join("\n"));
  console.log(`${filename}: ${rows.length} voci`);
}
