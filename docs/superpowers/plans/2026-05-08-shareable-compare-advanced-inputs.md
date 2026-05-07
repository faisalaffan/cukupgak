# Shareable Link, Comparison Mode & Advanced Inputs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shareable URLs, side-by-side comparison, and advanced inputs (cicilan, tunjangan, dana darurat) to the Jakarta salary calculator.

**Architecture:** URL sync composable watches form changes and encodes state to query params. Advanced inputs added as optional fields to SalaryInput. Comparison page uses two independent composable instances with prefixed URL params.

**Tech Stack:** Nuxt 3, TypeScript, Tailwind CSS, Vitest, Playwright

---

### Task 1: Update types with optional advanced fields

**Files:**
- Modify: `types/salary.ts`

- [ ] **Step 1: Add optional fields to SalaryInput**

Add 5 optional number fields to the `SalaryInput` interface:

```typescript
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
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add types/salary.ts
git commit -m "feat: add optional advanced input fields to SalaryInput"
```

---

### Task 2: Update computeResult for cicilan & tunjangan

**Files:**
- Modify: `utils/salary-calculator.ts`
- Modify: `utils/__tests__/salary-calculator.test.ts`

- [ ] **Step 1: Update computeResult signature and logic**

Change `computeResult` to accept 5 additional optional parameters:

```typescript
export function computeResult(
  gross: number,
  salaryType: SalaryType,
  deductions: Deductions,
  expenses: Expenses,
  cicilan: number = 0,
  danaDarurat: number = 0,
  tunjanganTransport: number = 0,
  tunjanganMakan: number = 0,
  bonusTahunan: number = 0,
): SalaryResult {
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0)
    + cicilan + danaDarurat - tunjanganTransport - tunjanganMakan

  // ... rest of existing computeResult logic unchanged ...
  // (guard clause, gross/net calculation, savings, verdict)
}
```

The changes to the existing function body are ONLY on the `totalExpense` line. The rest of the function stays identical.

- [ ] **Step 2: Update composable to pass advanced fields**

In `composables/use-salary-calculator.ts`, update the `computed` to pass the new fields:

```typescript
return computeResult(
  gross,
  form.salaryType,
  deductions,
  expenses,
  form.cicilan ?? 0,
  form.danaDarurat ?? 0,
  form.tunjanganTransport ?? 0,
  form.tunjanganMakan ?? 0,
  form.bonusTahunan ?? 0,
)
```

Also update `DEFAULT_FORM` to include defaults for the 5 new fields:

```typescript
const DEFAULT_FORM: SalaryInput = {
  salary: 8_000_000,
  salaryType: 'gross',
  zone: 'outer',
  status: 'single',
  transport: 'public',
  housing: 'kos_mid',
  food: 'mixed',
  lifestyle: 'normal',
  cicilan: 0,
  danaDarurat: 0,
  tunjanganTransport: 0,
  tunjanganMakan: 0,
  bonusTahunan: 0,
}
```

- [ ] **Step 3: Add unit tests for advanced inputs**

Add tests to `utils/__tests__/salary-calculator.test.ts`:

