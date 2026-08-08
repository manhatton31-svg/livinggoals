/**
 * Meta-evolution loop for LivingGoals.
 * Uses Grok Build harness to analyze progress and rewrite agent prompts/skills.
 */

import { LivingGoal } from "../core/LivingGoal";
import { GrokBuildHarness } from "../harness/GrokBuildHarness";

export async function runEvolutionLoop(goal: LivingGoal, metrics: Record<string, number>) {
  const harness = new GrokBuildHarness();
  const lastScore = goal.runHistory.length > 1 ? goal.runHistory[goal.runHistory.length - 2]?.score || 0 : 0;
  const newScore = goal.score(metrics);

  if (!goal.shouldEvolve(lastScore, newScore)) {
    console.log("[Evolution] Conditions not met, skipping.");
    return;
  }

  console.log(`[Evolution] Triggering for goal ${goal.config.id} (score ${lastScore.toFixed(2)} → ${newScore.toFixed(2)})`);

  for (const agent of goal.config.agents) {
    const current = agent.current_prompt || agent.initial_prompt_skill || "";
    const evolved = await harness.evolvePrompt(current, `Score moved to ${newScore}`, metrics);
    agent.current_prompt = evolved;
    agent.version = (agent.version || 0) + 1;
    if (goal.config.evolution.archive_every) {
      goal.promptArchive.set(`${agent.role}-v${agent.version}`, evolved);
    }
  }

  goal.config.updated_at = new Date().toISOString();
  console.log("[Evolution] Agents updated and archived.");
}
