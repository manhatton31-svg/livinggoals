/**
 * LivingGoal — Core first-class object (deepened)
 * A persistent, measurable objective that owns agents, evaluates progress,
 * evolves prompts via the Grok Build harness, and aligns with Agent Fuel.
 */

export interface Metric {
  name: string;
  value?: number;
  target: string | number;
  window?: string;
  baseline?: number;
}

export interface SuccessCriterion {
  metric: string;
  target: string | number; // number | ">=1.5" | ">= 2.0x_baseline" etc.
  window?: string;
}

export interface AgentRole {
  role: string;
  initial_prompt_skill?: string;
  current_prompt?: string;
  version?: number;
}

export interface EvolutionConfig {
  enabled: boolean;
  frequency: "after_every_run" | "daily" | "on_metric_threshold";
  min_score_delta?: number;
  archive_every?: boolean;
}

export interface LivingGoalConfig {
  id: string;
  name: string;
  description: string;
  success_criteria: SuccessCriterion[];
  time_horizon: string;
  priority: "low" | "medium" | "high" | "urgent";
  agents: AgentRole[];
  metrics: string[];
  constraints?: string[];
  parent_id?: string | null;
  tags?: string[];
  injection?: {
    type: "cli" | "mcp" | "sdk" | "file-watcher" | "nextjs" | "api";
    path?: string;
  };
  evolution: EvolutionConfig;
  created_at?: string;
  updated_at?: string;
  status?: "active" | "paused" | "completed" | "abandoned" | "failed";
}

export class LivingGoal {
  public config: LivingGoalConfig;
  public runHistory: any[] = [];
  public promptArchive: Map<string, any> = new Map();

  constructor(config: LivingGoalConfig) {
    this.config = {
      ...config,
      created_at: config.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: config.status || "active",
      constraints: config.constraints || [],
      tags: config.tags || [],
      parent_id: config.parent_id ?? null,
    };
  }

  /** Parse a target string into a comparable numeric threshold */
  private parseTarget(
    target: string | number,
    baseline?: number
  ): { op: ">=" | "<=" | "==" | ">" | "<"; value: number } | null {
    if (typeof target === "number") {
      return { op: ">=", value: target };
    }
    const s = String(target).trim().toLowerCase();

    // Handle "2.0x_baseline" / "x_baseline" forms
    const xBase = s.match(/^([><=]+)?\s*([0-9.]+)\s*x[_-]?baseline$/);
    if (xBase && baseline !== undefined) {
      const op = (xBase[1] as any) || ">=";
      const mult = parseFloat(xBase[2]);
      return { op, value: mult * baseline };
    }

    const m = s.match(/^([><=]+)?\s*([0-9.]+)/);
    if (m) {
      const op = (m[1] as any) || ">=";
      return { op, value: parseFloat(m[2]) };
    }
    return null;
  }

  private compare(val: number, op: string, target: number): number {
    switch (op) {
      case ">=":
        return val >= target ? 1 : Math.min(1, Math.max(0, val / (target || 1)));
      case ">":
        return val > target ? 1 : Math.min(1, Math.max(0, val / (target || 1)));
      case "<=":
        return val <= target ? 1 : 0;
      case "<":
        return val < target ? 1 : 0;
      case "==":
        return Math.abs(val - target) < 1e-6 ? 1 : 0;
      default:
        return Math.min(1, Math.max(0, val / (target || 1)));
    }
  }

  /** Score current progress against success criteria (0-1) */
  score(metrics: Record<string, number>, baselines?: Record<string, number>): number {
    let total = 0;
    let count = 0;
    for (const crit of this.config.success_criteria) {
      const val = metrics[crit.metric];
      if (val === undefined) continue;
      const parsed = this.parseTarget(crit.target, baselines?.[crit.metric]);
      if (parsed) {
        total += this.compare(val, parsed.op, parsed.value);
      } else {
        total += 0.5; // unknown target form
      }
      count++;
    }
    return count ? total / count : 0;
  }

  /** Trigger evolution if conditions met */
  shouldEvolve(lastScore: number, newScore: number): boolean {
    if (!this.config.evolution.enabled) return false;
    if (this.config.evolution.frequency === "after_every_run") return true;
    const delta = newScore - lastScore;
    return delta >= (this.config.evolution.min_score_delta || 0.05);
  }

  /** Record a run and optionally archive prompt state */
  recordRun(metrics: Record<string, number>, agentOutputs?: any, baselines?: Record<string, number>) {
    const score = this.score(metrics, baselines);
    this.runHistory.push({
      ts: new Date().toISOString(),
      metrics,
      score,
      agentOutputs,
    });
    this.config.updated_at = new Date().toISOString();
    return score;
  }

  /**
   * One full cycle: score → decide evolve → return structured result
   * Suitable for CLI and harness.
   */
  runCycle(
    metrics: Record<string, number>,
    agentOutputs?: any,
    baselines?: Record<string, number>
  ) {
    const lastScore =
      this.runHistory.length > 0
        ? this.runHistory[this.runHistory.length - 1].score
        : 0;
    const score = this.recordRun(metrics, agentOutputs, baselines);
    const evolve = this.shouldEvolve(lastScore, score);
    return {
      goalId: this.config.id,
      name: this.config.name,
      score,
      lastScore,
      evolve,
      status: this.config.status,
      metrics,
      ts: new Date().toISOString(),
    };
  }

  toJSON() {
    return this.config;
  }

  /** Fuel-aligned snapshot for project-memory/fuel */
  toFuelGoal() {
    return {
      id: this.config.id,
      title: this.config.name,
      description: this.config.description,
      status: this.config.status,
      parent_id: this.config.parent_id ?? null,
      success_criteria: this.config.success_criteria.map((c) => `${c.metric} ${c.target}`),
      constraints: this.config.constraints || [],
      tags: this.config.tags || [],
      created_at: this.config.created_at,
      updated_at: this.config.updated_at,
    };
  }

  static fromYAML(yamlObj: any): LivingGoal {
    return new LivingGoal(yamlObj as LivingGoalConfig);
  }

  static fromFuel(fuelObj: any): LivingGoal {
    return new LivingGoal({
      id: fuelObj.id,
      name: fuelObj.title || fuelObj.name,
      description: fuelObj.description || "",
      success_criteria: (fuelObj.success_criteria || []).map((s: string) => {
        const parts = String(s).split(/\s+/);
        return { metric: parts[0] || "progress", target: parts.slice(1).join(" ") || 1 };
      }),
      time_horizon: fuelObj.time_horizon || "30d",
      priority: fuelObj.priority || "medium",
      agents: fuelObj.agents || [{ role: "executor", version: 1 }],
      metrics: fuelObj.metrics || ["progress"],
      constraints: fuelObj.constraints || [],
      parent_id: fuelObj.parent_id ?? null,
      tags: fuelObj.tags || [],
      evolution: fuelObj.evolution || {
        enabled: true,
        frequency: "after_every_run",
        min_score_delta: 0.05,
      },
      status: fuelObj.status || "active",
      created_at: fuelObj.created_at,
      updated_at: fuelObj.updated_at,
    });
  }
}