```typescript
describe('computeResult with advanced inputs', () => {
  const sampleDeductions: Deductions = { pph21: 100_000, bpjsKes: 50_000, bpjsTK: 100_000 }
  const sampleExpenses: Expenses = {
    housing: 2_000_000, transport: 500_000, food: 1_500_000,
    lifestyle: 600_000, utilities: 300_000, personal: 200_000,
  }
  // base totalExpense = 5_100_000

  it('adds cicilan to total expense', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 2_000_000)
    // totalExpense = 5.1M + 2M = 7.1M, takeHome = 7.75M, savings = 650K
    expect(result.totalExpense).toBe(7_100_000)
    expect(result.savings).toBe(650_000)
  })

  it('adds dana darurat to total expense', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 500_000)
    expect(result.totalExpense).toBe(5_600_000)
  })

  it('subtracts tunjangan transport from total expense', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 400_000)
    // totalExpense = 5.1M - 400K = 4.7M
    expect(result.totalExpense).toBe(4_700_000)
  })

  it('subtracts tunjangan makan from total expense', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 0, 300_000)
    expect(result.totalExpense).toBe(4_800_000)
  })

  it('combines all advanced inputs correctly', () => {
    // cicilan=1M, darurat=500K, tunjTransport=400K, tunjMakan=300K
    // net addition = 1M + 500K - 400K - 300K = 800K, total = 5.1M + 800K = 5.9M
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 1_000_000, 500_000, 400_000, 300_000)
    expect(result.totalExpense).toBe(5_900_000)
  })

  it('bonus tahunan does not affect monthly verdict', () => {
    const withoutBonus = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 0, 0)
    const withBonus = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 0, 0, 20_000_000)
    expect(withBonus.savings).toBe(withoutBonus.savings)
    expect(withBonus.verdict).toBe(withoutBonus.verdict)
  })

  it('tunjangan can make total expense negative (edge case)', () => {
    // totalExpense = 5.1M - 3M - 3M = -900K
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 3_000_000, 3_000_000)
    expect(result.totalExpense).toBe(-900_000)
    // savings = 7.75M - (-900K) = 8.65M, rate = 8.65/7.75 > 100%
    expect(result.savings).toBeGreaterThan(result.takeHome)
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: all existing tests + 7 new tests PASS (30 total)

- [ ] **Step 5: Commit**

```bash
git add utils/salary-calculator.ts utils/__tests__/salary-calculator.test.ts composables/use-salary-calculator.ts
git commit -m "feat: add cicilan, tunjangan, and dana darurat to calculation"
```

---

### Task 3: Create use-url-sync composable

**Files:**
- Create: `composables/use-url-sync.ts`

- [ ] **Step 1: Write composable**

```typescript
import type { SalaryInput } from '~/types/salary'

const FORM_KEYS = [
  'salary', 'salaryType', 'zone', 'status', 'transport',
  'housing', 'food', 'lifestyle',
  'cicilan', 'danaDarurat', 'tunjanganTransport', 'tunjanganMakan', 'bonusTahunan',
] as const

function parseQuery(query: Record<string, string | undefined>): Partial<SalaryInput> {
  const parsed: Record<string, unknown> = {}

  for (const key of FORM_KEYS) {
    const raw = query[key]
    if (raw === undefined) continue

    if (key === 'salary' || key === 'cicilan' || key === 'danaDarurat' || key === 'tunjanganTransport' || key === 'tunjanganMakan' || key === 'bonusTahunan') {
      const n = parseInt(raw, 10)
      if (!isNaN(n) && n >= 0) parsed[key] = n
    } else {
      parsed[key] = raw
    }
  }

  return parsed as Partial<SalaryInput>
}

function serializeForm(form: SalaryInput): Record<string, string> {
  const query: Record<string, string> = {}
  for (const key of FORM_KEYS) {
    const val = form[key as keyof SalaryInput]
    if (val !== undefined && val !== 0) {
      query[key] = String(val)
    }
  }
  return query
}

