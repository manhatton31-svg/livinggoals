# LivingGoals

**Create living goals that grow their own agents.**

Drop a goal into *any* system.  
It spins up specialized agents (powered by the open Grok Build harness), continuously edits their prompts based on real progress, and drives itself toward completion.  

**You just monitor the metrics.**

## One-sentence pitch
LivingGoals turns any measurable objective into a self-evolving agent swarm that you can inject into existing apps, bots, CRMs, personal workflows, or greenfield projects. The system handles spawning, evaluation, and prompt evolution. You only watch the dashboard.

## Core Value Prop
- **Living Goal** = first-class, persistent, versioned object with success criteria, metrics, and ownership of agents.
- Automatically spins up agents via open-source Grok Build harness.
- Meta-learning loop rewrites agent prompts/skills/AGENTS.md based on goal progress (using Grok Build itself for the edits).
- Fully injectable: CLI, file drop (`goals.yaml` + `.livinggoal/`), MCP server, JS/Python SDK, REST API, or browser widget.
- Zero-proxy, local-first by default. Cloud dashboard optional for multi-goal monitoring.
- Built for solopreneurs, AI automation builders, crypto agents, affiliate systems, and any goal-driven workflow.

## How a Living Goal Works

```
User creates Living Goal
       ↓
[Inject into system]  ← CLI / MCP / SDK / file / API
       ↓
Living Goal Runtime (local or hosted)
  • Spawns specialized agents (Planner, Builder, Evaluator, Skeptic...) using Grok Build
  • Agents work toward the goal (code, content, trades, funnels, etc.)
  • Metrics collected continuously
  • Learning Loop: Grok Build analyzes progress → edits the agents' own prompts/skills
  • Git/stigmergic archive of every prompt mutation + score
       ↓
User monitors simple metrics dashboard over time
```

## Quick Start (Local MVP)

```bash
npm install
npm run build
npx livinggoals create "Double CiteForge affiliate conversion rate in 30 days"
# or drop goals.example.yaml and:
npx livinggoals run -f goals.example.yaml
```

See `docs/` and `examples/` for injection patterns.

## Architecture (MVP)

```
livinggoals/
├── src/
│   ├── core/LivingGoal.ts      # First-class goal object + scoring
│   ├── harness/GrokBuildHarness.ts  # Thin Grok Build wrapper
│   ├── evolution/loop.ts       # Meta-prompt evolution
│   ├── cli.ts                  # CLI entry
│   └── index.ts
├── prompts/skills/             # Versioned skills (meta-evolution etc.)
├── goals.example.yaml
├── docs/
└── package.json
```

## Product Roadmap (High Level)
1. **MVP (this week)** → Advanced Aug 7 2026: Core class, scoring, harness stub, evolution loop, CLI skeleton.
2. **Injectable**: MCP server + simple JS SDK so it can be dropped into Next.js / CiteForge / any Node project.
3. **Dashboard**: Multi-goal monitoring + prompt version history + alerts.
4. **SaaS tier**: Hosted LivingGoals for non-technical users + team workspaces.
5. **Marketplace**: Share / sell pre-tuned Living Goal templates.

## Status
- Linear Project: [LivingGoals](https://linear.app/arclya2a/project/livinggoals-6540e90d49e9)
- GitHub: https://github.com/manhatton31-svg/livinggoals
- Current: **MVP core advanced August 7 2026** (LivingGoal class expanded, harness + evolution + CLI stubs live)

Built with ❤️ + Grok Build by Christopher / manhatton31-svg

---

**Completed / advanced by team Aug 7 2026**:
- Expanded LivingGoal core (scoring, recordRun, fromYAML)
- GrokBuildHarness stub
- Evolution loop
- CLI skeleton (create / run / status)
- README + architecture updated
