import React from 'react';
import { X, Clock, Brain, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Note } from '../types/Note';

interface ReviewModalProps {
  notes: Note[];
  onMarkReviewed: (id: string) => void;
  onClose: () => void;
}

const getReviewLevelColor = (level: number) => {
  const colors = [
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  ];
  return colors[Math.min(level, colors.length - 1)];
};

const getReviewLevelText = (level: number) => {
  const labels = ['First Review (1h)', 'Daily Review', '3-Day Review', 'Weekly Review', 'Monthly Review'];
  return labels[Math.min(level, labels.length - 1)];
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  notes,
  onMarkReviewed,
  onClose
}) => {
  if (notes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">All Caught Up!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No notes are due for review right now.</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Time!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{notes.length} note{notes.length !== 1 ? 's' : ''} ready for review</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notes.map((note) => {
            const isOverdue = new Date(note.nextReviewDate) <= new Date();
            const overdueTime = isOverdue ? formatDistanceToNow(new Date(note.nextReviewDate), { addSuffix: true }) : null;

            return (
              <div
                key={note._id}
                className={`border rounded-xl p-5 transition-all duration-200 ${
                  isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{note.title}</h3>
                    
                    {/* AI Summary - Prominent display */}
                    {note.aiSummary && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">AI Summary</span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{note.aiSummary}</p>
                      </div>
                    )}
                    
                    {/* Content preview - smaller */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {note.content.substring(0, 150)}
                      {note.content.length > 150 && '...'}
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getReviewLevelColor(note.reviewLevel)}`}>
                        {getReviewLevelText(note.reviewLevel)}
                      </span>
                      {overdueTime && (
                        <div className="flex items-center space-x-1 text-xs text-red-600 dark:text-red-400">
                          <Clock className="w-3 h-3" />
                          <span>Due {overdueTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onMarkReviewed(note._id)}
                    className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Reviewed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Regular reviews help improve long-term retention
            </div>
            <button
              onClick={() => {
                notes.forEach(note => onMarkReviewed(note._id));
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark All Reviewed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};