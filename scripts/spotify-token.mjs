#!/usr/bin/env node
/**
 * Ottiene una volta sola il refresh token di Spotify per il giradischi dello studio.
 *
 *   node --env-file=.env.local scripts/spotify-token.mjs
 *
 * Apre un piccolo server su 127.0.0.1:8888, ti fa autorizzare l'app nel browser
 * e stampa il refresh token qui nel terminale (mai nella pagina web).
 */
import { randomBytes } from "node:crypto";
import { createServer } from "node:http";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["user-read-currently-playing", "user-read-recently-played", "user-top-read"];

const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error("Mancano SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET in .env.local.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: SCOPES.join(" "),
  state,
}).toString();

async function exchange(code) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
  });
  if (!res.ok) {
    throw new Error(`Spotify ha risposto ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const done = (status, message) => {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end(message);
    server.close();
  };
  if (url.searchParams.get("state") !== state) {
    done(400, "Richiesta non valida (state diverso). Rilancia lo script.");
    process.exitCode = 1;
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    done(400, `Autorizzazione negata: ${url.searchParams.get("error") ?? "motivo sconosciuto"}`);
    process.exitCode = 1;
    return;
  }
  try {
    const tokens = await exchange(code);
    console.log("\nFatto. Aggiungi questa riga a .env.local e alle variabili d'ambiente su Vercel:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    done(200, "Fatto: torna al terminale, il refresh token è stampato lì. Puoi chiudere questa scheda.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    done(500, "Scambio del codice non riuscito: guarda il terminale.");
    process.exitCode = 1;
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Apri questo indirizzo nel browser e autorizza l'app:\n");
  console.log(`${authorizeUrl.toString()}\n`);
});
