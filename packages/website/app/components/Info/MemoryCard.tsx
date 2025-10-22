import React from 'react';
import { Calendar, Tag, Link as LinkIcon, Sparkles } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content?: string;
  timestamp: string;
  category?: string;
  tags?: string[];
  url?: string;
  type?: string;
  icon?: string;
  summary?: string;
}

interface MemoryCardProps {
  memory: Memory;
}

const MemoryCard = ({ memory }: MemoryCardProps) => {
  const formattedDate = new Date(memory.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'selection': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'page': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'note': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow cursor-pointer">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl">{memory.icon || '📝'}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
            {memory.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
            {memory.type && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(memory.type)}`}>
                {memory.type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {memory.summary && (
        <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">AI Summary</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {truncateText(memory.summary, 200)}
          </p>
        </div>
      )}

      {/* Content Preview */}
      {memory.content && !memory.summary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
          {truncateText(memory.content, 150)}
        </p>
      )}

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Tag className="size-3 text-gray-400" />
          {memory.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-md"
            >
              {tag}
            </span>
          ))}
          {memory.tags.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{memory.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* URL */}
      {memory.url && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate pt-2 border-t border-gray-100 dark:border-gray-700">
          <LinkIcon className="size-3 flex-shrink-0" />
          <span className="truncate">{memory.url}</span>
        </div>
      )}
    </div>
  );
};

export default MemoryCard;