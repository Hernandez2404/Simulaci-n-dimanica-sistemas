import { useState } from 'react';

export default function ExercisesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            Ejercicios Prácticos
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-h-0 p-6 overflow-y-auto no-scrollbar flex flex-col gap-6">
          <ExerciseCard 
            title="Ejercicio Adicional: Mesa de Ayuda (Help Desk)"
            statement="Un departamento de soporte de TI tiene inicialmente 50 tickets sin resolver. Cada día, los usuarios reportan 20 nuevos problemas (Tasa de Llegada). Por su parte, el equipo de técnicos logra resolver 25 problemas al día (Tasa de Resolución). Si estas tasas se mantienen constantes, ¿qué sucederá con el número de tickets sin resolver al cabo de unos días?"
            answer="Elementos: Tickets Pendientes (Nivel), Llegada de Tickets (Flujo de entrada), Resolución de Tickets (Flujo de salida). Al ser el flujo de salida (25) mayor que el flujo de entrada (20), el nivel disminuirá de forma lineal (5 tickets menos cada día). Al cabo de 10 días, el nivel de tickets sin resolver llegará a 0 y se habrá agotado el trabajo pendiente."
          />

          <ExerciseCard 
            title="Ejercicio Adicional: Gestión de Inventario (Bucle Negativo)"
            statement="Una bodega de almacén comienza el mes con 500 pares de zapatos. Todos los días ingresan 50 pares nuevos directamente desde la fábrica a un ritmo constante. Sin embargo, la tienda es muy popular y vende diariamente el 15% de todo el inventario que tenga disponible en ese momento en la bodega. ¿Cómo se comportará el inventario a lo largo del tiempo?"
            answer="Elementos: Inventario (Nivel), Envíos de Fábrica (Flujo de entrada), Ventas (Flujo de salida). Como las ventas dependen del inventario actual (0.15 * Inventario), se trata de un bucle de retroalimentación negativa. Inicialmente entran 50 y salen 75 (15% de 500), así que el inventario bajará. Con el tiempo se estabilizará (comportamiento asintótico) en el punto donde las Entradas = Salidas, lo cual sucederá cuando el 15% del inventario sea igual a 50 (Inventario en equilibrio = 333.3 pares)."
          />
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ title, statement, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col h-[280px]">
      <div className={`absolute top-0 left-0 w-1 h-full ${showAnswer ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
      <h3 className="text-lg font-semibold text-blue-400 mb-3 shrink-0">{title}</h3>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
        {!showAnswer ? (
          <div className="text-slate-300 text-sm leading-relaxed">
            <strong className="text-slate-400 uppercase text-xs tracking-wider block mb-1">Enunciado:</strong>
            {statement}
          </div>
        ) : (
          <div className="bg-slate-800 border-l-4 border-emerald-500 rounded-r-lg p-4 text-slate-100 text-sm leading-relaxed shadow-inner">
            <strong className="text-emerald-400 uppercase text-xs tracking-wider block mb-2">Respuesta y Análisis:</strong>
            {answer}
          </div>
        )}
      </div>
      
      <div className="pt-4 mt-2 border-t border-slate-800 shrink-0">
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex items-center justify-center gap-2 text-sm font-medium transition-colors border px-4 py-2 rounded-lg w-full ${
            showAnswer 
              ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700' 
              : 'bg-blue-900/30 border-blue-800/50 text-blue-300 hover:bg-blue-800/40'
          }`}
        >
          {showAnswer ? (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
               Volver al Enunciado
             </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Ver Solución
            </>
          )}
        </button>
      </div>
    </div>
  );
}
