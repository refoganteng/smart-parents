import React from 'react';
import { 
  Flame, 
  Smartphone, 
  MessageSquareQuote, 
  ShieldCheck, 
  HeartHandshake, 
  AlertTriangle, 
  HelpCircle, 
  Users, 
  Sparkles, 
  X, 
  BookOpen, 
  MessageCircle,
  Trash2,
  BookMarked
} from 'lucide-react';
import { POPULAR_TOPICS } from '../lib/ragKnowledge';
import type { ChatSessionMeta } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (prompt: string) => void;
  sessions: ChatSessionMeta[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenLibrary: () => void;
  onOpenToolkit: () => void;
}

const getTopicIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame': return <Flame className="w-4 h-4 text-amber-600" />;
    case 'Smartphone': return <Smartphone className="w-4 h-4 text-teal-600" />;
    case 'MessageSquareQuote': return <MessageSquareQuote className="w-4 h-4 text-indigo-600" />;
    case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-sky-600" />;
    case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-rose-600" />;
    case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    case 'HelpCircle': return <HelpCircle className="w-4 h-4 text-emerald-600" />;
    case 'Users': return <Users className="w-4 h-4 text-purple-600" />;
    case 'Sparkles': return <Sparkles className="w-4 h-4 text-blue-600" />;
    default: return <BookMarked className="w-4 h-4 text-teal-600" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onOpenLibrary,
  onOpenToolkit,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 md:w-80 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-slate-800 text-sm">Pusat Konsultasi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Quick Actions / Featured Toolkit */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Fitur Cerdas
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { onOpenToolkit(); onClose(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-900 hover:bg-indigo-50/80 transition-all text-left group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Roleplay & Tes Gaya Asuh</div>
                  <div className="text-[10px] text-slate-500">Latihan dialog & evaluasi mandiri</div>
                </div>
              </button>

              <button
                onClick={() => { onOpenLibrary(); onClose(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-teal-900 hover:bg-teal-50/80 transition-all text-left group"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Koleksi Buku & RAG</div>
                  <div className="text-[10px] text-slate-500">12 Bab buku parenting nasional</div>
                </div>
              </button>
            </div>
          </div>

          {/* 12 Core Parenting Topics */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Topik Pengasuhan (12 Bab)
            </div>
            <div className="space-y-1">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.prompt);
                    onClose();
                  }}
                  className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100/80 hover:text-teal-800 transition-all text-left group cursor-pointer"
                >
                  <div className="p-1 rounded-md bg-slate-100 group-hover:bg-white transition-colors mt-0.5 shrink-0">
                    {getTopicIcon(topic.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-slate-800 group-hover:text-teal-900">
                      {topic.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {topic.chapter}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Sessions History */}
          {sessions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
                Riwayat Sesi
              </div>
              <div className="space-y-1">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectSession(s.id);
                      onClose();
                    }}
                    className={`
                      group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all
                      ${s.id === currentSessionId 
                        ? 'bg-teal-50 text-teal-900 font-medium border border-teal-200/70' 
                        : 'text-slate-600 hover:bg-slate-100'}
                    `}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <MessageCircle className={`w-3.5 h-3.5 shrink-0 ${s.id === currentSessionId ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="truncate">{s.title || 'Sesi Diskusi'}</span>
                    </div>
                    <button
                      onClick={(e) => onDeleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all"
                      title="Hapus sesi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>EdgeOne Gateway Online</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">DeepSeek-v4</span>
        </div>
      </aside>
    </>
  );
};
