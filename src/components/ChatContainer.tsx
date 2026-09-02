import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import type { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
  isStreaming: boolean;
  onSelectTopic: (prompt: string) => void;
}

const CLEAN_SUGGESTIONS = [
  'Bagaimana cara tenang menghadapi anak tantrum di tempat umum?',
  'Berapa batas waktu screen time yang sehat untuk anak?',
  'Bagaimana cara membagi peran pengasuhan (co-parenting) dengan pasangan?',
  'Bagaimana merespon pertanyaan kritis dan sensitif dari anak?',
];

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isStreaming,
  onSelectTopic,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-between">
        {isEmpty ? (
          /* Minimalist Empty State (like Claude / ChatGPT) */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 md:py-20 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-600/10 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
              Apa yang ingin Anda diskusikan tentang si kecil hari ini?
            </h2>

            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
              Konsultan parenting cerdas dan empatik yang siap membantu pola asuh, regulasi emosi, tantrum, hingga screen time anak.
            </p>

            {/* Simple Clean Suggestion Pills */}
            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {CLEAN_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectTopic(item)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-teal-500/50 dark:hover:border-teal-500/40 text-xs text-slate-700 dark:text-slate-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="line-clamp-2 pr-2 leading-relaxed">{item}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="space-y-6 pb-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const isLast = index === messages.length - 1;

              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3.5 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble / Content */}
                  <div className={`
                    max-w-[90%] sm:max-w-[85%] md:max-w-[82%]
                    ${isUser 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-2xl rounded-br-xs' 
                      : 'text-slate-900 dark:text-slate-100 py-1 flex-1'}
                  `}>
                    {/* User Text */}
                    {isUser ? (
                      <div className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      /* Assistant Markdown Content */
                      <div className="space-y-2">
                        <div className="prose-minimal text-slate-800 dark:text-slate-200">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                          {isStreaming && isLast && (
                            <span className="streaming-caret" />
                          )}
                        </div>

                        {/* Actions (Copy button) */}
                        {msg.content && !isStreaming && (
                          <div className="flex items-center gap-2 pt-1 text-slate-400 dark:text-slate-500">
                            <button
                              onClick={() => handleCopy(msg.content, msg.id || String(index))}
                              className="inline-flex items-center gap-1 text-[11px] p-1 rounded hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Salin jawaban"
                            >
                              {copiedId === (msg.id || String(index)) ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* In-Flight Streaming indicator if no token received yet */}
            {isStreaming && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 py-2">
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-teal-600 dark:text-teal-400" />
                <span>Smart Parents AI sedang berpikir...</span>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
