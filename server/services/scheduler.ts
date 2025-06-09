import { Note, INote } from '../models/Note.js';

const REVIEW_INTERVALS = [
  60 * 60 * 1000,      // 1 hour
  24 * 60 * 60 * 1000, // 1 day
  3 * 24 * 60 * 60 * 1000, // 3 days
  7 * 24 * 60 * 60 * 1000, // 7 days
  30 * 24 * 60 * 60 * 1000 // 30 days
];

export function calculateNextReviewDate(reviewLevel: number): Date {
  if (reviewLevel >= REVIEW_INTERVALS.length) {
    // Note has completed all review cycles
    return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
  }
  
  return new Date(Date.now() + REVIEW_INTERVALS[reviewLevel]);
}

export function startScheduler() {
  console.log('🔄 Spaced repetition scheduler started');
  
  // Check every minute for notes that need review
  setInterval(async () => {
    try {
      const now = new Date();
      const notesForReview = await Note.find({
        nextReviewDate: { $lte: now },
        isArchived: false,
        reviewLevel: { $lt: 5 }
      });
      
      if (notesForReview.length > 0) {
        console.log(`📚 ${notesForReview.length} notes due for review`);
        // In a real app, you'd send notifications here
        // For now, we'll just log them
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  }, 60000); // Check every minute
}

export async function markNoteReviewed(noteId: string): Promise<INote | null> {
  const note = await Note.findById(noteId);
  if (!note) return null;
  
  note.reviewCount += 1;
  note.reviewLevel = Math.min(note.reviewLevel + 1, 5);
  note.nextReviewDate = calculateNextReviewDate(note.reviewLevel);
  
  return await note.save();
}