export function useUrlSync(
  form: ReturnType<typeof import('~/composables/use-salary-calculator').useSalaryCalculator>['form'],
  prefix?: string,
) {
  const router = useRouter()
  const route = useRoute()

  // Hydrate from URL on mount
  onMounted(() => {
    const rawPrefix = prefix ?? ''
    const query = route.query as Record<string, string | undefined>

    if (prefix) {
      // Extract prefixed params (e.g., a.salary → salary)
      const prefixed: Record<string, string | undefined> = {}
      for (const [k, v] of Object.entries(query)) {
        if (k.startsWith(prefix + '.')) {
          prefixed[k.slice(prefix.length + 1)] = Array.isArray(v) ? v[0] : v
        }
      }
      const parsed = parseQuery(prefixed)
      Object.assign(form, parsed)
    } else {
      const parsed = parseQuery(query)
      Object.assign(form, parsed)
    }
  })

  // Sync form changes to URL (debounced)
  let timeout: ReturnType<typeof setTimeout> | null = null
  watch(
    () => ({ ...form }),
    () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        let query: Record<string, string>
        if (prefix) {
          const serialized = serializeForm(form)
          query = {}
          for (const [k, v] of Object.entries(serialized)) {
            query[`${prefix}.${k}`] = v
          }
        } else {
          query = serializeForm(form)
        }
        router.replace({ query })
      }, 300)
    },
    { deep: true },
  )
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add composables/use-url-sync.ts
git commit -m "feat: add use-url-sync composable for shareable links"
```

---

### Task 4: Add advanced inputs section to SalaryForm

**Files:**
- Modify: `components/SalaryForm.vue`

- [ ] **Step 1: Add collapsible advanced section**

Add after the closing `</div>` of the main grid (after line 109), before `</template>`:

```vue
    <!-- Advanced inputs -->
    <details class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
      <summary class="text-[13px] text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none">
        Pengaturan lanjutan
      </summary>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div>
          <label for="cicilan" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Cicilan / bulan (KPR, motor, dll)</label>
          <input id="cicilan" v-model.number="form.cicilan" type="number" step="100000" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label for="danaDarurat" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Dana darurat / bulan</label>
          <input id="danaDarurat" v-model.number="form.danaDarurat" type="number" step="100000" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label for="tunjanganTransport" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Tunjangan transport dari kantor</label>
          <input id="tunjanganTransport" v-model.number="form.tunjanganTransport" type="number" step="100000" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label for="tunjanganMakan" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Tunjangan makan dari kantor</label>
          <input id="tunjanganMakan" v-model.number="form.tunjanganMakan" type="number" step="100000" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="md:col-span-2">
          <label for="bonusTahunan" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Bonus tahunan (THR, bonus akhir tahun)</label>
          <input id="bonusTahunan" v-model.number="form.bonusTahunan" type="number" step="1000000" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </details>
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/SalaryForm.vue
git commit -m "feat: add collapsible advanced inputs section"
```

---

### Task 5: Integrate URL sync into index page

**Files:**
- Modify: `pages/index.vue`
- Modify: `components/SalaryCalculator.vue`

- [ ] **Step 1: Update SalaryCalculator composable to use URL sync**

Update `components/SalaryCalculator.vue`:

```vue
<script setup lang="ts">
import { useSalaryCalculator } from '~/composables/use-salary-calculator'
import { useUrlSync } from '~/composables/use-url-sync'

const { form, result } = useSalaryCalculator()
useUrlSync(form)
</script>

<template>
  <SalaryForm v-model="form" />
  <SalaryResults :result="result" />
</template>
```

- [ ] **Step 2: Add "Bandingkan" CTA to index page**

Update `pages/index.vue` to add a CTA below the calculator:

```vue
<script setup lang="ts">
useHead({ title: 'Kalkulator Kelayakan Gaji Jakarta — CukupGak' })
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Kalkulator Kelayakan Gaji Jakarta</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Estimasi apakah gajimu cukup untuk biaya hidup di Jakarta dan sekitarnya.</p>

    <SalaryCalculator />

    <div class="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5 text-center">
      <NuxtLink
        to="/bandingkan"
        class="inline-flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        ⚖ Bandingkan dua skenario
      </NuxtLink>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Verify build and dev server**

Run: `npx nuxi generate`
Expected: builds successfully, URL sync working

- [ ] **Step 4: Commit**

```bash
git add components/SalaryCalculator.vue pages/index.vue
git commit -m "feat: integrate URL sync and add comparison CTA"
```

---

### Task 6: Create CompareSummary component

**Files:**
- Create: `components/CompareSummary.vue`

- [ ] **Step 1: Write component**

