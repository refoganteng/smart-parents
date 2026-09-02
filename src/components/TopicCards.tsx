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
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { POPULAR_TOPICS } from '../lib/ragKnowledge';

interface TopicCardsProps {
  onSelectTopic: (prompt: string) => void;
}

const getTopicIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame': return <Flame className="w-5 h-5 text-amber-600" />;
    case 'Smartphone': return <Smartphone className="w-5 h-5 text-teal-600" />;
    case 'MessageSquareQuote': return <MessageSquareQuote className="w-5 h-5 text-indigo-600" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-sky-600" />;
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-rose-600" />;
    case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    case 'HelpCircle': return <HelpCircle className="w-5 h-5 text-emerald-600" />;
    case 'Users': return <Users className="w-5 h-5 text-purple-600" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-blue-600" />;
    default: return <BookMarked className="w-5 h-5 text-teal-600" />;
  }
};

export const TopicCards: React.FC<TopicCardsProps> = ({ onSelectTopic }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-6">
      {POPULAR_TOPICS.slice(0, 6).map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelectTopic(topic.prompt)}
          className="p-4 rounded-2xl border border-slate-200/80 bg-white/90 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all text-left group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-teal-50/80 transition-colors">
                {getTopicIcon(topic.icon)}
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {topic.ageGroup}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs md:text-sm group-hover:text-teal-900 transition-colors">
              {topic.title}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {topic.prompt}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-teal-700">
            <span className="truncate text-slate-400 text-[10px]">{topic.chapter}</span>
            <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Tanyakan
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
