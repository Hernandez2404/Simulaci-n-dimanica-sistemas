import { useState, useEffect } from 'react';
import { BookOpen, X, Play, CheckCircle2, Layers, ArrowRightLeft, Variable, Sigma, Bot } from 'lucide-react';

const EXERCISES = [
  {
    id: 'poblacion',
    title: 'Ejercicio 5.1: Modelo Poblacional (Malthus / Forrester)',
    category: 'Crecimiento Exponencial',
    badgeColor: 'blue',
    statement: 'Estudia la evolución de una población cerrada con 1,000 habitantes iniciales. Los nacimientos son proporcionales a la población según una tasa de natalidad constante del 5% anual, mientras que las defunciones dependen de una esperanza de vida promedio de 100 años.',
    elements: {
      stocks: 'Población (1000 hab)',
      inflow: 'Nacimientos = Población × Tasa_Natalidad (0.05)',
      outflow: 'Defunciones = Población ÷ Esperanza_Vida (100)',
      aux: 'Tasa_Natalidad = 0.05, Esperanza_Vida = 100 años'
    },
    deduction: [
      { step: '1. Balance de Conservación', math: 'dP/dt = Nacimientos - Defunciones', desc: 'Principio de continuidad: la variación del stock Población equivale a entradas menos salidas.' },
      { step: '2. Tasa de Natalidad (Inflow)', math: 'Nacimientos = P(t) × n = P(t) × 0.05', desc: 'Fecundidad proporcional per cápita (bucle de realimentación positiva R).' },
      { step: '3. Tasa de Mortalidad (Outflow)', math: 'Defunciones = P(t) / Ev = P(t) × 0.01', desc: 'La probabilidad anual de muerte es el inverso de la esperanza de vida (m = 1/100).' },
      { step: '4. Ecuación Diferencial & Solución Continua', math: 'dP/dt = P·(0.05 - 0.01) = 0.04·P  ⇒  P(t) = 1,000·e^(0.04·t)', desc: 'Tasa intrínseca neta r = +4% anual. Genera un crecimiento exponencial ininterrumpido.' },
      { step: '5. Discretización de Euler (Simulador)', math: 'P(t + dt) = P(t) + [Nacimientos - Defunciones] × dt', desc: 'Con dt=1 año: P(t + 1) = P(t) × 1.04 (crece 4% anual de forma discreta recurrente).' }
    ],
    analysis: 'Al ser la tasa de natalidad (5%) mayor que la tasa bruta de mortalidad (1% = 1/100), la tasa neta de crecimiento es del +4% anual. Esto genera un bucle de realimentación positiva que produce un crecimiento exponencial acelerado de la población.',
    modelId: 'poblacion'
  },
  {
    id: 'helpdesk',
    title: 'Ejercicio 5.2: Mesa de Ayuda (Help Desk TI)',
    category: 'Comportamiento Lineal',
    badgeColor: 'emerald',
    statement: 'Un departamento de soporte de TI tiene inicialmente 50 tickets sin resolver. Cada día, los usuarios reportan 20 nuevos problemas (Tasa de Llegada). Por su parte, el equipo de técnicos logra resolver 25 problemas al día (Tasa de Resolución). Si estas tasas se mantienen constantes, ¿qué sucederá con el número de tickets sin resolver al cabo de unos días?',
    elements: {
      stocks: 'Tickets Pendientes (50 tickets iniciales)',
      inflow: 'Llegada de Tickets (20 tickets/día constante)',
      outflow: 'Resolución de Tickets (25 tickets/día constante)',
      aux: 'Tasa_Llegada = 20, Tasa_Resolucion = 25'
    },
    deduction: [
      { step: '1. Balance de Masa', math: 'dT/dt = Llegada - Resolución = 20 - 25 = -5 tickets/día', desc: 'Ambos flujos son constantes exógenas, por lo que la derivada neta es constante.' },
      { step: '2. Solución Analítica', math: 'T(t) = T₀ - 5·t = 50 - 5·t', desc: 'Decremento estrictamente lineal sin realimentación de estado.' },
      { step: '3. Punto de Agotamiento', math: 'T(t) = 0  ⇒  50 - 5·t = 0  ⇒  t = 10 días', desc: 'La cola de tickets pendientes se vacía por completo exactamente al décimo día.' }
    ],
    analysis: 'Al ser el flujo de salida (25 tickets/día) estrictamente mayor que el flujo de entrada (20 tickets/día), la acumulación neta es negativa (-5 tickets/día). El sistema exhibe un decremento lineal que agota todos los tickets pendientes exactamente en 10 días.',
    modelId: 'helpdesk'
  },
  {
    id: 'inventario',
    title: 'Ejercicio 5.3: Gestión de Inventario',
    category: 'Bucle Negativo / Equilibrio',
    badgeColor: 'purple',
    statement: 'Una bodega de almacén comienza el mes con 500 pares de zapatos. Todos los días ingresan 50 pares nuevos directamente desde la fábrica a un ritmo constante. Sin embargo, la tienda vende diariamente el 15% de todo el inventario que tenga disponible en ese momento en la bodega. ¿Cómo se comportará el inventario a lo largo del tiempo?',
    elements: {
      stocks: 'Inventario (500 pares)',
      inflow: 'Envíos de Fábrica (50 pares/día)',
      outflow: 'Ventas = Inventario × 0.15 (15% del inventario)',
      aux: 'Fracción_Ventas = 0.15'
    },
    deduction: [
      { step: '1. Balance con Realimentación Negativa', math: 'dI/dt = Envíos - Ventas = 50 - 0.15·I(t)', desc: 'La tasa de salida aumenta a medida que crece el inventario, autorregulando el sistema.' },
      { step: '2. Condición de Estado Estacionario (Homeostasis)', math: 'dI/dt = 0  ⇒  50 - 0.15·I* = 0  ⇒  I* = 50 / 0.15 ≈ 333.33 pares', desc: 'El inventario converge asintóticamente hacia el punto donde entradas igualan salidas.' },
      { step: '3. Solución Analítica Completa', math: 'I(t) = 333.33 + (500 - 333.33)·e^(-0.15·t)', desc: 'Caída exponencial decreciente que estabiliza el stock en 333.33 unidades.' }
    ],
    analysis: 'Dado que las ventas dependen directamente del nivel de inventario actual, se forma un bucle de retroalimentación negativa que busca el equilibrio (homeostasis). Inicialmente salen 75 (15% de 500) y entran 50, provocando que el stock disminuya con pendiente decreciente hasta estabilizarse en 333.3 unidades (donde Entradas = Salidas).',
    modelId: 'inventario'
  }
];

