import { useState, useMemo, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import DiagramCanvas from './components/DiagramCanvas';
import ResultsChart from './components/ResultsChart';
import ExercisesModal from './components/ExercisesModal';
import { runSimulation } from './lib/simulatorEngine';
import { MODELS } from './lib/modelsData';
import { 
  Activity, 
  Play, 
  RotateCcw, 
  Sliders, 
  BookOpen, 
  ChevronDown,
  FunctionSquare
} from 'lucide-react';

export default function App() {
  const [selectedModelId, setSelectedModelId] = useState('poblacion');
  const activeModelConfig = useMemo(() => MODELS[selectedModelId] || MODELS.poblacion, [selectedModelId]);

  // Current working parameters (overrides)
  const [paramValues, setParamValues] = useState(() => {
    const initial = {};
    activeModelConfig.params.forEach(p => {
      initial[p.key] = p.default;
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState('params'); // 'params' | 'equations'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(activeModelConfig.getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeModelConfig.getInitialEdges());

  // Build the executable model based on current paramValues
  const currentExecutableModel = useMemo(() => {
    const base = JSON.parse(JSON.stringify(activeModelConfig));
    
    // Apply stocks
    base.stocks = base.stocks.map(s => ({
      ...s,
      initial_value: paramValues[s.id] !== undefined ? paramValues[s.id] : s.initial_value
    }));

    // Apply auxiliaries
    base.auxiliaries = base.auxiliaries.map(a => ({
      ...a,
      value: paramValues[a.id] !== undefined ? paramValues[a.id] : a.value
    }));

    // Apply settings
    if (paramValues.simulation_time !== undefined) {
      base.settings.simulation_time = Number(paramValues.simulation_time);
    }
    if (paramValues.dt !== undefined) {
      base.settings.dt = Number(paramValues.dt);
    }

    return base;
  }, [activeModelConfig, paramValues]);

  // Derive simulation results reactively
  const simulationData = useMemo(() => {
    try {
      return runSimulation(currentExecutableModel);
    } catch (err) {
      console.error('Error running simulation:', err);
      return [];
    }
  }, [currentExecutableModel]);

  // Visual simulation trigger
  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 200);
  }, []);

  // Handle loading a new model / exercise
  const loadModel = useCallback((modelKey) => {
    const targetConfig = MODELS[modelKey];
    if (!targetConfig) return;

    setSelectedModelId(modelKey);
    const newParams = {};
    targetConfig.params.forEach(p => {
      newParams[p.key] = p.default;
    });
    setParamValues(newParams);
    setNodes(targetConfig.getInitialNodes());
    setEdges(targetConfig.getInitialEdges());
  }, [setNodes, setEdges]);

  // Reset current model params
  const handleReset = useCallback(() => {
    const defaultParams = {};
    activeModelConfig.params.forEach(p => {
      defaultParams[p.key] = p.default;
    });
    setParamValues(defaultParams);
    setNodes(activeModelConfig.getInitialNodes());
    setEdges(activeModelConfig.getInitialEdges());
  }, [activeModelConfig, setNodes, setEdges]);

  const handleParamChange = (key, val) => {
    setParamValues(prev => ({
      ...prev,
      [key]: Number(val)
    }));
  };


  return (
    <div className="h-screen w-screen bg-[#080C14] text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Precision Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/60 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-slate-100">
                Simulador de Dinámica de Sistemas
              </h1>
              <span className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                Euler v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400">Modelado formal y simulación computacional de sistemas dinámicos</p>
          </div>
        </div>

        {/* Model Switcher Dropdown & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Exercise Selector */}
          <div className="relative">
            <select
              value={selectedModelId}
              onChange={(e) => loadModel(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2 pr-9 text-xs font-semibold text-slate-200 shadow-inner hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="poblacion">Caso 5.1: Dinámica Poblacional</option>
              <option value="helpdesk">Caso 5.2: Mesa de Ayuda TI</option>
              <option value="inventario">Caso 5.3: Gestión de Inventario</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-slate-750 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-white/25 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span>Guía de Ejercicios</span>
          </button>

          <button 
            onClick={handleReset}
            title="Restablecer valores originales del modelo"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-slate-700/60 px-3 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button 
            onClick={handleSimulate}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer ${
              isSimulating 
                ? 'bg-blue-700 opacity-80' 
                : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/40'
            }`}
          >
            <Play className={`h-3.5 w-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simular</span>
          </button>
        </div>
      </header>

      {/* Main Studio View */}
      <main className="flex-1 flex overflow-hidden p-5 gap-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#080C14] to-[#080C14]">
        {/* Left Column: Diagram Canvas */}
        <div className="flex-[3] flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Lienzo de Forrester (Diagrama de Flujos y Niveles)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400 bg-slate-900/60 px-2.5 py-0.5 rounded-md border border-white/5">
                {activeModelConfig.category}
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 overflow-hidden shadow-2xl backdrop-blur-md relative">
            <DiagramCanvas 
              nodesExt={nodes} 
              edgesExt={edges} 
              onNodesChangeExt={onNodesChange} 
              onEdgesChangeExt={onEdgesChange}
              setNodesExt={setNodes}
              setEdgesExt={setEdges}
            />
          </div>
        </div>

        {/* Right Column: Results & Interactive Inspector */}
        <div className="flex-[2] flex flex-col gap-5 min-w-0 max-w-[540px]">
          {/* Top Panel: Dynamic Results Chart */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Trayectoria Temporal y Resultados
                </h2>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 overflow-hidden shadow-2xl backdrop-blur-md flex flex-col">
              <ResultsChart data={simulationData} />
            </div>
          </div>

          {/* Bottom Panel: Tabbed Interactive Inspector */}
          <div className="h-[250px] flex flex-col gap-2 shrink-0">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-slate-900/80 border border-white/10">
                <button
                  onClick={() => setActiveTab('params')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'params'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="h-3 w-3" />
                  <span>Parámetros en Vivo</span>
                </button>
                <button
                  onClick={() => setActiveTab('equations')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'equations'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FunctionSquare className="h-3 w-3" />
                  <span>Ecuaciones</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                dt: {paramValues.dt || 1} | t_max: {paramValues.simulation_time || 50}
              </span>
            </div>

            {/* Tab Contents Container */}
            <div className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 p-4 overflow-y-auto shadow-inner backdrop-blur-md">
              {activeTab === 'params' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeModelConfig.params.map((param) => {
                      const val = paramValues[param.key] !== undefined ? paramValues[param.key] : param.default;

                      return (
                        <div key={param.key} className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium truncate max-w-[150px]" title={param.label}>
                              {param.label}
                            </span>
                            <span className="font-mono text-xs font-bold text-blue-400">
                              {val}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={val}
                            onChange={(e) => handleParamChange(param.key, e.target.value)}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-[11px] font-sans text-slate-400 mb-2">
                    Estructura diferencial simulada mediante el método de integración de Euler:
                  </div>
                  {activeModelConfig.equations.map((eq, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-white/5">
                      <span className={`font-semibold w-28 shrink-0 ${
                        eq.type === 'stock' ? 'text-blue-400' :
                        eq.type === 'inflow' ? 'text-emerald-400' :
                        eq.type === 'outflow' ? 'text-rose-400' : 'text-purple-400'
                      }`}>
                        {eq.var}
                      </span>
                      <span className="text-slate-500 font-bold">=</span>
                      <span className="text-slate-200">{eq.eq}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Exercises Modal Dialog */}
      <ExercisesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectExercise={loadModel}
        currentModelId={selectedModelId}
      />
    </div>
  );
}

