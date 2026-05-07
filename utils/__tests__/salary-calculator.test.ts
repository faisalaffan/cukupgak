import { describe, it, expect } from 'vitest'
import { calcTax, getExpenses, computeResult, reverseCalcGross } from '../salary-calculator'
import type { Deductions, Expenses } from '~/types/salary'

describe('calcTax', () => {
  it('returns zero PPh21 when income is below PTKP (single)', () => {
    const result = calcTax(4_000_000, 'single')
    expect(result.pph21).toBe(0)
  })

  it('calculates 5% bracket correctly', () => {
    const result = calcTax(6_000_000, 'single')
    expect(result.pph21).toBeCloseTo(75_000, -2)
  })

  it('calculates 15% bracket correctly', () => {
    const result = calcTax(15_000_000, 'single')
    expect(result.pph21).toBeCloseTo(1_075_000, -2)
  })

  it('calculates 25% bracket correctly', () => {
    const result = calcTax(35_000_000, 'single')
    expect(result.pph21).toBeCloseTo(5_041_667, -2)
  })

  it('calculates 30% bracket correctly', () => {
    const result = calcTax(60_000_000, 'single')
    expect(result.pph21).toBeCloseTo(11_983_333, -2)
  })

  it('uses correct PTKP for married status', () => {
    const single = calcTax(5_000_000, 'single')
    const married = calcTax(5_000_000, 'married')
    expect(married.pph21).toBeLessThan(single.pph21)
  })

  it('uses higher PTKP for family1 than single', () => {
    const single = calcTax(6_000_000, 'single')
    const family1 = calcTax(6_000_000, 'family1')
    expect(family1.pph21).toBeLessThan(single.pph21)
  })

  it('uses higher PTKP for family2 than family1', () => {
    const family1 = calcTax(6_000_000, 'family1')
    const family2 = calcTax(6_000_000, 'family2')
    expect(family2.pph21).toBeLessThan(family1.pph21)
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
    const expenses = getExpenses('jakarta', 'outer', 'single', 'public', 'parents', 'warung', 'frugal')
    expect(expenses.housing).toBe(0)
  })

  it('cheapest scenario: single + parents + warung + frugal + satellite + public', () => {
    const expenses = getExpenses('jakarta', 'satellite', 'single', 'public', 'parents', 'warung', 'frugal')
    const total = Object.values(expenses).reduce((a, b) => a + b, 0)
    expect(expenses.housing).toBe(0)
    expect(expenses.transport).toBe(350_000)
    expect(expenses.food).toBeCloseTo(425_000, -3)
    expect(expenses.lifestyle).toBe(200_000)
    expect(expenses.utilities).toBeCloseTo(212_500, -3)
    expect(expenses.personal).toBe(200_000)
    expect(total).toBeLessThan(1_500_000)
  })

  it('most expensive scenario: family2 + rent + resto + social + central + car', () => {
    const expenses = getExpenses('jakarta', 'central', 'family2', 'car', 'rent', 'resto', 'social')
    const total = Object.values(expenses).reduce((a, b) => a + b, 0)
    expect(expenses.housing).toBe(6_000_000)
    expect(expenses.transport).toBe(1_500_000)
    expect(expenses.food).toBeCloseTo(6_240_000, -3)
    expect(total).toBeGreaterThan(15_000_000)
  })

  it('applies zone multiplier to food and utilities', () => {
    const central = getExpenses('jakarta', 'central', 'single', 'public', 'parents', 'warung', 'frugal')
    const satellite = getExpenses('jakarta', 'satellite', 'single', 'public', 'parents', 'warung', 'frugal')
    expect(central.food).toBeGreaterThan(satellite.food)
    expect(central.utilities).toBeGreaterThan(satellite.utilities)
  })

  it('applies city multiplier correctly', () => {
    const jakarta = getExpenses('jakarta', 'outer', 'single', 'public', 'parents', 'warung', 'frugal')
    const yogya = getExpenses('yogyakarta', 'outer', 'single', 'public', 'parents', 'warung', 'frugal')
    // Yogyakarta should be cheaper than Jakarta
    const totalJkt = Object.values(jakarta).reduce((a, b) => a + b, 0)
    const totalYog = Object.values(yogya).reduce((a, b) => a + b, 0)
    expect(totalYog).toBeLessThan(totalJkt)
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
    expect(result.takeHome).toBe(7_750_000)
    expect(result.totalExpense).toBe(5_100_000)
    expect(result.savings).toBe(2_650_000)
    expect(result.savingsRate).toBeCloseTo(0.342, 2)
    expect(result.verdict).toBe('Layak banget')
  })

  it('computes take-home for net salary', () => {
    const result = computeResult(8_000_000, 'net', sampleDeductions, sampleExpenses)
    expect(result.takeHome).toBe(8_000_000)
    expect(result.savings).toBe(2_900_000)
  })

  it('verdict Pas-pasan at 5-15% savings', () => {
    const highDeductions: Deductions = { pph21: 1_100_000, bpjsKes: 120_000, bpjsTK: 200_000 }
    const result = computeResult(7_000_000, 'gross', highDeductions, sampleExpenses)
    expect(result.verdict).toBe('Pas-pasan')
  })

  it('verdict Tidak layak when expenses exceed take-home', () => {
    const highExpenses: Expenses = {
      housing: 3_000_000, transport: 1_000_000, food: 2_000_000,
      lifestyle: 1_000_000, utilities: 500_000, personal: 500_000,
    }
    const result = computeResult(8_000_000, 'gross', sampleDeductions, highExpenses)
    expect(result.savings).toBeLessThan(0)
    expect(result.verdict).toBe('Tidak layak')
  })

  it('verdict Layak at 15-30% savings', () => {
    const midDeductions: Deductions = { pph21: 1_300_000, bpjsKes: 100_000, bpjsTK: 100_000 }
    const result = computeResult(8_000_000, 'gross', midDeductions, sampleExpenses)
    expect(result.savingsRate).toBeGreaterThanOrEqual(0.15)
    expect(result.savingsRate).toBeLessThan(0.30)
    expect(result.verdict).toBe('Layak')
  })

  it('verdict Mepet sekali at 0-5% savings', () => {
    const tightDeductions: Deductions = { pph21: 1_480_000, bpjsKes: 120_000, bpjsTK: 200_000 }
    const result = computeResult(7_000_000, 'gross', tightDeductions, sampleExpenses)
    expect(result.savingsRate).toBeGreaterThanOrEqual(0)
    expect(result.savingsRate).toBeLessThan(0.05)
    expect(result.verdict).toBe('Mepet sekali')
  })

  it('handles zero salary gracefully (gross mode)', () => {
    const result = computeResult(0, 'gross', { pph21: 0, bpjsKes: 0, bpjsTK: 0 }, sampleExpenses)
    expect(result.takeHome).toBe(0)
    expect(result.gross).toBe(0)
    expect(result.savings).toBeLessThan(0)
    expect(result.verdict).toBe('Tidak layak')
  })

  it('handles zero salary gracefully (net mode)', () => {
    const result = computeResult(0, 'net', { pph21: 0, bpjsKes: 0, bpjsTK: 0 }, sampleExpenses)
    expect(result.takeHome).toBe(0)
    expect(result.gross).toBe(0)
    expect(result.savingsRate).toBe(-Infinity)
    expect(result.verdict).toBe('Tidak layak')
  })

  it('adds cicilan to total expense and reduces savings', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 2_000_000)
    expect(result.totalExpense).toBe(7_100_000)
    expect(result.savings).toBe(650_000)
  })

  it('subtracts tunjangan transport from total expense', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 500_000)
    expect(result.totalExpense).toBe(4_600_000)
  })

  it('combines all advanced inputs correctly', () => {
    const result = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 1_000_000, 500_000, 400_000, 300_000)
    expect(result.totalExpense).toBe(5_900_000)
  })

  it('bonus tahunan does not affect monthly savings', () => {
    const without = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses)
    const withBonus = computeResult(8_000_000, 'gross', sampleDeductions, sampleExpenses, 0, 0, 0, 0, 20_000_000)
    expect(withBonus.savings).toBe(without.savings)
    expect(withBonus.verdict).toBe(without.verdict)
  })
})

describe('reverseCalcGross', () => {
  it('finds gross that yields at least target take-home', () => {
    const gross = reverseCalcGross(7_000_000, 'single')
    const { pph21, bpjsKes, bpjsTK } = calcTax(gross, 'single')
    const takeHome = gross - pph21 - bpjsKes - bpjsTK
    expect(takeHome).toBeGreaterThanOrEqual(7_000_000)
    expect(takeHome).toBeLessThan(7_000_000 + 100_000)
  })

  it('returns 0 for zero target', () => {
    expect(reverseCalcGross(0, 'single')).toBe(0)
  })

  it('returns 0 for negative target', () => {
    expect(reverseCalcGross(-1000, 'single')).toBe(0)
  })

  it('handles high target for family status', () => {
    const gross = reverseCalcGross(30_000_000, 'family2')
    expect(gross).toBeGreaterThan(30_000_000)
  })
})
