#!/usr/bin/env node
/**
 * LivingGoals CLI — create, inject, run, evolve
 */

import { Command } from "commander";
import * as fs from "fs";
import * as yaml from "yaml";
import { LivingGoal } from "./core/LivingGoal";
import { runEvolutionLoop } from "./evolution/loop";

const program = new Command();

program
  .name("livinggoals")
  .description("Create and run living self-evolving goals powered by Grok Build")
  .version("0.1.0");

program
  .command("create")
  .description("Create a new living goal")
  .argument("<name>", "Goal name")
  .option("-m, --metrics <metrics>", "Comma-separated metrics", "progress")
  .option("-d, --dir <dir>", "Target directory", ".")
  .action((name, opts) => {
    console.log(`Creating living goal: ${name}`);
    console.log(`Metrics: ${opts.metrics}`);
    console.log(`Dir: ${opts.dir}`);
    // TODO: write goals.yaml skeleton
    console.log("MVP: drop goals.example.yaml and edit, or implement full writer next.");
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
    const doc = yaml.parse(fs.readFileSync(opts.file, "utf8"));
    const goals = (doc.goals || []).map((g: any) => LivingGoal.fromYAML(g));
    console.log(`Loaded ${goals.length} living goal(s)`);
    for (const g of goals) {
      const fakeMetrics: Record<string, number> = {};
      for (const m of g.config.metrics) fakeMetrics[m] = Math.random();
      const score = g.recordRun(fakeMetrics);
      console.log(`  ${g.config.name}: score ${score.toFixed(2)}`);
      await runEvolutionLoop(g, fakeMetrics);
    }
  });

program
  .command("status")
  .description("Show status of living goals")
  .action(() => {
    console.log("LivingGoals runtime status: MVP scaffolding advanced Aug 7 2026");
  });

program.parse();
