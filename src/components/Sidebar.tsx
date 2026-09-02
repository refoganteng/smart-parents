import React from 'react';
import { 
  SquarePen, 
  MessageSquare, 
  Trash2, 
  X, 
  PanelLeftClose
} from 'lucide-react';
import type { ChatSessionMeta } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  sessions: ChatSessionMeta[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 lg:hidden transition-opacity backdrop-blur-2xs"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-68 md:w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:border-r-0 lg:overflow-hidden'}
      `}>
        {/* Top: New Chat & Close Sidebar */}
        <div className="p-3 flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-all shadow-2xs cursor-pointer"
          >
            <SquarePen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Obrolan Baru</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <PanelLeftClose className="w-4 h-4 hidden lg:block" />
            <X className="w-4 h-4 lg:hidden" />
          </button>
        </div>

        {/* Sessions History List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Riwayat Percakapan
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-400 dark:text-slate-600">
              Belum ada riwayat percakapan.
            </div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === currentSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`
                    group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-slate-200/80 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-medium' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'}`} />
                    <span className="truncate">{s.title || 'Percakapan Baru'}</span>
                  </div>

                  <button
                    onClick={(e) => onDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-300/60 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer shrink-0"
                    title="Hapus sesi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Status / Branding */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>EdgeOne AI</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">DeepSeek-v4</span>
        </div>
      </aside>
    </>
  );
};
