/**
 * Thin wrapper around xAI / Grok for LivingGoals.
 * Spawns conceptual agents, runs cycles, and evolves prompts.
 * Graceful fallback when no API key is present.
 */

export interface AgentSpawnOptions {
  role: string;
  skillPath?: string;
  prompt?: string;
  goalContext?: string;
}

export interface HarnessResult {
  text: string;
  source: "live" | "stub";
  model?: string;
}

function getApiKey(): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY;
}

export class GrokBuildHarness {
  private model: string;

  constructor(model = "grok-2-latest") {
    this.model = model;
  }

  get hasKey(): boolean {
    return !!getApiKey();
  }

  async spawnAgent(
    opts: AgentSpawnOptions
  ): Promise<{ id: string; status: string; note?: string }> {
    const id = `agent-${opts.role}-${Date.now()}`;
    console.log(
      `[Harness] Spawning ${opts.role} with model ${this.model} (${this.hasKey ? "live" : "stub"})`
    );
    return {
      id,
      status: "spawned",
      note: this.hasKey
        ? "Ready for live Grok cycles"
        : "No API key — cycles use stub responses",
    };
  }

  private async callGrok(
    system: string,
    user: string,
    maxTokens = 800
  ): Promise<HarnessResult> {
    const apiKey = getApiKey();
    if (!apiKey) {
      return {
        text: `[stub] ${user.slice(0, 120)}…`,
        source: "stub",
        model: this.model,
      };
    }

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.6,
          max_tokens: maxTokens,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        return {
          text: `[harness error ${res.status}] ${body.slice(0, 160)}`,
          source: "stub",
          model: this.model,
        };
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        model?: string;
      };
      return {
        text: data.choices?.[0]?.message?.content?.trim() || "",
        source: "live",
        model: data.model || this.model,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { text: `[network] ${message}`, source: "stub", model: this.model };
    }
  }

  async runCycle(agentId: string, input: string): Promise<string> {
    const result = await this.callGrok(
      `You are LivingGoal agent ${agentId}. Execute the task briefly and report progress metrics as bullet points.`,
      input,
      600
    );
    return result.text;
  }

  async evolvePrompt(
    currentPrompt: string,
    feedback: string,
    metrics: Record<string, number>
  ): Promise<string> {
    const metricsLine = Object.entries(metrics)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    const result = await this.callGrok(
      "You rewrite agent system prompts for LivingGoals. Return ONLY the improved prompt text — no commentary.",
      `Current prompt:\n${currentPrompt || "(empty — invent a strong starter)"}\n\nFeedback:\n${feedback}\n\nMetrics: ${metricsLine}\n\nRewrite the prompt to improve outcomes while staying safe and measurable.`,
      900
    );

    if (result.source === "stub") {
      console.log("[Harness] Evolving prompt (stub)");
      return (
        (currentPrompt || "You are a focused LivingGoal agent.") +
        `\n\n# Evolved ${new Date().toISOString()}\n# Feedback: ${feedback.slice(0, 100)}\n# Metrics: ${metricsLine}`
      );
    }

    console.log("[Harness] Evolving prompt (live Grok)");
    return result.text;
  }
}
