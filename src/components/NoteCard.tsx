import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Tag, Brain, Archive, Trash2, Eye } from 'lucide-react';
import { Note } from '../types/Note';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
  onMarkReviewed: (id: string) => void;
}

const getReviewLevelColor = (level: number) => {
  const colors = [
    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',    // 1 hour
    'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', // 1 day
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', // 3 days
    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',     // 7 days
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',   // 30 days
    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'  // Completed
  ];
  return colors[Math.min(level, colors.length - 1)];
};

const getReviewLevelText = (level: number) => {
  const labels = ['1 Hour', '1 Day', '3 Days', '7 Days', '30 Days', 'Mastered'];
  return labels[Math.min(level, labels.length - 1)];
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onArchive,
  onMarkReviewed
}) => {
  const isOverdue = new Date(note.nextReviewDate) <= new Date() && note.reviewLevel < 5;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
      isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{note.title}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onArchive(note._id, !note.isArchived)}
              className="p-1.5 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Summary - Show prominently if available */}
        {note.aiSummary && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">AI Summary</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{note.aiSummary}</p>
          </div>
        )}

        {/* Content Preview - Smaller since AI summary is more prominent */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {note.content.substring(0, 100)}
            {note.content.length > 100 && '...'}
          </p>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReviewLevelColor(note.reviewLevel)}`}>
              {getReviewLevelText(note.reviewLevel)}
            </span>
          </div>

          {isOverdue && (
            <button
              onClick={() => onMarkReviewed(note._id)}
              className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark Reviewed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};