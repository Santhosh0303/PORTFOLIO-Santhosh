# Security exceptions (each one is reviewed monthly and removed when a fix exists)

| Advisory | Package path | Why accepted | Review by |
|---|---|---|---|
| GHSA-vfj7-8cjw-p6xm (braces, ReDoS on deeply nested glob patterns) | dev only: eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch > braces | No patched version exists yet. Dev tooling only; the pattern input is our own lint config, never user input; nothing from this path ships to production. | 2026-11-15 |
