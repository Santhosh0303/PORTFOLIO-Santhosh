"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const OrbPanel = dynamic(() => import("./OrbPanel"), { ssr: false });

// Foundation skeleton: the floating star. Visual polish and the 3D orb arrive in Phase 3.
export function Orb() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Open the job-ad matcher"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="btn"
        style={{ position: "fixed", right: "var(--space-4)", bottom: "var(--space-4)", borderRadius: "999px", zIndex: 20 }}
      >
        ✦ Hiring?
      </button>
      {open && <OrbPanel />}
    </>
  );
}
