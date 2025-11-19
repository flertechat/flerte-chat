import { readFile } from "node:fs/promises";
import path from "node:path";

let trainingCache: string | null = null;

export async function getTrainingPrompt() {
  if (trainingCache) return trainingCache;

  const trainingPath = path.resolve(process.cwd(), "docs", "training", "flerte-prompt.md");
  const content = await readFile(trainingPath, "utf-8");

  trainingCache = content;
  return trainingCache;
}
