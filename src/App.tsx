import { useState } from 'react';
import { calculateMonthlyPayment } from './utils/finance';

export function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'compare' | 'amortization' | 'investment' | 'pension' | 'property' | 'budget' | 'networth' | 'emergency' | 'inflation' | 'currency' | 'vat' | 'salary' | 'history'>('calc');

  // Hlavní kalkulačka
  const [amount, setAmount] = useState<number>(3000000);
  const [rate, setRate] = useState<number>(4.5);
  const [years, setYears] = useState<number>(25);

  // Porovnání - Varianta A & B
  const [compAmountA, setCompAmountA] = useState<number>(3000000);
  const [compRateA, setCompRateA] = useState<number>(4.5);
  const [compYearsA, setCompYearsA] = useState<number>(25);
  const [compAmountB, setCompAmountB] = useState<number>(2500000);
  const [compRateB, setCompRateB] = useState<number>(5.2);
  const [compYearsB, setCompYearsB] = useState<number>(25);

  // 5. Složené úrokování (Investice)
  const [invPrincipal, setInvPrincipal] = useState<number>(50000);
  const [invMonthly, setInvMonthly] = useState<number>(5000);
  const [invRate, setInvRate] = useState<number>(7.0);
  const [invYears, setInvYears] = useState<number>(20);

  // 6. Důchodová kalkulačka
  const [pensionTarget, setPensionTarget] = useState<number>(20000);
  const [pensionCurrentAge, setPensionCurrentAge] = useState<number>(30);
  const [pensionRetireAge, setPensionRetireAge] = useState<number>(65);

  // 7. Výnosnost nemovitosti
  const [propPrice, setPropPrice] = useState<number>(4500000);
  const [propRent, setPropRent] = useState<number>(18000);

  // 8. Pravidlo 50/30/20
  const [netIncome, setNetIncome] = useState<number>(45000);

  // 9. Čisté jmění
  const [assetsCash, setAssetsCash] = useState<number>(150000);
  const [assetsProperty, setAssetsProperty] = useState<number>(3000000);
  const [liabilitiesDebt, setLiabilitiesDebt] = useState<number>(2000000);

  // 10. Finanční rezerva
  const [monthlyExp, setMonthlyExp] = useState<number>(30000);
  const [resMonths, setResMonths] = useState<number>(6);

  // 11. Inflace
  const [inflationYears, setInflationYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.0);
  const [targetAmount, setTargetAmount] = useState<number>(1000000);

  // 12. Měny
  const [czkAmount, setCzkAmount] = useState<number>(25000);
  const [currencyRate] = useState<number>(25.2);

  // 13. DPH a Marže
  const [vatBase, setVatBase] = useState<number>(10000);
  const [vatRate, setVatRate] = useState<number>(21);

  // 14. Čistá mzda
  const [grossSalary, setGrossSalary] = useState<number>(45000);

  // Historie
  const [history, setHistory] = useState<Array<{ id: number; name: string; amount: number; payment: number }>>([
    { id: 1, name: 'Byt Praha 3+kk', amount: 4500000, payment: 25000 },
  ]);
  const [saveName, setSaveName] = useState<string>('');

  // Výpočty pro základní kalkulačku
  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const totalPaid = monthlyPayment * years * 12;
  const totalInterest = totalPaid - amount;

  const monthlyPaymentA = calculateMonthlyPayment(compAmountA, compRateA, compYearsA);
  const totalPaidA = monthlyPaymentA * compYearsA * 12;
  const monthlyPaymentB = calculateMonthlyPayment(compAmountB, compRateB, compYearsB);
  const totalPaidB = monthlyPaymentB * compYearsB * 12;

  // Výpočet 1: Amortizační tabulka (generování prvních 12 měsíců)
  const generateAmortization = () => {
    let balance = amount;
    const monthlyRate = rate / 100 / 12;
    const schedule = [];
    for (let i = 1; i <= Math.min(years * 12, 12); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      schedule.push({ month: i, principal: Math.round(principalPayment), interest: Math.round(interestPayment), remaining: Math.max(0, Math.round(balance)) });
    }
    return schedule;
  };

  // Výpočet 5: Složené úrokování
  const totalMonths = invYears * 12;
  const monthlyInvRate = invRate / 100 / 12;
  let futureInvValue = invPrincipal;
  for (let i = 0; i < totalMonths; i++) {
    futureInvValue = (futureInvValue + invMonthly) * (1 + monthlyInvRate);
  }
  const totalInvested = invPrincipal + invMonthly * totalMonths;

  // Výpočet 6: Důchod
  const yearsToRetire = Math.max(1, pensionRetireAge - pensionCurrentAge);
  const requiredCapital = pensionTarget * 12 * 20;

  // Výpočet 7: ROI nemovitosti
  const annualRentIncome = propRent * 12;
  const rentalYield = (annualRentIncome / propPrice) * 100;

  // Výpočet 11: Inflace
  const futureValue = targetAmount / Math.pow(1 + inflationRate / 100, inflationYears);

  // Výpočet 13: DPH
  const vatAmount = vatBase * (vatRate / 100);
  const totalWithVat = vatBase + vatAmount;

  // Výpočet 14: Čistá mzda (odhad ČR)
  const socialInsurance = grossSalary * 0.065;
  const healthInsurance = grossSalary * 0.045;
  const taxBase = grossSalary;
  const taxBeforeDiscount = taxBase * 0.15;
  const taxpayerDiscount = 2570;
  const finalTax = Math.max(0, taxBeforeDiscount - taxpayerDiscount);
  const netSalary = grossSalary - socialInsurance - healthInsurance - finalTax;

  const saveCurrentCalculation = () => {
    if (!saveName.trim()) return;
    setHistory([...history, { id: Date.now(), name: saveName, amount, payment: monthlyPayment }]);
    setSaveName('');
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#030712',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Zářící pozadí přes celou plochu */}
      <div style={{ position: 'fixed', top: '-150px', left: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', bottom: '-150px', right: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>

      {/* HLAVIČKA NA CELOU ŠÍŘKU */}
      <div style={{ width: '100%', padding: '20px 40px', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', zIndex: 20, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 14px #6366f1', display: 'inline-block' }}></span>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>FinCalc <span style={{ color: '#818cf8', fontWeight: '300' }}>Pro</span></h1>
        </div>
        <div style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontWeight: '600' }}>
          Všestranný finanční ekosystém
        </div>
      </div>

      {/* NAVIGAČNÍ LIŠTA (ZÁLOŽKY) */}
      <div style={{ width: '100%', display: 'flex', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', background: 'rgba(2, 6, 23, 0.8)', padding: '0 40px', gap: '8px', overflowX: 'auto', zIndex: 20, boxSizing: 'border-box' }}>
        {[
          { id: 'calc', label: '🧮 Kalkulačka' },
          { id: 'compare', label: '⚖️ Porovnání' },
          { id: 'amortization', label: '📋 Splátky' },
          { id: 'investment', label: '📈 Investice' },
          { id: 'pension', label: '🏖️ Důchod' },
          { id: 'property', label: '🏠 Nemovitosti' },
          { id: 'budget', label: '📊 Rozpočet 50/30/20' },
          { id: 'networth', label: '💎 Čisté jmění' },
          { id: 'emergency', label: '🛡️ Rezerva' },
          { id: 'inflation', label: '📉 Inflace' },
          { id: 'currency', label: '💱 Měny' },
          { id: 'vat', label: '🧾 DPH & Marže' },
          { id: 'salary', label: '💰 Čistá mzda' },
          { id: 'history', label: '💾 Uložené' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '14px 16px', fontSize: '12px', fontWeight: '600', background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: activeTab === tab.id ? '#818cf8' : '#94a3b8',
              borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OBSAHOVÁ ČÁST NA CELOU STRÁNKU */}
      <div style={{ flex: 1, width: '100%', padding: '40px', boxSizing: 'border-box', zIndex: 10 }}>
        
        {/* 1. KALKULAČKA */}
        {activeTab === 'calc' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(51, 65, 85, 0.5)', padding: '32px', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: '0 0 10px 0' }}>Základní parametry úvěru</h2>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                  <span>VÝŠE PŮJČKY</span>
                  <span style={{ color: '#818cf8' }}>{amount.toLocaleString('cs-CZ')} Kč</span>
                </div>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '14px', padding: '14px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                  <span>ROČNÍ ÚROK (%)</span>
                  <span style={{ color: '#818cf8' }}>{rate} %</span>
                </div>
                <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '14px', padding: '14px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                  <span>DOBA SPLÁCENÍ (ROKY)</span>
                  <span style={{ color: '#818cf8' }}>{years} let</span>
                </div>
                <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '14px', padding: '14px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px', boxSizing: 'border-box' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Měsíční splátka</span>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginTop: '6px' }}>{monthlyPayment.toLocaleString('cs-CZ')} <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '400' }}>Kč</span></div>
              </div>
              <div style={{ margin: '20px 0', padding: '16px 0', borderTop: '1px solid rgba(51, 65, 85, 0.6)', borderBottom: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Celkem zaplatíte:</span><span>{totalPaid.toLocaleString('cs-CZ')} Kč</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Přeplatek:</span><span style={{ color: '#f43f5e' }}>{totalInterest.toLocaleString('cs-CZ')} Kč</span></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Název pro uložení..." value={saveName} onChange={e => setSaveName(e.target.value)} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                <button onClick={saveCurrentCalculation} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Uložit</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. POROVNÁNÍ */}
        {activeTab === 'compare' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#818cf8', margin: 0, textTransform: 'uppercase' }}>Varianta A</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>PŮJČKA (Kč)</label>
                <input type="number" value={compAmountA} onChange={e => setCompAmountA(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ÚROK (%)</label>
                  <input type="number" step="0.1" value={compRateA} onChange={e => setCompRateA(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ROKY</label>
                  <input type="number" value={compYearsA} onChange={e => setCompYearsA(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Měsíční splátka:</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#818cf8' }}>{monthlyPaymentA.toLocaleString('cs-CZ')} Kč</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Celkem: {totalPaidA.toLocaleString('cs-CZ')} Kč</div>
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f43f5e', margin: 0, textTransform: 'uppercase' }}>Varianta B</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>PŮJČKA (Kč)</label>
                <input type="number" value={compAmountB} onChange={e => setCompAmountB(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ÚROK (%)</label>
                  <input type="number" step="0.1" value={compRateB} onChange={e => setCompRateB(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ROKY</label>
                  <input type="number" value={compYearsB} onChange={e => setCompYearsB(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Měsíční splátka:</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#f43f5e' }}>{monthlyPaymentB.toLocaleString('cs-CZ')} Kč</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Celkem: {totalPaidB.toLocaleString('cs-CZ')} Kč</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SPLÁTKOVÝ KALENDÁŘ (Funkce 1) */}
        {activeTab === 'amortization' && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', marginBottom: '16px' }}>Splátkový kalendář (Prvních 12 měsíců)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                    <th style={{ padding: '10px' }}>Měsíc</th>
                    <th style={{ padding: '10px' }}>Jistina</th>
                    <th style={{ padding: '10px' }}>Úrok</th>
                    <th style={{ padding: '10px' }}>Zůstatek dluhu</th>
                  </tr>
                </thead>
                <tbody>
                  {generateAmortization().map((row) => (
                    <tr key={row.month} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>#{row.month}</td>
                      <td style={{ padding: '12px', color: '#10b981' }}>{row.principal.toLocaleString('cs-CZ')} Kč</td>
                      <td style={{ padding: '12px', color: '#f43f5e' }}>{row.interest.toLocaleString('cs-CZ')} Kč</td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{row.remaining.toLocaleString('cs-CZ')} Kč</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. INVESTICE / SLOŽENÉ ÚROKOVÁNÍ (Funkce 5) */}
        {activeTab === 'investment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Simulátor složeného úrokování</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>POČÁTEČNÍ VKLAD (Kč)</label>
                <input type="number" value={invPrincipal} onChange={e => setInvPrincipal(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>MĚSÍČNÍ PŘÍSPĚVEK (Kč)</label>
                <input type="number" value={invMonthly} onChange={e => setInvMonthly(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ROČNÍ VÝNOS (%)</label>
                  <input type="number" step="0.5" value={invRate} onChange={e => setInvRate(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>DOBA (ROKY)</label>
                  <input type="number" value={invYears} onChange={e => setInvYears(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Celková hodnota portfolio</span>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginTop: '6px' }}>{Math.round(futureInvValue).toLocaleString('cs-CZ')} Kč</div>
              </div>
              <div style={{ padding: '16px 0', borderTop: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Vlastní vklady:</span><span>{totalInvested.toLocaleString('cs-CZ')} Kč</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Čistý zisk:</span><span style={{ color: '#10b981' }}>{Math.round(futureInvValue - totalInvested).toLocaleString('cs-CZ')} Kč</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 5. DŮCHODOVÁ KALKULAČKA (Funkce 6) */}
        {activeTab === 'pension' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Důchodový plánovač</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>CÍLOVÁ MĚSÍČNÍ RENTA (Kč)</label>
                <input type="number" value={pensionTarget} onChange={e => setPensionTarget(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>AKTUÁLNÍ VĚK</label>
                  <input type="number" value={pensionCurrentAge} onChange={e => setPensionCurrentAge(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>VĚK ODCHODU</label>
                  <input type="number" value={pensionRetireAge} onChange={e => setPensionRetireAge(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #6366f1', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Potřebný kapitál pro 20 let renty</span>
              <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '12px' }}>{Math.round(requiredCapital).toLocaleString('cs-CZ')} Kč</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>Zbývá ti {yearsToRetire} let do penze. Doporučená měsíční úspora cca {Math.round(requiredCapital / (yearsToRetire * 12)).toLocaleString('cs-CZ')} Kč/měsíc.</p>
            </div>
          </div>
        )}

        {/* 6. VÝNOSNOST NEMOVITOSTI (Funkce 7) */}
        {activeTab === 'property' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Analýza výnosu nemovitosti (Rental Yield)</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>KUPNÍ CENA NEMOVITOSTI (Kč)</label>
                <input type="number" value={propPrice} onChange={e => setPropPrice(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>MĚSÍČNÍ NÁJEMNÉ (Kč)</label>
                <input type="number" value={propRent} onChange={e => setPropRent(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>Hrubý roční výnos (Rental Yield)</span>
              <div style={{ fontSize: '38px', fontWeight: '900', marginTop: '12px', color: '#10b981' }}>{rentalYield.toFixed(2)} % p.a.</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>Roční příjem z nájmu: {annualRentIncome.toLocaleString('cs-CZ')} Kč</p>
            </div>
          </div>
        )}

        {/* 7. ROZPOČET 50/30/20 (Funkce 8) */}
        {activeTab === 'budget' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Pravidlo rozpočtu 50/30/20</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ČISTÝ MĚSÍČNÍ PŘÍJEM (Kč)</label>
                <input type="number" value={netIncome} onChange={e => setNetIncome(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#020617', borderRadius: '12px' }}>
                <span>Nezbytné výdaje (50%):</span>
                <strong style={{ color: '#818cf8' }}>{Math.round(netIncome * 0.5).toLocaleString('cs-CZ')} Kč</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#020617', borderRadius: '12px' }}>
                <span>Osobní potřeby (30%):</span>
                <strong style={{ color: '#38bdf8' }}>{Math.round(netIncome * 0.3).toLocaleString('cs-CZ')} Kč</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#020617', borderRadius: '12px' }}>
                <span>Úspory a investice (20%):</span>
                <strong style={{ color: '#10b981' }}>{Math.round(netIncome * 0.2).toLocaleString('cs-CZ')} Kč</strong>
              </div>
            </div>
          </div>
        )}

        {/* 8. ČISTÉ JMĚNÍ (Funkce 9) */}
        {activeTab === 'networth' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Kalkulačka čistého jmění (Net Worth)</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Hotovost a investice (Kč)</label>
                <input type="number" value={assetsCash} onChange={e => setAssetsCash(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Nemovitosti a majetek (Kč)</label>
                <input type="number" value={assetsProperty} onChange={e => setAssetsProperty(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Celkové dluhy / hypotéky (Kč)</label>
                <input type="number" value={liabilitiesDebt} onChange={e => setLiabilitiesDebt(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '10px', padding: '10px', color: '#fff', marginTop: '4px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>Celkové čisté jmění</span>
              <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px', color: '#10b981' }}>{(assetsCash + assetsProperty - liabilitiesDebt).toLocaleString('cs-CZ')} Kč</div>
            </div>
          </div>
        )}

        {/* 9. FINANČNÍ REZERVA (Funkce 10) */}
        {activeTab === 'emergency' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Pohotovostní fond</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Měsíční výdaje (Kč)</label>
                <input type="number" value={monthlyExp} onChange={e => setMonthlyExp(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Počet měsíců rezervy</label>
                <input type="number" value={resMonths} onChange={e => setResMonths(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #818cf8', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Doporučená výše rezervy</span>
              <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px' }}>{(monthlyExp * resMonths).toLocaleString('cs-CZ')} Kč</div>
            </div>
          </div>
        )}

        {/* 10. INFLACE (Funkce 11) */}
        {activeTab === 'inflation' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Kalkulačka inflace</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ČÁSTKA DNES (Kč)</label>
                <input type="number" value={targetAmount} onChange={e => setTargetAmount(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ROKY</label>
                  <input type="number" value={inflationYears} onChange={e => setInflationYears(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>INFLACE (%)</label>
                  <input type="number" step="0.5" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #6366f1', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>Reálná hodnota peněz v čase</span>
              <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '12px' }}>{Math.round(futureValue).toLocaleString('cs-CZ')} Kč</div>
            </div>
          </div>
        )}

        {/* 11. MĚNY (Funkce 12) */}
        {activeTab === 'currency' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', marginBottom: '20px' }}>Rychlý převodník měn (CZK / EUR)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '18px', padding: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '700' }}>CZK</span>
                  <input type="number" value={czkAmount} onChange={e => setCzkAmount(Number(e.target.value))} style={{ width: '100%', background: 'transparent', border: 'none', color: '#818cf8', fontSize: '20px', fontWeight: '700', textAlign: 'center', outline: 'none' }} />
                </div>
                <div style={{ background: '#020617', border: '1px solid #334155', borderRadius: '18px', padding: '20px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '700' }}>EUR</span>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginTop: '6px' }}>{(czkAmount / currencyRate).toFixed(2)} €</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 12. DPH A MARŽE (Funkce 13) */}
        {activeTab === 'vat' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Kalkulačka DPH</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>ZÁKLAD DANĚ (Kč)</label>
                <input type="number" value={vatBase} onChange={e => setVatBase(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>SAZBA DPH (%)</label>
                <input type="number" value={vatRate} onChange={e => setVatRate(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #6366f1', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#020617', borderRadius: '12px' }}>
                <span>Výše DPH:</span>
                <strong style={{ color: '#f43f5e' }}>{Math.round(vatAmount).toLocaleString('cs-CZ')} Kč</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#020617', borderRadius: '12px' }}>
                <span>Celková cena s DPH:</span>
                <strong style={{ color: '#10b981' }}>{Math.round(totalWithVat).toLocaleString('cs-CZ')} Kč</strong>
              </div>
            </div>
          </div>
        )}

        {/* 13. ČISTÁ MZDA (Funkce 14) */}
        {activeTab === 'salary' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', margin: 0 }}>Výpočet čisté mzdy (ČR)</h3>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>HRUBÁ MZDA (Kč)</label>
                <input type="number" value={grossSalary} onChange={e => setGrossSalary(Number(e.target.value))} style={{ width: '100%', background: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px', color: '#fff', marginTop: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>Výsledná čistá mzda</span>
              <div style={{ fontSize: '36px', fontWeight: '900', marginTop: '12px', color: '#10b981' }}>{Math.round(netSalary).toLocaleString('cs-CZ')} Kč</div>
            </div>
          </div>
        )}

        {/* 14. ULOŽENÉ VÝPOČTY (Historie) */}
        {activeTab === 'history' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#818cf8', marginBottom: '16px' }}>Uložené výpočty v paměti</h3>
            {history.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Zatím nemáš uložené žádné výpočty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#020617', border: '1px solid #334155', borderRadius: '14px', padding: '18px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#818cf8', fontSize: '15px' }}>{item.name}</div>
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>Půjčka: {item.amount.toLocaleString('cs-CZ')} Kč</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{item.payment.toLocaleString('cs-CZ')} Kč / měsíc</div>
                      <button onClick={() => setHistory(history.filter(h => h.id !== item.id))} style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '12px', cursor: 'pointer', marginTop: '4px' }}>Smazat</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
