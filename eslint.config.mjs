import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "out/**", "node_modules/**", ".wrangler/**", "theme-guard/actual/**"] },
];

export default config;
