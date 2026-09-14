import { evaluate } from 'mathjs';

/**
 * Runs a System Dynamics simulation using Euler integration.
 * @param {Object} model - The model definition
 * @returns {Array} - The timeseries results
 */
export function runSimulation(model) {
  const { simulation_time = 50, dt = 1 } = model.settings || {};
  const { stocks = [], flows = [], auxiliaries = [], structure = {} } = model;

  const results = [];
  let state = {};
  
  // Initialize state
  stocks.forEach(s => { state[s.id] = Number(s.initial_value); });
  auxiliaries.forEach(a => { state[a.id] = Number(a.value); });
  
  // Simulation loop
  for (let t = 0; t <= simulation_time; t += dt) {
    // 1. Calculate flows
    const currentFlows = {};
    flows.forEach(f => {
      try {
        currentFlows[f.id] = evaluate(f.equation, state);
      } catch (e) {
        console.warn(`Error evaluating equation for flow ${f.id}:`, e);
        currentFlows[f.id] = 0;
      }
    });

    // 2. Save current state to results
    results.push({
      time: t,
      ...state,
      ...currentFlows
    });

    // 3. Update stocks for next timestep
    stocks.forEach(s => {
      let dStock = 0;
      const s_structure = structure[s.id];
      if (s_structure) {
        s_structure.inflows?.forEach(inflow => {
          dStock += currentFlows[inflow] || 0;
        });
        s_structure.outflows?.forEach(outflow => {
          dStock -= currentFlows[outflow] || 0;
        });
      }
      
      state[s.id] += dStock * dt;
    });
  }

  return results;
}
