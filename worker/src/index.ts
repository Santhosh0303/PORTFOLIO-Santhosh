import { MAX_AD_CHARS, keywordMatch, redact } from "../../lib/orb";
import type { OrbResponse } from "../../lib/orb";

interface Env {
  ASSETS: Fetcher;
  AI: Ai;
  DB: D1Database;
  ENVIRONMENT: string;
  AI_DAILY_NEURON_LIMIT: string;
  AI_GUARD_RATIO: string;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });

const today = () => new Date().toISOString().slice(0, 10);

async function handleOrb(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "unsupported_media_type" }, 415);
  if (new URL(request.url).origin !== (request.headers.get("origin") ?? new URL(request.url).origin)) return json({ error: "forbidden_origin" }, 403);

  let body: unknown;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const text = typeof (body as { text?: unknown })?.text === "string" ? (body as { text: string }).text : null;
  if (text === null || text.trim().length === 0) return json({ error: "empty_text" }, 400);
  if (text.length > MAX_AD_CHARS) return json({ error: "too_long", max: MAX_AD_CHARS }, 413);

  const started = Date.now();
  const clean = redact(text);
  // Foundation skeleton: Workers AI matching (EmbeddingGemma, measured cost, 90% guard) is wired in Phase 3.
  // Until project vectors exist, every query is answered by the keyword matcher.
  const result: OrbResponse = keywordMatch(clean);

  const ms = Date.now() - started;
  try {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO orb_queries (redacted_text, track, source, top_projects, latency_ms) VALUES (?, ?, ?, ?, ?)")
        .bind(clean, result.track, result.source, result.matches.map((m) => m.projectId).join(","), ms),
      env.DB.prepare("INSERT INTO usage_daily (day, orb_calls, fallback_calls) VALUES (?, 1, 1) ON CONFLICT(day) DO UPDATE SET orb_calls = orb_calls + 1, fallback_calls = fallback_calls + 1")
        .bind(today()),
    ]);
  } catch {
    /* logging must never break an answer */
  }
  return json(result);
}

async function purge(env: Env): Promise<void> {
  const cut30 = new Date(Date.now() - 30 * 86400_000).toISOString();
  const cut365 = new Date(Date.now() - 365 * 86400_000).toISOString();
  const res = await env.DB.batch([
    env.DB.prepare("DELETE FROM orb_queries WHERE created_at < ?").bind(cut30),
    env.DB.prepare("DELETE FROM contact_messages WHERE created_at < ?").bind(cut30),
    env.DB.prepare("DELETE FROM audit_log WHERE created_at < ?").bind(cut365),
  ]);
  const removed = res.reduce((n, r) => n + (r.meta.changes ?? 0), 0);
  await env.DB.prepare("INSERT INTO audit_log (actor, action, detail) VALUES ('cron', 'purge', ?)").bind(`removed ${removed} rows`).run();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/health") return json({ ok: true, environment: env.ENVIRONMENT });
    if (pathname === "/api/orb") return handleOrb(request, env);
    if (pathname.startsWith("/api/")) return json({ error: "not_implemented" }, 501);
    return env.ASSETS.fetch(request);
  },
  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    await purge(env);
  },
} satisfies ExportedHandler<Env>;
