
import React from 'react';
import { DNSServer, TestResult } from '../types';

interface Props {
  server: DNSServer;
  result?: TestResult;
  isTesting: boolean;
  onRemove?: (id: string) => void;
}

const DNSCard: React.FC<Props> = ({ server, result, isTesting, onRemove }) => {
  const getLatencyColor = (ms: number) => {
    if (ms < 30) return 'text-emerald-400';
    if (ms < 100) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getLatencyBg = (ms: number) => {
    if (ms < 30) return 'bg-emerald-500/10 border-emerald-500/30';
    if (ms < 100) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${result?.status === 'success' ? getLatencyBg(result.latency) : 'bg-slate-800 border-slate-700'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="font-bold text-lg text-white truncate">{server.name}</h3>
          <p className="text-slate-400 text-[10px] font-mono truncate uppercase tracking-tighter">{server.provider}</p>
        </div>
        {server.isCustom && onRemove && (
          <button 
            onClick={() => onRemove(server.id)}
            className="text-slate-500 hover:text-rose-500 transition-colors p-1"
            title="Kaldır"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Gecikme</span>
          <div className="flex items-baseline gap-1">
            {isTesting ? (
              <div className="h-8 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            ) : result ? (
              <>
                <span className={`text-3xl font-black ${result.status === 'success' ? getLatencyColor(result.latency) : 'text-slate-600'}`}>
                  {result.status === 'success' ? result.latency : '--'}
                </span>
                {result.status === 'success' && <span className="text-slate-500 text-sm font-bold">ms</span>}
              </>
            ) : (
              <span className="text-slate-600 text-3xl font-black italic">Hazır</span>
            )}
          </div>
        </div>
        
        {result?.status === 'success' && (
          <div className="text-right">
             <span className="text-[10px] text-slate-500 block mb-1">Cevaplar</span>
             <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
               {result.answerCount ?? 0} Kayıt
             </span>
          </div>
        )}
      </div>
      
      {result?.status === 'error' && (
        <div className="mt-2 p-2 bg-rose-500/10 rounded border border-rose-500/20">
          <p className="text-[9px] text-rose-400 uppercase font-black leading-tight flex items-center gap-1">
            <i className="fa-solid fa-triangle-exclamation"></i>
            Bağlantı Hatası
          </p>
          <p className="text-[8px] text-rose-500/70 mt-1 leading-tight italic">
            Bu sunucu tarayıcı sorgularını (CORS) kısıtlıyor olabilir.
          </p>
        </div>
      )}
    </div>
  );
};

export default DNSCard;
