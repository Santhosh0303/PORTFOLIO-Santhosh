export type Track = "data" | "ai" | "both" | "neither";

export interface OrbMatch {
  projectId: string;
  reasonId: string;
}

export interface OrbResponse {
  track: Track;
  matches: OrbMatch[];
  source: "ai" | "fallback";
}

export interface OrbRequest {
  text: string;
}

export const MAX_AD_CHARS = 8000;
export const AI_TIMEOUT_MS = 2000;
export const BROWSER_FALLBACK_AT_MS = 2500;
