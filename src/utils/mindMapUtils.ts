import { Note } from '../types/Note';
import { MindMapData, MindMapNode, MindMapLink, TagCluster } from '../types/MindMap';

/**
 * Generates a color based on a string (tag name)
 */
export const generateColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

/**
 * Calculates similarity between two tags based on common notes
 */
export const calculateTagSimilarity = (tag1Notes: string[], tag2Notes: string[]): number => {
  const intersection = tag1Notes.filter(note => tag2Notes.includes(note));
  const union = [...new Set([...tag1Notes, ...tag2Notes])];
  return intersection.length / union.length; // Jaccard similarity
};

/**
 * Groups notes by tags and identifies tag relationships
 */
export const analyzeTagClusters = (notes: Note[]): TagCluster[] => {
  const tagToNotes: Record<string, string[]> = {};
  
  // Group notes by tags
  notes.forEach(note => {
    if (!note.isArchived) {
      note.tags.forEach(tag => {
        if (!tagToNotes[tag]) {
          tagToNotes[tag] = [];
        }
        tagToNotes[tag].push(note._id);
      });
    }
  });

  // Calculate relationships between tags
  const clusters: TagCluster[] = [];
  const tagNames = Object.keys(tagToNotes);

  tagNames.forEach(tag => {
    const relatedTags: { tag: string; commonNotes: number }[] = [];
    
    tagNames.forEach(otherTag => {
      if (tag !== otherTag) {
        const commonNotes = tagToNotes[tag].filter(noteId => 
          tagToNotes[otherTag].includes(noteId)
        ).length;
        
        if (commonNotes > 0) {
          relatedTags.push({ tag: otherTag, commonNotes });
        }
      }
    });

    // Sort by number of common notes
    relatedTags.sort((a, b) => b.commonNotes - a.commonNotes);

    clusters.push({
      tag,
      notes: tagToNotes[tag],
      relatedTags
    });
  });

  return clusters.sort((a, b) => b.notes.length - a.notes.length);
};

/**
 * Generates mind map data from note clusters
 */
export const generateMindMapData = (notes: Note[], minTagSize: number = 2): MindMapData => {
  const clusters = analyzeTagClusters(notes);
  const nodes: MindMapNode[] = [];
  const links: MindMapLink[] = [];

  // Filter out tags with too few notes
  const significantClusters = clusters.filter(cluster => cluster.notes.length >= minTagSize);

  // Create nodes for tags
  significantClusters.forEach(cluster => {
    const size = Math.min(Math.max(cluster.notes.length * 10, 20), 80);
    nodes.push({
      id: `tag-${cluster.tag}`,
      label: cluster.tag,
      type: 'tag',
      size,
      color: generateColor(cluster.tag),
      noteIds: cluster.notes,
      noteCount: cluster.notes.length
    });
  });

  // Create links between related tags
  significantClusters.forEach(cluster => {
    cluster.relatedTags.forEach(related => {
      // Only create link if the related tag is also significant
      const relatedCluster = significantClusters.find(c => c.tag === related.tag);
      if (relatedCluster) {
        const sourceId = `tag-${cluster.tag}`;
        const targetId = `tag-${related.tag}`;
        
        // Avoid duplicate links
        const existingLink = links.find(link => 
          (link.source === sourceId && link.target === targetId) ||
          (link.source === targetId && link.target === sourceId)
        );

        if (!existingLink && related.commonNotes > 0) {
          const strength = related.commonNotes / Math.max(cluster.notes.length, relatedCluster.notes.length);
          const color = `rgba(107, 114, 128, ${Math.min(strength * 2, 0.8)})`;
          
          links.push({
            source: sourceId,
            target: targetId,
            strength: strength * 100,
            color
          });
        }
      }
    });
  });

  return { nodes, links };
};

/**
 * Positions nodes in a circular layout
 */
export const calculateNodePositions = (nodes: MindMapNode[], width: number, height: number): MindMapNode[] => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
};

/**
 * Finds notes that contain specific tags
 */
export const getNotesForTag = (notes: Note[], tag: string): Note[] => {
  return notes.filter(note => 
    !note.isArchived && note.tags.includes(tag)
  );
};

/**
 * Gets all unique tags from notes
 */
export const getAllTags = (notes: Note[]): string[] => {
  const allTags = notes
    .filter(note => !note.isArchived)
    .flatMap(note => note.tags);
  return [...new Set(allTags)].sort();
}; 