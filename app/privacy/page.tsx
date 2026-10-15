import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <div className="page" style={{ paddingBlock: "var(--space-9)" }}>
      <h1 className="headline h1">Privacy</h1>
      <p style={{ maxWidth: "68ch" }}>The full privacy notice is written in Phase 1 and must be live before launch.</p>
    </div>
  );
}
