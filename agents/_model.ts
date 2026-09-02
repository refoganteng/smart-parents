/**
 * Private module (filename starts with _) -- not mapped as a public route.
 * Used to configure the LLM model from EdgeOne runtime context.env.
 *
 * Imported by chat/index.ts via `import { getModelConfig } from '../_model'`
 *
 * Supports both AI_GATEWAY_* and API_GATEWAY_* naming conventions with
 * robust fallback defaults.
 */

type RuntimeEnv = Record<string, string | undefined>;

export interface ModelConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function getModelConfig(env: RuntimeEnv = {}): ModelConfig {
  const apiKey = 
    env.AI_GATEWAY_API_KEY || 
    env.API_GATEWAY_API_KEY || 
    'sk-a3b126d30a953c022c2f5c153b39e17b5e642ad5431df542';

  const baseUrl = (
    env.AI_GATEWAY_BASE_URL || 
    env.API_GATEWAY_BASE_URL || 
    'https://ai-gateway.edgeone.link/v1'
  ).trim();

  const model = 
    env.AI_GATEWAY_MODEL || 
    env.API_GATEWAY_MODEL || 
    '@makers/deepseek-v4-flash';

  return { apiKey, baseUrl, model };
}
