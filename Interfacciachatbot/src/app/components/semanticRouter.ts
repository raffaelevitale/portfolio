import type { Ambito, Module } from './data';
import { ambiti as staticAmbiti } from './data';

export type RoutingCandidate = {
  moduleId: string;
  moduleName: string;
  ambitoId: string;
  ambitoName: string;
  ambitoColor: string;
  score: number;
  matchedKeywords: string[];
  reason: string;
};

export type RoutingDecision = {
  status: 'routed' | 'fallback' | 'ambiguous';
  query: string;
  primary: RoutingCandidate;
  alternatives: RoutingCandidate[];
  confidence: number;
  intent: string;
  reasoning: string;
  latencyMs: number;
  tokensAnalyzed: number;
};

// Keyword-to-module mappings used by the semantic router simulation.
// Each entry defines words that, if found in the query, score that module higher.
const routingRules: Array<{
  moduleId: string;
  keywords: string[];
  intents: string[];
  weight?: number;
}> = [
  // AEGIS - instradamento
  { moduleId: 'M093', keywords: ['instrada', 'routing', 'smistament', 'classifica', 'orchestr'], intents: ['meta'], weight: 0.7 },

  // Assistenza / knowledge
  { moduleId: 'M002', keywords: ['assistenza', 'supporto', 'cliente', 'normativ', 'tecnic', 'knowledge', 'rag', 'specialist'], intents: ['assistenza specialistica'], weight: 1 },
  { moduleId: 'M001', keywords: ['reputaz', 'brand', 'percezione', 'social', 'monitoragg'], intents: ['reputazione'], weight: 1 },
  { moduleId: 'M061', keywords: ['sentiment', 'feedback', 'conversaz', 'insight clienti', 'voce del cliente'], intents: ['analisi conversazioni'], weight: 1 },

  // Vendite / preventivi
  { moduleId: 'M041', keywords: ['preventivo', 'preventivi', 'offerta', 'quotazione', 'listino', 'proposta commerciale'], intents: ['vendite'], weight: 1 },
  { moduleId: 'M062', keywords: ['lead', 'prospect', 'qualifica', 'score', 'priorita commerciale', 'pipeline'], intents: ['vendite'], weight: 1 },

  // Dati
  { moduleId: 'M010', keywords: ['normaliz', 'dati', 'anagraf', 'schema', 'standardizz', 'puliz', 'canonic'], intents: ['data governance'], weight: 1 },
  { moduleId: 'M011', keywords: ['email', 'mail', 'posta', 'smista email', 'coda mail'], intents: ['operations'], weight: 1 },
  { moduleId: 'M012', keywords: ['priorit', 'urgenza', 'sla', 'ordina', 'impatto'], intents: ['operations'], weight: 1 },

  // Marketing / content
  { moduleId: 'M071', keywords: ['post', 'linkedin', 'newsletter', 'ad copy', 'contenut', 'campagna', 'editorial', 'creative'], intents: ['marketing'], weight: 1 },

  // Documenti / compliance
  { moduleId: 'M014', keywords: ['contratto', 'clausola', 'document', 'compliance', 'confront', 'legale', 'accord'], intents: ['documenti'], weight: 1 },
];

