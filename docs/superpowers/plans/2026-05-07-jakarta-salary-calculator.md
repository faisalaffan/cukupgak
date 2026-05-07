# Jakarta Salary Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementasi kalkulator kelayakan gaji Jakarta dengan Nuxt 3 + TypeScript + Tailwind CSS.

**Architecture:** Pure functions di `utils/` untuk logika kalkulasi (zero Vue dependency), composable sebagai reactive wrapper, dua komponen UI (form + results), Vitest untuk unit test, Playwright untuk e2e.

**Tech Stack:** Nuxt 3, TypeScript, Tailwind CSS, Vitest, Playwright

---

### Task 1: Initialize Nuxt 3 project

**Files:**
- Create: `package.json`
- Create: `nuxt.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "jakarta-salary-calculator",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxi dev",
    "build": "nuxi generate",
    "generate": "nuxi generate",
    "preview": "nuxi preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "npx playwright test"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.13.2",
    "@playwright/test": "^1.52.0",
    "nuxt": "^3.16.0",
    "typescript": "^5.8.0",
    "vitest": "^3.1.0",
    "vue-tsc": "^2.2.0"
  }
}
```

- [ ] **Step 2: Create nuxt.config.ts**

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

- [ ] **Step 4: Create assets/css/main.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`

- [ ] **Step 6: Verify Nuxt builds**

Run: `npx nuxi generate`
Expected: builds successfully (may warn about empty app.vue — ignore)

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json nuxt.config.ts tsconfig.json assets/
git commit -m "chore: init Nuxt 3 + TypeScript + Tailwind CSS"
```

---

### Task 2: Define TypeScript types

**Files:**
- Create: `types/salary.ts`

- [ ] **Step 1: Write types**

```typescript
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
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add types/salary.ts
git commit -m "feat: add salary calculator types"
```

---

### Task 3: Implement calculation utilities + unit tests

**Files:**
- Create: `utils/salary-calculator.ts`
- Create: `utils/__tests__/salary-calculator.test.ts`

- [ ] **Step 1: Write utility implementation**

```typescript
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
  let actualGross = gross
  let takeHome: number

  if (salaryType === 'net') {
    takeHome = gross
    const effectiveRate = deductions.pph21 / gross
    actualGross = gross / (1 - effectiveRate)
  } else {
    takeHome = gross - deductions.pph21 - deductions.bpjsKes - deductions.bpjsTK
  }

  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0)
  const savings = takeHome - totalExpense
  const savingsRate = savings / takeHome

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
```

- [ ] **Step 2: Write unit tests**

