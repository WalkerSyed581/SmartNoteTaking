import React from 'react';
import { X, FileText, Tag, Calendar, Brain, Users, TrendingUp } from 'lucide-react';
import { Note } from '../types/Note';
import { MindMapNode } from '../types/MindMap';
import { getNotesForTag } from '../utils/mindMapUtils';
import { formatDistanceToNow } from 'date-fns';

interface MindMapNodeModalProps {
  selectedNode: MindMapNode;
  notes: Note[];
  onClose: () => void;
  onNoteClick: (note: Note) => void;
  relatedTags: string[];
}

export const MindMapNodeModal: React.FC<MindMapNodeModalProps> = ({
  selectedNode,
  notes,
  onClose,
  onNoteClick,
  relatedTags
}) => {
  // Get notes associated with this tag
  const tagNotes = getNotesForTag(notes, selectedNode.label);
  const recentNotes = tagNotes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Calculate statistics
  const totalWords = tagNotes.reduce((sum, note) => 
    sum + note.content.split(/\s+/).filter(word => word.length > 0).length, 0
  );
  const averageWordCount = tagNotes.length > 0 ? Math.round(totalWords / tagNotes.length) : 0;
  
  // Get unique tags from all notes with this tag
  const associatedTags = Array.from(
    new Set(
      tagNotes.flatMap(note => note.tags)
        .filter(tag => tag !== selectedNode.label)
    )
  ).slice(0, 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedNode.color }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedNode.label}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tagNotes.length} note{tagNotes.length !== 1 ? 's' : ''} • {relatedTags.length} connection{relatedTags.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Notes List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Recent Notes</span>
                </h3>
                {tagNotes.length > 5 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {Math.min(5, tagNotes.length)} of {tagNotes.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => onNoteClick(note)}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {note.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {note.aiSummary && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-3 mb-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <Brain className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI Summary</span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-300 line-clamp-2">
                          {note.aiSummary}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {note.content.substring(0, 120)}
                      {note.content.length > 120 && '...'}
                    </p>
                    
                    {note.tags.length > 1 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {note.tags.filter(tag => tag !== selectedNode.label).slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.filter(tag => tag !== selectedNode.label).length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{note.tags.filter(tag => tag !== selectedNode.label).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {tagNotes.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No notes found for this tag</p>
                </div>
              )}
            </div>

            {/* Sidebar - Statistics and Related Tags */}
            <div className="space-y-6">
              {/* Statistics */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Statistics</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Notes:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tagNotes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Words:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{totalWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Words/Note:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{averageWordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Connections:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{relatedTags.length}</span>
                  </div>
                </div>
              </div>

              {/* Related Tags */}
              {relatedTags.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Connected Tags</span>
                  </h4>
                  <div className="space-y-2">
                    {relatedTags.slice(0, 8).map((tag, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{tag}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getNotesForTag(notes, tag).filter(note => note.tags.includes(selectedNode.label)).length} shared
                          </span>
                        </div>
                      </div>
                    ))}
                    {relatedTags.length > 8 && (
                      <div className="text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{relatedTags.length - 8} more connections
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Associated Tags */}
              {associatedTags.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Other Tags</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {associatedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 