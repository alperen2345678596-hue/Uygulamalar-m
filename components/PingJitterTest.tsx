
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const PingJitterTest: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({ ping: 0, jitter: 0, quality: 'N/A' });
  const intervalRef = useRef<number | null>(null);

  const runPing = async () => {
    const start = performance.now();
    try {
      // Smallest possible resource for a fast ping
      await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-cache' });
      const latency = Math.round(performance.now() - start);
      
      setData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), ms: latency }].slice(-20);
        
        // Calculate Jitter (average difference between consecutive pings)
        if (newData.length > 1) {
          let totalDiff = 0;
          for (let i = 1; i < newData.length; i++) {
            totalDiff += Math.abs(newData[i].ms - newData[i - 1].ms);
          }
          const jitter = Math.round(totalDiff / (newData.length - 1));
          
          let quality = 'Mükemmel';
          if (latency > 100 || jitter > 20) quality = 'Orta';
          if (latency > 200 || jitter > 50) quality = 'Zayıf';

          setStats({ ping: latency, jitter, quality });
        } else {
          setStats(s => ({ ...s, ping: latency }));
        }
        
        return newData;
      });
    } catch (e) {
      console.error("Ping error", e);
    }
  };

  const toggleTest = () => {
    if (isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
    } else {
      setData([]);
      setIsActive(true);
      intervalRef.current = window.setInterval(runPing, 1000);
    }
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <i className="fa-solid fa-chart-line text-blue-400"></i> Bağlantı Kararlılığı
        </h3>
        <button 
          onClick={toggleTest}
          className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${isActive ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}
        >
          {isActive ? 'DURDUR' : 'BAŞLAT'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900 p-2 rounded border border-slate-700">
          <span className="text-[9px] text-slate-500 block uppercase font-black">Ping</span>
          <span className="text-lg font-black text-white">{stats.ping}<span className="text-[10px] ml-0.5 text-slate-500">ms</span></span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-700">
          <span className="text-[9px] text-slate-500 block uppercase font-black">Jitter</span>
          <span className="text-lg font-black text-white">{stats.jitter}<span className="text-[10px] ml-0.5 text-slate-500">ms</span></span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-700">
          <span className="text-[9px] text-slate-500 block uppercase font-black">Kalite</span>
          <span className={`text-[11px] font-black uppercase mt-1 block ${stats.quality === 'Mükemmel' ? 'text-emerald-400' : stats.quality === 'Orta' ? 'text-amber-400' : 'text-rose-400'}`}>
            {stats.quality}
          </span>
        </div>
      </div>

      <div className="flex-1 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '10px' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="ms" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PingJitterTest;