const stopwords = new Set([
  'il', 'la', 'lo', 'le', 'gli', 'i', 'un', 'una', 'uno', 'del', 'della', 'dello',
  'dei', 'delle', 'degli', 'e', 'ed', 'o', 'ma', 'che', 'di', 'da', 'in', 'con',
  'su', 'per', 'tra', 'fra', 'a', 'al', 'alla', 'allo', 'ai', 'alle', 'agli',
  'dal', 'dalla', 'dallo', 'dai', 'dalle', 'dagli', 'nel', 'nella', 'nello',
  'nei', 'nelle', 'negli', 'sul', 'sulla', 'sullo', 'sui', 'sulle', 'sugli',
  'non', 'si', 'ci', 'vi', 'mi', 'ti', 'tu', 'io', 'noi', 'voi', 'loro', 'lui', 'lei',
  'come', 'quando', 'dove', 'cosa', 'chi', 'mostra', 'fammi', 'vedere', 'dimmi',
  'oggi', 'ieri', 'adesso', 'ora', 'questo', 'quello', 'questi', 'quelli',
  'delle', 'degli', 'sono', 'ho', 'hai', 'abbia', 'essere', 'avere',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(tok => tok.length > 2 && !stopwords.has(tok));
}

function flattenModules(ambiti: Ambito[]): Array<{ module: Module; ambito: Ambito }> {
  return ambiti.flatMap(a => a.funzioni.flatMap(f => f.modules.map(module => ({ module, ambito: a }))));
}

function buildModuleIndex(ambiti: Ambito[]) {
  const idx = new Map<string, { module: Module; ambito: Ambito }>();
  for (const entry of flattenModules(ambiti)) idx.set(entry.module.id, entry);
  return idx;
}

export function routeSemantic(query: string, ambiti: Ambito[] = staticAmbiti): RoutingDecision {
  const trimmed = query.trim();
  const tokens = tokenize(trimmed);
  const index = buildModuleIndex(ambiti);
  const start = performance.now();

  // Score each module based on keyword matches
  const scores = new Map<string, { score: number; matched: Set<string>; intent: string }>();

  for (const rule of routingRules) {
    if (!index.has(rule.moduleId)) continue;
    const entry = index.get(rule.moduleId)!;
    if (!entry.module.purchased) continue;
    const agg = scores.get(rule.moduleId) ?? { score: 0, matched: new Set<string>(), intent: rule.intents[0] ?? '' };
    for (const kw of rule.keywords) {
      const hits = tokens.filter(t => t.includes(kw) || kw.includes(t)).length;
      if (hits > 0) {
        agg.score += hits * (rule.weight ?? 1);
        agg.matched.add(kw);
      }
    }
    if (agg.score > 0) {
      // Boost if module is active
      if (entry.module.active) agg.score += 0.3;
      scores.set(rule.moduleId, agg);
    }
  }

  const candidates: RoutingCandidate[] = Array.from(scores.entries())
    .map(([moduleId, { score, matched, intent }]) => {
      const entry = index.get(moduleId)!;
      return {
        moduleId,
        moduleName: entry.module.name,
        ambitoId: entry.ambito.id,
        ambitoName: entry.ambito.name,
        ambitoColor: entry.ambito.color,
        score,
        matchedKeywords: Array.from(matched),
        reason: `${matched.size} termine/i chiave rilevati · intent ${intent}`,
      };
    })
    .sort((a, b) => b.score - a.score);

  const latencyMs = Math.round((performance.now() - start) + 40 + Math.random() * 80);
  const tokensAnalyzed = tokens.length;

  // No match: fallback to M002 (Assistenza specialistica) if purchased, otherwise M093 self
  if (candidates.length === 0) {
    const fallback = index.get('M002') ?? index.get('M093');
    if (fallback) {
      const primary: RoutingCandidate = {
        moduleId: fallback.module.id,
        moduleName: fallback.module.name,
        ambitoId: fallback.ambito.id,
        ambitoName: fallback.ambito.name,
        ambitoColor: fallback.ambito.color,
        score: 0,
        matchedKeywords: [],
        reason: 'Fallback verso RAG generalista controllato',
      };
      return {
        status: 'fallback',
        query: trimmed,
        primary,
        alternatives: [],
        confidence: 42,
        intent: 'generico',
        reasoning: 'Nessun dominio specifico rilevato. Inoltro verso motore generalista con grounding controllato.',
        latencyMs,
        tokensAnalyzed,
      };
    }
  }

  const [primary, ...rest] = candidates;
  const topScore = primary?.score ?? 0;
  const secondScore = rest[0]?.score ?? 0;

  // Ambiguity detection: top-2 are too close
  const scoreGap = topScore - secondScore;
  const isAmbiguous = rest.length > 0 && scoreGap < 0.6 && topScore > 0;

  // Confidence heuristic
  const confidenceBase = Math.min(98, 60 + topScore * 8 + (primary?.matchedKeywords.length ?? 0) * 3);
  const confidence = isAmbiguous ? Math.max(55, confidenceBase - 20) : Math.round(confidenceBase);

  return {
    status: isAmbiguous ? 'ambiguous' : 'routed',
    query: trimmed,
    primary: primary!,
    alternatives: rest.slice(0, 2),
    confidence,
    intent: primary?.reason.split('intent ')[1] ?? 'generico',
    reasoning: isAmbiguous
      ? `Richiesta multi-dominio: ${primary.ambitoName} prevale ma ${rest[0].ambitoName} resta candidato plausibile. Applico disambiguazione soft.`
      : `Classificato come richiesta di dominio ${primary.ambitoName.toLowerCase()}. Keywords dominanti: ${primary.matchedKeywords.slice(0, 3).join(', ')}.`,
    latencyMs,
    tokensAnalyzed,
  };
}
