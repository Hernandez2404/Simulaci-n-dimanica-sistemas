import { useState, useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { TrendingUp, TrendingDown, Eye, EyeOff, Activity } from 'lucide-react';

const SERIES_CONFIG = {
  Poblacion: { label: 'Población', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  Nacimientos: { label: 'Nacimientos', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  Defunciones: { label: 'Defunciones', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.1)' },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tiempo (t)</span>
        <span className="font-mono text-xs font-bold text-slate-100">{label}</span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {SERIES_CONFIG[entry.dataKey]?.label || entry.dataKey}:
            </span>
            <span className="font-mono font-medium text-slate-100">
              {typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsChart({ data }) {
  const [activeSeries, setActiveSeries] = useState({
    Poblacion: true,
    Nacimientos: true,
    Defunciones: true
  });

  const availableKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== 'time');
  }, [data]);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const initialPop = data[0]?.Poblacion ?? 0;
    const finalPop = data[data.length - 1]?.Poblacion ?? 0;
    const diff = finalPop - initialPop;
    const percentChange = initialPop > 0 ? ((diff / initialPop) * 100).toFixed(1) : 0;
    const maxPop = Math.max(...data.map(d => d.Poblacion ?? 0));
    
    return {
      initial: initialPop,
      final: finalPop,
      diff,
      percentChange,
      max: maxPop,
      isGrowing: diff >= 0
    };
  }, [data]);

  const toggleSeries = (key) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 p-6">
        <Activity className="h-8 w-8 text-slate-600 animate-pulse" />
        <span className="text-sm font-medium">Ejecuta la simulación para visualizar la trayectoria temporal</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* KPI Stats Header Bar */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 p-3 border-b border-white/5 bg-slate-950/40">
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-0.5">Población Final</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-slate-100">
                {stats.final.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className={`text-[11px] font-medium flex items-center ${stats.isGrowing ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.isGrowing ? <TrendingUp className="h-3 w-3 inline mr-0.5" /> : <TrendingDown className="h-3 w-3 inline mr-0.5" />}
                {stats.percentChange}%
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-0.5">Población Inicial</span>
            <span className="font-mono text-base font-bold text-slate-300">
              {stats.initial.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-0.5">Pico Máximo</span>
            <span className="font-mono text-base font-bold text-blue-400">
              {stats.max.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      )}

      {/* Series Toggle Pills */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-slate-900/20 text-xs">
        <span className="text-[11px] text-slate-500 font-medium mr-1">Series:</span>
        {availableKeys.map(key => {
          const cfg = SERIES_CONFIG[key] || { label: key, color: '#8B5CF6' };
          const isVisible = activeSeries[key] !== false;
          return (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                isVisible 
                  ? 'border-white/10 bg-slate-800/80 text-slate-200 hover:border-white/20'
                  : 'border-transparent bg-transparent text-slate-500 line-through hover:text-slate-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isVisible ? cfg.color : '#64748B' }} />
              <span>{cfg.label}</span>
              {isVisible ? <Eye className="h-2.5 w-2.5 opacity-60" /> : <EyeOff className="h-2.5 w-2.5 opacity-60" />}
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="poblacionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#64748B" 
              tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
              tickLine={{ stroke: '#334155' }}
              tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {activeSeries.Poblacion && (
              <Area 
                type="monotone" 
                dataKey="Poblacion" 
                fill="url(#poblacionGradient)" 
                stroke="none"
              />
            )}

            {availableKeys.map((key) => {
              if (!activeSeries[key]) return null;
              const cfg = SERIES_CONFIG[key] || { color: '#8B5CF6' };
              return (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={cfg.color} 
                  strokeWidth={key === 'Poblacion' ? 2.5 : 1.8}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#090D16' }} 
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