export default function ExercisesModal({ isOpen, onClose, onSelectExercise, currentModelId, onOpenDeduction }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState('poblacion');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentExercise = EXERCISES.find(e => e.id === selectedExerciseId) || EXERCISES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="relative flex flex-col w-full max-w-4xl max-h-[88vh] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0C1222] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Guía de Ejercicios Prácticos</h2>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30">
                  <Bot className="h-3 w-3" /> IA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Problemas clásicos y análisis formal de Dinámica de Sistemas</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Layout: Sidebar Tabs + Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Exercises Navigation Tabs */}
          <div className="w-64 border-r border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-950/40 p-3 space-y-1.5 overflow-y-auto">
            <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Catálogo de Casos
            </span>
            {EXERCISES.map((ex) => {
              const isSelected = ex.id === selectedExerciseId;
              const isCurrentActive = ex.modelId === currentModelId;

              return (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">
                      {ex.category}
                    </span>
                    {isCurrentActive && (
                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 font-mono">
                        Activo
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold leading-snug text-slate-800 dark:text-slate-200 line-clamp-2">
                    {ex.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Exercise Content Detail */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white dark:bg-gradient-to-b dark:from-slate-900/20 dark:to-transparent">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                  {currentExercise.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {currentExercise.title}
              </h3>
            </div>

            {/* Statement */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Enunciado del Problema
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {currentExercise.statement}
              </p>
            </div>

            {/* Elements breakdown */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Estructura y Ecuaciones de Forrester
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 shadow-xs">
                  <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Nivel (Stock)</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{currentExercise.elements.stocks}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 shadow-xs">
                  <ArrowRightLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Flujo de Entrada</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{currentExercise.elements.inflow}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 shadow-xs">
                  <ArrowRightLeft className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Flujo de Salida</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{currentExercise.elements.outflow}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 shadow-xs">
                  <Variable className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Variables Auxiliares</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{currentExercise.elements.aux}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mathematical Deduction */}
            {currentExercise.deduction && (
              <div className="rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Sigma className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Deducción Formal de las Ecuaciones
                  </span>
                  {currentExercise.id === 'poblacion' && onOpenDeduction && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDeduction();
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-500/30 transition-all cursor-pointer shadow-xs"
                    >
                      <Sigma className="h-3 w-3" />
                      <span>Ver Demostración Completa</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {currentExercise.deduction.map((d, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-purple-100 dark:border-white/5 space-y-1 text-xs shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{d.step}</span>
                        <code className="font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/20">
                          {d.math}
                        </code>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {d.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytical Resolution */}
            <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/25 bg-emerald-50/60 dark:bg-emerald-950/15 p-4 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Respuesta y Análisis Dinámico
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentExercise.analysis}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200 dark:border-white/10 px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
              <Bot className="h-3.5 w-3.5" /> Desarrollado por Agentes de IA
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 font-mono text-[10px]">Esc</kbd> para cerrar
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                if (onSelectExercise) onSelectExercise(currentExercise.modelId);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Cargar este modelo en el Simulador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
