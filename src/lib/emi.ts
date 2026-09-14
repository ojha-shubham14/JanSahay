import type { EMIResult, ScheduleRow } from '@/lib/types';

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  moratoriumMonths: number = 0,
): EMIResult {
  const monthlyRate = annualRate / 12 / 100;

  let principalAfterMoratorium = principal;
  const schedule: ScheduleRow[] = [];

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = principalAfterMoratorium * monthlyRate;
    principalAfterMoratorium += interest;
    schedule.push({
      month: m,
      phase: 'moratorium',
      opening_balance: Math.round(principalAfterMoratorium - interest),
      emi: 0,
      interest: Math.round(interest),
      principal_component: 0,
      closing_balance: Math.round(principalAfterMoratorium),
    });
  }

  const repaymentMonths = tenureMonths - moratoriumMonths;
  const r = monthlyRate;
  let emi: number;

  if (r === 0) {
    emi = principalAfterMoratorium / repaymentMonths;
  } else {
    emi =
      (principalAfterMoratorium * r * Math.pow(1 + r, repaymentMonths)) /
      (Math.pow(1 + r, repaymentMonths) - 1);
  }

  let balance = principalAfterMoratorium;
  let totalInterest = 0;

  for (let m = 1; m <= repaymentMonths; m++) {
    const interest = balance * r;
    const principalComponent = emi - interest;
    balance -= principalComponent;
    totalInterest += interest;

    schedule.push({
      month: moratoriumMonths + m,
      phase: 'repayment',
      opening_balance: Math.round(balance + principalComponent),
      emi: Math.round(emi),
      interest: Math.round(interest),
      principal_component: Math.round(principalComponent),
      closing_balance: Math.max(0, Math.round(balance)),
    });
  }

  const totalRepayment = emi * repaymentMonths;

  return {
    emi: Math.round(emi),
    total_interest: Math.round(totalInterest),
    total_repayment: Math.round(totalRepayment),
    principal_after_moratorium: Math.round(principalAfterMoratorium),
    schedule,
  };
}
