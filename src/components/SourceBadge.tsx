import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface SourceBadgeProps {
  citation: string;
  onClick?: () => void;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ citation, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200/80 hover:bg-teal-100/80 transition-all cursor-pointer group shadow-2xs my-1.5"
      title="Rujukan ilmiah buku parenting"
    >
      <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
      <span className="truncate max-w-xs md:max-w-md">{citation}</span>
      <ExternalLink className="w-3 h-3 text-teal-500 opacity-70 group-hover:opacity-100 shrink-0" />
    </div>
  );
};
