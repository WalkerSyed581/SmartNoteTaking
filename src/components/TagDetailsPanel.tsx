import React from 'react';
import { X, FileText, Tag, Calendar, ArrowRight } from 'lucide-react';
import { Note } from '../types/Note';
import { MindMapNode } from '../types/MindMap';
import { getNotesForTag } from '../utils/mindMapUtils';
import { formatDistanceToNow } from 'date-fns';

interface TagDetailsPanelProps {
  selectedNode: MindMapNode | null;
  notes: Note[];
  onClose: () => void;
  onNoteClick: (note: Note) => void;
  relatedTags: string[];
}

export const TagDetailsPanel: React.FC<TagDetailsPanelProps> = ({
  selectedNode,
  notes,
  onClose,
  onNoteClick,
  relatedTags
}) => {
  if (!selectedNode) return null;

  const tagNotes = getNotesForTag(notes, selectedNode.label);
  const recentNotes = tagNotes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedNode.color }}
          >
            <Tag className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedNode.label}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedNode.noteCount} note{selectedNode.noteCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Related Tags */}
      {relatedTags.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Related Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {relatedTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {relatedTags.length > 6 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{relatedTags.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Recent Notes
        </h4>
        <div className="space-y-3">
          {recentNotes.map((note) => (
            <div
              key={note._id}
              className="group cursor-pointer border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => onNoteClick(note)}
            >
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {note.title}
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {note.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {tagNotes.length > 5 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{tagNotes.length - 5} more notes with this tag
            </span>
          </div>
        )}

        {tagNotes.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notes found with this tag
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 