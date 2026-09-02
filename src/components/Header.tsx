import React from 'react';
import { 
  Menu,
  SquarePen,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
  onExportPdf?: () => void;
  canExport?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isStreaming?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onToggleSidebar,
  onExportPdf,
  canExport = false,
  theme,
  onToggleTheme,
  isStreaming = false,
}) => {
  return (
    <header className="sticky top-0 z-20 h-13 px-3 md:px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
      {/* Left: Sidebar Toggle & App Name */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100 tracking-tight">
            Smart Parents AI
          </span>
        </div>
      </div>

      {/* Right: Actions (Export PDF, Theme, New Chat) */}
      <div className="flex items-center gap-1.5">
        {onExportPdf && (
          <button
            onClick={onExportPdf}
            disabled={!canExport || isStreaming}
            aria-label="Ekspor Chat ke PDF"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Ekspor Chat ke PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Ekspor PDF</span>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        <button
          onClick={onNewChat}
          disabled={isStreaming}
          aria-label="Obrolan Baru"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer disabled:opacity-50"
          title="Obrolan Baru"
        >
          {isStreaming ? (
            <RotateCcw className="w-3.5 h-3.5 animate-spin text-teal-600" />
          ) : (
            <SquarePen className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Obrolan Baru</span>
        </button>
      </div>
    </header>
  );
};
