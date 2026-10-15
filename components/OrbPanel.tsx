"use client";

import { useRef, useState } from "react";
import { AI_TIMEOUT_MS, BROWSER_FALLBACK_AT_MS, MAX_AD_CHARS, PROJECTS, REASONS, keywordMatch } from "@/lib/orb";
import type { OrbResponse } from "@/lib/orb";

// Loaded only when the star is first opened, so it stays out of first-load JavaScript.
export default function OrbPanel() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<OrbResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);

  async function run() {
    const my = ++seq.current;
    setBusy(true);
    const local = keywordMatch(text); // always computed: shadow fallback + instant answer
    const timer = setTimeout(() => {
      if (seq.current === my) { setResult(local); setBusy(false); }
    }, BROWSER_FALLBACK_AT_MS);
    try {
      const res = await fetch("/api/orb", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, MAX_AD_CHARS) }),
        signal: AbortSignal.timeout(AI_TIMEOUT_MS + 400),
      });
      if (res.ok && seq.current === my) setResult((await res.json()) as OrbResponse);
    } catch {
      /* the timer above answers with the browser fallback */
    } finally {
      clearTimeout(timer);
      if (seq.current === my) { setBusy(false); setResult((r) => r ?? local); }
    }
  }

  return (
    <section
      aria-label="Job-ad matcher"
      className="card"
      style={{ position: "fixed", right: "var(--space-4)", bottom: "calc(var(--space-4) + 56px)", width: "min(92vw, 420px)", zIndex: 20 }}
    >
      <p className="label">PASTE A JOB AD</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_AD_CHARS}
        rows={6}
        aria-label="Job ad text"
        className="field" style={{ width: "100%" }}
      />
      <button type="button" className="btn" onClick={run} disabled={busy || text.trim().length === 0}>
        {busy ? "Matching..." : "Match"}
      </button>
      {result && (
        <div aria-live="polite" style={{ marginTop: "var(--space-4)" }}>
          {result.matches.length === 0 ? (
            <p>No clear match for this text.</p>
          ) : (
            <ul style={{ paddingLeft: "1.2em" }}>
              {result.matches.map((m) => (
                <li key={m.projectId}>
                  <strong>{PROJECTS.find((p) => p.id === m.projectId)?.title}</strong>
                  <br />
                  <span style={{ color: "var(--stardust)" }}>{REASONS[m.reasonId]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
