/**
 * LivingGoal — Core first-class object
 * A persistent, measurable objective that owns a swarm of agents,
 * evaluates progress, and evolves its own agent prompts via the
 * open Grok Build harness.
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
  target: string | number;
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
  injection?: {
    type: "cli" | "mcp" | "sdk" | "file-watcher" | "nextjs" | "api";
    path?: string;
  };
  evolution: EvolutionConfig;
  created_at?: string;
  updated_at?: string;
  status?: "active" | "paused" | "completed" | "failed";
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
    };
  }

  /** Score current progress against success criteria (0-1) */
  score(metrics: Record<string, number>): number {
    // Simple average for MVP; replace with weighted / LLM judge later
    let total = 0;
    let count = 0;
    for (const crit of this.config.success_criteria) {
      const val = metrics[crit.metric];
      if (val === undefined) continue;
      // Very naive for now — real version will parse target strings
      total += 0.5; // placeholder
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

  toJSON() {
    return this.config;
  }
}
