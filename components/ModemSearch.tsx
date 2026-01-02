
import React, { useState } from 'react';
import { MODEM_DATA } from '../constants';
import { ModemCredential } from '../types';

const ModemSearch: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = MODEM_DATA.filter(m => 
    m.brand.toLowerCase().includes(search.toLowerCase()) ||
    m.defaultIp.includes(search)
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Kopyalandı: ' + text);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-house-signal text-emerald-400"></i>
          Modem Giriş Bilgileri
        </h2>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input 
            type="text" 
            placeholder="Marka ara (örn: TP-Link, Zyxel...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.length > 0 ? filtered.map((modem, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="font-bold text-slate-100">{modem.brand}</span>
              <button 
                onClick={() => copyToClipboard(modem.defaultIp)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-1 rounded font-mono border border-slate-700 transition-colors"
              >
                {modem.defaultIp} <i className="fa-regular fa-copy ml-1"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div 
                className="bg-slate-800 p-2 rounded cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => copyToClipboard(modem.username)}
              >
                <span className="text-slate-500 block text-[9px] uppercase font-bold mb-1">Kullanıcı</span>
                <span className="text-slate-300 font-mono truncate">{modem.username}</span>
              </div>
              <div 
                className="bg-slate-800 p-2 rounded cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => copyToClipboard(modem.password)}
              >
                <span className="text-slate-500 block text-[9px] uppercase font-bold mb-1">Şifre</span>
                <span className="text-slate-300 font-mono truncate">{modem.password}</span>
              </div>
            </div>
            {modem.notes && (
              <p className="text-[10px] text-slate-500 mt-2 italic">* {modem.notes}</p>
            )}
          </div>
        )) : (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm">Eşleşen sonuç bulunamadı.</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

export default ModemSearch;
