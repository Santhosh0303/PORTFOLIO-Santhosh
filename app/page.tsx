import Link from "next/link";

export default function Launch() {
  return (
    <div className="page" style={{ paddingBlock: "var(--space-9)" }}>
      <p className="label">MISSION CONTROL</p>
      <h1 className="headline hero">Sai Santhosh Bellam</h1>
      <p style={{ maxWidth: "68ch", color: "var(--stardust)", fontSize: "1.125rem" }}>
        Choose your mission.
      </p>
      <div
        style={{
          display: "grid",
          gap: "var(--space-5)",
          marginTop: "var(--space-7)",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        }}
      >
        <Link href="/data/" className="card" style={{ textDecoration: "none", color: "inherit" }}>
          <p className="label">GALAXY 01</p>
          <h2 className="headline" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>Data</h2>
          <p style={{ color: "var(--stardust)" }}>A barred spiral of data streams.</p>
        </Link>
        <Link href="/ai/" className="card" style={{ textDecoration: "none", color: "inherit" }}>
          <p className="label">GALAXY 02</p>
          <h2 className="headline" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>AI</h2>
          <p style={{ color: "var(--stardust)" }}>A neural nebula of firing filaments.</p>
        </Link>
      </div>
      <p className="label" style={{ marginTop: "var(--space-8)" }}>
        FOUNDATION PREVIEW · CONTENT ARRIVES IN PHASE 1 · <Link href="/privacy/">PRIVACY</Link>
      </p>
    </div>
  );
}
