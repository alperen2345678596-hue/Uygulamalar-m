
import React, { useState } from 'react';

const NetworkHealth: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const targets = [
    { name: 'Google Global', url: 'https://8.8.8.8' },
    { name: 'Cloudflare Edge', url: 'https://1.1.1.1' },
    { name: 'Amazon AWS', url: 'https://checkip.amazonaws.com' },
    { name: 'Microsoft Azure', url: 'https://www.microsoft.com' }
  ];

  const runHealthCheck = async () => {
    setTesting(true);
    setTests([]);
    const results = [];
    
    for (const target of targets) {
      const start = performance.now();
      try {
        await fetch(target.url, { mode: 'no-cors', cache: 'no-cache' });
        const end = performance.now();
        results.push({ name: target.name, latency: Math.round(end - start), status: 'ok' });
      } catch {
        results.push({ name: target.name, latency: 0, status: 'error' });
      }
    }
    setTests(results);
    setTesting(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <i className="fa-solid fa-heart-pulse text-rose-500"></i> Ağ Sağlık Durumu
        </h3>
        <button 
          onClick={runHealthCheck} disabled={testing}
          className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-all"
        >
          {testing ? 'KONTROL EDİLİYOR...' : 'TÜMÜNÜ TEST ET'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {targets.map(t => {
          const result = tests.find(res => res.name === t.name);
          return (
            <div key={t.name} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center md:flex-col md:items-start md:gap-4">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{t.name}</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${result?.status === 'ok' ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {result ? (result.status === 'ok' ? result.latency : '--') : '??'}
                </span>
                {result?.status === 'ok' && <span className="text-slate-600 text-[10px] font-bold">ms</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkHealth;
