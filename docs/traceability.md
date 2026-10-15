# Requirement traceability (starter)

The merge gate is 100% of requirement IDs passing. IDs are added here as each requirement is accepted; the four test families (end-to-end, operational acceptance, acceptance, telemetry) reference them.

| ID | Requirement | Source | Enforced from | Test |
|---|---|---|---|---|
| THEME-001 | `app/globals.css` tokens match the DESIGN.md token block; no raw colours | DESIGN.md section 2 | Phase 0B | `scripts/theme-tokens-check.mjs` |
| THEME-002 | Every page screenshot matches the last approved look (desktop, iPhone) | DESIGN.md section 13 | After Sandy approves the first baseline | `theme-guard/theme.spec.ts` |
| THEME-003 | Text over the 3D or poster holds 4.5:1 against the pixels behind it (worst case); boundaries 3:1 | DESIGN.md sections 2 and 13 | Phase 1, when the poster first puts text over imagery; built at the start of Phase 1 with a fixture that proves it fails on stardust over white | `theme-guard/contrast.spec.ts` (starter version exists) |
| PERF-001 | First-load JavaScript at most 150 KB gzip per page | Performance card | Phase 0B | `scripts/size-budget.mjs` |
