import type { Deductions, Expenses, MaritalStatus, Zone, TransportMode, HousingType, FoodStyle, Lifestyle, SalaryResult, SalaryType } from '~/types/salary'

const PTKP: Record<MaritalStatus, number> = {
  single: 54_000_000,
  married: 58_500_000,
  family1: 63_000_000,
  family2: 67_500_000,
}

const HOUSING_COST: Record<HousingType, number> = {
  parents: 0,
  kos_budget: 950_000,
  kos_mid: 2_000_000,
  kos_premium: 4_000_000,
  rent: 6_000_000,
}

const TRANSPORT_COST: Record<TransportMode, number> = {
  public: 350_000,
  ojol: 900_000,
  motor: 500_000,
  car: 1_500_000,
}

const FOOD_BASE: Record<FoodStyle, number> = {
  warung: 500_000,
  mixed: 900_000,
  resto: 1_500_000,
}

const LIFESTYLE_COST: Record<Lifestyle, number> = {
  frugal: 200_000,
  normal: 600_000,
  social: 1_200_000,
}

const PEOPLE_MULTIPLIER: Record<MaritalStatus, number> = {
  single: 1,
  married: 1.8,
  family1: 2.5,
  family2: 3.2,
}

const ZONE_MULTIPLIER: Record<Zone, number> = {
  central: 1.3,
  outer: 1.0,
  satellite: 0.85,
}

const UTILITY_BASE: Record<MaritalStatus, number> = {
  single: 250_000,
  married: 350_000,
  family1: 450_000,
  family2: 550_000,
}

export function calcTax(gross: number, status: MaritalStatus): Deductions {
  const ptkp = PTKP[status]
  const annual = gross * 12
  const pkp = Math.max(0, annual - ptkp)

  let annualTax = 0
  if (pkp <= 60_000_000) {
    annualTax = pkp * 0.05
  } else if (pkp <= 250_000_000) {
    annualTax = 3_000_000 + (pkp - 60_000_000) * 0.15
  } else if (pkp <= 500_000_000) {
    annualTax = 31_500_000 + (pkp - 250_000_000) * 0.25
  } else {
    annualTax = 94_000_000 + (pkp - 500_000_000) * 0.3
  }

  const pph21 = annualTax / 12
  const bpjsKes = Math.min(gross * 0.01, 120_000)
  const bpjsTK = gross * 0.02

  return { pph21, bpjsKes, bpjsTK }
}

export function getExpenses(
  zone: Zone,
  status: MaritalStatus,
  transport: TransportMode,
  housing: HousingType,
  food: FoodStyle,
  lifestyle: Lifestyle,
): Expenses {
  const housingCost = HOUSING_COST[housing]
  const transportCost = TRANSPORT_COST[transport]
  const basePeople = PEOPLE_MULTIPLIER[status]
  const foodBase = FOOD_BASE[food]
  const foodCost = foodBase * basePeople * ZONE_MULTIPLIER[zone]
  const zoneMult = ZONE_MULTIPLIER[zone]
  const lifestyleCost = LIFESTYLE_COST[lifestyle]
  const utilities = UTILITY_BASE[status] * zoneMult
  const personal = 200_000 * basePeople

  return {
    housing: housingCost,
    transport: transportCost,
    food: foodCost,
    lifestyle: lifestyleCost,
    utilities,
    personal,
  }
}

export function computeResult(gross: number, salaryType: SalaryType, deductions: Deductions, expenses: Expenses): SalaryResult {
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0)

  if (gross <= 0) {
    return {
      gross: 0, takeHome: 0, deductions: { pph21: 0, bpjsKes: 0, bpjsTK: 0 },
      expenses, totalExpense, savings: -totalExpense, savingsRate: -Infinity,
      verdict: 'Tidak layak',
    }
  }

  let actualGross = gross
  let takeHome: number

  if (salaryType === 'net') {
    takeHome = gross
    const effectiveRate = deductions.pph21 / gross
    actualGross = gross / (1 - effectiveRate)
  } else {
    takeHome = gross - deductions.pph21 - deductions.bpjsKes - deductions.bpjsTK
  }

  const savings = takeHome - totalExpense
  const savingsRate = takeHome > 0 ? savings / takeHome : -Infinity

  let verdict: SalaryResult['verdict']
  if (savingsRate >= 0.3) {
    verdict = 'Layak banget'
  } else if (savingsRate >= 0.15) {
    verdict = 'Layak'
  } else if (savingsRate >= 0.05) {
    verdict = 'Pas-pasan'
  } else if (savingsRate >= 0) {
    verdict = 'Mepet sekali'
  } else {
    verdict = 'Tidak layak'
  }

  return {
    gross: actualGross,
    takeHome,
    deductions,
    expenses,
    totalExpense,
    savings,
    savingsRate,
    verdict,
  }
}
