# LivingGoals Product Spec (v0.1)

## Vision
Anyone (solopreneur, team, or end-user) can create a **Living Goal**.  
That goal becomes a living, self-managing entity that:

1. Spins up the exact agents it needs (using the open Grok Build harness).
2. Continuously evaluates progress against the user-defined success criteria.
3. Uses Grok Build itself to rewrite the prompts, skills, and behavior of those agents.
4. Can be injected into *any* existing system with almost zero friction.
5. Requires the human only to monitor metrics over time.

## User Journey
1. **Create** — `livinggoals create "My big goal" --metrics a,b,c` or edit goals.yaml
2. **Inject** — drop into Next.js app, crypto bot, CRM, personal folder, or call via MCP/SDK/API
3. **Forget** — the Living Goal runs autonomously
4. **Monitor** — open local dashboard or hosted view → watch progress, prompt mutations, agent health
5. **Optional intervene** — pause, adjust success criteria, force evolution, or kill

## Injection Surfaces (Priority Order for MVP)
1. File-based: `goals.yaml` + `.livinggoal/` directory (works in any project)
2. CLI
3. MCP server (so Cursor, Claude Desktop, other agents, IDEs can talk to it)
4. Simple Node/TS SDK (for Next.js / CiteForge / any JS app)
5. REST API + simple web dashboard
6. Browser widget / bookmarklet later

## Technical Differentiator
We do **not** reinvent the agent runtime.  
We stand on the shoulders of the newly open-sourced **Grok Build harness**.  
The Living Goal runtime is a thin, goal-centric orchestration + evolution layer on top of it.

The evolution step literally shells out to (or uses ACP with) Grok Build to edit the prompt files of the child agents. This keeps us zero-proxy and maximally powerful.

## Monetization (later)
- Free / open-source local CLI + runtime
- Paid hosted dashboard + multi-user + higher rate limits + template marketplace
- Enterprise: private harness + compliance + team workspaces

## Success Metrics for the Product Itself
- Time-to-first-living-goal < 5 minutes
- Users can inject into an existing Next.js / Python project with < 10 lines of code or a single file drop
- Prompt evolution produces measurable goal score improvement within 3–5 cycles
- At least 3 public example Living Goals (CiteForge funnel, crypto trader, personal productivity)

---
Owned by: LivingGoals Linear project
Repo: https://github.com/manhatton31-svg/livinggoals