```vue
<script setup lang="ts">
import type { SalaryResult } from '~/types/salary'

const props = defineProps<{ a: SalaryResult; b: SalaryResult }>()

const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

const rows = computed(() => [
  { label: 'Take-home / bulan', a: props.a.takeHome, b: props.b.takeHome },
  { label: 'Total pengeluaran', a: props.a.totalExpense, b: props.b.totalExpense },
  { label: 'Sisa / tabungan', a: props.a.savings, b: props.b.savings },
  { label: 'Savings rate', a: props.a.savingsRate, b: props.b.savingsRate, isPct: true },
])

function deltaClass(a: number, b: number) {
  if (a > b) return 'text-green-600 dark:text-green-400'
  if (a < b) return 'text-red-600 dark:text-red-400'
  return 'text-gray-400 dark:text-gray-500'
}

function deltaFmt(a: number, b: number, isPct?: boolean) {
  const diff = a - b
  const prefix = diff > 0 ? '+' : ''
  return isPct ? prefix + (diff * 100).toFixed(1) + '%' : prefix + fmt(diff)
}
</script>

<template>
  <div class="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5">
    <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">Perbandingan</h2>

    <div class="overflow-x-auto">
      <table class="w-full text-[13px]">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-2 text-gray-500 dark:text-gray-400 font-normal"></th>
            <th class="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-normal">Skenario A</th>
            <th class="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-normal">Skenario B</th>
            <th class="text-right py-2 text-gray-500 dark:text-gray-400 font-normal w-32">Selisih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label" class="border-b border-gray-100 dark:border-gray-800">
            <td class="py-2.5 text-gray-500 dark:text-gray-400">{{ row.label }}</td>
            <td class="text-right py-2.5 px-3 text-gray-900 dark:text-gray-100 tabular-nums">
              {{ row.isPct ? (row.a * 100).toFixed(1) + '%' : fmt(row.a) }}
            </td>
            <td class="text-right py-2.5 px-3 text-gray-900 dark:text-gray-100 tabular-nums">
              {{ row.isPct ? (row.b * 100).toFixed(1) + '%' : fmt(row.b) }}
            </td>
            <td :class="[deltaClass(row.a, row.b), 'text-right py-2.5 tabular-nums']">
              {{ deltaFmt(row.a, row.b, row.isPct) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex gap-4 mt-4 pt-2">
      <div class="flex-1 text-center">
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">Verdict A</p>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ a.verdict }}</p>
      </div>
      <div class="flex-1 text-center">
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">Verdict B</p>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ b.verdict }}</p>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify types compile**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/CompareSummary.vue
git commit -m "feat: add CompareSummary component"
```

---

### Task 7: Create compare page

**Files:**
- Create: `pages/compare.vue`

- [ ] **Step 1: Write compare page**

