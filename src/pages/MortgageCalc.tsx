import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download } from 'lucide-react';
import { calculateMortgage, formatCZK } from '../utils/financeMath';
import { downloadCSV } from '../utils/exportCsv';

export const MortgageCalc: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(4500000);
  const [annualRate, setAnnualRate] = useState<number>(4.8);
  const [years, setYears] = useState<number>(25);

  const result = useMemo(
    () => calculateMortgage(loanAmount, annualRate, years),
    [loanAmount, annualRate, years]
  );

  const handleExport = () => {
    const dataToExport = result.schedule.map((row) => ({
      Rok: row.year,
      'Umořená jistina (Kč)': row.principalPaid,
      'Zaplacené úroky (Kč)': row.interestPaid,
      'Zbývající dluh (Kč)': row.remainingBalance,
    }));
    downloadCSV(`hypoteka_${loanAmount}_${years}let.csv`, dataToExport);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hypoteční kalkulačka</h2>
          <p className="text-slate-500 text-sm">Simulace anuitního splácení a rozklad úroků v čase</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportovat CSV
        </button>
      </div>

      {/* Vstupní parametry a hlavní výsledky */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Výše úvěru</label>
              <span className="text-sm font-bold text-indigo-600">{formatCZK(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={20000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Úroková sazba (% p.a.)</label>
              <span className="text-sm font-bold text-indigo-600">{annualRate.toFixed(2)} %</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={12.0}
              step={0.1}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Doba splácení</label>
              <span className="text-sm font-bold text-indigo-600">{years} let</span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Karty s výsledky */}
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <span className="text-indigo-200 text-sm font-medium">Měsíční splátka</span>
            <div className="text-4xl font-extrabold mt-1">{formatCZK(result.monthlyPayment)}</div>
          </div>

          <div className="space-y-3 pt-6 border-t border-indigo-500/50 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-200">Celkem zaplatíte:</span>
              <span className="font-semibold">{formatCZK(result.totalPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Z toho přeplatíte na úrocích:</span>
              <span className="font-semibold text-amber-300">{formatCZK(result.totalInterest)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graf */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-base font-bold text-slate-800 mb-4">Roční struktura splátek (Jistina vs. Úrok)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.schedule}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tickFormatter={(v) => `${v}. rok`} fontSize={12} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)} tis.`} fontSize={12} />
              <Tooltip formatter={(value: number) => formatCZK(value)} />
              <Legend />
              <Bar dataKey="principalPaid" name="Umořená jistina" stackId="a" fill="#4f46e5" />
              <Bar dataKey="interestPaid" name="Zaplacený úrok" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Amortizační tabulka */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-sm">
          Amortizační tabulka po letech
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 sticky top-0">
              <tr>
                <th className="p-3">Rok</th>
                <th className="p-3">Zaplaceno na jistině</th>
                <th className="p-3">Zaplaceno na úrocích</th>
                <th className="p-3">Zbývající dluh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.schedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50">
                  <td className="p-3 font-medium">{row.year}. rok</td>
                  <td className="p-3 text-indigo-600">{formatCZK(row.principalPaid)}</td>
                  <td className="p-3 text-amber-600">{formatCZK(row.interestPaid)}</td>
                  <td className="p-3 font-semibold text-slate-700">{formatCZK(row.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
