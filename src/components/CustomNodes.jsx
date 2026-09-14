import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers, Variable, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const StockNode = memo(({ data }) => {
  return (
    <div className="group relative min-w-[170px] rounded-xl border border-blue-500/40 bg-slate-900/90 p-3.5 shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-200 hover:border-blue-400 hover:shadow-blue-500/20">
      <Handle type="target" position={Position.Left} id="in" className="!h-3 !w-3 !rounded-full !border-2 !border-slate-900 !bg-blue-400" />
      <Handle type="target" position={Position.Top} id="top" className="!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 !bg-blue-400/80" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
          <Layers className="h-3.5 w-3.5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/90">Nivel (Stock)</span>
      </div>

      <div className="font-medium text-slate-100 text-sm tracking-tight">{data.label || 'Población'}</div>
      {data.subtext && (
        <div className="mt-1 font-mono text-xs text-blue-300/80 font-medium">
          {data.subtext}
        </div>
      )}

      <Handle type="source" position={Position.Right} id="out" className="!h-3 !w-3 !rounded-full !border-2 !border-slate-900 !bg-blue-400" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 !bg-blue-400/80" />
    </div>
  );
});
StockNode.displayName = 'StockNode';

export const FlowNode = memo(({ data }) => {
  const isOutflow = data.flowType === 'outflow';
  const borderColor = isOutflow ? 'border-rose-500/40 hover:border-rose-400' : 'border-emerald-500/40 hover:border-emerald-400';
  const shadowColor = isOutflow ? 'shadow-rose-950/40 hover:shadow-rose-500/20' : 'shadow-emerald-950/40 hover:shadow-emerald-500/20';
  const badgeBg = isOutflow ? 'bg-rose-500/20 text-rose-300 ring-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30';
  const dotColor = isOutflow ? '!bg-rose-400' : '!bg-emerald-400';

  return (
    <div className={`group relative min-w-[160px] rounded-xl border ${borderColor} bg-slate-900/90 p-3 shadow-lg ${shadowColor} backdrop-blur-md transition-all duration-200`}>
      <Handle type="target" position={Position.Left} className={`!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 ${dotColor}`} />
      <Handle type="target" position={Position.Top} className={`!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 ${dotColor}`} />

      <div className="flex items-center gap-2 mb-1.5">
        <div className={`flex h-5 w-5 items-center justify-center rounded-md ${badgeBg} ring-1`}>
          {isOutflow ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isOutflow ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isOutflow ? 'Flujo de Salida' : 'Flujo de Entrada'}
        </span>
      </div>

      <div className="font-medium text-slate-200 text-sm">{data.label}</div>
      {data.equation && (
        <div className="mt-1 font-mono text-[11px] text-slate-400 truncate max-w-[150px]" title={data.equation}>
          = {data.equation}
        </div>
      )}

      <Handle type="source" position={Position.Right} className={`!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 ${dotColor}`} />
      <Handle type="source" position={Position.Bottom} className={`!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 ${dotColor}`} />
    </div>
  );
});
FlowNode.displayName = 'FlowNode';

export const AuxNode = memo(({ data }) => {
  return (
    <div className="group relative min-w-[140px] rounded-full border border-purple-500/35 bg-slate-900/90 px-4 py-2.5 shadow-lg shadow-purple-950/30 backdrop-blur-md transition-all duration-200 hover:border-purple-400 hover:shadow-purple-500/20">
      <Handle type="target" position={Position.Top} className="!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 !bg-purple-400" />
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 !bg-purple-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30">
          <Variable className="h-3 w-3" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-200 leading-tight">{data.label}</span>
          {data.value !== undefined && (
            <span className="font-mono text-[11px] text-purple-400/90 font-medium">
              = {data.value}
            </span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 !bg-purple-400" />
      <Handle type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !rounded-full !border !border-slate-900 !bg-purple-400" />
    </div>
  );
});
AuxNode.displayName = 'AuxNode';
