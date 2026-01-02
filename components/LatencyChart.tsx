
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TestResult, DNSServer } from '../types';

interface Props {
  results: TestResult[];
  servers: DNSServer[];
}

const LatencyChart: React.FC<Props> = ({ results, servers }) => {
  const data = results
    .filter(r => r.status === 'success')
    .map(r => ({
      name: servers.find(s => s.id === r.serverId)?.name || 'Unknown',
      latency: r.latency
    }))
    .sort((a, b) => a.latency - b.latency);

  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700 mt-6">
      <h3 className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-widest">Performans Karşılaştırması (ms)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#94a3b8" 
            fontSize={12} 
            width={100}
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="latency" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LatencyChart;
