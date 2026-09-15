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
  // Caso 5.1: Población
  Poblacion: { label: 'Población', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', isStock: true },
  Nacimientos: { label: 'Nacimientos', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  Defunciones: { label: 'Defunciones', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.1)' },
  Tasa_Natalidad: { label: 'Tasa Natalidad', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)', isAux: true },
  Esperanza_Vida: { label: 'Esperanza Vida', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', isAux: true },

  // Caso 5.2: Help Desk TI
  Tickets_Pendientes: { label: 'Tickets Pendientes', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', isStock: true },
  Llegada_Tickets: { label: 'Llegada Tickets', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  Resolucion_Tickets: { label: 'Resolución', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.1)' },
  Tasa_Llegada: { label: 'Tasa Llegada', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)', isAux: true },
  Tasa_Resolucion: { label: 'Tasa Resolución', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', isAux: true },

  // Caso 5.3: Inventario
  Inventario: { label: 'Inventario Bodega', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', isStock: true },
  Envios_Fabrica: { label: 'Envíos Fábrica', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  Ventas: { label: 'Ventas Diarias', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.1)' },
  Tasa_Envios: { label: 'Tasa Envíos', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)', isAux: true },
  Fraccion_Ventas: { label: 'Fracción Ventas', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', isAux: true },
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
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
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
  const [activeSeries, setActiveSeries] = useState({});

  const availableKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    const rawKeys = Object.keys(data[0]).filter(k => k !== 'time');
    
    // Sort: Stocks first, then Flows, then Auxiliaries
    return rawKeys.sort((a, b) => {
      const aStock = SERIES_CONFIG[a]?.isStock ? 1 : 0;
      const bStock = SERIES_CONFIG[b]?.isStock ? 1 : 0;
      if (aStock !== bStock) return bStock - aStock;

      const aAux = SERIES_CONFIG[a]?.isAux ? 1 : 0;
      const bAux = SERIES_CONFIG[b]?.isAux ? 1 : 0;
      return aAux - bAux;
    });
  }, [data]);

  // Primary stock detection for stats and area fill
  const primaryStockKey = useMemo(() => {
    if (!data || data.length === 0) return null;
    const keys = Object.keys(data[0]);
    if (keys.includes('Poblacion')) return 'Poblacion';
    if (keys.includes('Tickets_Pendientes')) return 'Tickets_Pendientes';
    if (keys.includes('Inventario')) return 'Inventario';
    return keys.find(k => k !== 'time') || null;
  }, [data]);

  const stats = useMemo(() => {
    if (!data || data.length === 0 || !primaryStockKey) return null;
    const initialVal = data[0]?.[primaryStockKey] ?? 0;
    const finalVal = data[data.length - 1]?.[primaryStockKey] ?? 0;
    const diff = finalVal - initialVal;
    const percentChange = initialVal > 0 ? ((diff / initialVal) * 100).toFixed(1) : 0;
    const maxVal = Math.max(...data.map(d => d[primaryStockKey] ?? 0));
    const stockLabel = SERIES_CONFIG[primaryStockKey]?.label || primaryStockKey;
    
    return {
      label: stockLabel,
      initial: initialVal,
      final: finalVal,
      diff,
      percentChange,
      max: maxVal,
      isGrowing: diff >= 0
    };
  }, [data, primaryStockKey]);

  const toggleSeries = (key) => {
    setActiveSeries(prev => {
      // Default for uninitialized keys: if it's an aux, default was false, otherwise true
      const currentVal = prev[key] !== undefined ? prev[key] : (SERIES_CONFIG[key]?.isAux ? false : true);
      return { ...prev, [key]: !currentVal };
    });
  };

  const isSeriesVisible = (key) => {
    if (activeSeries[key] !== undefined) return activeSeries[key];
    // Auxiliaries default to false (hidden) to avoid scale flattening, stocks/flows default to true
    return !SERIES_CONFIG[key]?.isAux;
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
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* KPI Stats Header Bar */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 p-2.5 border-b border-white/5 bg-slate-950/40 shrink-0">
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-0.5 truncate">
              {stats.label} Final
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-slate-100">
                {stats.final.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
              <span className={`text-[10px] font-medium flex items-center ${stats.isGrowing ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats.isGrowing ? <TrendingUp className="h-3 w-3 inline mr-0.5" /> : <TrendingDown className="h-3 w-3 inline mr-0.5" />}
                {stats.percentChange}%
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-0.5 truncate">
              {stats.label} Inicial
            </span>
            <span className="font-mono text-base font-bold text-slate-300">
              {stats.initial.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-0.5 truncate">
              Pico Máximo
            </span>
            <span className="font-mono text-base font-bold text-blue-400">
              {stats.max.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
          </div>
        </div>
      )}

      {/* Series Toggle Pills - Responsive wrapping with no overflow */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 border-b border-white/5 bg-slate-900/40 text-xs shrink-0 max-w-full">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mr-1 shrink-0">
          Series:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {availableKeys.map(key => {
            const cfg = SERIES_CONFIG[key] || { label: key.replace(/_/g, ' '), color: '#8B5CF6' };
            const visible = isSeriesVisible(key);
            return (
              <button
                key={key}
                onClick={() => toggleSeries(key)}
                title={visible ? `Ocultar ${cfg.label}` : `Mostrar ${cfg.label}`}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-medium transition-all duration-150 cursor-pointer select-none shrink-0 ${
                  visible 
                    ? 'border-white/10 bg-slate-800/90 text-slate-200 hover:border-white/20 hover:bg-slate-800 shadow-sm'
                    : 'border-transparent bg-slate-900/40 text-slate-500 line-through hover:text-slate-400'
                }`}
              >
                <span 
                  className="h-1.5 w-1.5 rounded-full shrink-0" 
                  style={{ backgroundColor: visible ? cfg.color : '#64748B' }} 
                />
                <span className="truncate max-w-[130px]">{cfg.label}</span>
                {visible ? (
                  <Eye className="h-2.5 w-2.5 opacity-60 shrink-0" />
                ) : (
                  <EyeOff className="h-2.5 w-2.5 opacity-60 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
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
            
            {primaryStockKey && isSeriesVisible(primaryStockKey) && (
              <Area 
                type="monotone" 
                dataKey={primaryStockKey} 
                fill="url(#stockGradient)" 
                stroke="none"
              />
            )}

            {availableKeys.map((key) => {
              if (!isSeriesVisible(key)) return null;
              const cfg = SERIES_CONFIG[key] || { color: '#8B5CF6' };
              const isStock = key === primaryStockKey;
              return (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={cfg.color} 
                  strokeWidth={isStock ? 2.5 : 1.8}
                  strokeDasharray={cfg.isAux ? '4 4' : undefined}
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
