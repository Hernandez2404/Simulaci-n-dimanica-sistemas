import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import DiagramCanvas from './components/DiagramCanvas';
import ResultsChart from './components/ResultsChart';
import ExercisesModal from './components/ExercisesModal';
import MathDeductionModal from './components/MathDeductionModal';
import { runSimulation } from './lib/simulatorEngine';
import { MODELS } from './lib/modelsData';
import { 
  Activity, 
  Play, 
  RotateCcw, 
  Sliders, 
  BookOpen, 
  ChevronDown,
  FunctionSquare,
  Sigma,
  Sun,
  Moon,
  Bot
} from 'lucide-react';

export default function App() {
  const [selectedModelId, setSelectedModelId] = useState('poblacion');
  const activeModelConfig = useMemo(() => MODELS[selectedModelId] || MODELS.poblacion, [selectedModelId]);

  // Theme state with local persistence (defaults to dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sd_theme') || 'dark';
  });
  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('sd_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Current working parameters (overrides)
  const [paramValues, setParamValues] = useState(() => {
    const initial = {};
    activeModelConfig.params.forEach(p => {
      initial[p.key] = p.default;
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState('params'); // 'params' | 'equations' | 'deduction'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
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
    <div className="h-screen w-screen bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden select-none transition-colors duration-200">
      {/* Precision Header */}
      <header className="h-16 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-xl z-20 shrink-0 shadow-xs transition-colors duration-200 gap-4">
        {/* Left: Brand, Version & AI Credits */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20">
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                Simulador de Dinámica de Sistemas
              </h1>
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-100/80 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400">
                Euler v1.2
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="hidden md:inline truncate">Modelado formal y simulación computacional</span>
              <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 shadow-2xs">
                <Bot className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                <span>Desarrollado por Agentes de IA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Clustered Functional Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Group 1: Model Context Selector */}
          <div className="relative">
            <select
              value={selectedModelId}
              onChange={(e) => loadModel(e.target.value)}
              className="appearance-none rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0D1527] px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:border-slate-400 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-colors"
            >
              <option value="poblacion">Caso 5.1: Dinámica Poblacional</option>
              <option value="helpdesk">Caso 5.2: Mesa de Ayuda TI</option>
              <option value="inventario">Caso 5.3: Gestión de Inventario</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Subtle Divider */}
          <div className="h-5 w-px bg-slate-200 dark:border-white/10 hidden sm:block" />

          {/* Group 2: Learning & Deductions */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setIsDeductionModalOpen(true)}
              title="Ver deducción formal analítica de fórmulas"
              className="flex items-center gap-1.5 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/80 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-3 py-2 text-xs font-semibold text-purple-700 dark:text-purple-200 hover:border-purple-300 dark:hover:border-purple-500/50 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Sigma className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden xl:inline">Deducción Matemática</span>
              <span className="xl:hidden">Deducción</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              title="Ver guía de ejercicios prácticos y preguntas"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] hover:bg-slate-100 dark:hover:bg-[#131D35] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/25 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden xl:inline">Guía de Ejercicios</span>
              <span className="xl:hidden">Guía</span>
            </button>
          </div>

          {/* Subtle Divider */}
          <div className="h-5 w-px bg-slate-200 dark:border-white/10" />

          {/* Group 3: Simulation Controls (Reset + Run) */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleReset}
              title="Restablecer valores iniciales del modelo y diagrama"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] hover:bg-slate-100 dark:hover:bg-[#131D35] px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 active:scale-95 transition-all cursor-pointer shadow-xs group"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 group-hover:rotate-[-45deg] transition-transform duration-200" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button 
              onClick={handleSimulate}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer ${
                isSimulating 
                  ? 'bg-blue-700 opacity-80' 
                  : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/40'
              }`}
            >
              <Play className={`h-3.5 w-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simular</span>
            </button>
          </div>

          {/* Subtle Divider */}
          <div className="h-5 w-px bg-slate-200 dark:border-white/10" />

          {/* Group 4: System Utility (Theme Switcher) */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            aria-label={isDark ? "Activar Modo Claro" : "Activar Modo Oscuro"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1527] hover:bg-slate-100 dark:hover:bg-[#131D35] text-slate-700 dark:text-amber-300 hover:text-slate-900 dark:hover:text-amber-200 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Studio View */}
      <main className="flex-1 flex overflow-hidden p-5 gap-5 transition-colors duration-200 bg-slate-100/70 dark:bg-[#080C14] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-[#0B1120]/60 dark:via-[#080C14] dark:to-[#080C14]">
        {/* Left Column: Diagram Canvas */}
        <div className="flex-[3] flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                Lienzo de Forrester (Diagrama de Flujos y Niveles)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-[#0A0F1D] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10 shadow-xs">
                {activeModelConfig.category}
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0F1D] overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-md relative transition-colors duration-200">
            <DiagramCanvas 
              nodesExt={nodes} 
              edgesExt={edges} 
              onNodesChangeExt={onNodesChange} 
              onEdgesChangeExt={onEdgesChange}
              setNodesExt={setNodes}
              setEdgesExt={setEdges}
              isDark={isDark}
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
                <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Trayectoria Temporal y Resultados
                </h2>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0F1D] overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-md flex flex-col transition-colors duration-200">
              <ResultsChart data={simulationData} isDark={isDark} />
            </div>
          </div>

          {/* Bottom Panel: Tabbed Interactive Inspector */}
          <div className="h-[250px] flex flex-col gap-2 shrink-0">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-slate-200/70 dark:bg-[#0A0F1D] border border-slate-300/60 dark:border-white/10">
                <button
                  onClick={() => setActiveTab('params')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'params'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FunctionSquare className="h-3 w-3" />
                  <span>Ecuaciones</span>
                </button>
                <button
                  onClick={() => setActiveTab('deduction')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'deduction'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Sigma className="h-3 w-3" />
                  <span>Deducción</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {activeTab === 'params' && (
                  <button
                    onClick={handleReset}
                    title="Restablecer valores originales de los parámetros"
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0D1527] hover:bg-slate-200 dark:hover:bg-[#131D35] text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-2xs group"
                  >
                    <RotateCcw className="h-2.5 w-2.5 group-hover:rotate-[-45deg] transition-transform duration-200" />
                    <span>Reset</span>
                  </button>
                )}
                <span>dt: {paramValues.dt || 1} | t_max: {paramValues.simulation_time || 50}</span>
              </div>
            </div>

            {/* Tab Contents Container */}
            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0F1D] p-4 overflow-y-auto shadow-xs dark:shadow-inner backdrop-blur-md transition-colors duration-200">
              {activeTab === 'params' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeModelConfig.params.map((param) => {
                      const val = paramValues[param.key] !== undefined ? paramValues[param.key] : param.default;

                      return (
                        <div key={param.key} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200/80 dark:border-white/10 space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]" title={param.label}>
                              {param.label}
                            </span>
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
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
                            className="w-full h-1.5 bg-slate-200 dark:bg-[#131D35] rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 focus:outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'equations' && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mb-2">
                    Estructura diferencial simulada mediante el método de integración de Euler:
                  </div>
                  {activeModelConfig.equations.map((eq, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 shadow-xs">
                      <span className={`font-semibold w-28 shrink-0 ${
                        eq.type === 'stock' ? 'text-blue-600 dark:text-blue-400' :
                        eq.type === 'inflow' ? 'text-emerald-600 dark:text-emerald-400' :
                        eq.type === 'outflow' ? 'text-rose-600 dark:text-rose-400' : 'text-purple-600 dark:text-purple-400'
                      }`}>
                        {eq.var}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 font-bold">=</span>
                      <span className="text-slate-800 dark:text-slate-200">{eq.eq}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'deduction' && (
                <div className="space-y-3 font-sans text-xs">
                  {selectedModelId === 'poblacion' ? (
                    <>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">
                        Origen analítico de la fórmula de población (Malthus / Forrester):
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 space-y-1 shadow-xs">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">1. Ecuación Continua Diferencial</span>
                          <code className="font-mono text-purple-700 dark:text-purple-300 text-[11px] block font-bold">
                            dP/dt = P·(0.05 - 0.01) = 0.04·P
                          </code>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-mono">
                            Solución: P(t) = 1,000 · e^(0.04 · t)
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 space-y-1 shadow-xs">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">2. Algoritmo Euler Discreto</span>
                          <code className="font-mono text-emerald-700 dark:text-emerald-300 text-[11px] block font-bold">
                            P(t + dt) = P(t) + [N - D] × dt
                          </code>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-mono">
                            Con dt=1: P(t + 1) = P(t) × 1.04 (+4% anual)
                          </span>
                        </div>
                      </div>
                    </>
                  ) : selectedModelId === 'helpdesk' ? (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                        Deducción del modelo lineal de tickets:
                      </span>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 space-y-1 font-mono text-xs shadow-xs">
                        <div className="text-slate-700 dark:text-slate-300">dT/dt = Llegadas - Resoluciones = 20 - 25 = -5 tickets/día</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">T(t) = 50 - 5·t  ⇒  Agotamiento total en t = 10 días</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                        Deducción del equilibrio asintótico del inventario:
                      </span>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1527] border border-slate-200 dark:border-white/10 space-y-1 font-mono text-xs shadow-xs">
                        <div className="text-slate-700 dark:text-slate-300">dI/dt = Envíos - 0.15·I(t) = 50 - 0.15·I(t)</div>
                        <div className="text-purple-700 dark:text-purple-300 font-bold">Estado Estacionario (dI/dt = 0): I* = 50 / 0.15 ≈ 333.33 pares</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Footer with AI Agent Credits */}
      <footer className="h-7 border-t flex items-center justify-between px-6 text-[11px] shrink-0 transition-colors duration-200 bg-white/95 dark:bg-[#070A10] border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 shadow-xs">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>Desarrollado integralmente por <strong>Agentes de IA</strong></span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden sm:inline">Simulador de Dinámica de Sistemas (Modelo de Forrester & Integración de Euler)</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          <span>React 19</span>
          <span>•</span>
          <span>Tailwind v4</span>
          <span>•</span>
          <span>XYFlow</span>
        </div>
      </footer>

      {/* Exercises Modal Dialog */}
      <ExercisesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectExercise={loadModel}
        currentModelId={selectedModelId}
        onOpenDeduction={() => setIsDeductionModalOpen(true)}
      />

      {/* Math Deduction Modal Dialog */}
      <MathDeductionModal
        isOpen={isDeductionModalOpen}
        onClose={() => setIsDeductionModalOpen(false)}
      />
    </div>
  );
}
