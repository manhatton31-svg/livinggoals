# LivingGoals Agent Fuel Schema

Clean, durable, agent-consumable memory for LivingGoals.
Aligned with Agent OS principles: Own Your Intelligence, Graph Memory preference, Zero Token Architecture, Missions + Validators, Skillify.

## Core Entities

### Goal
- id, title, description, status (active | paused | completed | abandoned)
- parent_id (for sub-goals)
- target (metric + operator + value)
- success_criteria[]
- constraints[]
- tags[]
- created_at, updated_at

### ProgressEvent
- id, goal_id, timestamp
- type (measurement | action | reflection | external)
- value, notes, source
- signal (positive | neutral | negative | noise)

### Decision
- id, goal_id, timestamp
- question, options_considered[], chosen, rationale
- outcome_linked, outcome_id

### Preference / Constraint
- id, category, statement, strength (hard | soft)
- source (explicit | inferred)
- created_at, last_confirmed

### Mission (optional)
- id, goal_id, title, success_criteria[], validator, status, result_summary

## Relationships
Goal → ProgressEvent, Decision, Mission
Goal → parent/child Goal
Decision → influences Goal / Preference
Preference → constrains Goal / Mission

## Storage
Markdown / YAML files in this folder. Version-controlled. Agents load at session start.

Version: 2026-08-10
