import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import https from 'node:https';
import { retrieveRagContext } from './agents/_rag';

function edgeOneDevMiddleware(): Plugin {
  return {
    name: 'edgeone-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'POST' && req.url?.startsWith('/chat/stop')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        if (req.method === 'POST' && req.url?.startsWith('/history')) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ messages: [] }));
          return;
        }

        if (req.method === 'POST' && req.url?.startsWith('/chat')) {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk.toString();
          });

          req.on('end', async () => {
            let message = '';
            try {
              const parsed = JSON.parse(bodyStr || '{}');
              message = parsed.message || '';
            } catch {
              message = '';
            }

            if (!message.trim()) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'message is required' }));
              return;
            }

            // Setup SSE headers
            res.writeHead(200, {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'X-Accel-Buffering': 'no',
            });

            const apiKey = process.env.AI_GATEWAY_API_KEY || 'sk-a3b126d30a953c022c2f5c153b39e17b5e642ad5431df542';
            const model = process.env.AI_GATEWAY_MODEL || '@makers/deepseek-v4-flash';

            // Retrieve RAG Context
            const ragResult = retrieveRagContext(message, 3);
            const systemPrompt = [
              'You are "Smart Parents AI" (Sahabat & Konsultan Parenting Cerdas), an empathetic, evidence-based AI parenting consultant deployed on EdgeOne Makers.',
              'Your primary knowledge base is grounded on the book "Parenting: Rahasia Membentuk Karakter Anak" (2023 by Maria Nona Nancy et al.) and globally recognized child development & positive discipline frameworks (Dr. Jane Nelsen, Dr. Daniel Siegel Whole-Brain Child, AAP Pediatric Guidelines).',
              '',
              'Core Guidelines:',
              '1. Tone: Empathetic, warm, reassuring, and non-judgmental. Validate parental feelings and reduce parenting guilt.',
              '2. Practical Structure: Format answers clearly with headings, bullet points, and steps (1, 2, 3).',
              '3. Conversation Scripts: Always include concrete examples: "Contoh Kalimat yang Dianjurkan" (Recommended phrases) and "Hindari Mengatakan" (Phrases to avoid).',
              '4. Grounding: Cite the relevant Chapter / Book reference from the retrieved RAG knowledge below.',
              '5. Language: Match the user\'s language (Bahasa Indonesia or English) naturally.',
              '6. Safety: For clinical emergencies or postpartum depression crisis, encourage compassionate medical/psychological support.',
              '',
              '=== RETRIEVED RAG KNOWLEDGE BASE ===',
              ragResult.promptContext || 'General authoritative and positive parenting principles apply.',
              '=====================================',
            ].join('\n');

            const payload = JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
              ],
              stream: true
            });

            // Call EdgeOne AI Gateway via direct IP fallback if local DNS issues occur
            const makeGatewayRequest = (useDirectIp = true) => {
              const options = {
                host: useDirectIp ? '43.159.104.94' : 'ai-gateway.edgeone.link',
                port: 443,
                path: '/v1/chat/completions',
                method: 'POST',
                servername: 'ai-gateway.edgeone.link',
                headers: {
                  'Host': 'ai-gateway.edgeone.link',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Length': Buffer.byteLength(payload)
                }
              };

              const gwReq = https.request(options, (gwRes) => {
                let buffer = '';
                gwRes.on('data', chunk => {
                  buffer += chunk.toString();
                  const lines = buffer.split('\n');
                  buffer = lines.pop() || '';

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed === 'data: [DONE]') {
                      res.write(`event: done\ndata: {}\n\n`);
                      continue;
                    }
                    if (trimmed.startsWith('data: ')) {
                      try {
                        const parsed = JSON.parse(trimmed.slice(6));
                        const delta = parsed?.choices?.[0]?.delta?.content;
                        if (delta) {
                          res.write(`event: text_delta\ndata: ${JSON.stringify({ delta })}\n\n`);
                        }
                      } catch {
                        // ignore parse errors on partial chunks
                      }
                    }
                  }
                });

                gwRes.on('end', () => {
                  res.write(`event: done\ndata: {}\n\n`);
                  res.end();
                });
              });

              gwReq.on('error', (err) => {
                if (useDirectIp) {
                  makeGatewayRequest(false);
                } else {
                  res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
                  res.end();
                }
              });

              gwReq.write(payload);
              gwReq.end();
            };

            makeGatewayRequest(true);
          });

          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), edgeOneDevMiddleware()],
});
