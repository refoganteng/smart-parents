/**
 * Private module (filename starts with _) -- not mapped as a public route.
 * Used to configure the LLM model from EdgeOne runtime context.env.
 *
 * Imported by chat/index.ts via `import { getModelConfig } from '../_model'`
 *
 * Configure via environment variables:
 *   AI_GATEWAY_API_KEY / AI_GATEWAY_BASE_URL / AI_GATEWAY_MODEL
 */

type RuntimeEnv = Record<string, string | undefined>;

export interface ModelConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function getModelConfig(env: RuntimeEnv): ModelConfig {
  return {
    apiKey: env.AI_GATEWAY_API_KEY || 'sk-a3b126d30a953c022c2f5c153b39e17b5e642ad5431df542',
    baseUrl: env.AI_GATEWAY_BASE_URL || 'https://ai-gateway.edgeone.link/v1',
    model: env.AI_GATEWAY_MODEL || '@makers/deepseek-v4-flash',
  };
}
