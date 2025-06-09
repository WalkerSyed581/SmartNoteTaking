import React, { useState, useMemo, useEffect } from 'react';
import { Brain, Settings, RefreshCw, Info, Filter } from 'lucide-react';
import { Note } from '../types/Note';
import { MindMapNode } from '../types/MindMap';
import { MindMapVisualization } from './MindMapVisualization';
import { MindMapNodeModal } from './MindMapNodeModal';
import { generateMindMapData, analyzeTagClusters, getAllTags } from '../utils/mindMapUtils';

interface MindMapPageProps {
  notes: Note[];
  onNoteEdit: (note: Note) => void;
}

export const MindMapPage: React.FC<MindMapPageProps> = ({
  notes,
  onNoteEdit
}) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MindMapNode | null>(null);
  const [minTagSize, setMinTagSize] = useState(2);
  const [showControls, setShowControls] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Generate mind map data
  const mindMapData = useMemo(() => {
    return generateMindMapData(notes, minTagSize);
  }, [notes, minTagSize]);

  // Analyze tag clusters for additional insights
  const tagClusters = useMemo(() => {
    return analyzeTagClusters(notes);
  }, [notes]);

  // Get related tags for selected node
  const relatedTags = useMemo(() => {
    if (!selectedNode) return [];
    const cluster = tagClusters.find(c => c.tag === selectedNode.label);
    return cluster?.relatedTags.map(rt => rt.tag) || [];
  }, [selectedNode, tagClusters]);

  // Update container size on window resize
  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById('mindmap-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        setContainerSize({
          width: rect.width || 800,
          height: Math.max(rect.height || 600, 500)
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleNodeClick = (node: MindMapNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const handleNodeHover = (node: MindMapNode | null) => {
    setHoveredNode(node);
  };

  const handleNoteClick = (note: Note) => {
    onNoteEdit(note);
  };

  const allTags = getAllTags(notes);
  const activeTags = mindMapData.nodes.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mind Map</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Visualize tag relationships
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{activeTags}</span> active tags
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{allTags.length}</span> total tags
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{notes.filter(n => !n.isArchived).length}</span> notes
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className={`p-2 rounded-lg transition-colors ${
                  showControls 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          {showControls && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Min notes per tag:
                  </label>
                  <select
                    value={minTagSize}
                    onChange={(e) => setMinTagSize(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Info className="w-4 h-4" />
                  <span>Click nodes to see details • Hover to highlight connections</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Mind Map Visualization */}
          <div className="flex-1">
            <div 
              id="mindmap-container"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{ minHeight: '600px' }}
            >
              {mindMapData.nodes.length > 0 ? (
                <MindMapVisualization
                  data={mindMapData}
                  width={containerSize.width}
                  height={containerSize.height}
                  onNodeClick={handleNodeClick}
                  onNodeHover={handleNodeHover}
                  selectedNodeId={selectedNode?.id}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No tag connections found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create more notes with similar tags to see mind map visualization.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Current filter: At least {minTagSize} note{minTagSize !== 1 ? 's' : ''} per tag
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mind Map Node Modal */}
          {selectedNode && (
            <MindMapNodeModal
              selectedNode={selectedNode}
              notes={notes}
              onClose={() => setSelectedNode(null)}
              onNoteClick={handleNoteClick}
              relatedTags={relatedTags}
            />
          )}
        </div>

        {/* Tag Statistics */}
        {mindMapData.nodes.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tag Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagClusters
                .filter(cluster => cluster.notes.length >= minTagSize)
                .slice(0, 6)
                .map((cluster) => (
                  <div
                    key={cluster.tag}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      const node = mindMapData.nodes.find(n => n.label === cluster.tag);
                      if (node) setSelectedNode(node);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {cluster.tag}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {cluster.notes.length} notes
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Connected to {cluster.relatedTags.length} other tag{cluster.relatedTags.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 