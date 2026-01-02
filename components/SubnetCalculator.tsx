
import React, { useState, useEffect } from 'react';

const SubnetCalculator: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    try {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return;

      const mask = (0xffffffff << (32 - cidr)) >>> 0;
      const ipNum = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0;
      
      const networkNum = (ipNum & mask) >>> 0;
      const broadcastNum = (networkNum | (~mask >>> 0)) >>> 0;
      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

      const toIP = (num: number) => [
        (num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff
      ].join('.');

      setResults({
        network: toIP(networkNum),
        broadcast: toIP(broadcastNum),
        mask: toIP(mask),
        firstHost: usableHosts > 0 ? toIP(networkNum + 1) : 'N/A',
        lastHost: usableHosts > 0 ? toIP(broadcastNum - 1) : 'N/A',
        hosts: usableHosts > 0 ? usableHosts : totalHosts
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(calculate, [ip, cidr]);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-full">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-calculator text-indigo-400"></i> Alt Ağ Hesaplayıcı
      </h3>
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="col-span-2">
          <label className="text-[9px] text-slate-500 uppercase font-black block mb-1 ml-1">IP Adresi</label>
          <input 
            type="text" value={ip} onChange={(e) => setIp(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div>
          <label className="text-[9px] text-slate-500 uppercase font-black block mb-1 ml-1">CIDR</label>
          <input 
            type="number" min="0" max="32" value={cidr} onChange={(e) => setCidr(parseInt(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
          <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <span className="text-slate-500 block text-[9px] mb-1">AĞ ADRESİ</span>
            <span className="text-indigo-400 font-bold">{results.network}</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <span className="text-slate-500 block text-[9px] mb-1">YAYIN (BC)</span>
            <span className="text-rose-400 font-bold">{results.broadcast}</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <span className="text-slate-500 block text-[9px] mb-1">ALT AĞ MASKESİ</span>
            <span className="text-slate-300">{results.mask}</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <span className="text-slate-500 block text-[9px] mb-1">HOST KAPASİTESİ</span>
            <span className="text-emerald-400 font-bold">{results.hosts}</span>
          </div>
          <div className="col-span-2 bg-slate-900/50 p-2 rounded border border-slate-700/50 flex justify-between">
            <div>
              <span className="text-slate-500 block text-[9px] mb-1">İLK HOST</span>
              <span className="text-slate-400">{results.firstHost}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[9px] mb-1">SON HOST</span>
              <span className="text-slate-400">{results.lastHost}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubnetCalculator;