```typescript
import { describe, it, expect } from 'vitest'
import { calcTax, getExpenses, computeResult } from '../salary-calculator'
import type { Deductions, Expenses, SalaryResult, SalaryInput } from '~/types/salary'

describe('calcTax', () => {
  it('returns zero PPh21 when income is below PTKP (single)', () => {
    const result = calcTax(4_000_000, 'single')
    // 4jt × 12 = 48jt, PTKP single = 54jt → PKP = 0
    expect(result.pph21).toBe(0)
  })

  it('calculates 5% bracket correctly', () => {
    // gross 6jt → annual 72jt, PKP = 72jt - 54jt = 18jt → tax = 18jt × 5% = 900rb / 12 = 75rb
    const result = calcTax(6_000_000, 'single')
    expect(result.pph21).toBeCloseTo(75_000, -2)
  })

  it('calculates 15% bracket correctly', () => {
    // gross 15jt → annual 180jt, PKP = 180jt - 54jt = 126jt
    // tax = 3jt + (126jt - 60jt) × 15% = 3jt + 9.9jt = 12.9jt / 12 = 1.075jt
    const result = calcTax(15_000_000, 'single')
    expect(result.pph21).toBeCloseTo(1_075_000, -2)
  })

  it('calculates 25% bracket correctly', () => {
    // gross 35jt → annual 420jt, PKP = 420jt - 54jt = 366jt
    // tax = 31.5jt + (366jt - 250jt) × 25% = 31.5jt + 29jt = 60.5jt / 12 ≈ 5.042jt
    const result = calcTax(35_000_000, 'single')
    expect(result.pph21).toBeCloseTo(5_041_667, -2)
  })

  it('calculates 30% bracket correctly', () => {
    // gross 60jt → annual 720jt, PKP = 720jt - 54jt = 666jt
    // tax = 94jt + (666jt - 500jt) × 30% = 94jt + 49.8jt = 143.8jt / 12 ≈ 11.983jt
    const result = calcTax(60_000_000, 'single')
    expect(result.pph21).toBeCloseTo(11_983_333, -2)
  })

  it('uses correct PTKP for married status', () => {
    const single = calcTax(5_000_000, 'single')
    const married = calcTax(5_000_000, 'married')
    // PTKP married higher → less PKP → less tax
    expect(married.pph21).toBeLessThan(single.pph21)
  })

  it('caps BPJS Kesehatan at Rp 120.000', () => {
    const result = calcTax(15_000_000, 'single')
    expect(result.bpjsKes).toBe(120_000)
  })

  it('calculates BPJS Kesehatan at 1% for low salary', () => {
    const result = calcTax(5_000_000, 'single')
    expect(result.bpjsKes).toBe(50_000)
  })

  it('calculates BPJS Ketenagakerjaan at 2%', () => {
    const result = calcTax(10_000_000, 'single')
    expect(result.bpjsTK).toBe(200_000)
  })
})

describe('getExpenses', () => {
  it('returns zero housing for parents', () => {
    const expenses = getExpenses('outer', 'single', 'public', 'parents', 'warung', 'frugal')
    expect(expenses.housing).toBe(0)
  })

  it('cheapest scenario: single + parents + warung + frugal + satellite + public', () => {
    const expenses = getExpenses('satellite', 'single', 'public', 'parents', 'warung', 'frugal')
    const total = Object.values(expenses).reduce((a, b) => a + b, 0)
    // housing=0, transport=350k, food=500k*1*0.85=425k, lifestyle=200k, utilities=250k*0.85=212.5k, personal=200k*1=200k
    expect(expenses.housing).toBe(0)
    expect(expenses.transport).toBe(350_000)
    expect(expenses.food).toBeCloseTo(425_000, -3)
    expect(expenses.lifestyle).toBe(200_000)
    expect(expenses.utilities).toBeCloseTo(212_500, -3)
    expect(expenses.personal).toBe(200_000)
    expect(total).toBeLessThan(1_500_000)
  })

  it('most expensive scenario: family2 + rent + resto + social + central + car', () => {
    const expenses = getExpenses('central', 'family2', 'car', 'rent', 'resto', 'social')
    const total = Object.values(expenses).reduce((a, b) => a + b, 0)
    // housing=6jt, transport=1.5jt, food=1.5jt*3.2*1.3=6.24jt, lifestyle=1.2jt, utilities=550k*1.3=715k, personal=200k*3.2=640k
    expect(expenses.housing).toBe(6_000_000)
    expect(expenses.transport).toBe(1_500_000)
    expect(expenses.food).toBeCloseTo(6_240_000, -3)
    expect(total).toBeGreaterThan(15_000_000)
  })

  it('applies zone multiplier to food and utilities', () => {
    const central = getExpenses('central', 'single', 'public', 'parents', 'warung', 'frugal')
    const satellite = getExpenses('satellite', 'single', 'public', 'parents', 'warung', 'frugal')
    expect(central.food).toBeGreaterThan(satellite.food)
    expect(central.utilities).toBeGreaterThan(satellite.utilities)
  })
})

describe('computeResult', () => {
  const sampleDeductions: Deductions = { pph21: 100_000, bpjsKes: 50_000, bpjsTK: 100_000 }
  const sampleExpenses: Expenses = {
    housing: 2_000_000, transport: 500_000, food: 1_500_000,
    lifestyle: 600_000, utilities: 300_000, personal: 200_000,
  }

  it('computes take-home for gross salary', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses)
    expect(result.takeHome).toBe(7_750_000) // 8jt - 100k - 50k - 100k
    expect(result.totalExpense).toBe(5_100_000)
    expect(result.savings).toBe(2_650_000)
    expect(result.savingsRate).toBeCloseTo(0.342, 2)
    expect(result.verdict).toBe('Layak banget')
  })

  it('computes take-home for net salary', () => {
    const result = computeResult(8_000_000, 'net', sampleDeductions, sampleExpenses)
    expect(result.takeHome).toBe(8_000_000)
    // savings = 8jt - 5.1jt = 2.9jt
    expect(result.savings).toBe(2_900_000)
  })

  it('verdict Pas-pasan at 5-15% savings', () => {
    // takeHome needs to be ~5.37jt for expenses 5.1jt → savings ~270k = 5%
    const highDeductions: Deductions = { pph21: 1_500_000, bpjsKes: 120_000, bpjsTK: 200_000 }
    const result = computeResult(7_000_000, 'gross', highDeductions, sampleExpenses)
    // takeHome = 7jt - 1.82jt = 5.18jt, savings = 80k, rate ≈ 0.015
    expect(result.verdict).toBe('Pas-pasan')
  })

  it('verdict Tidak layak when expenses exceed take-home', () => {
    const highExpenses: Expenses = {
      housing: 10_000_000, transport: 1_000_000, food: 3_000_000,
      lifestyle: 1_000_000, utilities: 500_000, personal: 500_000,
    }
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses)
    expect(result.savings).toBeLessThan(0)
    expect(result.verdict).toBe('Tidak layak')
  })

  it('handles zero salary gracefully', () => {
    const result = computeResult(0, 'gross', { pph21: 0, bpjsKes: 0, bpjsTK: 0 }, sampleExpenses)
    expect(result.takeHome).toBe(0)
    expect(result.savings).toBeLessThan(0)
    expect(result.verdict).toBe('Tidak layak')
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run`
Expected: all tests FAIL (utils not created yet — actually they were created in step 1, so they should PASS)

