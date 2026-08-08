#!/usr/bin/env node
/**
 * LivingGoals CLI — create, inject, run, evolve
 */

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import { LivingGoal } from "./core/LivingGoal";
import { runEvolutionLoop } from "./evolution/loop";
import { GrokBuildHarness } from "./harness/GrokBuildHarness";

const program = new Command();

program
  .name("livinggoals")
  .description("Create and run living self-evolving goals powered by Grok")
  .version("0.2.0");

program
  .command("create")
  .description("Create a new living goal YAML skeleton")
  .argument("<name>", "Goal name")
  .option("-m, --metrics <metrics>", "Comma-separated metrics", "progress")
  .option("-d, --dir <dir>", "Target directory", ".")
  .option("-f, --file <file>", "Output file", "goals.yaml")
  .action((name, opts) => {
    const metrics = String(opts.metrics)
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const goal = {
      id,
      name,
      description: `${name} — living goal managed by Grok harness`,
      success_criteria: metrics.map((m: string) => ({
        metric: m,
        target: 1,
        window: "7d",
      })),
      time_horizon: "30d",
      priority: "medium",
      agents: [
        {
          role: "executor",
          initial_prompt_skill: `You advance the goal "${name}". Propose concrete next actions.`,
          version: 1,
        },
      ],
      metrics,
      evolution: {
        enabled: true,
        frequency: "after_every_run",
        min_score_delta: 0.05,
        archive_every: true,
      },
      status: "active",
    };

    const outPath = path.join(opts.dir, opts.file);
    let doc: { goals: unknown[] } = { goals: [] };
    if (fs.existsSync(outPath)) {
      try {
        doc = yaml.parse(fs.readFileSync(outPath, "utf8")) || { goals: [] };
        if (!Array.isArray(doc.goals)) doc.goals = [];
      } catch {
        doc = { goals: [] };
      }
    }
    doc.goals.push(goal);
    fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
    fs.writeFileSync(outPath, yaml.stringify(doc));
    console.log(`Wrote living goal "${name}" → ${outPath}`);
  });

program
  .command("run")
  .description("Load goals.yaml and run one cycle")
  .option("-f, --file <file>", "goals file", "goals.yaml")
  .action(async (opts) => {
    if (!fs.existsSync(opts.file)) {
      console.error(`File not found: ${opts.file}`);
      process.exit(1);
    }
    const harness = new GrokBuildHarness();
    console.log(
      `Harness: ${harness.hasKey ? "live Grok" : "stub (set XAI_API_KEY for live)"}`
    );
    const doc = yaml.parse(fs.readFileSync(opts.file, "utf8"));
    const goals = (doc.goals || []).map((g: unknown) => LivingGoal.fromYAML(g));
    console.log(`Loaded ${goals.length} living goal(s)`);
    for (const g of goals) {
      const fakeMetrics: Record<string, number> = {};
      for (const m of g.config.metrics) fakeMetrics[m] = Math.random();
      const agent = await harness.spawnAgent({
        role: g.config.agents[0]?.role || "executor",
        goalContext: g.config.name,
      });
      const output = await harness.runCycle(
        agent.id,
        `Goal: ${g.config.name}. Metrics: ${JSON.stringify(fakeMetrics)}`
      );
      const score = g.recordRun(fakeMetrics, { agentId: agent.id, output });
      console.log(`  ${g.config.name}: score ${score.toFixed(2)}`);
      console.log(`    agent: ${output.slice(0, 160)}${output.length > 160 ? "…" : ""}`);
      await runEvolutionLoop(g, fakeMetrics);
    }
  });

program
  .command("status")
  .description("Show status of living goals")
  .option("-f, --file <file>", "goals file", "goals.yaml")
  .action((opts) => {
    const harness = new GrokBuildHarness();
    console.log(
      `LivingGoals runtime: harness=${harness.hasKey ? "live" : "stub"}`
    );
    if (!fs.existsSync(opts.file)) {
      console.log(`No ${opts.file} — run: livinggoals create "My Goal"`);
      return;
    }
    const doc = yaml.parse(fs.readFileSync(opts.file, "utf8"));
    const goals = doc.goals || [];
    console.log(`${goals.length} goal(s) in ${opts.file}`);
    for (const g of goals) {
      console.log(`  - ${g.name || g.id} [${g.status || "active"}]`);
    }
  });

program.parse();
