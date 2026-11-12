import { useState } from 'react';
import { calculateMonthlyPayment } from './utils/finance';

export function App() {
  const [amount, setAmount] = useState<number>(3000000);
  const [rate, setRate] = useState<number>(4.5);
  const [years, setYears] = useState<number>(25);

  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const totalPaid = monthlyPayment * years * 12;
  const totalInterest = totalPaid - amount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Pozadí s jemnou zářící atmosférou */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-3xl bg-slate-900/80 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden">
        
        {/* Vrchní záhlaví */}
        <div className="px-8 py-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow-lg shadow-indigo-500/50"></span>
              FinCalc <span className="text-indigo-400 font-light">Pro</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Profesionální úvěrová a hypoteční kalkulačka</p>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
            Tauri v2 + React
          </div>
        </div>

        {/* Hlavní grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Formulářová část (7 sloupců) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Input 1: Výše půjčky */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Výše půjčky
                </label>
                <span className="text-sm font-bold text-indigo-400">
                  {amount.toLocaleString('cs-CZ')} Kč
                </span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3.5 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Input 2: Úrok */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Roční úrok
                </label>
                <span className="text-sm font-bold text-indigo-400">
                  {rate} %
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3.5 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Input 3: Doba splácení */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Doba splácení
                </label>
                <span className="text-sm font-bold text-indigo-400">
                  {years} let
                </span>
              </div>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3.5 text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

          </div>

          {/* Výsledkový panel (5 sloupců) */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 block mb-1">
                Měsíční splátka
              </span>
              <div className="text-3xl font-black text-white tracking-tight mt-1">
                {monthlyPayment.toLocaleString('cs-CZ')} <span className="text-base font-normal text-slate-400">Kč</span>
              </div>
            </div>

            <div className="space-y-3.5 my-6 pt-6 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Celkem zaplatíte:</span>
                <span className="font-semibold text-slate-200">{totalPaid.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Přeplatek na úrocích:</span>
                <span className="font-semibold text-rose-400">{totalInterest.toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center bg-slate-950/40 py-2 px-3 rounded-xl border border-slate-800/50">
              Přesný výpočet zajišťuje Decimal.js
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
