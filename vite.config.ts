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

            const apiKey = 
              process.env.AI_GATEWAY_API_KEY || 
              process.env.API_GATEWAY_API_KEY || 
              'sk-a3b126d30a953c022c2f5c153b39e17b5e642ad5431df542';

            const model = 
              process.env.AI_GATEWAY_MODEL || 
              process.env.API_GATEWAY_MODEL || 
              '@makers/deepseek-v4-flash';

            // Retrieve RAG Context
            const ragResult = retrieveRagContext(message, 3);
            const systemPrompt = [
              'You are "Smart Parents AI" (Sahabat & Konsultan Parenting Cerdas), an empathetic, conversational, evidence-based AI parenting consultant deployed on EdgeOne Makers.',
              'Your knowledge is grounded on the national book "Parenting: Rahasia Membentuk Karakter Anak" (2023 by Maria Nona Nancy et al.) and global child psychology frameworks (Positive Discipline, Whole-Brain Child, AAP).',
              '',
              'Response Style Rules:',
              '1. Tone: Empathetic, warm, practical, and conversational like a friendly parenting expert (similar to Claude / ChatGPT). Avoid sounding robotic or like an academic textbook.',
              '2. Practical Advice: Focus immediately on answering the parent\'s concern with actionable tips, clear steps, and helpful scripts (what to say/what to avoid).',
              '3. Clean Citation Rule: Do NOT clutter the body of the response with repetitive source references or book titles. Keep the main explanation clean and natural. At the very bottom of your response, you may add a single subtle line: `*Referensi: Bab X (Judul Bab)*` only if applicable.',
              '4. Language: Answer naturally in the same language the user asks in (Bahasa Indonesia or English).',
              '5. Safety: For clinical emergencies or severe postpartum depression crisis, encourage compassionate medical/psychological support gently.',
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
                if (gwRes.statusCode && gwRes.statusCode >= 400) {
                  let errBody = '';
                  gwRes.on('data', chunk => errBody += chunk.toString());
                  gwRes.on('end', () => {
                    res.write(`event: error\ndata: ${JSON.stringify({ message: `AI Gateway status ${gwRes.statusCode}: ${errBody}` })}\n\n`);
                    res.end();
                  });
                  return;
                }

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
