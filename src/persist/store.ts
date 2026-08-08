/**
 * Free local persistence — filesystem JSON only. No paid DB.
 */
import * as fs from "fs";
import * as path from "path";

export function defaultStorePath(cwd = process.cwd()) {
  return path.join(cwd, ".livinggoals", "runs.json");
}

export function loadRuns(file = defaultStorePath()): unknown[] {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function appendRun(entry: unknown, file = defaultStorePath()) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const runs = loadRuns(file);
  runs.push(entry);
  // cap history to control disk
  const trimmed = runs.slice(-200);
  fs.writeFileSync(file, JSON.stringify(trimmed, null, 2));
  return trimmed.length;
}
