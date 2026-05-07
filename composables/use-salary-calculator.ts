import type { SalaryInput, SalaryResult } from '~/types/salary'
import { calcTax, getExpenses, computeResult } from '~/utils/salary-calculator'

const DEFAULT_FORM: SalaryInput = {
  salary: 8_000_000,
  salaryType: 'gross',
  zone: 'outer',
  status: 'single',
  transport: 'public',
  housing: 'kos_mid',
  food: 'mixed',
  lifestyle: 'normal',
  city: 'jakarta',
  cicilan: 0,
  danaDarurat: 0,
  tunjanganTransport: 0,
  tunjanganMakan: 0,
  bonusTahunan: 0,
}

export function useSalaryCalculator() {
  const form = reactive<SalaryInput>({ ...DEFAULT_FORM })

  const result = computed<SalaryResult>(() => {
    // NOTE: When salaryType='net', calcTax receives net salary as gross input,
    // causing PPh21 to be computed from a lower base. computeResult partially
    // compensates with a one-pass back-calculation (net / (1 - effectiveRate)),
    // but this is approximate for higher tax brackets. See design spec.
    const gross = form.salary
    const deductions = calcTax(gross, form.status)
    const expenses = getExpenses(
      form.city,
      form.zone,
      form.status,
      form.transport,
      form.housing,
      form.food,
      form.lifestyle,
    )
    return computeResult(gross, form.salaryType, deductions, expenses,
      form.cicilan ?? 0,
      form.danaDarurat ?? 0,
      form.tunjanganTransport ?? 0,
      form.tunjanganMakan ?? 0,
      form.bonusTahunan ?? 0,
    )
  })

  return { form, result }
}
