import { useState, useEffect } from 'react';
import { 
  X, 
  Sigma, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  GitCompare, 
  Sparkles,
  RefreshCw,
  Info,
  Bot
} from 'lucide-react';

export default function MathDeductionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'compare' | 'loops'
  const [interactiveDt, setInteractiveDt] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Comparison data calculation for table/graphs
  const comparisonTimes = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const P0 = 1000;
  const r = 0.04; // 0.05 - 0.01

  const comparisonData = comparisonTimes.map((t) => {
    // Exact analytical solution: P(t) = P0 * e^(r*t)
    const exact = P0 * Math.exp(r * t);

    // Euler discrete solution with step dt:
    // P_k = P0 * (1 + r * dt)^(t / dt)
    const steps = t / interactiveDt;
    const euler = P0 * Math.pow(1 + r * interactiveDt, steps);

    const error = exact > 0 ? ((euler - exact) / exact) * 100 : 0;

    return {
      t,
      exact: Math.round(exact * 10) / 10,
      euler: Math.round(euler * 10) / 10,
      diff: Math.round(Math.abs(euler - exact) * 10) / 10,
      errorPercent: error.toFixed(2)
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="relative flex flex-col w-full max-w-5xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0F1D] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-white/20">
              <Sigma className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Deducción Formal de la Fórmula Poblacional
                </h2>
                <span className="rounded-full bg-purple-100 dark:bg-purple-500/15 border border-purple-300 dark:border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                  Cálculo & Dinámica de Sistemas
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                  <Bot className="h-3 w-3" /> Agentes de IA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Demostración rigurosa del modelo de Malthus / Forrester y su discretización con el método de Euler
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('steps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'steps'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/50'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>1. Deducción Paso a Paso</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/50'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>2. Comparativa: Euler vs Solución Analítica</span>
            </button>
            <button
              onClick={() => setActiveTab('loops')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'loops'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/50'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>3. Estructura de Bucles de Causalidad</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400/80 hidden sm:inline-block font-semibold">
            dP/dt = (n - 1/Ev) · P = 0.04 · P
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-gradient-to-b dark:from-[#0A0F1D] dark:via-[#080C14] dark:to-[#080C14]">
          {activeTab === 'steps' && (
            <div className="space-y-5">
              {/* Step 1 */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-3 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-300 dark:ring-blue-500/30">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Principio Físico de Conservación (Balance de Masa/Individuos)
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/20">
                    Nivel y Flujos
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  En Dinámica de Sistemas (fundada por Jay W. Forrester), cualquier acumulación cerrada sin corrientes migratorias externas se rige por la ley de balance: la razón de cambio de la variable de estado o <strong>Nivel</strong> (Stock) es la diferencia estricta entre sus <strong>Flujos de Entrada</strong> y sus <strong>Flujos de Salida</strong> por unidad de tiempo.
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-800 dark:text-slate-200 flex flex-col md:flex-row items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">dP(t) / dt</span>
                    <span className="text-slate-400">=</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Nacimientos(t)</span>
                    <span className="text-slate-400">-</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">Defunciones(t)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-sans italic">
                    Ecuación diferencial fundamental de balance
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-3 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold ring-1 ring-emerald-300 dark:ring-emerald-500/30">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Modelado del Flujo de Entrada (Nacimientos per cápita)
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                    Bucle Positivo (R)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Los nacimientos no son una constante fija exógena: dependen intrínsecamente del tamaño actual de la población fértil disponible. Si cada individuo genera en promedio una tasa de fecundidad o fertilidad <code className="text-emerald-600 dark:text-emerald-300 font-mono font-bold">n = 0.05</code> (5% anual per cápita), la tasa global de nacimientos se formula como:
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 font-mono text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Nacimientos(t)</span>
                    <span className="text-slate-400">=</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Población(t)</span>
                    <span className="text-slate-400">×</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">Tasa_Natalidad (n)</span>
                    <span className="text-slate-400">=</span>
                    <span className="font-semibold">P(t) × 0.05</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +Pob → +Nacimientos → +Pob
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-3 shadow-xs hover:border-rose-400 dark:hover:border-rose-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold ring-1 ring-rose-300 dark:ring-rose-500/30">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Modelado del Flujo de Salida (Esperanza de Vida y Probabilidad de Muerte)
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20">
                    Bucle Negativo (B)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  ¿Por qué las defunciones son <code className="text-rose-600 dark:text-rose-300 font-mono font-bold">Población ÷ Esperanza_Vida</code>? En teoría de colas y dinámica de sistemas agregada con tiempo medio de residencia homogéneo, si la esperanza de vida media es <code className="text-purple-600 dark:text-purple-300 font-mono font-bold">E_v = 100 años</code>, la probabilidad de que una persona fallezca en un año determinado (tasa de mortalidad bruta per cápita <code className="text-purple-600 dark:text-purple-300 font-mono font-bold">m</code>) es exactamente su inversa:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans uppercase font-semibold block">Tasa de Mortalidad per cápita</span>
                    <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold">
                      <span>m = 1 / Esperanza_Vida</span>
                      <span className="text-slate-400">=</span>
                      <span>1 / 100 = 0.01 año⁻¹ (1%)</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans uppercase font-semibold block">Ecuación de Defunciones</span>
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                      <span>Defunciones(t) = P(t) / E_v = P(t) × 0.01</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-3 shadow-xs hover:border-purple-400 dark:hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold ring-1 ring-purple-300 dark:ring-purple-500/30">
                      4
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Deducción de la Tasa Neta (r) y Solución Analítica Continua
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/20">
                    Cálculo Integral
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sustituyendo ambos flujos en la ecuación diferencial de balance y factorizando <code className="text-blue-600 dark:text-blue-300 font-mono font-bold">P(t)</code>:
                </p>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2 font-mono text-xs shadow-xs">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">dP / dt</span>
                    <span>=</span>
                    <span>P(t) · n - P(t) · (1 / E_v)</span>
                    <span>=</span>
                    <span className="text-purple-700 dark:text-purple-300 font-bold">P(t) · [ n - (1 / E_v) ]</span>
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-semibold pl-4 border-l-2 border-purple-400 dark:border-purple-500/40">
                    Definiendo r = n - (1 / E_v) = 0.05 - 0.01 = 0.04 año⁻¹ (Tasa intrínseca neta del +4%)
                  </div>
                  <div className="text-slate-500 text-[11px] font-sans pt-1">
                    Integrando por el método clásico de separación de variables:
                  </div>
                  <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-white/5 shadow-xs">
                    <span>∫ (1 / P) dP = ∫ r dt</span>
                    <span>⇒</span>
                    <span>ln(P) = r·t + C</span>
                    <span>⇒</span>
                    <span className="text-purple-700 dark:text-yellow-300 font-bold">P(t) = P₀ · e^(r · t) = 1,000 · e^(0.04 · t)</span>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-3 shadow-xs hover:border-amber-400 dark:hover:border-yellow-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-yellow-500/20 text-amber-600 dark:text-yellow-400 text-xs font-bold ring-1 ring-amber-300 dark:ring-yellow-500/30">
                      5
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Discretización Numérica de Euler (Como opera este Simulador)
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-yellow-400 uppercase tracking-wider bg-amber-50 dark:bg-yellow-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-yellow-500/20">
                    Método de Euler
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Las computadoras no resuelven ecuaciones diferenciales continuas de forma analítica en cada iteración de un sistema no lineal complejo; en su lugar, dividen el horizonte temporal en pequeños pasos discretos de integración <code className="text-amber-700 dark:text-yellow-300 font-mono font-bold">dt</code> (o <code className="text-amber-700 dark:text-yellow-300 font-mono font-bold">Δt</code>).
                  Aproximando la derivada por diferencias finitas hacia adelante:
                </p>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2 font-mono text-xs shadow-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span>dP / dt ≈ [ P(t + dt) - P(t) ] / dt = Nacimientos(t) - Defunciones(t)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">P(t + dt)</span>
                    <span>=</span>
                    <span className="text-blue-700 dark:text-blue-300">P(t)</span>
                    <span>+</span>
                    <span>[ Nacimientos(t) - Defunciones(t) ] × dt</span>
                  </div>
                  <div className="text-slate-500 text-[11px] font-sans pt-1">
                    Sustituyendo los valores del Caso 5.1 con <code className="text-amber-700 dark:text-yellow-300 font-mono font-bold">dt = 1 año</code>:
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs">
                    P(t + 1) = P(t) + [ 0.05·P(t) - 0.01·P(t) ] × 1 = P(t) × (1 + 0.04) = P(t) × 1.04
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans italic">
                    Cada año transcurrido, la población simulada es exactamente un 104% (un 4% adicional) de la del año previo: P(t) = 1,000 × (1.04)^t.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <GitCompare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Aproximación Numérica de Euler vs Solución Analítica Continua
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Observa cómo cambia la precisión y el error de truncamiento numérico al modificar el paso de integración dt
                    </p>
                  </div>

                  {/* dt selector */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200 dark:border-white/10 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">Paso (dt):</span>
                    {[0.1, 0.5, 1, 2].map((stepVal) => (
                      <button
                        key={stepVal}
                        onClick={() => setInteractiveDt(stepVal)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          interactiveDt === stepVal
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-900'
                        }`}
                      >
                        {stepVal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mathematical convergence note */}
                <div className="rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50/60 dark:bg-purple-950/15 p-3 flex items-start gap-2.5 text-xs text-purple-900 dark:text-purple-200/90">
                  <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-purple-700 dark:text-purple-300">Teorema de Convergencia del Número e: </span>
                    A medida que <code className="font-mono font-bold">dt → 0</code>, la aproximación discreta de Euler 
                    <code className="font-mono font-bold"> lim_(dt→0) [1 + r·dt]^(t/dt) = e^(r·t)</code> converge exactamente hacia la solución continua analítica.
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-950/60 shadow-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 font-semibold">
                      <tr>
                        <th className="px-4 py-2.5">Año (t)</th>
                        <th className="px-4 py-2.5 text-blue-600 dark:text-blue-400">Euler P(t) [dt={interactiveDt}]</th>
                        <th className="px-4 py-2.5 text-purple-600 dark:text-purple-400">Analítica Exacta [1000·e^0.04t]</th>
                        <th className="px-4 py-2.5 text-slate-600 dark:text-slate-300">Diferencia Absoluta</th>
                        <th className="px-4 py-2.5 text-right">Error Numérico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                      {comparisonData.map((row) => (
                        <tr key={row.t} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300">{row.t} años</td>
                          <td className="px-4 py-2 text-blue-700 dark:text-blue-300 font-semibold">
                            {row.euler.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                          </td>
                          <td className="px-4 py-2 text-purple-700 dark:text-purple-300 font-semibold">
                            {row.exact.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                          </td>
                          <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                            ±{row.diff.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} hab
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-amber-600 dark:text-yellow-400">
                            {row.errorPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">¿Por qué Euler subestima levemente el valor?</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      El método de Euler hacia adelante calcula la pendiente al inicio de cada intervalo <code className="font-mono text-slate-800 dark:text-slate-300">t</code> y la asume constante durante todo el paso <code className="font-mono text-slate-800 dark:text-slate-300">dt</code>. En una curva convexa exponencial creciente, la derivada real aumenta continuamente, por lo que Euler siempre queda ligeramente por debajo de la curva analítica ideal.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Recomendación para el Modelador</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      Para garantizar estabilidad numérica y errores inferiores al 1%, el paso de integración debe cumplir la condición de Forrester: <code className="text-purple-600 dark:text-purple-300 font-mono font-bold">dt ≤ 1 / (4 · |r|)</code>. Con <code className="font-mono text-slate-800 dark:text-slate-300">r = 0.04</code>, cualquier <code className="font-mono text-slate-800 dark:text-slate-300">dt ≤ 1.0</code> garantiza excelente fidelidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loops' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 p-5 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Causalidad y Dominancia de Bucles (Feedback Loops)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Análisis estructural de la retroalimentación que determina el comportamiento del sistema
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reinforcing Loop */}
                  <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-950/15 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" /> Bucle de Refuerzo (R+)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono">
                        Ganancia: +0.05
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      Circuito cerrado de realimentación positiva:
                      <br />
                      <strong className="text-emerald-800 dark:text-emerald-300 font-mono">Población (+) → Nacimientos (+) → Población</strong>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Multiplica el estado del sistema. Por sí solo, generaría un crecimiento exponencial desenfrenado a un ritmo del 5% anual.
                    </p>
                  </div>

                  {/* Balancing Loop */}
                  <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-500/25 bg-rose-50 dark:bg-rose-950/15 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowDownRight className="h-4 w-4" /> Bucle de Balance (B-)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-mono">
                        Ganancia: -0.01
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      Circuito cerrado de realimentación negativa:
                      <br />
                      <strong className="text-rose-800 dark:text-rose-300 font-mono">Población (+) → Defunciones (-) → Población</strong>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Drena y estabiliza el stock. Ejerce una fuerza de resistencia restando el 1% anual de la población acumulada.
                    </p>
                  </div>
                </div>

                {/* Dominance conclusion */}
                <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/70 p-4 space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Veredicto de Dominancia Estructural
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Dado que la ganancia del bucle de refuerzo (<span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">+0.05</span>) supera numéricamente la ganancia del bucle de balance (<span className="text-rose-700 dark:text-rose-400 font-mono font-bold">-0.01</span>), el sistema exhibe <strong>dominancia permanente del bucle positivo</strong> con una tasa neta resultante de <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">r = +0.04</span>. En ausencia de una capacidad de carga o bucle de saturación (como en los modelos logísticos de Verhulst), la población crecerá indefinidamente hacia el infinito.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200 dark:border-white/10 px-6 py-3.5 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
              <Bot className="h-3.5 w-3.5" /> Desarrollado por Agentes de IA
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden sm:inline">
              Presiona <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 font-mono text-[10px]">Esc</kbd> para volver
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-xs font-semibold text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
          >
            Entendido, volver al Simulador
          </button>
        </div>
      </div>
    </div>
  );
}
