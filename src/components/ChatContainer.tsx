import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  HeartHandshake, 
  User, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  RotateCcw,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import type { Message } from '../types';
import { TopicCards } from './TopicCards';

interface ChatContainerProps {
  messages: Message[];
  isStreaming: boolean;
  onSelectTopic: (prompt: string) => void;
  onOpenLibrary: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isStreaming,
  onSelectTopic,
  onOpenLibrary,
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
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {isEmpty ? (
          /* Empty State: Welcome Hero */
          <div className="py-6 space-y-6 animate-in fade-in duration-300">
            {/* Hero Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Konsultan AI Berbasis RAG Buku Parenting Nasional</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Bagaimana Kami Dapat Membantu Pengasuhan Anak Anda Hari Ini?
              </h2>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Smart Parents AI siap mendampingi Anda dengan jawaban empatik, ilmiah, dan solutif yang merujuk langsung pada 12 Bab buku <em>"Parenting: Rahasia Membentuk Karakter Anak"</em> serta pedoman psikologi perkembangan anak global.
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-950">Evidence-Based RAG</h4>
                  <p className="text-[11px] text-teal-800/80 mt-0.5">Grounding ilmiah 12 bab karakter anak & pedoman global</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">Actionable Script</h4>
                  <p className="text-[11px] text-indigo-800/80 mt-0.5">Contoh konkret kalimat yang dianjurkan vs dihindari</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950">Empatik & Tanpa Menghakimi</h4>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">Mendukung kesehatan mental ibu & ayah tanpa rasa bersalah</p>
                </div>
              </div>
            </div>

            {/* Topic Cards Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Topik Populer yang Sering Ditanyakan
                </h3>
                <button
                  onClick={onOpenLibrary}
                  className="text-xs text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  Lihat Semua 12 Bab
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <TopicCards onSelectTopic={onSelectTopic} />
            </div>
          </div>
        ) : (
          /* Active Chat Messages */
          <div className="space-y-6">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`
                    max-w-[88%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl p-4 md:p-5 transition-all
                    ${isUser 
                      ? 'bg-gradient-to-tr from-teal-700 to-teal-600 text-white rounded-br-xs shadow-md shadow-teal-700/15' 
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-xs'}
                  `}>
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-black/5 text-[11px]">
                      <span className={`font-semibold ${isUser ? 'text-teal-100' : 'text-teal-800'}`}>
                        {isUser ? 'Orang Tua' : 'Smart Parents AI'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={isUser ? 'text-teal-200' : 'text-slate-400'}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id || String(index))}
                            className="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Salin jawaban"
                          >
                            {copiedId === (msg.id || String(index)) ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    {isUser ? (
                      <div className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="prose-parenting">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Streaming Caret Indicator */}
            {isStreaming && (
              <div className="flex gap-3 items-center text-xs text-teal-700 font-medium bg-teal-50/70 border border-teal-200/60 p-3 rounded-xl w-fit animate-pulse-subtle">
                <RotateCcw className="w-4 h-4 animate-spin text-teal-600" />
                <span>Smart Parents AI sedang menyusun jawaban berdasarkan rujukan buku parenting...</span>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
