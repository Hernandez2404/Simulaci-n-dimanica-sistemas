export const MODELS = {
  poblacion: {
    id: 'poblacion',
    title: 'Ejercicio 5.1: Dinámica Poblacional',
    category: 'Crecimiento Exponencial',
    badge: 'Malthus / Forrester',
    description: 'Bucle de realimentación positiva gobernado por nacimientos y defunciones.',
    settings: { simulation_time: 50, dt: 1 },
    stocks: [{ id: 'Poblacion', initial_value: 1000 }],
    flows: [
      { id: 'Nacimientos', equation: 'Poblacion * Tasa_Natalidad', flowType: 'inflow' },
      { id: 'Defunciones', equation: 'Poblacion / Esperanza_Vida', flowType: 'outflow' }
    ],
    auxiliaries: [
      { id: 'Tasa_Natalidad', value: 0.05 },
      { id: 'Esperanza_Vida', value: 100 }
    ],
    structure: {
      Poblacion: { inflows: ['Nacimientos'], outflows: ['Defunciones'] }
    },
    params: [
      { key: 'Poblacion', target: 'stock', label: 'Población Inicial (hab)', min: 100, max: 5000, step: 100, default: 1000 },
      { key: 'Tasa_Natalidad', target: 'aux', label: 'Tasa de Natalidad (anual)', min: 0.01, max: 0.20, step: 0.005, default: 0.05 },
      { key: 'Esperanza_Vida', target: 'aux', label: 'Esperanza de Vida (años)', min: 20, max: 150, step: 5, default: 100 },
      { key: 'simulation_time', target: 'setting', label: 'Tiempo Total (años)', min: 10, max: 100, step: 5, default: 50 },
      { key: 'dt', target: 'setting', label: 'Paso de Integración (dt)', min: 0.1, max: 2, step: 0.1, default: 1 }
    ],
    equations: [
      { var: 'Población(t)', type: 'stock', eq: 'Población(t - dt) + (Nacimientos - Defunciones) × dt' },
      { var: 'Nacimientos', type: 'inflow', eq: 'Población × Tasa_Natalidad' },
      { var: 'Defunciones', type: 'outflow', eq: 'Población ÷ Esperanza_Vida' }
    ],
    getInitialNodes: () => [
      { id: 'Poblacion', position: { x: 340, y: 150 }, type: 'stock', data: { label: 'Población', subtext: 'Stock Principal' } },
      { id: 'Nacimientos', position: { x: 80, y: 150 }, type: 'flow', data: { label: 'Nacimientos', equation: 'Pob × Tasa_Nat', flowType: 'inflow' } },
      { id: 'Defunciones', position: { x: 600, y: 150 }, type: 'flow', data: { label: 'Defunciones', equation: 'Pob ÷ Esp_Vida', flowType: 'outflow' } },
      { id: 'Tasa_Natalidad', position: { x: 80, y: 300 }, type: 'auxiliary', data: { label: 'Tasa Natalidad', value: 0.05 } },
      { id: 'Esperanza_Vida', position: { x: 600, y: 300 }, type: 'auxiliary', data: { label: 'Esperanza Vida', value: 100 } }
    ],
    getInitialEdges: () => [
      { id: 'e1', source: 'Tasa_Natalidad', target: 'Nacimientos', animated: true, style: { stroke: '#A855F7', strokeDasharray: '4,4' } },
      { id: 'e2', source: 'Poblacion', target: 'Nacimientos', animated: true, style: { stroke: '#3B82F6', strokeDasharray: '4,4' } },
      { id: 'e3', source: 'Poblacion', target: 'Defunciones', animated: true, style: { stroke: '#3B82F6', strokeDasharray: '4,4' } },
      { id: 'e4', source: 'Esperanza_Vida', target: 'Defunciones', animated: true, style: { stroke: '#A855F7', strokeDasharray: '4,4' } },
      { id: 'flow-in', source: 'Nacimientos', target: 'Poblacion', animated: true, style: { strokeWidth: 3, stroke: '#10B981' } },
      { id: 'flow-out', source: 'Poblacion', target: 'Defunciones', animated: true, style: { strokeWidth: 3, stroke: '#F43F5E' } }
    ]
  },
  helpdesk: {
    id: 'helpdesk',
    title: 'Ejercicio 5.2: Mesa de Ayuda (Help Desk TI)',
    category: 'Comportamiento Lineal',
    badge: 'Tasa Constante',
    description: 'Sistema de atención de soporte técnico donde la resolución supera a la llegada.',
    settings: { simulation_time: 20, dt: 1 },
    stocks: [{ id: 'Tickets_Pendientes', initial_value: 50 }],
    flows: [
      { id: 'Llegada_Tickets', equation: 'Tasa_Llegada', flowType: 'inflow' },
      { id: 'Resolucion_Tickets', equation: 'Tasa_Resolucion', flowType: 'outflow' }
    ],
    auxiliaries: [
      { id: 'Tasa_Llegada', value: 20 },
      { id: 'Tasa_Resolucion', value: 25 }
    ],
    structure: {
      Tickets_Pendientes: { inflows: ['Llegada_Tickets'], outflows: ['Resolucion_Tickets'] }
    },
    params: [
      { key: 'Tickets_Pendientes', target: 'stock', label: 'Tickets Iniciales', min: 10, max: 200, step: 5, default: 50 },
      { key: 'Tasa_Llegada', target: 'aux', label: 'Tasa Llegada (tickets/día)', min: 5, max: 50, step: 1, default: 20 },
      { key: 'Tasa_Resolucion', target: 'aux', label: 'Tasa Resolución (tickets/día)', min: 5, max: 50, step: 1, default: 25 },
      { key: 'simulation_time', target: 'setting', label: 'Días de Simulación', min: 5, max: 30, step: 1, default: 20 },
      { key: 'dt', target: 'setting', label: 'Paso dt (días)', min: 0.1, max: 2, step: 0.1, default: 1 }
    ],
    equations: [
      { var: 'Tickets(t)', type: 'stock', eq: 'Tickets(t - dt) + (Llegada - Resolución) × dt' },
      { var: 'Llegada', type: 'inflow', eq: 'Tasa_Llegada (20/día)' },
      { var: 'Resolución', type: 'outflow', eq: 'Tasa_Resolución (25/día)' }
    ],
    getInitialNodes: () => [
      { id: 'Tickets_Pendientes', position: { x: 340, y: 150 }, type: 'stock', data: { label: 'Tickets Pendientes', subtext: 'Cola de soporte' } },
      { id: 'Llegada_Tickets', position: { x: 80, y: 150 }, type: 'flow', data: { label: 'Llegada Tickets', equation: '20 tickets/día', flowType: 'inflow' } },
      { id: 'Resolucion_Tickets', position: { x: 600, y: 150 }, type: 'flow', data: { label: 'Resolución', equation: '25 tickets/día', flowType: 'outflow' } },
      { id: 'Tasa_Llegada', position: { x: 80, y: 300 }, type: 'auxiliary', data: { label: 'Tasa Llegada', value: 20 } },
      { id: 'Tasa_Resolucion', position: { x: 600, y: 300 }, type: 'auxiliary', data: { label: 'Tasa Resolución', value: 25 } }
    ],
    getInitialEdges: () => [
      { id: 'e1', source: 'Tasa_Llegada', target: 'Llegada_Tickets', animated: true, style: { stroke: '#A855F7', strokeDasharray: '4,4' } },
      { id: 'e2', source: 'Tasa_Resolucion', target: 'Resolucion_Tickets', animated: true, style: { stroke: '#A855F7', strokeDasharray: '4,4' } },
      { id: 'flow-in', source: 'Llegada_Tickets', target: 'Tickets_Pendientes', animated: true, style: { strokeWidth: 3, stroke: '#10B981' } },
      { id: 'flow-out', source: 'Tickets_Pendientes', target: 'Resolucion_Tickets', animated: true, style: { strokeWidth: 3, stroke: '#F43F5E' } }
    ]
  },
  inventario: {
    id: 'inventario',
    title: 'Ejercicio 5.3: Gestión de Inventario',
    category: 'Bucle Negativo / Homeostasis',
    badge: 'Equilibrio Asintótico',
    description: 'Regulación de existencias donde las ventas son proporcionales al inventario.',
    settings: { simulation_time: 40, dt: 1 },
    stocks: [{ id: 'Inventario', initial_value: 500 }],
    flows: [
      { id: 'Envios_Fabrica', equation: 'Tasa_Envios', flowType: 'inflow' },
      { id: 'Ventas', equation: 'Inventario * Fraccion_Ventas', flowType: 'outflow' }
    ],
    auxiliaries: [
      { id: 'Tasa_Envios', value: 50 },
      { id: 'Fraccion_Ventas', value: 0.15 }
    ],
    structure: {
      Inventario: { inflows: ['Envios_Fabrica'], outflows: ['Ventas'] }
    },
    params: [
      { key: 'Inventario', target: 'stock', label: 'Inventario Inicial (pares)', min: 100, max: 1000, step: 50, default: 500 },
      { key: 'Tasa_Envios', target: 'aux', label: 'Envíos Fábrica (pares/día)', min: 10, max: 100, step: 5, default: 50 },
      { key: 'Fraccion_Ventas', target: 'aux', label: 'Fracción Ventas (15% = 0.15)', min: 0.05, max: 0.40, step: 0.01, default: 0.15 },
      { key: 'simulation_time', target: 'setting', label: 'Días de Simulación', min: 10, max: 80, step: 5, default: 40 },
      { key: 'dt', target: 'setting', label: 'Paso dt (días)', min: 0.1, max: 2, step: 0.1, default: 1 }
    ],
    equations: [
      { var: 'Inventario(t)', type: 'stock', eq: 'Inventario(t - dt) + (Envíos - Ventas) × dt' },
      { var: 'Envíos', type: 'inflow', eq: 'Tasa_Envios (50/día)' },
      { var: 'Ventas', type: 'outflow', eq: 'Inventario × Fracción_Ventas (15%)' }
    ],
    getInitialNodes: () => [
      { id: 'Inventario', position: { x: 340, y: 150 }, type: 'stock', data: { label: 'Inventario Bodega', subtext: 'Pares en almacén' } },
      { id: 'Envios_Fabrica', position: { x: 80, y: 150 }, type: 'flow', data: { label: 'Envíos Fábrica', equation: '50 pares/día', flowType: 'inflow' } },
      { id: 'Ventas', position: { x: 600, y: 150 }, type: 'flow', data: { label: 'Ventas Diarias', equation: 'Inventario × 15%', flowType: 'outflow' } },
      { id: 'Tasa_Envios', position: { x: 80, y: 300 }, type: 'auxiliary', data: { label: 'Tasa Envíos', value: 50 } },
      { id: 'Fraccion_Ventas', position: { x: 600, y: 300 }, type: 'auxiliary', data: { label: 'Fracción Ventas', value: 0.15 } }
    ],
    getInitialEdges: () => [
      { id: 'e1', source: 'Tasa_Envios', target: 'Envios_Fabrica', animated: true, style: { stroke: '#A855F7', strokeDasharray: '4,4' } },
      { id: 'e2', source: 'Inventario', target: 'Ventas', animated: true, style: { stroke: '#3B82F6', strokeDasharray: '4,4' } },
      { id: 'e3', source: 'Fraccion_Ventas', target: 'Ventas', animated: true, style: { stroke: '#A855F7', strokeDasharray: '4,4' } },
      { id: 'flow-in', source: 'Envios_Fabrica', target: 'Inventario', animated: true, style: { strokeWidth: 3, stroke: '#10B981' } },
      { id: 'flow-out', source: 'Inventario', target: 'Ventas', animated: true, style: { strokeWidth: 3, stroke: '#F43F5E' } }
    ]
  }
};
