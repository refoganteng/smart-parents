import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Plus, 
  BookOpen, 
  Sparkles, 
  Menu,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  onOpenLibrary: () => void;
  onOpenToolkit: () => void;
  onToggleMobileSidebar: () => void;
  isStreaming?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onOpenLibrary,
  onOpenToolkit,
  onToggleMobileSidebar,
  isStreaming = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 lg:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Buka Menu"
            className="p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base md:text-lg tracking-tight">
                  Smart Parents AI
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  RAG Parenting 2023
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-500 hidden sm:block">
                Konsultan & Sahabat Pengasuhan Karakter Anak Terpercaya
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLibrary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50/80 border border-slate-200 hover:border-teal-200 transition-all cursor-pointer shadow-xs"
            title="Lihat Basis Pengetahuan & Buku Referensi"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span className="hidden md:inline">Sumber Buku</span>
          </button>

          <button
            onClick={onOpenToolkit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer shadow-xs"
            title="Latihan Dialog & Tes Gaya Asuh"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Parenting Tools</span>
          </button>

          <button
            onClick={onNewChat}
            disabled={isStreaming}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-97 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shadow-teal-600/25"
          >
            {isStreaming ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Sesi Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
