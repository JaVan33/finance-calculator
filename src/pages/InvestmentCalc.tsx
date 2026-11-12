import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download } from 'lucide-react';
import { calculateInvestment, formatCZK } from '../utils/financeMath';
import { downloadCSV } from '../utils/exportCsv';

export const InvestmentCalc: React.FC = () => {
  const [initialDeposit, setInitialDeposit] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [annualReturn, setAnnualReturn] = useState<number>(8.0);
  const [years, setYears] = useState<number>(20);
  const [inflation, setInflation] = useState<number>(2.5);

  const schedule = useMemo(
    () => calculateInvestment(initialDeposit, monthlyContribution, annualReturn, years, inflation),
    [initialDeposit, monthlyContribution, annualReturn, years, inflation]
  );

  const finalState = schedule[schedule.length - 1];

  const handleExport = () => {
    const dataToExport = schedule.map((row) => ({
      Rok: row.year,
      'Vloženo celkem (Kč)': row.totalContributions,
      'Zisk z úroků (Kč)': row.interestEarned,
      'Nominální hodnota (Kč)': row.totalBalance,
      'Reálná hodnota po inflaci (Kč)': row.realBalance,
    }));
    downloadCSV(`investice_${years}let.csv`, dataToExport);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kalkulačka složeného úročení</h2>
          <p className="text-slate-500 text-sm">Vývoj investice v čase včetně vlivu inflace</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportovat CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Počáteční vklad</label>
              <span className="text-sm font-bold text-emerald-600">{formatCZK(initialDeposit)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2000000}
              step={10000}
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Měsíční úložka</label>
              <span className="text-sm font-bold text-emerald-600">{formatCZK(monthlyContribution)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Roční zhodnocení</label>
              <span className="text-sm font-bold text-emerald-600">{annualReturn.toFixed(1)} %</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Doba investování</label>
              <span className="text-sm font-bold text-emerald-600">{years} let</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Očekávaná roční inflace</label>
              <span className="text-sm font-bold text-slate-600">{inflation.toFixed(1)} %</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full accent-slate-600"
            />
          </div>
        </div>

        {/* Výsledky */}
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <span className="text-emerald-100 text-sm font-medium">Konečná hodnota portfolia</span>
            <div className="text-3xl font-extrabold mt-1">{formatCZK(finalState.totalBalance)}</div>
            <div className="text-xs text-emerald-100 mt-1">
              Reálná kupní síla po inflaci: <strong>{formatCZK(finalState.realBalance)}</strong>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-emerald-500/50 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-100">Vlastní vklady:</span>
              <span className="font-semibold">{formatCZK(finalState.totalContributions)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Čistý zisk z úroků:</span>
              <span className="font-semibold text-amber-200">{formatCZK(finalState.interestEarned)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graf růstu */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-base font-bold text-slate-800 mb-4">Exponenciální růst kapitálu</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={schedule}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tickFormatter={(v) => `${v}. rok`} fontSize={12} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)} mil.`} fontSize={12} />
              <Tooltip formatter={(value: number) => formatCZK(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalBalance"
                name="Celková hodnota"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="realBalance"
                name="Reálná hodnota (po inflaci)"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="totalContributions"
                name="Vložené peníze"
                stroke="#64748b"
                fill="#64748b"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
