import { useState, useEffect } from 'react';
import DiagramCanvas from './components/DiagramCanvas';
import ResultsChart from './components/ResultsChart';
import { runSimulation } from './lib/simulatorEngine';
import { useNodesState, useEdgesState } from '@xyflow/react';
import ExercisesModal from './components/ExercisesModal';

const DEFAULT_MODEL = {
  settings: { simulation_time: 50, dt: 1 },
  stocks: [
    { id: 'Poblacion', initial_value: 1000 }
  ],
  flows: [
    { id: 'Nacimientos', equation: 'Poblacion * Tasa_Natalidad' },
    { id: 'Defunciones', equation: 'Poblacion / Esperanza_Vida' }
  ],
  auxiliaries: [
    { id: 'Tasa_Natalidad', value: 0.05 },
    { id: 'Esperanza_Vida', value: 100 }
  ],
  structure: {
    Poblacion: { inflows: ['Nacimientos'], outflows: ['Defunciones'] }
  }
};

const initialNodes = [
  { id: 'Poblacion', position: { x: 350, y: 200 }, data: { label: 'Población (Nivel)' }, type: 'default', style: { backgroundColor: '#1E3A8A', color: '#BFDBFE', borderColor: '#3B82F6', borderWidth: 2, fontWeight: 'bold', width: 150, textAlign: 'center' } },
  { id: 'Nacimientos', position: { x: 100, y: 200 }, data: { label: 'Nacimientos (Flujo)' }, style: { backgroundColor: '#064E3B', color: '#A7F3D0', borderColor: '#10B981', borderWidth: 1 } },
  { id: 'Defunciones', position: { x: 600, y: 200 }, data: { label: 'Defunciones (Flujo)' }, style: { backgroundColor: '#881337', color: '#FECDD3', borderColor: '#F43F5E', borderWidth: 1 } },
  { id: 'Tasa_Natalidad', position: { x: 100, y: 350 }, data: { label: 'Tasa de Natalidad' }, style: { backgroundColor: '#2E1065', color: '#DDD6FE', borderColor: '#8B5CF6', borderWidth: 1, borderRadius: '50%' } },
  { id: 'Esperanza_Vida', position: { x: 600, y: 350 }, data: { label: 'Esperanza de Vida' }, style: { backgroundColor: '#2E1065', color: '#DDD6FE', borderColor: '#8B5CF6', borderWidth: 1, borderRadius: '50%' } }
];

const initialEdges = [
  { id: 'e1', source: 'Tasa_Natalidad', target: 'Nacimientos', animated: true, style: { strokeDasharray: '5,5' } },
  { id: 'e2', source: 'Poblacion', target: 'Nacimientos', animated: true, style: { strokeDasharray: '5,5' } },
  { id: 'e3', source: 'Poblacion', target: 'Defunciones', animated: true, style: { strokeDasharray: '5,5' } },
  { id: 'e4', source: 'Esperanza_Vida', target: 'Defunciones', animated: true, style: { strokeDasharray: '5,5' } },
  { id: 'flow-in', source: 'Nacimientos', target: 'Poblacion', animated: true, style: { strokeWidth: 4, stroke: '#10B981' } },
  { id: 'flow-out', source: 'Poblacion', target: 'Defunciones', animated: true, style: { strokeWidth: 4, stroke: '#F43F5E' } }
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [simulationData, setSimulationData] = useState([]);
  const [model] = useState(DEFAULT_MODEL);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSimulate = () => {
    const results = runSimulation(model);
    setSimulationData(results);
  };

  useEffect(() => {
    handleSimulate();
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-50 flex flex-col font-sans overflow-hidden">
      <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-6 bg-slate-900/40 backdrop-blur-md z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">DS</div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">Simulador de Dinámica de Sistemas</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Ejercicio 5.1: Población</span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-lg font-medium text-sm text-slate-200 flex items-center gap-2 border border-slate-700 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            Ver Ejercicios
          </button>
          <button 
            onClick={handleSimulate}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Ejecutar Simulación
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="flex-[3] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Lienzo Causal y Flujos
            </h2>
          </div>
          <div className="flex-1 rounded-2xl border border-slate-800/60 bg-slate-900/30 overflow-hidden relative shadow-2xl backdrop-blur-sm">
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

        <div className="flex-[2] flex flex-col gap-6">
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Resultados de la Simulación
            </h2>
            <div className="flex-1 rounded-2xl border border-slate-800/60 bg-slate-900/30 overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col">
              <ResultsChart data={simulationData} />
            </div>
          </div>

          <div className="h-[200px] flex flex-col gap-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Ecuaciones del Sistema
            </h2>
            <div className="flex-1 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5 overflow-y-auto text-sm font-mono text-slate-300 space-y-3 shadow-inner">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-semibold w-24">Población</span>
                <span className="text-slate-500">=</span>
                <span>Poblacion(t-dt) + (Nacimientos - Defunciones) * dt</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-semibold w-24">Nacimientos</span>
                <span className="text-slate-500">=</span>
                <span>Poblacion * Tasa_Natalidad</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-semibold w-24">Defunciones</span>
                <span className="text-slate-500">=</span>
                <span>Poblacion / Esperanza_Vida</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">// Valores Iniciales</div>
                  <div>Poblacion = 1000</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider">// Variables Aux</div>
                  <div>Tasa_Natalidad = 0.05</div>
                  <div>Esperanza_Vida = 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ExercisesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
