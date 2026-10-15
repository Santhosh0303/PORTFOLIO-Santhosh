import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Data" };

export default function Track() {
  return (
    <div className="page" style={{ paddingBlock: "var(--space-9)" }}>
      <p className="label">GALAXY · DATA</p>
      <h1 className="headline hero">Sai Santhosh Bellam</h1>
      <p style={{ maxWidth: "68ch", color: "var(--stardust)", fontSize: "1.125rem" }}>
        Graduate Data Analyst. Foundation preview: the journey for this track is built in Phase 1.
      </p>
      <p><Link className="btn" href="/">Return to launch</Link></p>
    </div>
  );
}
