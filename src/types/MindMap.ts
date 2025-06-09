export interface MindMapNode {
  id: string;
  label: string;
  type: 'tag' | 'note';
  size: number;
  color: string;
  x?: number;
  y?: number;
  noteIds?: string[];
  noteCount?: number;
}

export interface MindMapLink {
  source: string;
  target: string;
  strength: number;
  color: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  links: MindMapLink[];
}

export interface TagCluster {
  tag: string;
  notes: string[];
  relatedTags: { tag: string; commonNotes: number }[];
} 