import { useState } from 'react';
import { calculateMonthlyPayment } from './utils/finance';

export function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'compare' | 'history' | 'inflation' | 'currency'>('calc');

  // Hlavní kalkulačka
  const [amount, setAmount] = useState<number>(3000000);
  const [rate, setRate] = useState<number>(4.5);
  const [years, setYears] = useState<number>(25);

  // Porovnání - Varianta A
  const [compAmountA, setCompAmountA] = useState<number>(3000000);
  const [compRateA, setCompRateA] = useState<number>(4.5);
  const [compYearsA, setCompYearsA] = useState<number>(25);

  // Porovnání - Varianta B
  const [compAmountB, setCompAmountB] = useState<number>(2500000);
  const [compRateB, setCompRateB] = useState<number>(5.2);
  const [compYearsB, setCompYearsB] = useState<number>(25);

  // Historie
  const [history, setHistory] = useState<Array<{ id: number; name: string; amount: number; payment: number }>>([
    { id: 1, name: 'Byt Praha 3+kk', amount: 4500000, payment: 25000 },
  ]);
  const [saveName, setSaveName] = useState<string>('');

  // Inflace
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  const [targetAmount, setTargetAmount] = useState<number>(1000000);

  // Měny
  const [czkAmount, setCzkAmount] = useState<number>(25000);
  const [currencyRate] = useState<number>(25.2);

  // Výpočty
  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const totalPaid = monthlyPayment * years * 12;
  const totalInterest = totalPaid - amount;

  const monthlyPaymentA = calculateMonthlyPayment(compAmountA, compRateA, compYearsA);
  const totalPaidA = monthlyPaymentA * compYearsA * 12;

  const monthlyPaymentB = calculateMonthlyPayment(compAmountB, compRateB, compYearsB);
  const totalPaidB = monthlyPaymentB * compYearsB * 12;

  const futureValue = targetAmount / Math.pow(1 + inflationRate / 100, inflationYears);

  const saveCurrentCalculation = () => {
    if (!saveName.trim()) return;
    setHistory([...history, { id: Date.now(), name: saveName, amount, payment: monthlyPayment }]);
    setSaveName('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Zářící pozadí */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>

      {/* Hlavní karta (zvětšená šířka na 1050px) */}
      <div style={{
        width: '100%', maxWidth: '1050px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(51, 65, 85, 0.6)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 10
      }}>
        
        {/* Hlavička */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 12px #6366f1', display: 'inline-block' }}></span>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>FinCalc <span style={{ color: '#818cf8', fontWeight: '300' }}>Pro</span></h1>
          </div>
          <div style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontWeight: '600' }}>
            Tauri v2 + React
          </div>
        </div>

        {/* Záložky */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', background: 'rgba(2, 6, 23, 0.4)', padding: '0 24px', gap: '8px' }}>
          {[
            { id: 'calc', label: '🧮 Kalkulačka' },
            { id: 'compare', label: '⚖️ Porovnání' },
            { id: 'history', label: '💾 Uložené' },
            { id: 'inflation', label: '📉 Inflace' },
            { id: 'currency', label: '💱 Měny' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 16px', fontSize: '12px', fontWeight: '600', background: 'transparent', border: 'none', cursor: 'pointer',
                color: activeTab === tab.id ? '#818cf8' : '#94a3b8',
                borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Obsah */}
        <div style={{ padding: '36px' }}>
          
          {/* KALKULAČKA */}
          {activeTab === 'calc' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>
                    <span>VÝŠE PŮJČKY</span>
                    <span style={{ color: '#818cf8' }}>{amount.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                  <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>
                    <span>ROČNÍ ÚROK (%)</span>
                    <span style={{ color: '#818cf8' }}>{rate} %</span>
                  </div>
                  <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>
                    <span>DOBA SPLÁCENÍ (ROKY)</span>
                    <span style={{ color: '#818cf8' }}>{years} let</span>
                  </div>
                  <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Měsíční splátka</span>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>{monthlyPayment.toLocaleString('cs-CZ')} <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>Kč</span></div>
                </div>
                <div style={{ margin: '16px 0', padding: '12px 0', borderTop: '1px solid rgba(51, 65, 85, 0.6)', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Celkem zaplatíte:</span><span>{totalPaid.toLocaleString('cs-CZ')} Kč</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Přeplatek:</span><span style={{ color: '#f43f5e' }}>{totalInterest.toLocaleString('cs-CZ')} Kč</span></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Název..." value={saveName} onChange={e => setSaveName(e.target.value)} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '8px 12px', color: '#fff', fontSize: '12px', outline: 'none' }} />
                  <button onClick={saveCurrentCalculation} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Uložit</button>
                </div>
              </div>
            </div>
          )}

          {/* POROVNÁNÍ */}
          {activeTab === 'compare' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              
              {/* Varianta A */}
              <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#818cf8', margin: 0, textTransform: 'uppercase' }}>Varianta A</h3>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>PŮJČKA (Kč)</label>
                  <input type="number" value={compAmountA} onChange={e => setCompAmountA(Number(e.target.value))} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>ÚROK (%)</label>
                    <input type="number" step="0.1" value={compRateA} onChange={e => setCompRateA(Number(e.target.value))} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>ROKY</label>
                    <input type="number" value={compYearsA} onChange={e => setCompYearsA(Number(e.target.value))} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px' }} />
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Měsíční splátka:</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#818cf8' }}>{monthlyPaymentA.toLocaleString('cs-CZ')} Kč</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Celkem: {totalPaidA.toLocaleString('cs-CZ')} Kč</div>
                </div>
              </div>

              {/* Varianta B */}
              <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#f43f5e', margin: 0, textTransform: 'uppercase' }}>Varianta B</h3>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>PŮJČKA (Kč)</label>
                  <input type="number" value={compAmountB} onChange={e => setCompAmountB(Number(e.target.value))} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>ÚROK (%)</label>
                    <input type="number" step="0.1" value={compRateB} onChange={e => setCompRateB(Number(e.target.value))} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>ROKY</label>
                    <input type="number" value={compYearsB} onChange={e => setCompYearsB(Number(e.target.value))} style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px' }} />
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Měsíční splátka:</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#f43f5e' }}>{monthlyPaymentB.toLocaleString('cs-CZ')} Kč</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Celkem: {totalPaidB.toLocaleString('cs-CZ')} Kč</div>
                </div>
              </div>

            </div>
          )}

          {/* HISTORIE */}
          {activeTab === 'history' && (
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase' }}>Uložené výpočty</h3>
              {history.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '16px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#818cf8' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Půjčka: {item.amount.toLocaleString('cs-CZ')} Kč</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700' }}>{item.payment.toLocaleString('cs-CZ')} Kč</div>
                    <button onClick={() => setHistory(history.filter(h => h.id !== item.id))} style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '11px', cursor: 'pointer', marginTop: '4px' }}>Smazat</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INFLACE */}
          {activeTab === 'inflation' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ČÁSTKA DNES</label>
                  <input type="number" value={targetAmount} onChange={e => setTargetAmount(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ROKY</label>
                  <input type="number" value={inflationYears} onChange={e => setInflationYears(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '12px', color: '#fff' }} />
                </div>
              </div>
              <div style={{ background: '#020617', border: '1px solid #6366f1', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#818cf8' }}>REÁLNÁ HODNOTA</span>
                <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '8px' }}>{Math.round(futureValue).toLocaleString('cs-CZ')} Kč</div>
              </div>
            </div>
          )}

          {/* MĚNY */}
          {activeTab === 'currency' && (
            <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '16px', padding: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>CZK</span>
                  <input type="number" value={czkAmount} onChange={e => setCzkAmount(Number(e.target.value))} style={{ width: '100%', background: 'transparent', border: 'none', color: '#818cf8', fontSize: '20px', fontWeight: '700', textAlign: 'center', outline: 'none' }} />
                </div>
                <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '16px', padding: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>EUR</span>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{(czkAmount / currencyRate).toFixed(2)} €</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
