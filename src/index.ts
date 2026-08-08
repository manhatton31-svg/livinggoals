/**
 * LivingGoals — public API
 */
export { LivingGoal } from "./core/LivingGoal";
export type {
  LivingGoalConfig,
  Metric,
  SuccessCriterion,
  AgentRole,
  EvolutionConfig,
} from "./core/LivingGoal";

export { loadGoalsFromYaml } from "./core/loader";
export { LivingGoalsRuntime } from "./core/runtime";
