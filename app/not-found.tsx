import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page" style={{ paddingBlock: "var(--space-9)" }}>
      <p className="label">404</p>
      <h1 className="headline hero">Signal lost</h1>
      <p style={{ color: "var(--stardust)" }}>That page drifted into the void.</p>
      <p><Link className="btn" href="/">Return to launch</Link></p>
    </div>
  );
}
