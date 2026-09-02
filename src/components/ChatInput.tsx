import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const QUICK_PROMPT_PILLS = [
  'Cara mengatasi anak tantrum di mall',
  'Aturan screen time usia 3-6 tahun',
  'Membagi peran asuh dengan suami',
  'Merespon pertanyaan kritis anak',
  'Beda pola asuh dengan mertua',
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStop,
  isStreaming,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming || disabled) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 md:p-4 transition-all">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            Saran:
          </span>
          {QUICK_PROMPT_PILLS.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSendMessage(pill);
              }}
              disabled={isStreaming}
              className="px-2.5 py-1 rounded-full bg-slate-100/90 hover:bg-teal-50 hover:text-teal-800 text-slate-600 border border-slate-200/60 hover:border-teal-200 shrink-0 text-[11px] transition-all cursor-pointer disabled:opacity-50"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-2xl p-2 transition-all shadow-xs">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Tanyakan masalah pengasuhan anak (misal: tantrum, screen time, emosi, co-parenting)..."
            className="flex-1 max-h-40 min-h-[40px] bg-transparent text-slate-800 text-xs md:text-sm resize-none outline-none px-2 py-2 placeholder:text-slate-400 leading-relaxed"
          />

          <div className="flex items-center gap-1.5 pb-1 pr-1">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all shadow-sm cursor-pointer"
                title="Hentikan pembuatan jawaban"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all shadow-sm disabled:shadow-none cursor-pointer"
                title="Kirim pertanyaan"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Tekan <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-[10px]">Enter</kbd> untuk kirim, <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-[10px]">Shift + Enter</kbd> baris baru</span>
          <span className="hidden sm:inline">Rujukan 12 Bab Buku Parenting 2023</span>
        </div>
      </div>
    </div>
  );
};
