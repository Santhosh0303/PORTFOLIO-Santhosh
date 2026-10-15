// PLACEHOLDER catalogue for the Foundation skeleton. The real project set and the
// approved one-line reasons are chosen in Phase 0A-2 / Phase 1 after Sandy approves
// the final Role Fit Report. Public repositories only. Strengths only: no score, no gaps.
export interface CatalogueProject {
  id: string;
  track: "data" | "ai";
  title: string;
  keywords: string[];
  reasonId: string;
}

export const REASONS: Record<string, string> = {
  "r-dq": "Built and tested a data-quality pipeline that reconciles every row.",
  "r-geo": "Analysed 7,392 Scottish Data Zones with a documented method and honest limits.",
  "r-bi": "Reads Power BI models and DAX with a large automated test suite.",
  "r-ai": "Published an AI pre-flight tool to PyPI with benchmarks and tests.",
  "r-eval": "Scores a CV against a job description with two separate, explained scores.",
};

export const PROJECTS: CatalogueProject[] = [
  { id: "uk-sme-dq", track: "data", title: "UK SME data-quality pipeline", reasonId: "r-dq",
    keywords: ["data quality", "validation", "cleaning", "etl", "pipeline", "python", "regex", "reconciliation", "pytest", "ci"] },
  { id: "rural-financial-access", track: "data", title: "Rural financial access, Scotland", reasonId: "r-geo",
    keywords: ["analysis", "sql", "power bi", "dashboard", "statistics", "machine learning", "pandas", "geospatial", "stakeholder", "python", "degree"] },
  { id: "dustpan", track: "data", title: "DUSTPAN", reasonId: "r-bi",
    keywords: ["power bi", "dax", "bi", "semantic model", "measures", "reporting", "testing", "ci"] },
  { id: "prism", track: "ai", title: "prism", reasonId: "r-ai",
    keywords: ["ai", "llm", "embeddings", "mcp", "onnx", "evaluation", "python", "packaging", "benchmark", "agents"] },
  { id: "cv-forge", track: "ai", title: "cv-forge", reasonId: "r-eval",
    keywords: ["evaluation", "scoring", "nlp", "python", "parsing", "testing", "llm", "ci"] },
];
