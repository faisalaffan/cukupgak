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
}

export function useSalaryCalculator() {
  const form = reactive<SalaryInput>({ ...DEFAULT_FORM })

  const result = computed<SalaryResult>(() => {
    const gross = form.salary
    const deductions = calcTax(gross, form.status)
    const expenses = getExpenses(
      form.zone,
      form.status,
      form.transport,
      form.housing,
      form.food,
      form.lifestyle,
    )
    return computeResult(gross, form.salaryType, deductions, expenses)
  })

  return { form, result }
}
