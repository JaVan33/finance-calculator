import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MortgageCalc } from './pages/MortgageCalc';
import { InvestmentCalc } from './pages/InvestmentCalc';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState<'mortgage' | 'investment'>('mortgage');

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'mortgage' ? <MortgageCalc /> : <InvestmentCalc />}
        </div>
      </main>
    </div>
  );
}

export default App;
