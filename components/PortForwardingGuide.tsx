
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const PortForwardingGuide: React.FC = () => {
  const [service, setService] = useState('');
  const [guide, setGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getGuide = async () => {
    if (!service) return;
    setLoading(true);
    setGuide(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const prompt = `"${service}" servisi için modem üzerinden port yönlendirme (Port Forwarding) rehberi hazırla.
    İçerik şunları kapsamalı:
    - Hangi portlar açılmalı? (TCP ve UDP detaylı liste)
    - Bu servis ne için kullanılır?
    - Tipik bir modem arayüzünde (WAN/NAT/Virtual Server) bu işlem nasıl yapılır?
    Adım adım, anlaşılır ve Türkçe Markdown olarak hazırla.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setGuide(response.text || "Rehber oluşturulamadı.");
    } catch (e) {
      console.error(e);
      setGuide("Rehber hazırlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-door-open text-amber-400"></i> Akıllı Port Rehberi
      </h3>
      <div className="flex gap-2 mb-4">
        <input 
          type="text" placeholder="Örn: Valorant, Minecraft..." value={service} onChange={(e) => setService(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
        />
        <button 
          onClick={getGuide} disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 rounded-lg transition-colors font-bold text-xs"
        >
          SOR
        </button>
      </div>
      
      {loading && <div className="text-center py-6 animate-pulse text-amber-400 text-xs">Rehber hazırlanıyor...</div>}
      
      {guide && (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="prose prose-invert prose-xs text-slate-300" dangerouslySetInnerHTML={{ __html: guide.replace(/\n/g, '<br/>') }} />
        </div>
      )}
      
      {!guide && !loading && (
        <p className="text-[10px] text-slate-500 italic">Hangi portu açmanız gerektiğini bilmiyorsanız buraya sorun.</p>
      )}
    </div>
  );
};

export default PortForwardingGuide;
