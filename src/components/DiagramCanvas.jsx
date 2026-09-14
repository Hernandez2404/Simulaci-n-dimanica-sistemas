import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function DiagramCanvas({ onNodesChangeExt, onEdgesChangeExt, nodesExt, edgesExt, setNodesExt, setEdgesExt }) {
  const onConnect = useCallback(
    (params) => setEdgesExt((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdgesExt],
  );

  return (
    <div className="w-full h-full bg-slate-950/50">
      <ReactFlow
        nodes={nodesExt}
        edges={edgesExt}
        onNodesChange={onNodesChangeExt}
        onEdgesChange={onEdgesChangeExt}
        onConnect={onConnect}
        colorMode="dark"
        fitView
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
