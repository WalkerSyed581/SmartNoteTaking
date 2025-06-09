import React, { useState, useEffect } from 'react';
import { X, Save, Tag as TagIcon, Brain, Clock } from 'lucide-react';
import { Note } from '../types/Note';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: { title: string; content: string; tags: string[] }) => Promise<void>;
  onClose: () => void;
  isCreating: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onClose,
  isCreating
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      setSaving(true);
      await onSave({ title: title.trim(), content: content.trim(), tags });
      if (isCreating) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isCreating ? 'Create New Note' : 'Edit Note'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || saving}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col p-6">
            {/* Title */}
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-2xl font-bold text-gray-900 dark:text-white border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 mb-4 bg-transparent"
            />

            {/* Tags */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full flex items-center space-x-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      <span>{tag}</span>
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <textarea
                placeholder="Start writing your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Sidebar */}
          {note && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
              {/* AI Summary */}
              {note.aiSummary && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Summary</h3>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{note.aiSummary}</p>
                  </div>
                </div>
              )}

              {/* Review Stats */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Review Progress</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Review Level:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{note.reviewLevel}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Times Reviewed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{note.reviewCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Next Review:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(note.nextReviewDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Note Info</h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="text-gray-900 dark:text-white">{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Modified:</span>
                    <span className="text-gray-900 dark:text-white">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Words:</span>
                    <span className="text-gray-900 dark:text-white">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};