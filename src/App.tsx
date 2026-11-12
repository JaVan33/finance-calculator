import { useState } from 'react';
import { calculateMonthlyPayment } from './utils/finance';

export function App() {
  const [amount, setAmount] = useState<number>(2000000);
  const [rate, setRate] = useState<number>(5.5);
  const [years, setYears] = useState<number>(25);

  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const totalPaid = monthlyPayment * years * 12;
  const totalInterest = totalPaid - amount;

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-800">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">FinCalc Pro – Hypoteční kalkulačka</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Výše půjčky (Kč)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600">Roční úrok (%)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600">Doba splácení (roky)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-indigo-50 rounded-lg space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-slate-600">Měsíční splátka:</span>
            <span className="font-bold text-indigo-600">{monthlyPayment.toLocaleString('cs-CZ')} Kč</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Celkem zaplatíte:</span>
            <span>{totalPaid.toLocaleString('cs-CZ')} Kč</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Na úrocích přeplatíte:</span>
            <span>{totalInterest.toLocaleString('cs-CZ')} Kč</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
