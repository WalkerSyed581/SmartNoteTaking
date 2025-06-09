import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/Note';
import { notesApi } from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async (params?: { search?: string; tags?: string; archived?: boolean }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.getAllNotes(params);
      setNotes(data);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReviewNotes = useCallback(async () => {
    try {
      const data = await notesApi.getNotesForReview();
      setReviewNotes(data);
    } catch (err) {
      console.error('Error fetching review notes:', err);
    }
  }, []);

  const createNote = useCallback(async (noteData: { title: string; content: string; tags?: string[] }) => {
    try {
      setLoading(true);
      const newNote = await notesApi.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id: string, noteData: { title: string; content: string; tags?: string[] }) => {
    try {
      setLoading(true);
      const updatedNote = await notesApi.updateNote(id, noteData);
      setNotes(prev => prev.map(note => note._id === id ? updatedNote : note));
      return updatedNote;
    } catch (err) {
      setError('Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markReviewed = useCallback(async (id: string) => {
    try {
      const updatedNote = await notesApi.markReviewed(id);
      setNotes(prev => prev.map(note => note._id === id ? updatedNote : note));
      setReviewNotes(prev => prev.filter(note => note._id !== id));
      return updatedNote;
    } catch (err) {
      setError('Failed to mark note as reviewed');
      throw err;
    }
  }, []);

  const archiveNote = useCallback(async (id: string, archived: boolean) => {
    try {
      const updatedNote = await notesApi.archiveNote(id, archived);
      setNotes(prev => prev.map(note => note._id === id ? updatedNote : note));
      return updatedNote;
    } catch (err) {
      setError('Failed to archive note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(prev => prev.filter(note => note._id !== id));
      setReviewNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      setError('Failed to delete note');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchReviewNotes();
    
    // Poll for review notes every minute
    const interval = setInterval(fetchReviewNotes, 60000);
    return () => clearInterval(interval);
  }, [fetchNotes, fetchReviewNotes]);

  return {
    notes,
    reviewNotes,
    loading,
    error,
    fetchNotes,
    fetchReviewNotes,
    createNote,
    updateNote,
    markReviewed,
    archiveNote,
    deleteNote,
  };
};