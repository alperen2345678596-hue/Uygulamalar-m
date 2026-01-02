
import React, { useState } from 'react';

const DNSLookup: React.FC = () => {
  const [target, setTarget] = useState('');
  const [type, setType] = useState('A');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!target) return;
    setLoading(true);
    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${target}&type=${type}`, {
        headers: { 'Accept': 'application/dns-json' }
      });
      const data = await res.json();
      setResults(data.Answer || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-magnifying-glass-nodes text-blue-400"></i> DNS Kayıt Sorgulama
      </h3>
      <div className="flex gap-2 mb-4">
        <input 
          type="text" placeholder="google.com" value={target} onChange={(e) => setTarget(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 text-sm text-white outline-none">
          <option>A</option><option>AAAA</option><option>MX</option><option>TXT</option><option>NS</option>
        </select>
        <button onClick={lookup} className="bg-blue-600 px-4 rounded-lg text-white"><i className="fa-solid fa-search"></i></button>
      </div>
      
      <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
        {loading ? <p className="text-center text-slate-500 py-4 text-xs animate-pulse">Sorgulanıyor...</p> : 
         results.length > 0 ? results.map((r, i) => (
           <div key={i} className="bg-slate-900 p-2 rounded border border-slate-700/50 text-[11px] font-mono break-all text-slate-300">
             {r.data}
           </div>
         )) : <p className="text-center text-slate-500 py-4 text-xs italic">Kayıt bulunamadı.</p>}
      </div>
    </div>
  );
};

export default DNSLookup;
