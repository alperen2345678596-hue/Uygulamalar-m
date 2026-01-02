
import React, { useState, useCallback, useEffect } from 'react';
import { DNSServer, TestResult, DNSRecordType } from './types';
import { POPULAR_DNS, DEFAULT_DOMAIN } from './constants';
import { testDNSServer } from './services/dnsService';
import { analyzeResults } from './services/geminiService';
import DNSCard from './components/DNSCard';
import LatencyChart from './components/LatencyChart';
import ModemSearch from './components/ModemSearch';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dns' | 'modem'>('dns');
  const [servers, setServers] = useState<DNSServer[]>(POPULAR_DNS);
  const [results, setResults] = useState<TestResult[]>([]);
  const [domain, setDomain] = useState(DEFAULT_DOMAIN);
  const [isTesting, setIsTesting] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Custom DNS Form State
  const [customName, setCustomName] = useState('');
  const [customDoh, setCustomDoh] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    setResults([]);
    setAnalysis(null);
    
    const testPromises = servers.map(server => 
      testDNSServer(domain, server.dohUrl, server.id)
    );
    
    const newResults = await Promise.all(testPromises);
    setResults(newResults);
    setIsTesting(false);
  };

  const handleAddCustomDns = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customDoh) return;
    
    const newServer: DNSServer = {
      id: `custom-${Date.now()}`,
      name: customName,
      provider: 'Özel DoH Sunucusu',
      dohUrl: customDoh,
      isCustom: true
    };
    
    setServers(prev => [...prev, newServer]);
    setCustomName('');
    setCustomDoh('');
    setShowAddForm(false);
  };

  const removeServer = (id: string) => {
    setServers(prev => prev.filter(s => s.id !== id));
    setResults(prev => prev.filter(r => r.serverId !== id));
  };

  const handleAnalyze = async () => {
    if (results.length === 0) return;
    setIsAnalyzing(true);
    const report = await analyzeResults(results, servers, domain);
    setAnalysis(report);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 tracking-tight">
          DNS SPEED MASTER
        </h1>
        <p className="text-slate-400 text-lg">Hızınızı Test Edin & Ağınızı Optimize Edin.</p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button 
          onClick={() => setActiveTab('dns')}
          className={`px-6 py-2 rounded-full font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'dns' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          <i className="fa-solid fa-bolt"></i> DNS Test
        </button>
        <button 
          onClick={() => setActiveTab('modem')}
          className={`px-6 py-2 rounded-full font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'modem' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          <i className="fa-solid fa-house-signal"></i> Modem Rehberi
        </button>
      </div>

      {activeTab === 'dns' ? (
        <>
          {/* Controls */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-10 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Test Edilecek Alan Adı</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <i className="fa-solid fa-globe"></i>
                  </span>
                  <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Örn: google.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg font-medium"
                  />
                </div>
              </div>
              <div>
                <button 
                  onClick={runTest}
                  disabled={isTesting}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isTesting ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
                >
                  {isTesting ? (
                    <>
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                      Test Ediliyor...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-bolt"></i>
                      Testi Başlat
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-server text-blue-500"></i>
                  DNS Sunucuları
                </h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <i className={`fa-solid ${showAddForm ? 'fa-xmark' : 'fa-plus'}`}></i>
                  {showAddForm ? 'İptal' : 'Manuel DNS Ekle'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddCustomDns} className="bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-600 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input 
                      type="text" 
                      placeholder="Sunucu Adı (Örn: Pi-hole)" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                    <input 
                      type="url" 
                      placeholder="DoH URL (https://...)" 
                      value={customDoh}
                      onChange={(e) => setCustomDoh(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition-all text-sm"
                    >
                      Ekle
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {servers.map(server => (
                  <DNSCard 
                    key={server.id} 
                    server={server} 
                    result={results.find(r => r.serverId === server.id)}
                    isTesting={isTesting}
                    onRemove={removeServer}
                  />
                ))}
              </div>

              <LatencyChart results={results} servers={servers} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 p-6 rounded-2xl border border-indigo-500/30">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
                  AI Analizi
                </h2>
                
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {!analysis && !isAnalyzing && (
                      <button 
                        onClick={handleAnalyze}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all text-sm"
                      >
                        Gemini ile Analiz Et
                      </button>
                    )}
                    
                    {isAnalyzing && (
                      <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-indigo-300 text-sm font-medium">İşleniyor...</p>
                      </div>
                    )}

                    {analysis && (
                      <div className="prose prose-invert prose-sm max-w-none text-slate-300 animate-in fade-in duration-700">
                        <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm text-center py-10">Test yapıldığında AI burada görünecek.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ModemSearch />
          </div>
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Hızlı İpuçları</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-3">
                  <i className="fa-solid fa-circle-info text-blue-400 mt-1"></i>
                  <span>Çoğu modem için varsayılan IP <b>192.168.1.1</b> veya <b>192.168.0.1</b>'dir.</span>
                </li>
                <li className="flex gap-3">
                  <i className="fa-solid fa-key text-amber-400 mt-1"></i>
                  <span>Şifreleri denemeden önce modemin altındaki etiketi kontrol edin.</span>
                </li>
                <li className="flex gap-3">
                  <i className="fa-solid fa-rotate-left text-rose-400 mt-1"></i>
                  <span>Şifrenizi unuttuysanız arkadaki küçük deliğe iğne ile 10 sn basarak resetleyebilirsiniz.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 py-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <i className="fa-solid fa-network-wired"></i>
          <span>DNS Speed Master & Modem Rehberi v1.1</span>
        </div>
        <div className="flex gap-6 text-slate-500 text-sm">
          <a href="#" className="hover:text-blue-400 transition-colors">Dökümantasyon</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Gizlilik</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
