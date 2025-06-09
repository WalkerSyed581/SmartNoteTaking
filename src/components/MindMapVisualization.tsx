import React, { useEffect, useRef, useState } from 'react';
import { MindMapData, MindMapNode } from '../types/MindMap';
import { calculateNodePositions } from '../utils/mindMapUtils';
import { Note } from '../types/Note';

interface MindMapVisualizationProps {
  data: MindMapData;
  width: number;
  height: number;
  onNodeClick?: (node: MindMapNode) => void;
  onNodeHover?: (node: MindMapNode | null) => void;
  selectedNodeId?: string;
}

export const MindMapVisualization: React.FC<MindMapVisualizationProps> = ({
  data,
  width,
  height,
  onNodeClick,
  onNodeHover,
  selectedNodeId
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [positionedNodes, setPositionedNodes] = useState<MindMapNode[]>([]);

  useEffect(() => {
    const positioned = calculateNodePositions(data.nodes, width, height);
    setPositionedNodes(positioned);
  }, [data.nodes, width, height]);

  const handleNodeClick = (node: MindMapNode) => {
    onNodeClick?.(node);
  };

  const handleNodeHover = (node: MindMapNode | null) => {
    setHoveredNode(node?.id || null);
    onNodeHover?.(node);
  };

  const getNodeOpacity = (nodeId: string) => {
    if (!hoveredNode && !selectedNodeId) return 1;
    if (selectedNodeId === nodeId) return 1;
    if (hoveredNode === nodeId) return 1;
    
    // Check if this node is connected to the hovered/selected node
    const connectedToHovered = hoveredNode && data.links.some(link => 
      (link.source === hoveredNode && link.target === nodeId) ||
      (link.target === hoveredNode && link.source === nodeId)
    );
    
    const connectedToSelected = selectedNodeId && data.links.some(link => 
      (link.source === selectedNodeId && link.target === nodeId) ||
      (link.target === selectedNodeId && link.source === nodeId)
    );

    if (connectedToHovered || connectedToSelected) return 0.8;
    
    return hoveredNode || selectedNodeId ? 0.3 : 1;
  };

  const getLinkOpacity = (link: any) => {
    if (!hoveredNode && !selectedNodeId) return 0.6;
    
    const isConnectedToActive = 
      link.source === hoveredNode || link.target === hoveredNode ||
      link.source === selectedNodeId || link.target === selectedNodeId;
    
    return isConnectedToActive ? 0.8 : 0.2;
  };

  if (positionedNodes.length === 0) {
    return null;
  }

  return (
    <svg width={width} height={height} className="bg-gray-50 dark:bg-gray-800 rounded-lg">
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="nodeGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Links */}
      <g className="links">
        {data.links.map((link, index) => {
          const sourceNode = positionedNodes.find(n => n.id === link.source);
          const targetNode = positionedNodes.find(n => n.id === link.target);
          
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={`link-${index}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={link.color}
              strokeWidth={Math.max(link.strength / 10, 1)}
              opacity={getLinkOpacity(link)}
              className="transition-all duration-300"
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g className="nodes">
        {positionedNodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            className="cursor-pointer"
            onClick={() => handleNodeClick(node)}
            onMouseEnter={() => handleNodeHover(node)}
            onMouseLeave={() => handleNodeHover(null)}
          >
            {/* Node circle */}
            <circle
              r={node.size / 2}
              fill={node.color}
              opacity={getNodeOpacity(node.id)}
              className="transition-all duration-300 hover:stroke-white hover:stroke-2"
              filter="url(#shadow)"
            />
            
            {/* Inner highlight */}
            <circle
              r={node.size / 2}
              fill="url(#nodeGradient)"
              opacity={getNodeOpacity(node.id) * 0.6}
              className="transition-all duration-300 pointer-events-none"
            />

            {/* Node label */}
            <text
              textAnchor="middle"
              dy="0.35em"
              fontSize={Math.min(node.size / 3, 14)}
              fill="white"
              fontWeight="600"
              className="pointer-events-none select-none"
              opacity={getNodeOpacity(node.id)}
            >
              {node.label.length > 10 ? node.label.substring(0, 10) + '...' : node.label}
            </text>

            {/* Note count badge */}
            {node.noteCount && node.noteCount > 1 && (
              <g transform={`translate(${node.size / 3}, ${-node.size / 3})`}>
                <circle
                  r="8"
                  fill="rgba(239, 68, 68, 0.9)"
                  opacity={getNodeOpacity(node.id)}
                  className="transition-all duration-300"
                />
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize="10"
                  fill="white"
                  fontWeight="700"
                  className="pointer-events-none select-none"
                  opacity={getNodeOpacity(node.id)}
                >
                  {node.noteCount}
                </text>
              </g>
            )}

            {/* Selection indicator */}
            {selectedNodeId === node.id && (
              <circle
                r={node.size / 2 + 4}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                opacity="0.8"
                className="animate-pulse pointer-events-none"
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}; 