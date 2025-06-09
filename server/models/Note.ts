import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  aiSummary?: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  nextReviewDate: Date;
  reviewLevel: number; // 0: 1hr, 1: 1day, 2: 3days, 3: 7days, 4: 1month, 5: completed
  reviewCount: number;
  isArchived: boolean;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  aiSummary: {
    type: String,
    maxlength: 1000
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nextReviewDate: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
  },
  reviewLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
noteSchema.index({ userId: 1, nextReviewDate: 1, isArchived: 1 });
noteSchema.index({ userId: 1, title: 'text', content: 'text' });

export const Note = mongoose.model<INote>('Note', noteSchema);