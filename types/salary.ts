export type SalaryType = 'gross' | 'net'

export type Zone = 'central' | 'outer' | 'satellite'

export type MaritalStatus = 'single' | 'married' | 'family1' | 'family2'

export type TransportMode = 'public' | 'ojol' | 'motor' | 'car'

export type HousingType = 'parents' | 'kos_budget' | 'kos_mid' | 'kos_premium' | 'rent'

export type FoodStyle = 'warung' | 'mixed' | 'resto'

export type Lifestyle = 'frugal' | 'normal' | 'social'

export type Verdict = 'Layak banget' | 'Layak' | 'Pas-pasan' | 'Mepet sekali' | 'Tidak layak'

export interface SalaryInput {
  salary: number
  salaryType: SalaryType
  zone: Zone
  status: MaritalStatus
  transport: TransportMode
  housing: HousingType
  food: FoodStyle
  lifestyle: Lifestyle
  cicilan?: number
  danaDarurat?: number
  tunjanganTransport?: number
  tunjanganMakan?: number
  bonusTahunan?: number
}

export interface Deductions {
  pph21: number
  bpjsKes: number
  bpjsTK: number
}

export interface Expenses {
  housing: number
  transport: number
  food: number
  lifestyle: number
  utilities: number
  personal: number
}

export interface SalaryResult {
  gross: number
  takeHome: number
  deductions: Deductions
  expenses: Expenses
  totalExpense: number
  savings: number
  savingsRate: number
  verdict: Verdict
}