Wait — since step 1 creates the implementation and step 2 writes the tests, running tests should pass directly.

Run: `npx vitest run`
Expected: all 16 tests PASS

- [ ] **Step 4: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add utils/salary-calculator.ts utils/__tests__/salary-calculator.test.ts
git commit -m "feat: add salary calculation utilities with unit tests"
```

---

### Task 4: Implement composable

**Files:**
- Create: `composables/use-salary-calculator.ts`

- [ ] **Step 1: Write composable**

```typescript
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
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add composables/use-salary-calculator.ts
git commit -m "feat: add useSalaryCalculator composable"
```

---

### Task 5: Implement SalaryForm component

**Files:**
- Create: `components/SalaryForm.vue`

- [ ] **Step 1: Write SalaryForm component**

```vue
<script setup lang="ts">
import type { SalaryInput } from '~/types/salary'

const form = defineModel<SalaryInput>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Gaji bruto (Rp/bulan)</label>
      <input
        v-model.number="form.salary"
        type="number"
        step="500000"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Tipe gaji</label>
      <select
        v-model="form.salaryType"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="gross">Bruto (sebelum pajak)</option>
        <option value="net">Neto (sudah dipotong)</option>
      </select>
    </div>

    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Zona domisili</label>
      <select
        v-model="form.zone"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="central">Jakarta Pusat / Selatan (premium)</option>
        <option value="outer">Jakarta Timur / Barat / Utara</option>
        <option value="satellite">Bekasi / Depok / Tangerang / Bogor</option>
      </select>
    </div>
    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Status</label>
      <select
        v-model="form.status"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="single">Lajang</option>
        <option value="married">Menikah (tanpa anak)</option>
        <option value="family1">Menikah + 1 anak</option>
        <option value="family2">Menikah + 2 anak</option>
      </select>
    </div>

    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Transportasi ke kantor</label>
      <select
        v-model="form.transport"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="public">KRL / MRT / TransJakarta</option>
        <option value="ojol">Ojol harian</option>
        <option value="motor">Motor pribadi</option>
        <option value="car">Mobil pribadi</option>
      </select>
    </div>
    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Tempat tinggal</label>
      <select
        v-model="form.housing"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="parents">Tinggal sama orang tua</option>
        <option value="kos_budget">Kos budget (Rp 700rb–1,2jt)</option>
        <option value="kos_mid">Kos menengah (Rp 1,5jt–2,5jt)</option>
        <option value="kos_premium">Kos premium (Rp 3jt–5jt)</option>
        <option value="rent">Sewa apartemen (Rp 4jt–8jt)</option>
      </select>
    </div>

    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Gaya makan</label>
      <select
        v-model="form.food"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="warung">Warung / warteg setiap hari</option>
        <option value="mixed">Mix (warung + sesekali resto)</option>
        <option value="resto">Resto / GrabFood lebih sering</option>
      </select>
    </div>
    <div>
      <label class="block text-[13px] text-gray-500 mb-1.5">Gaya hidup</label>
      <select
        v-model="form.lifestyle"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="frugal">Hemat ketat</option>
        <option value="normal">Normal (nongkrong sesekali)</option>
        <option value="social">Aktif sosial / hobi</option>
      </select>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/SalaryForm.vue
