import React, { useState } from 'react';
import { X, BookOpen, Search, ShieldCheck, Globe, BookMarked } from 'lucide-react';
import { PARENTING_SOURCES, POPULAR_TOPICS } from '../lib/ragKnowledge';

interface SourceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskTopic: (prompt: string) => void;
}

export const SourceLibraryModal: React.FC<SourceLibraryModalProps> = ({
  isOpen,
  onClose,
  onAskTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSources = PARENTING_SOURCES.filter(
    s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/80 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                Pusat RAG & Sumber Referensi Parenting
              </h3>
              <p className="text-xs text-slate-500">
                Basis pengetahuan multi-sumber (Bahasa Indonesia & Internasional)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari buku, bab, kata kunci atau topik parenting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Daftar Buku & Pedoman Terintegrasi ({filteredSources.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                      {source.language === 'id' ? (
                        <>
                          <BookMarked className="w-3 h-3 text-teal-600" />
                          Bahasa Indonesia
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-indigo-600" />
                          English / Global
                        </>
                      )}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{source.year}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">
                    {source.title}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2 italic">
                    {source.author}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {source.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{source.chaptersCount} Bab / Modul</span>
                  <span className="text-teal-600 font-medium">Terverifikasi RAG</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Chapter Matrix */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              12 Bab Buku Referensi Karakter Anak
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {POPULAR_TOPICS.map((topic, index) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    onAskTopic(topic.prompt);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-teal-200 bg-slate-50/70 hover:bg-teal-50/60 text-left transition-all group cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900 truncate">
                    {index + 1}. {topic.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {topic.chapter}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Siap ditambahkan file PDF baru kapan saja melalui direktori sumber</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
