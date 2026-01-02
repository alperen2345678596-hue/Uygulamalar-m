
import React, { useState } from 'react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('ModemSifresi123!');
  const [length, setLength] = useState(16);

  const generate = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPass = "";
    for (let i = 0; i < length; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    alert('Şifre Kopyalandı!');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <i className="fa-solid fa-shield-halved text-emerald-400"></i> Şifre Oluşturucu
      </h3>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center mb-6">
        <span className="text-white font-mono text-lg break-all mr-4">{password}</span>
        <button onClick={copy} className="text-slate-400 hover:text-white"><i className="fa-solid fa-copy"></i></button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black mb-2">
            <span>Uzunluk</span>
            <span>{length} Karakter</span>
          </div>
          <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <button onClick={generate} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all text-sm">YENİ ŞİFRE ÜRET</button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
