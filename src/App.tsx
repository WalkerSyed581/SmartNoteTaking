import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { ReviewModal } from './components/ReviewModal';
import { MindMapPage } from './components/MindMapPage';
import { AuthPage } from './components/auth/AuthPage';
import { useNotes } from './hooks/useNotes';
import { useAuth } from './contexts/AuthContext';
import { Note } from './types/Note';
import { Loader2, FileText, ArrowLeft, Database } from 'lucide-react';
import { generateSampleData } from './utils/sampleData';

function App() {
  const { user, loading: authLoading } = useAuth();
  
  // Show loading screen while checking auth - early return before other hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in - early return before other hooks
  if (!user) {
    return <AuthPage />;
  }

  // Only call other hooks after auth is confirmed
  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const {
    notes,
    reviewNotes,
    loading,
    error,
    createNote,
    updateNote,
    markReviewed,
    archiveNote,
    deleteNote
  } = useNotes();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);


  // Filter notes based on search query and archived status
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesArchived = note.isArchived === showArchived;
      
      return matchesSearch && matchesArchived;
    });
  }, [notes, searchQuery, showArchived]);

  const handleSaveNote = async (noteData: { title: string; content: string; tags: string[] }) => {
    if (isCreating) {
      await createNote(noteData);
    } else if (editingNote) {
      await updateNote(editingNote._id, noteData);
    }
  };

  const handleCloseEditor = () => {
    setEditingNote(null);
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setEditingNote(null);
    setShowMindMap(false); // Close mind map when creating new note
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreating(false);
    setShowMindMap(false); // Close mind map when editing note
  };

  const handleShowMindMap = () => {
    setShowMindMap(true);
    setEditingNote(null);
    setIsCreating(false);
    setShowReview(false);
  };

  const handleBackToNotes = () => {
    setShowMindMap(false);
  };

  const handleLoadSampleData = async () => {
    const sampleNotes = generateSampleData();
    try {
      for (const noteData of sampleNotes) {
        await createNote(noteData);
      }
    } catch (error) {
      console.error('Failed to load sample data:', error);
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      await markReviewed(id);
    } catch (error) {
      console.error('Failed to mark note as reviewed:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Make sure the backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  // Show mind map if requested
  if (showMindMap) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Mind Map Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBackToNotes}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Notes</span>
            </button>
          </div>
        </div>
        <MindMapPage 
          notes={notes} 
          onNoteEdit={handleEditNote}
        />
        
        {/* Note Editor Modal */}
        {(isCreating || editingNote) && (
          <NoteEditor
            note={editingNote || undefined}
            onSave={handleSaveNote}
            onClose={handleCloseEditor}
            isCreating={isCreating}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        reviewCount={reviewNotes.length}
        onNewNote={handleNewNote}
        onShowReview={() => setShowReview(true)}
        onShowMindMap={handleShowMindMap}
        showMindMapButton={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {showArchived ? 'Archived Notes' : 'Your Notes'}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            {showArchived ? 'Show Active Notes' : 'Show Archived Notes'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No notes found' : showArchived ? 'No archived notes' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or create a new note.'
                : showArchived 
                ? 'Archive some notes to see them here.'
                : 'Create your first note to get started with AI-powered learning!'
              }
            </p>
            {!searchQuery && !showArchived && (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Create Your First Note
                </button>
                <span className="text-gray-400 dark:text-gray-500">or</span>
                <button
                  onClick={handleLoadSampleData}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  <Database className="w-5 h-5" />
                  <span>Load Sample Data</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notes Grid */}
        {!loading && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={deleteNote}
                onArchive={archiveNote}
                onMarkReviewed={handleMarkReviewed}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {(isCreating || editingNote) && (
        <NoteEditor
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onClose={handleCloseEditor}
          isCreating={isCreating}
        />
      )}

      {showReview && (
        <ReviewModal
          notes={reviewNotes}
          onMarkReviewed={handleMarkReviewed}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}

export default App;