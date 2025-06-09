import express from 'express';
import { Note } from '../models/Note.js';
import { AIService } from '../services/aiService.js';
import { markNoteReviewed } from '../services/scheduler.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all notes for authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { search, tags, archived } = req.query;
    let query: any = { userId: req.user._id };
    
    if (archived !== 'true') {
      query.isArchived = false;
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }
    
    if (tags) {
      const tagArray = (tags as string).split(',');
      query.tags = { $in: tagArray };
    }
    
    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .limit(100);
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get notes due for review for authenticated user
router.get('/due-for-review', async (req: AuthRequest, res) => {
  try {
    const now = new Date();
    const notes = await Note.find({
      userId: req.user._id,
      nextReviewDate: { $lte: now },
      isArchived: false,
      reviewLevel: { $lt: 5 }
    }).sort({ nextReviewDate: 1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review notes' });
  }
});

// Get single note for authenticated user
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create note for authenticated user
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.user._id
    });
    
    // Generate AI summary with title, tags, and content
    try {
      note.aiSummary = await AIService.generateSummary(content, title, tags);
    } catch (error) {
      console.error('AI summary generation failed:', error);
    }
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note for authenticated user
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const contentChanged = content !== note.content;
    
    note.title = title;
    note.content = content;
    note.tags = tags || [];
    
    // Regenerate AI summary if content changed
    if (contentChanged) {
      try {
        note.aiSummary = await AIService.generateSummary(content, title, tags);
      } catch (error) {
        console.error('AI summary generation failed:', error);
      }
    }
    
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Mark note as reviewed for authenticated user
router.post('/:id/review', async (req: AuthRequest, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    const updatedNote = await markNoteReviewed(req.params.id);
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark note as reviewed' });
  }
});

// Archive/unarchive note for authenticated user
router.patch('/:id/archive', async (req: AuthRequest, res) => {
  try {
    const { archived } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isArchived: archived },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive note' });
  }
});

// Delete note for authenticated user
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;