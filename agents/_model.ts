/**
 * Private module (filename starts with _) -- not mapped as a public route.
 * Used to configure the LLM model from EdgeOne runtime context.env.
 *
 * Imported by chat/index.ts via `import { getModelConfig } from '../_model'`
 */

type RuntimeEnv = Record<string, string | undefined>;

export interface ModelConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const DEFAULT_BASE_URL = 'https://ai-gateway.edgeone.link/v1';
const DEFAULT_MODEL = '@makers/deepseek-v4-flash';

export function getModelConfig(env: RuntimeEnv = {}): ModelConfig {
  let rawKey = env.AI_GATEWAY_API_KEY ?? env.API_GATEWAY_API_KEY ?? '';
  rawKey = String(rawKey).trim().replace(/^["']|["']$/g, '');

  const apiKey = rawKey.length > 10 ? rawKey : '';

  let rawUrl = env.AI_GATEWAY_BASE_URL ?? env.API_GATEWAY_BASE_URL ?? '';
  rawUrl = String(rawUrl).trim().replace(/^["']|["']$/g, '').replace(/\/$/, '');

  const baseUrl = rawUrl.startsWith('http') ? rawUrl : DEFAULT_BASE_URL;

  let rawModel = env.AI_GATEWAY_MODEL ?? env.API_GATEWAY_MODEL ?? '';
  rawModel = String(rawModel).trim().replace(/^["']|["']$/g, '');

  const model = rawModel.length > 2 ? rawModel : DEFAULT_MODEL;

  return { apiKey, baseUrl, model };
}
