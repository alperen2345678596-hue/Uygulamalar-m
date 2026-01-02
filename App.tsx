
import React, { useState } from 'react';
import { DNSServer, TestResult } from './types';
import { POPULAR_DNS, DEFAULT_DOMAIN } from './constants';
import { testDNSServer } from './services/dnsService';
import { analyzeResults } from './services/geminiService';
import DNSCard from './components/DNSCard';
import LatencyChart from './components/LatencyChart';
import ModemSearch from './components/ModemSearch';
import IPDetails from './components/IPDetails';
import PasswordGenerator from './components/PasswordGenerator';
import DNSLookup from './components/DNSLookup';
import NetworkHealth from './components/NetworkHealth';
import WhoisLookup from './components/WhoisLookup';
import PingJitterTest from './components/PingJitterTest';

type TabType = 'dns' | 'modem' | 'tools' | 'ip';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dns');
  const [servers, setServers] = useState<DNSServer[]>(POPULAR_DNS);
  const [results, setResults] = useState<TestResult[]>([]);
  const [domain, setDomain] = useState(DEFAULT_DOMAIN);
  const [isTesting, setIsTesting] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [customName, setCustomName] = useState('');
  const [customDoh, setCustomDoh] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    setResults([]);
    setAnalysis(null);
    const testPromises = servers.map(server => testDNSServer(domain, server.dohUrl, server.id));
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
      provider: 'Özel Sunucu',
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
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 mb-2 tracking-tight">
          NETWORK MASTER PRO
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Hepsi Bir Arada Ağ Yönetim Paneli</p>
      </header>

      <nav className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
        {[
          { id: 'dns', icon: 'fa-bolt', label: 'DNS Test' },
          { id: 'modem', icon: 'fa-house-signal', label: 'Modem Rehberi' },
          { id: 'ip', icon: 'fa-location-dot', label: 'IP & ISP' },
          { id: 'tools', icon: 'fa-toolbox', label: 'Araçlar' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </nav>

      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dns' && (
          <div className="space-y-8">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-wider">Test Edilecek Hedef</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><i className="fa-solid fa-globe"></i></span>
                    <input 
                      type="text" value={domain} onChange={(e) => setDomain(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg font-bold"
                    />
                  </div>
                </div>
                <button 
                  onClick={runTest} disabled={isTesting}
                  className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${isTesting ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                >
                  {isTesting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                  {isTesting ? 'TEST EDİLİYOR' : 'HIZI TEST ET'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fa-solid fa-server text-blue-500"></i> DNS Sunucuları</h2>
                  <button onClick={() => setShowAddForm(!showAddForm)} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"><i className="fa-solid fa-plus mr-1"></i> MANUEL EKLE</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {servers.map(server => (
                    <DNSCard key={server.id} server={server} result={results.find(r => r.serverId === server.id)} isTesting={isTesting} onRemove={removeServer} />
                  ))}
                </div>
                <LatencyChart results={results} servers={servers} />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 p-6 rounded-2xl border border-indigo-500/30 sticky top-8">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i> AI RAPORU</h2>
                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {!analysis && !isAnalyzing && (
                        <button onClick={handleAnalyze} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm">GEMINI ANALİZİ BAŞLAT</button>
                      )}
                      {isAnalyzing && <div className="text-center py-8"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div><p className="text-xs text-indigo-300">Düşünülüyor...</p></div>}
                      {analysis && <div className="prose prose-invert prose-xs text-slate-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />}
                    </div>
                  ) : <p className="text-slate-500 text-xs italic text-center py-10">Test sonuçları hazır olduğunda AI burada analiz yapacak.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modem' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"><ModemSearch /></div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit">
              <h3 className="font-bold text-white mb-4">Güvenlik Uyarısı</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Varsayılan şifreler sadece ilk kurulum içindir. Güvenliğiniz için panel girişinden şifrenizi mutlaka değiştirin.</p>
            </div>
          </div>
        )}

        {activeTab === 'ip' && <IPDetails />}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PingJitterTest />
            <WhoisLookup />
            <DNSLookup />
            <PasswordGenerator />
            <div className="md:col-span-2 lg:col-span-3"><NetworkHealth /></div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">© 2024 Network Master Pro // Version 3.0 // Professional Network Suite</p>
      </footer>
    </div>
  );
};

export default App;
