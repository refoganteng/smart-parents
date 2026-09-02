/**
 * Session module -- private module (starts with _), not mapped as a route.
 *
 * Wraps EdgeOne's context.store (ConversationMemory) to provide a simple
 * session interface for conversation history persistence.
 */

export class ChatSession {
  private store: any;
  private maxHistory: number;

  constructor(store: any, maxHistory = 50) {
    this.store = store;
    this.maxHistory = maxHistory;
  }

  /** Get conversation history as OpenAI-compatible message dicts. */
  async getHistory(conversationId: string): Promise<Array<{ role: string; content: string }>> {
    try {
      // Node.js EdgeOne runtime uses object parameters
      const messages = await this.store.getMessages({
        conversationId,
        limit: this.maxHistory,
        order: 'asc',
      });
      if (this.store.toOpenaiInput) {
        // 平台存储的历史可能含非字符串 content（如结构化/工具消息、null），
        // 模型网关要求 content 必须为 string，统一收窄避免 400（保留 tool_calls 等其余字段）。
        return (this.store.toOpenaiInput(messages) as any[]).map((m: any) => ({
          ...m,
          content:
            typeof m.content === 'string'
              ? m.content
              : m.content == null
                ? ''
                : JSON.stringify(m.content),
        }));
      }
      // Fallback: manual conversion
      // 平台存储的历史可能含非字符串 content（结构化消息/对象/null），
      // 模型网关要求 content 必须为 string，统一收窄避免 400。
      return (messages || [])
        .filter((m: any) => m.role === 'user' || m.role === 'assistant')
        .map((m: any) => ({
          role: m.role,
          content:
            typeof m.content === 'string'
              ? m.content
              : m.content == null
                ? ''
                : JSON.stringify(m.content),
        }));
    } catch (e) {
      console.error(`[session] Failed to get history for ${conversationId}:`, e);
      return [];
    }
  }

  /** Save a user message to the store. */
  async saveUserMessage(conversationId: string, content: string): Promise<string> {
    try {
      return await this.store.appendMessage({ conversationId, role: 'user', content });
    } catch (e) {
      console.error('[session] Failed to save user message:', e);
      return '';
    }
  }

  /** Save an assistant message to the store. */
  async saveAssistantMessage(conversationId: string, content: string): Promise<string> {
    try {
      return await this.store.appendMessage({ conversationId, role: 'assistant', content });
    } catch (e) {
      console.error('[session] Failed to save assistant message:', e);
      return '';
    }
  }
}
