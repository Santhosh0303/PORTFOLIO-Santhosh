// Redact obvious personal data before anything is embedded or logged.
const PATTERNS: [RegExp, string][] = [
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "[email]"],
  [/(?:\+44\s?|\b0)\d(?:[\s-]?\d){8,10}\b/g, "[phone]"],
  [/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/gi, "[postcode]"],
  [/\b\d{1,4}\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\s(?:Road|Street|Lane|Avenue|Close|Drive|Way|Gardens)\b/g, "[address]"],
  [/https?:\/\/\S+/g, "[link]"],
];

export function redact(text: string): string {
  return PATTERNS.reduce((t, [re, sub]) => t.replace(re, sub), text);
}
