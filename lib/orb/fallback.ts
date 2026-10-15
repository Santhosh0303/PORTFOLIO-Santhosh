import { PROJECTS } from "./catalogue";
import type { OrbMatch, OrbResponse, Track } from "./types";

// Browser/Worker keyword matcher. Must answer in <= 50 ms and also shadow-runs on every query.
const AI_WORDS = ["ai", "llm", "genai", "machine learning", "ml", "nlp", "embeddings", "rag", "mlops", "prompt", "agents", "neural"];
const DATA_WORDS = ["data analyst", "analytics", "sql", "power bi", "tableau", "excel", "dashboard", "reporting", "bi", "data quality", "etl", "statistics"];

const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9+#. ]+/g, " ").replace(/\s+/g, " ")} `;
const count = (hay: string, words: string[]) =>
  words.reduce((n, w) => n + (hay.includes(` ${w} `) ? 1 : 0), 0);

export function keywordMatch(text: string): OrbResponse {
  const hay = norm(text);
  const ai = count(hay, AI_WORDS);
  const data = count(hay, DATA_WORDS);
  let track: Track;
  if (ai + data === 0) track = "neither";
  else if (ai > 0 && data > 0 && Math.min(ai, data) / Math.max(ai, data) >= 0.6) track = "both";
  else track = ai > data ? "ai" : "data";

  const scored = PROJECTS.map((p) => ({ p, s: count(hay, p.keywords) }))
    .filter((x) => x.s > 0 && (track === "both" || track === "neither" ? true : x.p.track === track))
    .sort((a, b) => b.s - a.s || a.p.id.localeCompare(b.p.id))
    .slice(0, 3);
  const matches: OrbMatch[] = track === "neither" ? [] : scored.map((x) => ({ projectId: x.p.id, reasonId: x.p.reasonId }));
  return { track, matches, source: "fallback" };
}