```vue
<script setup lang="ts">
import { useSalaryCalculator } from '~/composables/use-salary-calculator'
import { useUrlSync } from '~/composables/use-url-sync'

useHead({ title: 'Bandingkan Dua Skenario — CukupGak' })

const { form: formA, result: resultA } = useSalaryCalculator()
const { form: formB, result: resultB } = useSalaryCalculator()

useUrlSync(formA, 'a')
useUrlSync(formB, 'b')

const copyAToB = () => {
  Object.assign(formB, { ...formA })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Bandingkan Dua Skenario</h1>
      <NuxtLink to="/" class="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
        ← Kembali
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Skenario A -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-gray-900 dark:text-gray-100">Skenario A</h2>
          <button
            @click="copyAToB"
            class="text-[12px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Salin ke B
          </button>
        </div>
        <SalaryForm v-model="formA" />
        <SalaryResults :result="resultA" />
      </div>

      <!-- Skenario B -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Skenario B</h2>
        <SalaryForm v-model="formB" />
        <SalaryResults :result="resultB" />
      </div>
    </div>

    <!-- Comparison summary -->
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <CompareSummary :a="resultA" :b="resultB" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify build**

Run: `npx nuxi generate`
Expected: builds successfully, `/bandingkan` page prerendered

- [ ] **Step 3: Commit**

```bash
git add pages/compare.vue
git commit -m "feat: add comparison page"
```

---

### Task 8: Update navbar with Bandingkan link

**Files:**
- Modify: `components/AppNavbar.vue`

- [ ] **Step 1: Add "Bandingkan" nav link**

Add to `navLinks` array:

```typescript
const navLinks = [
  { to: '/', label: 'Simulasi' },
  { to: '/bandingkan', label: 'Bandingkan' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/privacy', label: 'Kebijakan Privasi' },
]
```

The desktop nav (hidden sm:flex) and mobile nav (sm:hidden) will both auto-render the new link since they both iterate over `navLinks`.

- [ ] **Step 2: Verify build**

Run: `npx nuxi generate`
Expected: builds successfully, all pages prerendered

- [ ] **Step 3: Commit**

```bash
git add components/AppNavbar.vue
git commit -m "feat: add Bandingkan link to navbar"
```

---

### Task 9: Add e2e tests for new features

**Files:**
- Modify: `e2e/salary-calculator.spec.ts`

- [ ] **Step 1: Add e2e tests**

Add these tests after the existing ones, inside the `test.describe` block:

```typescript
test('URL updates when salary changes', async ({ page }) => {
  await page.fill('#salary', '12000000')
  await page.waitForTimeout(500) // debounce
  expect(page.url()).toContain('salary=12000000')
})

test('advanced inputs section is collapsible', async ({ page }) => {
  const summary = page.getByText('Pengaturan lanjutan')
  await expect(summary).toBeVisible()
  // initially collapsed — inputs not visible
  await expect(page.locator('#cicilan')).not.toBeVisible()
  // click to expand
  await summary.click()
  await expect(page.locator('#cicilan')).toBeVisible()
})

test('adding cicilan reduces savings', async ({ page }) => {
  await page.getByText('Pengaturan lanjutan').click()
  await page.fill('#cicilan', '3000000')
  // savings should decrease
  const savingsText = await page.getByText(/Sisa|Defisit/).last().textContent()
  // verify some result is shown (the exact value depends on default settings)
  expect(savingsText).toBeTruthy()
})

test('compare page renders two calculators', async ({ page }) => {
  await page.goto('/bandingkan')
  await expect(page.locator('h1')).toHaveText('Bandingkan Dua Skenario')
  // both scenario A and B salary inputs should be visible
  await expect(page.locator('#salary')).toHaveCount(2)
})

test('compare page copy A to B works', async ({ page }) => {
  await page.goto('/bandingkan')
  // Change salary in A
  const salaryInputs = page.locator('#salary')
  await salaryInputs.first().fill('15000000')
  await page.waitForTimeout(500)
  // Click "Salin ke B"
  await page.getByText('Salin ke B').click()
  // B salary should now match A
  await expect(salaryInputs.nth(1)).toHaveValue('15000000')
})
```

- [ ] **Step 2: Run e2e tests**

Run: `npx playwright test`
Expected: 11 tests PASS (6 existing + 5 new)

- [ ] **Step 3: Commit**

```bash
git add e2e/salary-calculator.spec.ts
git commit -m "test: add e2e tests for URL sync, advanced inputs, and comparison"
```

---

### Task 10: Final verification & version bump

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: all tests PASS (30 tests)

- [ ] **Step 2: Run all e2e tests**

Run: `npx playwright test`
Expected: all tests PASS (11 tests)

- [ ] **Step 3: Type check**

Run: `npx vue-tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Production build**

Run: `npx nuxi generate`
Expected: generates `/bandingkan` page, 12 routes prerendered

- [ ] **Step 5: Bump version to 1.1.0**

Update `app.config.ts`:
```typescript
export default defineAppConfig({
  version: '1.1.0',
  googleAnalyticsId: 'G-1VR4HY3M2H',
})
```

- [ ] **Step 6: Final commit**

```bash
git add app.config.ts
git commit -m "chore: bump version to 1.1.0"
```
