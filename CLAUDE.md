# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Kalkulator kelayakan gaji di Jakarta. Input: gaji + profil hidup → output: take-home, breakdown biaya, verdict.

**Stack:** Nuxt 3 + TypeScript + Tailwind CSS, static generate (hybrid ready).

## Commands

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run generate     # Static build → .output/public/
npm run preview      # Preview production build
npm test             # Vitest unit tests (23 tests)
npm run test:e2e     # Playwright e2e tests (6 tests)
npx vue-tsc --noEmit # Type check
```

## Architecture

```
types/salary.ts              — Union types & interfaces (SalaryInput, SalaryResult, dll)
utils/salary-calculator.ts   — Pure functions: calcTax(), getExpenses(), computeResult()
composables/use-salary-calculator.ts — Reactive wrapper: form state + computed result
components/SalaryForm.vue    — Input form (8 fields, 2-column responsive grid, defineModel)
components/SalaryResults.vue — Verdict + summary + deductions + expense bars + disclaimer
components/SalaryCalculator.vue — Orchestrator: useSalaryCalculator() → Form + Results
app.vue                      — Shell layout
```

Data flow: `form state (reactive) → pure functions → computed result → komponen render`. Pure functions tidak depend ke Vue, testable langsung dengan Vitest.

## Branch

- `dev` adalah branch utama.

## Conventions

- Bahasa Indonesia untuk komunikasi.
- Commit messages: conventional commits (`feat/fix/refactor/chore/docs/test`).
- 1 commit = 1 logical change.
