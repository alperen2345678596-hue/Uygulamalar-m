
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const WhoisLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performWhois = async () => {
    if (!domain) return;
    setLoading(true);
    setResult(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const prompt = `Alan adı "${domain}" için WHOIS bilgilerini araştır ve bana şu formatta bir özet ver:
    - Kayıt Tarihi (Registration Date)
    - Bitiş Tarihi (Expiry Date)
    - Kayıt Firması (Registrar)
    - Alan Adı Durumu (Status)
    - Önemli Notlar
    Lütfen Markdown formatında, temiz ve Türkçe bir tablo veya liste olarak döndür.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      setResult(response.text || "Bilgi bulunamadı.");
    } catch (e) {
      console.error(e);
      setResult("Sorgulama sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col h-full">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-address-card text-emerald-400"></i> WHOIS Sorgulama (AI)
      </h3>
      <div className="flex gap-2 mb-4">
        <input 
          type="text" placeholder="google.com" value={domain} onChange={(e) => setDomain(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
        />
        <button 
          onClick={performWhois} disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg transition-colors"
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-search"></i>}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {result ? (
          <div className="prose prose-invert prose-xs text-slate-300 animate-in fade-in" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }} />
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-600 text-[10px] uppercase font-bold text-center italic">
            {loading ? "WHOIS verileri çekiliyor..." : "Bir alan adı girin ve sorgulayın"}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoisLookup;
