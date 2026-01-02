
import React, { useEffect, useState } from 'react';
import { IPInfo } from '../types';

const IPDetails: React.FC = () => {
  const [ipData, setIpData] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setIpData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-slate-800 p-12 rounded-3xl border border-slate-700 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 animate-pulse">IP Bilgileri Alınıyor...</p>
    </div>
  );

  return (
    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <i className="fa-solid fa-map-location-dot text-9xl"></i>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Mevcut Bağlantınız</h2>
          <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">{ipData?.ip}</div>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
            <i className="fa-solid fa-tower-broadcast"></i> {ipData?.org}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 w-full border-t md:border-t-0 md:border-l border-slate-700 md:pl-8 pt-8 md:pt-0">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Şehir / Ülke</span>
            <span className="text-white font-bold">{ipData?.city}, {ipData?.country_name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">ISP ASN</span>
            <span className="text-white font-bold">{ipData?.asn}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Bölge</span>
            <span className="text-white font-bold">{ipData?.region}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPDetails;
