import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StockNode, FlowNode, AuxNode } from './CustomNodes';
import { Layers, ArrowRightLeft, Variable } from 'lucide-react';

export default function DiagramCanvas({ onNodesChangeExt, onEdgesChangeExt, nodesExt, edgesExt, setEdgesExt, isDark = true }) {
  const nodeTypes = useMemo(() => ({
    stock: StockNode,
    flow: FlowNode,
    auxiliary: AuxNode,
  }), []);

  const onConnect = useCallback(
    (params) => setEdgesExt((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdgesExt],
  );

  return (
    <div className="relative w-full h-full bg-slate-100/70 dark:bg-[#080C14] overflow-hidden transition-colors duration-200">
      <ReactFlow
        nodes={nodesExt}
        edges={edgesExt}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChangeExt}
        onEdgesChange={onEdgesChangeExt}
        onConnect={onConnect}
        colorMode={isDark ? 'dark' : 'light'}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.5}
        maxZoom={1.75}
      >
        <Controls showInteractive={false} />
        <Background 
          variant="dots" 
          gap={18} 
          size={1} 
          color={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)'} 
        />
      </ReactFlow>

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/85 px-3 py-2 text-[11px] font-medium text-slate-600 dark:text-slate-400 shadow-xl backdrop-blur-md transition-colors duration-200">
        <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Leyenda:</span>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <Layers className="h-3 w-3" />
          <span>Nivel</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/10" />
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <ArrowRightLeft className="h-3 w-3" />
          <span>Flujo</span>
        </div>
        <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/10" />
        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
          <Variable className="h-3 w-3" />
          <span>Auxiliar</span>
        </div>
      </div>
    </div>
  );
}
