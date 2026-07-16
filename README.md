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
# Install (once Grok Build CLI is available)
curl -fsSL https://x.ai/cli/install.sh | bash   # or your local build of the open harness

# Create a new living goal
npx livinggoals create "Double CiteForge affiliate conversion rate in 30 days" \
  --metrics conversion_rate,bounce_rate,revenue \
  --dir ./my-project

# Or just drop a goals.yaml
```

See `docs/` and `examples/` for injection patterns.

## Architecture (MVP)

```
livinggoals/
├── core/                 # Living Goal runtime, goal object, metrics
├── harness/              # Thin wrapper around open Grok Build (CLI/ACP)
├── evolution/            # Meta-prompt editor loop (uses Grok Build to edit prompts)
├── injection/            # CLI, MCP server, SDK stubs, file watcher
├── dashboard/            # Simple local metrics viewer (or Vercel-hosted)
├── prompts/              # Versioned system prompts + skills for the Living Goal itself
├── examples/             # CiteForge, crypto trader, lead-gen, personal productivity
└── docs/
```

## Product Roadmap (High Level)
1. **MVP (this week)**: Local CLI + goals.yaml + Grok Build powered evolution loop + basic metrics board.
2. **Injectable**: MCP server + simple JS SDK so it can be dropped into Next.js / CiteForge / any Node project.
3. **Dashboard**: Multi-goal monitoring + prompt version history + alerts.
4. **SaaS tier**: Hosted LivingGoals for non-technical users + team workspaces.
5. **Marketplace**: Share / sell pre-tuned Living Goal templates (e.g. “Affiliate Funnel Optimizer”, “Crypto Alpha Agent”).

## Why This Wins
- Built directly on the newly open-sourced Grok Build harness → maximum leverage + transparency.
- Closes the self-improvement loop at the *prompt + agent* layer (the highest ROI layer right now).
- True “set and forget” for builders: create goal → inject → monitor metrics.
- Perfectly aligned with CiteForge, LoopForge, crypto agents, and AI automation micro-businesses.

## Status
- Linear Project: [LivingGoals](https://linear.app/arclya2a/project/livinggoals-6540e90d49e9)
- GitHub: https://github.com/manhatton31-svg/livinggoals
- Current: Scaffolding MVP (July 16, 2026)

Built with ❤️ + Grok Build by Christopher / manhatton31-svg

---

**Next actions** (auto-managed by Project Manager + Archivist):
- Scaffold core Living Goal class + goals.yaml schema
- Wire Grok Build harness (headless + ACP)
- Implement first meta-evolution skill
- Create example for CiteForge funnel goal
- Deploy simple local dashboard
