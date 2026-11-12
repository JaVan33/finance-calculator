import Decimal from 'decimal.js';

export interface MortgageYearData {
  year: number;
  remainingBalance: number;
  interestPaid: number;
  principalPaid: number;
  totalInterestPaid: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: MortgageYearData[];
}

export function calculateMortgage(
  loanAmount: number,
  annualRate: number,
  years: number
): MortgageResult {
  const P = new Decimal(loanAmount);
  const r = new Decimal(annualRate).div(100).div(12);
  const n = years * 12;

  let monthlyPaymentDec: Decimal;
  if (r.isZero()) {
    monthlyPaymentDec = P.div(n);
  } else {
    const factor = r.plus(1).pow(n);
    monthlyPaymentDec = P.mul(r.mul(factor)).div(factor.minus(1));
  }

  let balance = P;
  let totalInterest = new Decimal(0);
  const schedule: MortgageYearData[] = [];

  for (let year = 1; year <= years; year++) {
    let yearlyInterest = new Decimal(0);
    let yearlyPrincipal = new Decimal(0);

    for (let month = 1; month <= 12; month++) {
      if (balance.lte(0)) break;
      const interestForMonth = balance.mul(r);
      let principalForMonth = monthlyPaymentDec.minus(interestForMonth);

      if (principalForMonth.gt(balance)) {
        principalForMonth = balance;
      }

      balance = balance.minus(principalForMonth);
      yearlyInterest = yearlyInterest.plus(interestForMonth);
      yearlyPrincipal = yearlyPrincipal.plus(principalForMonth);
      totalInterest = totalInterest.plus(interestForMonth);
    }

    schedule.push({
      year,
      remainingBalance: Math.max(0, Math.round(balance.toNumber())),
      interestPaid: Math.round(yearlyInterest.toNumber()),
      principalPaid: Math.round(yearlyPrincipal.toNumber()),
      totalInterestPaid: Math.round(totalInterest.toNumber()),
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPaymentDec.toNumber()),
    totalPaid: Math.round(P.plus(totalInterest).toNumber()),
    totalInterest: Math.round(totalInterest.toNumber()),
    schedule,
  };
}

export interface InvestmentYearData {
  year: number;
  totalContributions: number;
  interestEarned: number;
  totalBalance: number;
  realBalance: number; // Očištěno o inflaci
}

export function calculateInvestment(
  initialDeposit: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  inflationRate: number
): InvestmentYearData[] {
  let balance = new Decimal(initialDeposit);
  let totalContributed = new Decimal(initialDeposit);
  const monthlyRate = new Decimal(annualReturn).div(100).div(12);
  const schedule: InvestmentYearData[] = [];

  // Rok 0 (výchozí stav)
  schedule.push({
    year: 0,
    totalContributions: Math.round(totalContributed.toNumber()),
    interestEarned: 0,
    totalBalance: Math.round(balance.toNumber()),
    realBalance: Math.round(balance.toNumber()),
  });

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance.mul(monthlyRate.plus(1)).plus(monthlyContribution);
      totalContributed = totalContributed.plus(monthlyContribution);
    }

    const interestEarned = balance.minus(totalContributed);
    const inflationFactor = new Decimal(1).plus(new Decimal(inflationRate).div(100)).pow(year);
    const realBalance = balance.div(inflationFactor);

    schedule.push({
      year,
      totalContributions: Math.round(totalContributed.toNumber()),
      interestEarned: Math.round(interestEarned.toNumber()),
      totalBalance: Math.round(balance.toNumber()),
      realBalance: Math.round(realBalance.toNumber()),
    });
  }

  return schedule;
}

export const formatCZK = (amount: number): string => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount);
};
