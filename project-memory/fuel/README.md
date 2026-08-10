# LivingGoals Agent Fuel

This directory holds the clean, durable, agent-consumable memory for LivingGoals.

Agents should load the relevant fuel files at session start instead of relying only on chat history or unstructured notes.

## Files
- `SCHEMA.md` — entity definitions and relationships
- `goals/` — individual Goal files
- `events/` — ProgressEvents
- `preferences/` — Preferences and Constraints
- `decisions/` — Decisions (optional)
- `missions/` — Missions with validators (optional)

## Rules
- Prefer append + version over silent overwrite
- Keep high-signal only (Ablation applies)
- Link entities by id
- Treat this as owned intelligence that compounds

See SCHEMA.md for the exact shape.
