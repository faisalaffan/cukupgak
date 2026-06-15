<script setup lang="ts">
import type { SalaryResult } from '~/types/salary'

const props = defineProps<{ a: SalaryResult; b: SalaryResult }>()

const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

const rows = computed(() => [
  { label: 'Take-home / bulan', a: props.a.takeHome, b: props.b.takeHome, icon: 'wallet' },
  { label: 'Total pengeluaran', a: props.a.totalExpense, b: props.b.totalExpense, isExpense: true, icon: 'card' },
  { label: 'Sisa / tabungan', a: props.a.savings, b: props.b.savings, icon: 'bank' },
  { label: 'Savings rate', a: props.a.savingsRate, b: props.b.savingsRate, isPct: true, icon: 'percent' },
])

const verdictStyles: Record<SalaryResult['verdict'], { text: string; bg: string; icon: string }> = {
  'Layak banget': { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/5 border-emerald-100/70 dark:border-emerald-900/30', icon: '✨' },
  'Layak': { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/5 border-emerald-100/70 dark:border-emerald-900/30', icon: '✅' },
  'Pas-pasan': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/5 border-amber-100/70 dark:border-amber-900/30', icon: '⚠️' },
  'Mepet sekali': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/5 border-amber-100/70 dark:border-amber-900/30', icon: '🚨' },
  'Tidak layak': { text: 'text-red-700 dark:text-red-400', bg: 'bg-gradient-to-br from-rose-50 to-red-50/50 dark:from-rose-950/20 dark:to-rose-950/5 border-rose-100/70 dark:border-rose-900/30', icon: '🛑' },
}

function barPercentages(a: number, b: number) {
  const absA = Math.max(0, a)
  const absB = Math.max(0, b)
  const total = absA + absB
  if (total === 0) return { a: 50, b: 50 }
  return {
    a: (absA / total) * 100,
    b: (absB / total) * 100,
  }
}

function deltaClass(a: number, b: number, isExpense?: boolean) {
  if (a === b) return 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800'
  const isBetter = isExpense ? a < b : a > b
  if (isBetter) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30'
  return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30'
}

function deltaFmt(a: number, b: number, isPct?: boolean) {
  const diff = a - b
  if (diff === 0) return 'Sama'
  const prefix = diff > 0 ? '+' : ''
  return isPct ? prefix + (diff * 100).toFixed(1) + '%' : prefix + fmt(diff)
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-2 mb-6">
      <div class="p-1.5 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      </div>
      <h2 class="text-xs font-extrabold text-gray-900 dark:text-gray-100 tracking-wider uppercase">Analisis Perbandingan</h2>
    </div>

    <!-- List Kartu Indikator Row Premium (Responsive Layout) -->
    <div class="flex flex-col gap-4">
      <div 
        v-for="row in rows" 
        :key="row.label"
        class="relative overflow-hidden bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 hover:shadow-md hover:scale-[1.005] hover:border-blue-100/50 dark:hover:border-blue-900/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group"
      >
        <!-- Baris 1: Ikon + Judul (Kiri) & Lencana Selisih (Kanan di Mobile) -->
        <div class="flex items-center justify-between w-full sm:w-auto">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300">
              <!-- Wallet Icon -->
              <svg v-if="row.icon === 'wallet'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <path d="M16 11h6V8a2 2 0 0 0-2-2h-4"></path>
                <path d="M20 12a2 2 0 0 0 0 4h2v-4h-2z"></path>
              </svg>
              <!-- Card Icon -->
              <svg v-else-if="row.icon === 'card'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <!-- Bank Icon -->
              <svg v-else-if="row.icon === 'bank'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18"></path>
                <path d="M3 10h18"></path>
                <path d="M5 6l7-3 7 3"></path>
                <path d="M4 10v7"></path>
                <path d="M20 10v7"></path>
                <path d="M10 10v7"></path>
                <path d="M14 10v7"></path>
              </svg>
              <!-- Percent Icon -->
              <svg v-else-if="row.icon === 'percent'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"></line>
                <circle cx="6.5" cy="6.5" r="2.5"></circle>
                <circle cx="17.5" cy="17.5" r="2.5"></circle>
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-805 dark:text-gray-200 uppercase tracking-wider">{{ row.label }}</span>
          </div>

          <!-- Lencana Selisih (Mobile-only) -->
          <div 
            :class="deltaClass(row.a, row.b, row.isExpense)" 
            class="sm:hidden min-w-[76px] text-center text-[10px] font-black px-2 py-1 rounded-xl tracking-tight tabular-nums transition-colors"
          >
            {{ deltaFmt(row.a, row.b, row.isPct) }}
          </div>
        </div>

        <!-- Baris 2: Nilai Skenario A & B & Lencana Selisih (Desktop-only) -->
        <div class="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto mt-1 sm:mt-0">
          <div class="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6 w-full sm:w-auto">
            <!-- Skenario A -->
            <div class="text-left sm:text-right">
              <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Skenario A</span>
              <span class="text-xs sm:text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">
                {{ row.isPct ? (row.a * 100).toFixed(1) + '%' : fmt(row.a) }}
              </span>
            </div>

            <!-- Divider (Desktop-only) -->
            <div class="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-800" />

            <!-- Skenario B -->
            <div class="text-left">
              <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Skenario B</span>
              <span class="text-xs sm:text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">
                {{ row.isPct ? (row.b * 100).toFixed(1) + '%' : fmt(row.b) }}
              </span>
            </div>
          </div>

          <!-- Lencana Selisih (Desktop-only) -->
          <div 
            :class="deltaClass(row.a, row.b, row.isExpense)" 
            class="hidden sm:block min-w-[84px] text-center text-[10px] font-black px-2.5 py-1.5 rounded-xl tracking-tight tabular-nums transition-colors"
          >
            {{ deltaFmt(row.a, row.b, row.isPct) }}
          </div>
        </div>

        <!-- Accent Line di Bagian Bawah -->
        <div class="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-gray-800/50 flex">
          <div 
            class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-550 ease-out" 
            :style="{ width: barPercentages(row.a, row.b).a + '%' }"
          />
          <div 
            class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-550 ease-out border-l border-white dark:border-gray-900" 
            :style="{ width: barPercentages(row.a, row.b).b + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Verdict perbandingan -->
    <div class="grid grid-cols-2 gap-4 pt-2">
      <div 
        :class="verdictStyles[a.verdict]?.bg"
        class="border rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
      >
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Verdict Skenario A</p>
        <p class="text-[14px] font-black tracking-tight flex items-center justify-center gap-1.5" :class="verdictStyles[a.verdict]?.text">
          <span>{{ verdictStyles[a.verdict]?.icon }}</span>
          <span>{{ a.verdict }}</span>
        </p>
      </div>
      <div 
        :class="verdictStyles[b.verdict]?.bg"
        class="border rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
      >
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Verdict Skenario B</p>
        <p class="text-[14px] font-black tracking-tight flex items-center justify-center gap-1.5" :class="verdictStyles[b.verdict]?.text">
          <span>{{ verdictStyles[b.verdict]?.icon }}</span>
          <span>{{ b.verdict }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
