import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
    <div className="sticky bottom-0 pb-3 md:pb-5 pt-1 px-4 md:px-8 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Main Input Box */}
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 focus-within:border-slate-300 dark:focus-within:border-slate-600 focus-within:ring-1 focus-within:ring-slate-300 dark:focus-within:ring-slate-600 rounded-3xl px-4 py-2.5 transition-all shadow-xs"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Tanyakan apa saja seputar pengasuhan anak..."
            className="flex-1 max-h-44 min-h-[26px] bg-transparent text-slate-900 dark:text-slate-100 text-sm md:text-[15px] resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed py-1"
          />

          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                title="Hentikan"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-30 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                title="Kirim pesan"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Minimal Footer Note */}
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
          Smart Parents AI berbasis pengetahuan ilmiah. Konsultasikan ke ahli medis untuk kebutuhan klinis.
        </p>
      </div>
    </div>
  );
};
