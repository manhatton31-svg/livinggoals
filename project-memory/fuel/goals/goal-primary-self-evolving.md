---
id: goal-primary-self-evolving
title: Make LivingGoals a self-evolving goal system powered by Grok
description: Build and refine LivingGoals so that goals, progress, and preferences compound automatically via the Grok-native Agent OS and clean agent fuel.
status: active
parent_id: null
created_at: 2026-08-09
updated_at: 2026-08-10
target:
  metric: agent_fuel_coverage
  operator: ">="
  value: 80%
success_criteria:
  - Clean agent fuel structure exists and is loaded at session start
  - Progress and decisions are written back as structured fuel
  - At least one full cycle uses Missions + Validators
constraints:
  - Exclusive Grok / xAI stack
  - Prefer owned durable files over chat-only memory
  - Keep structure lean (Ablation)
tags:
  - livinggoals
  - agent-os
  - own-your-intelligence
---

# Primary Goal: Self-Evolving LivingGoals

This is the top-level goal for the product. All major work should link back here or to a clear sub-goal.
