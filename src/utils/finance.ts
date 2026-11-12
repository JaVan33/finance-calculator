import Decimal from 'decimal.js';

/**
 * Vypočítá měsíční splátku úvěru (anuitní splátka)
 * @param principal Celková výše půjčky (jistina)
 * @param annualRate Roční úroková sazba v procentech (např. 5.5 pro 5.5 %)
 * @param years Doba splácení v letech
 */
export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;

  const P = new Decimal(principal);
  // Převedení ročního úroku na měsíční desetinné číslo
  const r = new Decimal(annualRate).dividedBy(100).dividedBy(12);
  // Celkový počet měsíců
  const n = new Decimal(years).times(12);

  // Vzorec: M = P * [r(1 + r)^n] / [(1 + r)^n – 1]
  const onePlusR = r.plus(1);
  const numerator = r.times(onePlusR.pow(n));
  const denominator = onePlusR.pow(n).minus(1);

  const monthlyPayment = P.times(numerator.dividedBy(denominator));

  // Zaokrouhlení na 2 desetinná místa
  return monthlyPayment.toDecimalPlaces(2).toNumber();
}
