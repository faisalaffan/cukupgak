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
  'Layak banget': { text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' },
  'Layak': { text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' },
  'Pas-pasan': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' },
  'Mepet sekali': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' },
  'Tidak layak': { text: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' },
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
  <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
    <!-- Verdict -->
    <div
      :class="verdictStyle.bg"
      class="rounded-lg px-5 py-4 mb-5 border"
    >
      <div class="flex items-center gap-2.5 mb-1">
        <span :class="verdictStyle.text" class="text-lg font-medium">{{ result.verdict }}</span>
        <span :class="verdictStyle.text" class="text-[13px] opacity-80">{{ pct(Math.max(result.savingsRate, 0)) }} savings rate</span>
      </div>
      <p class="m-0 text-[13px] text-gray-500 dark:text-gray-400">{{ verdictNote }}</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-2.5 mb-6">
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3.5">
        <p class="m-0 mb-1 text-xs text-gray-500 dark:text-gray-400">Take-home / bulan</p>
        <p class="m-0 text-[15px] font-medium text-gray-900 dark:text-gray-100">{{ fmt(result.takeHome) }}</p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3.5">
        <p class="m-0 mb-1 text-xs text-gray-500 dark:text-gray-400">Total pengeluaran</p>
        <p class="m-0 text-[15px] font-medium text-gray-900 dark:text-gray-100">{{ fmt(result.totalExpense) }}</p>
      </div>
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3.5">
        <p class="m-0 mb-1 text-xs text-gray-500 dark:text-gray-400">{{ result.savings >= 0 ? 'Sisa / potensi tabungan' : 'Defisit' }}</p>
        <p
          :class="result.savings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
          class="m-0 text-[15px] font-medium"
        >
          {{ fmt(Math.abs(result.savings)) }}
        </p>
      </div>
    </div>

    <!-- Deduction breakdown -->
    <div class="mb-5">
      <p class="text-[13px] text-gray-500 dark:text-gray-400 m-0 mb-3">Rincian potongan gaji</p>
      <div class="grid grid-cols-3 gap-2 text-[13px]">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <p class="m-0 mb-0.5 text-gray-500 dark:text-gray-400">PPh 21</p>
          <p class="m-0 font-medium">{{ fmt(result.deductions.pph21) }}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <p class="m-0 mb-0.5 text-gray-500 dark:text-gray-400">BPJS Kesehatan</p>
          <p class="m-0 font-medium">{{ fmt(result.deductions.bpjsKes) }}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <p class="m-0 mb-0.5 text-gray-500 dark:text-gray-400">BPJS Ketenagakerjaan</p>
          <p class="m-0 font-medium">{{ fmt(result.deductions.bpjsTK) }}</p>
        </div>
      </div>
    </div>

    <!-- Expense bars -->
    <div>
      <p class="text-[13px] text-gray-500 dark:text-gray-400 m-0 mb-3">Breakdown pengeluaran</p>
      <div
        v-for="(value, key) in result.expenses"
        :key="key"
        class="mb-2.5"
      >
        <div class="flex justify-between text-[13px] mb-1">
          <span class="text-gray-500 dark:text-gray-400">{{ expenseLabels[key as keyof Expenses] }}</span>
          <span class="text-gray-900 dark:text-gray-100">{{ fmt(value) }}</span>
        </div>
        <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full"
            :style="{ width: barWidth(value) + '%', backgroundColor: barColors[key as keyof Expenses] }"
          />
        </div>
      </div>
    </div>

    <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-5 mb-0">
      Estimasi berdasarkan asumsi rata-rata biaya hidup 2024–2025. PPh 21 menggunakan tarif progresif PTKP standar. Tidak termasuk tanggungan cicilan, dana darurat, atau pengeluaran tak terduga.
    </p>
  </div>
</template>
