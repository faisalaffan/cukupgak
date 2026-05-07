# Jakarta Salary Calculator — Design Spec

## Overview

Kalkulator kelayakan gaji di Jakarta. Input: gaji + profil hidup (zona domisili, status, transportasi, hunian, pola makan, gaya hidup). Output: take-home setelah pajak, breakdown biaya hidup, surplus/defisit, dan verdict.

Stack: Nuxt 3 + TypeScript + Tailwind CSS, hybrid deployment.

## Architecture

```
types/salary.ts              — TypeScript interfaces & union types
utils/salary-calculator.ts   — calcTax(), getExpenses() (pure functions, zero Vue)
composables/use-salary-calculator.ts — reactive wrapper: form state + computed result
components/SalaryForm.vue    — input form (8 input fields, 2-column responsive grid)
components/SalaryResults.vue — verdict box, 3-card summary, potongan, expense bars, disclaimer
app.vue                      — shell, renders SalaryCalculator
```

Data flow: form state (reactive) → pure functions → computed result → komponen render.

## Types

All string literals from HTML reference encoded as TypeScript union types. Key types:

- `SalaryInput` — all 8 form fields (salary, salaryType, zone, status, transport, housing, food, lifestyle)
- `Deductions` — pph21, bpjsKes, bpjsTK
- `Expenses` — housing, transport, food, lifestyle, utilities, personal
- `SalaryResult` — gross, takeHome, deductions, expenses, totalExpense, savings, savingsRate, verdict

## Calculation Logic (utils/salary-calculator.ts)

Two pure functions, constants as module-level `const`.

### calcTax(gross, status)

PTKP 2024: single=54jt, married=58.5jt, family1=63jt, family2=67.5jt.
PPh 21 brackets: ≤60jt→5%, ≤250jt→15%, ≤500jt→25%, >500jt→30%.
BPJS Kes = min(gross × 1%, Rp 120.000). BPJS TK = gross × 2%.

### getExpenses(zone, status, transport, housing, food, lifestyle)

Housing: parents=0, kos_budget=950rb, kos_mid=2jt, kos_premium=4jt, rent=6jt.
Transport: public=350rb, ojol=900rb, motor=500rb, car=1.5jt.
Food: base × people_multiplier × zone_multiplier.
People multiplier: single=1, married=1.8, family1=2.5, family2=3.2.
Zone multiplier: central=1.3, outer=1.0, satellite=0.85.
Utilities: base × zone_multiplier. Personal: fixed × people_multiplier.

### computeResult(gross, salaryType, deductions, expenses)

Combines calcTax + getExpenses into SalaryResult, including verdict mapping:
- ≥30%: "Layak banget"
- ≥15%: "Layak"
- ≥5%: "Pas-pasan"
- ≥0%: "Mepet sekali"
- <0%: "Tidak layak"

### Net→gross reverse calc

Current implementation uses one-step approximation. Not perfectly accurate for high salaries due to progressive tax, but adequate for estimation. Future: binary search for precision.

## Composable

`useSalaryCalculator()` — single composable:
- `form: Reactive<SalaryInput>` — 8 fields, default values from HTML reference
- `result: ComputedRef<SalaryResult>` — auto-recalculates on any form change
- No manual event listeners — Vue reactivity handles everything

## Components & Styling

Tailwind CSS for layout and utility. Inline styles only for dynamic values (bar widths, colors).

### SalaryForm.vue
- 4 rows × 2 columns responsive grid (`grid-cols-1 md:grid-cols-2`)
- Row 1: salary input + salary type select
- Row 2: zone select + status select
- Row 3: transport select + housing select
- Row 4: food select + lifestyle select
- All inputs use v-model binding to composable form

### SalaryResults.vue
- Verdict box: conditional background/text color, savings rate percentage
- 3-card summary: take-home, total expense, surplus/deficit (conditional color)
- Deduction breakdown: PPh 21, BPJS Kesehatan, BPJS Ketenagakerjaan
- Expense bars: vertical list with colored horizontal bars (6 categories)
- Disclaimer text at bottom

## Testing

### Vitest (unit)
- `calcTax`: all 5 PTKP statuses, all 4 tax brackets, BPJS cap validation
- `getExpenses`: extreme combinations (cheapest vs most expensive scenario)
- `computeResult`: verdict mapping for all 5 levels
- Edge cases: zero/negative salary, boundary values at tax bracket edges

### Playwright (e2e)
- Initial render shows default values and results
- Changing any input updates results
- Toggling salary type (gross/net) preserves take-home
- All 5 verdict states render with correct colors
- Mobile responsive: 1-column grid on small screens

## Limitations

- Does not account for: loan installments, emergency fund, employer-paid contributions (JKK/JKM), irregular income (bonus, THR), employer-provided allowances (transport, meal)
- Cost estimates are averages — real costs may vary ±20–30%
- Net→gross reverse calc is approximate for high tax brackets
