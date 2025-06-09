import axios from 'axios';
import { Note, CreateNoteData, UpdateNoteData } from '../types/Note';

const API_BASE_URL = 'http://localhost:8484/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  getCurrentUser: async (token: string) => {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updatePreferences: async (preferences: { darkMode?: boolean; name?: string }, token: string) => {
    const response = await api.patch('/auth/preferences', preferences, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export const notesApi = {
  // Get all notes
  getAllNotes: async (params?: { search?: string; tags?: string; archived?: boolean }): Promise<Note[]> => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Get notes due for review
  getNotesForReview: async (): Promise<Note[]> => {
    const response = await api.get('/notes/due-for-review');
    return response.data;
  },

  // Get single note
  getNote: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create note
  createNote: async (data: CreateNoteData): Promise<Note> => {
    const response = await api.post('/notes', data);
    return response.data;
  },

  // Update note
  updateNote: async (id: string, data: UpdateNoteData): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  // Mark note as reviewed
  markReviewed: async (id: string): Promise<Note> => {
    const response = await api.post(`/notes/${id}/review`);
    return response.data;
  },

  // Archive/unarchive note
  archiveNote: async (id: string, archived: boolean): Promise<Note> => {
    const response = await api.patch(`/notes/${id}/archive`, { archived });
    return response.data;
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};