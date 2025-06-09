# Mind Map Feature Documentation

## Overview

The Mind Map feature visualizes relationships between notes based on shared tags, providing an interactive way to explore knowledge connections and discover patterns in your note collection.

## Features

### 🧠 Interactive Visualization
- **Node-based graph**: Each tag is represented as a colored node
- **Connection lines**: Links show relationships between tags based on shared notes
- **Dynamic sizing**: Node sizes reflect the number of notes with that tag
- **Color coding**: Each tag gets a unique, consistent color
- **Interactive controls**: Click, hover, and pan through the visualization

### 🔍 Tag Analysis
- **Similarity calculation**: Uses Jaccard similarity to determine tag relationships
- **Cluster analysis**: Groups related tags based on note overlap
- **Statistical insights**: Shows tag usage patterns and connections
- **Filtering options**: Adjust minimum notes per tag to focus on significant relationships

### 📊 Details Panel
- **Tag information**: View note count and related tags
- **Recent notes**: See the latest notes for any selected tag
- **Quick access**: Click any note to edit it directly
- **Related tags**: Discover connected topics and themes

### ⚙️ Customization
- **Filter controls**: Set minimum notes per tag (1, 2, 3, 5, 10)
- **Responsive design**: Adapts to different screen sizes
- **Dark mode support**: Works seamlessly with the app's theme
- **Real-time updates**: Reflects changes as you add or modify notes

## Technical Implementation

### Core Components

1. **MindMapPage.tsx**: Main container component with controls and layout
2. **MindMapVisualization.tsx**: SVG-based interactive visualization
3. **TagDetailsPanel.tsx**: Side panel showing selected tag information
4. **mindMapUtils.ts**: Utility functions for data processing and analysis

### Data Processing

```typescript
// Tag clustering analysis
const clusters = analyzeTagClusters(notes);

// Mind map data generation
const mindMapData = generateMindMapData(notes, minTagSize);

// Node positioning
const positionedNodes = calculateNodePositions(nodes, width, height);
```

### Algorithms Used

- **Jaccard Similarity**: Measures tag relationship strength
- **Circular Layout**: Positions nodes in a readable circle arrangement
- **Force-directed principles**: Links connect related tags with appropriate opacity

## Usage Guide

### Getting Started

1. **Access Mind Map**: Click the network icon (🔗) in the header
2. **Load Sample Data**: If you have no notes, use "Load Sample Data" to populate with examples
3. **Explore Connections**: Hover over nodes to highlight connections
4. **View Details**: Click any node to see detailed information

### Best Practices

- **Use consistent tags**: Similar concepts should use the same tag name
- **Create overlapping tags**: Notes with multiple shared tags create stronger connections
- **Regular review**: Use the mind map to discover gaps in your knowledge
- **Tag refinement**: Merge similar tags to create clearer relationships

### Sample Data

The app includes 20 sample notes covering:
- **Programming**: JavaScript, Python, React, Node.js
- **Web Development**: CSS, HTML, REST APIs, Security
- **Data Science**: Machine Learning, Algorithms, Database Design
- **Development Practices**: Git, Docker, Agile, Testing

## Mind Map Insights

### What You Can Discover

1. **Knowledge Clusters**: Groups of related topics you're studying
2. **Learning Gaps**: Areas where you have few notes or connections
3. **Core Concepts**: Tags that appear in many notes (large nodes)
4. **Cross-disciplinary Connections**: Unexpected relationships between topics

### Visual Indicators

- **Node Size**: Proportional to number of notes (min 20px, max 80px)
- **Link Thickness**: Reflects strength of relationship between tags
- **Link Opacity**: Stronger connections have more opaque lines
- **Color Consistency**: Each tag maintains the same color across sessions

## Advanced Features

### Filtering and Controls

- **Minimum Tag Size**: Hide tags with few notes to focus on main topics
- **Interactive Highlighting**: Hover to see immediate connections
- **Click Selection**: Select nodes for detailed exploration
- **Responsive Layout**: Auto-adjusts to container size

### Integration Points

- **Note Editor**: Open notes directly from the mind map
- **Search Integration**: Find notes by tag from the main interface
- **Theme Support**: Respects dark/light mode preferences

## Performance Considerations

- **Optimized Rendering**: Only renders visible elements
- **Efficient Algorithms**: O(n²) complexity for small to medium datasets
- **Memory Management**: Cleanup on component unmount
- **Responsive Updates**: Debounced resize handling

## Future Enhancements

- **3D Visualization**: Three-dimensional node arrangements
- **Custom Layouts**: Tree, hierarchical, or force-directed layouts
- **Export Options**: Save mind maps as images or data files
- **Collaborative Features**: Share mind maps with other users
- **AI Suggestions**: Recommend tags or connections based on content

---

*The Mind Map feature transforms your notes from a flat list into an interconnected knowledge graph, helping you see the bigger picture of your learning journey.* 