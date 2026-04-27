import type { LoudlyConfig } from "@/types/config";

// Dynamic import at build time — loudly.config.js lives at project root
async function loadConfig(): Promise<LoudlyConfig> {
  const mod = await import("../../loudly.config.js");
  return mod.default as LoudlyConfig;
}

let _config: LoudlyConfig | null = null;

export async function getConfig(): Promise<LoudlyConfig> {
  if (!_config) {
    _config = await loadConfig();
  }
  return _config;
}
