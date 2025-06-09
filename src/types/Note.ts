export interface Note {
  _id: string;
  title: string;
  content: string;
  aiSummary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nextReviewDate: string;
  reviewLevel: number;
  reviewCount: number;
  isArchived: boolean;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title: string;
  content: string;
  tags?: string[];
}