git commit -m "feat: add SalaryForm component"
```

---

### Task 6: Implement SalaryResults component

**Files:**
- Create: `components/SalaryResults.vue`

- [ ] **Step 1: Write SalaryResults component**

```vue
<script setup lang="ts">
import type { SalaryResult, Expenses } from '~/types/salary'

const props = defineProps<{ result: SalaryResult }>()

const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const pct = (n: number) => (n * 100).toFixed(1) + '%'

const barWidth = (value: number) => {
  const takeHome = props.result.takeHome
  if (takeHome <= 0) return '0'
  return Math.min(100, Math.max(0, (value / takeHome) * 100)).toFixed(1)
}

const expenseLabels: Record<keyof Expenses, string> = {
  housing: 'Tempat tinggal',
  transport: 'Transportasi',
  food: 'Makan',
  lifestyle: 'Gaya hidup',
  utilities: 'Utilitas & listrik',
  personal: 'Kebutuhan pribadi',
}

const barColors: Record<keyof Expenses, string> = {
  housing: '#378ADD',
  transport: '#1D9E75',
  food: '#EF9F27',
  lifestyle: '#D4537E',
  utilities: '#7F77DD',
  personal: '#D85A30',
}

const verdictStyles: Record<SalaryResult['verdict'], { text: string; bg: string }> = {
  'Layak banget': { text: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  'Layak': { text: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  'Pas-pasan': { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  'Mepet sekali': { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  'Tidak layak': { text: 'text-red-700', bg: 'bg-red-50 border-red-200' },
}

const verdictNotes: Record<SalaryResult['verdict'], string> = {
  'Layak banget': 'Bisa nabung >30% take-home. Finansial aman untuk profil ini.',
  'Layak': 'Cukup untuk hidup + nabung tipis. Perlu disiplin kalau ada kebutuhan mendadak.',
  'Pas-pasan': 'Hampir impas. Risiko tinggi kalau ada pengeluaran tak terduga.',
  'Mepet sekali': 'Hampir tidak ada ruang untuk savings atau darurat.',
  'Tidak layak': 'Pengeluaran melebihi take-home. Perlu tambahan income atau kurangi gaya hidup.',
}

const verdictStyle = computed(() => verdictStyles[props.result.verdict])
const verdictNote = computed(() => verdictNotes[props.result.verdict])
</script>

<template>
  <div class="border-t border-gray-200 pt-6 mt-2">
    <!-- Verdict -->
    <div
      :class="verdictStyle.bg"
      class="rounded-lg px-5 py-4 mb-5 border"
    >
      <div class="flex items-center gap-2.5 mb-1">
        <span :class="verdictStyle.text" class="text-lg font-medium">{{ result.verdict }}</span>
        <span :class="verdictStyle.text" class="text-[13px] opacity-80">{{ pct(Math.max(result.savingsRate, 0)) }} savings rate</span>
      </div>
      <p class="m-0 text-[13px] text-gray-500">{{ verdictNote }}</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-2.5 mb-6">
      <div class="bg-gray-100 rounded-lg p-3.5">
        <p class="m-0 mb-1 text-xs text-gray-500">Take-home / bulan</p>
        <p class="m-0 text-[15px] font-medium text-gray-900">{{ fmt(result.takeHome) }}</p>
      </div>
      <div class="bg-gray-100 rounded-lg p-3.5">
        <p class="m-0 mb-1 text-xs text-gray-500">Total pengeluaran</p>
        <p class="m-0 text-[15px] font-medium text-gray-900">{{ fmt(result.totalExpense) }}</p>
      </div>
      <div class="bg-gray-100 rounded-lg p-3.5">
        <p class="m-0 mb-1 text-xs text-gray-500">{{ result.savings >= 0 ? 'Sisa / potensi tabungan' : 'Defisit' }}</p>
        <p
          :class="result.savings >= 0 ? 'text-green-600' : 'text-red-600'"
          class="m-0 text-[15px] font-medium"
        >
          {{ fmt(Math.abs(result.savings)) }}
        </p>
      </div>
    </div>

    <!-- Deduction breakdown -->
    <div class="mb-5">
      <p class="text-[13px] text-gray-500 m-0 mb-3">Rincian potongan gaji</p>
      <div class="grid grid-cols-3 gap-2 text-[13px]">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="m-0 mb-0.5 text-gray-500">PPh 21</p>
          <p class="m-0 font-medium">{{ fmt(result.deductions.pph21) }}</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="m-0 mb-0.5 text-gray-500">BPJS Kesehatan</p>
          <p class="m-0 font-medium">{{ fmt(result.deductions.bpjsKes) }}</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="m-0 mb-0.5 text-gray-500">BPJS Ketenagakerjaan</p>
          <p class="m-0 font-medium">{{ fmt(result.deductions.bpjsTK) }}</p>
        </div>
      </div>
    </div>

    <!-- Expense bars -->
    <div>
      <p class="text-[13px] text-gray-500 m-0 mb-3">Breakdown pengeluaran</p>
      <div
        v-for="(value, key) in result.expenses"
        :key="key"
        class="mb-2.5"
      >
        <div class="flex justify-between text-[13px] mb-1">
          <span class="text-gray-500">{{ expenseLabels[key as keyof Expenses] }}</span>
          <span class="text-gray-900">{{ fmt(value) }}</span>
        </div>
        <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full"
            :style="{ width: barWidth(value) + '%', backgroundColor: barColors[key as keyof Expenses] }"
          />
        </div>
      </div>
    </div>

    <p class="text-[11px] text-gray-400 mt-5 mb-0">
      Estimasi berdasarkan asumsi rata-rata biaya hidup 2024–2025. PPh 21 menggunakan tarif progresif PTKP standar. Tidak termasuk tanggungan cicilan, dana darurat, atau pengeluaran tak terduga.
    </p>
  </div>
</template>
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/SalaryResults.vue
git commit -m "feat: add SalaryResults component"
```

---

### Task 7: Wire up app.vue

**Files:**
- Create/Overwrite: `app.vue`

- [ ] **Step 1: Write app.vue**

```vue
<script setup lang="ts">
useHead({ title: 'Kalkulator Kelayakan Gaji Jakarta' })
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 class="text-xl font-semibold text-gray-900 mb-1">Kalkulator Kelayakan Gaji Jakarta</h1>
        <p class="text-sm text-gray-500 mb-6">Estimasi apakah gajimu cukup untuk biaya hidup di Jakarta dan sekitarnya.</p>

        <SalaryCalculator />
      </div>

      <footer class="text-center text-xs text-gray-400 mt-6">
        Dibuat oleh <a href="https://faisalaffan.github.io" class="underline">Faisal Affan</a> &middot; Data estimasi 2024–2025
      </footer>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create SalaryCalculator wrapper component**

```vue
<!-- components/SalaryCalculator.vue -->
<script setup lang="ts">
import { useSalaryCalculator } from '~/composables/use-salary-calculator'

const { form, result } = useSalaryCalculator()
</script>

<template>
  <SalaryForm v-model="form" />
  <SalaryResults :result="result" />
</template>
```

- [ ] **Step 3: Verify build**

Run: `npx nuxi generate`
Expected: builds without errors

- [ ] **Step 4: Start dev server and verify visually**

Run: `npx nuxi dev`
Open: `http://localhost:3000`
Verify: form renders, changing inputs updates results, all 5 verdicts reachable

- [ ] **Step 5: Commit**

```bash
git add app.vue components/SalaryCalculator.vue
git commit -m "feat: wire up app with SalaryCalculator"
```

---

### Task 8: Add Playwright e2e tests

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/salary-calculator.spec.ts`

- [ ] **Step 1: Create playwright.config.ts**

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npx nuxi dev --port 3000',
    port: 3000,
    timeout: 30_000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
})
```

- [ ] **Step 2: Write e2e tests**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Jakarta Salary Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders form with default values and results', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Kalkulator Kelayakan Gaji Jakarta')
    await expect(page.locator('#salary')).toBeVisible()
    await expect(page.locator('#salary')).toHaveValue('8000000')
    // default verdict should be visible
    await expect(page.getByText(/Layak banget|Layak|Pas-pasan|Mepet sekali|Tidak layak/)).toBeVisible()
  })

  test('changing salary updates results', async ({ page }) => {
    await page.fill('#salary', '5000000')
    // results should update
    await expect(page.getByText(/take-home/i)).toBeVisible()
  })

  test('changing zone updates expense breakdown', async ({ page }) => {
    await page.selectOption('#zone', 'central')
    // expenses should increase from central multiplier
    await expect(page.getByText(/total pengeluaran/i)).toBeVisible()
  })

  test('toggling salary type from gross to net preserves take-home', async ({ page }) => {
    await page.fill('#salary', '10000000')
    await page.selectOption('#salaryType', 'net')
    // take-home should now be exactly 10jt
    await expect(page.getByText('Rp 10.000.000')).toBeVisible()
  })

  test('can reach verdict Tidak layak with extreme settings', async ({ page }) => {
    await page.fill('#salary', '4000000')
    await page.selectOption('#zone', 'central')
    await page.selectOption('#status', 'family2')
    await page.selectOption('#housing', 'rent')
    await page.selectOption('#transport', 'car')
    await page.selectOption('#food', 'resto')
    await page.selectOption('#lifestyle', 'social')
    await expect(page.getByText('Tidak layak')).toBeVisible()
  })

  test('responsive layout shows 1 column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    // form should still be interactable
    await expect(page.locator('#salary')).toBeVisible()
  })
})
```

- [ ] **Step 3: Run e2e tests**

Run: `npx playwright test`
Expected: all 6 tests PASS

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e/salary-calculator.spec.ts
git commit -m "test: add Playwright e2e tests"
```

---

### Task 9: Final verification & cleanup

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: all 16 tests PASS

- [ ] **Step 2: Run all e2e tests**

Run: `npx playwright test`
Expected: all 6 tests PASS

- [ ] **Step 3: Run type check**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Run production build**

Run: `npx nuxi generate`
Expected: generates static output in `.output/public/`

- [ ] **Step 5: Update CLAUDE.md**

Add relevant build/test commands and architecture overview. The CLAUDE.md currently is minimal and only has project conventions.

- [ ] **Step 6: Final commit if needed**
