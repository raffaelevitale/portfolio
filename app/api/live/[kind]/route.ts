import { getGithub } from "@/lib/live/server/github";
import { getLetterboxd } from "@/lib/live/server/letterboxd";
import { getSpotify } from "@/lib/live/server/spotify";
import { getSteam } from "@/lib/live/server/steam";
import { isLiveKind, type LiveEnvelope, type LiveKind } from "@/lib/live/types";

export const dynamic = "force-dynamic";

/** Quanto la CDN può tenere in cache ogni fonte: Spotify cambia spesso, GitHub e Letterboxd no. */
const SOURCES: Record<LiveKind, { load: () => Promise<LiveEnvelope<unknown>>; maxAge: number }> = {
  spotify: { load: getSpotify, maxAge: 30 },
  github: { load: getGithub, maxAge: 3600 },
  steam: { load: getSteam, maxAge: 300 },
  letterboxd: { load: getLetterboxd, maxAge: 3600 },
};

export async function GET(_request: Request, context: { params: Promise<{ kind: string }> }): Promise<Response> {
  const { kind } = await context.params;
  if (!isLiveKind(kind)) {
    return Response.json({ error: "Fonte sconosciuta" }, { status: 404 });
  }
  const source = SOURCES[kind];
  const body = await source.load();
  // Gli errori non vanno in cache a lungo: si riprova presto.
  const maxAge = body.error ? 30 : source.maxAge;
  return Response.json(body, {
    headers: { "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 4}` },
  });
}
