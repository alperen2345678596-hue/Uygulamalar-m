
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const SSLChecker: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSSL = async () => {
    if (!domain) return;
    setLoading(true);
    setReport(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const prompt = `"${domain}" alan adının SSL sertifikasını ve güvenlik durumunu araştır.
    Şu bilgileri içeren profesyonel bir rapor ver:
    - Sertifika Geçerlilik Durumu (Aktif/Süresi dolmuş)
    - Son Geçerlilik Tarihi (Expiry Date)
    - Sertifika Sağlayıcısı (Issuer - Örn: Let's Encrypt, DigiCert)
    - Güvenlik Seviyesi (Grade A-F)
    - Güvenlik Önerisi (HSTS, TLS sürümü vb.)
    Türkçe, net ve Markdown formatında sun.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      setReport(response.text || "Veri alınamadı.");
    } catch (e) {
      console.error(e);
      setReport("SSL sorgusu sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-full">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-lock text-emerald-400"></i> SSL Güvenlik Analizi
      </h3>
      <div className="flex gap-2 mb-4">
        <input 
          type="text" placeholder="apple.com" value={domain} onChange={(e) => setDomain(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
        />
        <button 
          onClick={checkSSL} disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg transition-colors"
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {report ? (
          <div className="prose prose-invert prose-xs text-slate-300 animate-in fade-in" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }} />
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-slate-600 gap-2">
            <i className="fa-solid fa-shield-halved text-2xl opacity-20"></i>
            <span className="text-[10px] uppercase font-bold tracking-widest">{loading ? "Güvenlik katmanları taranıyor..." : "Alan adı girin ve test edin"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SSLChecker;
