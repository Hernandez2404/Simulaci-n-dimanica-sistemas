import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ResultsChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500 italic">Ejecuta la simulación para ver los resultados...</div>;
  }

  const keys = Object.keys(data[0]).filter(k => k !== 'time');
  const colors = {
    Poblacion: '#3B82F6',
    Nacimientos: '#10B981',
    Defunciones: '#F43F5E'
  };

  return (
    <div className="w-full h-full p-4 text-sm font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
          <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
            itemStyle={{ color: '#F8FAFC', fontWeight: '500' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {keys.map((key) => (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={colors[key] || '#8B5CF6'} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
