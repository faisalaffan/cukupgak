<script setup lang="ts">
import type { SalaryResult, Expenses } from '~/types/salary'
import ShareCard from '~/components/ShareCard.vue'

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

const verdictStyles: Record<SalaryResult['verdict'], { text: string; bg: string; icon: string }> = {
  'Layak banget': { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/5 border-emerald-100/70 dark:border-emerald-900/30', icon: '✨' },
  'Layak': { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/5 border-emerald-100/70 dark:border-emerald-900/30', icon: '✅' },
  'Pas-pasan': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/5 border-amber-100/70 dark:border-amber-900/30', icon: '⚠️' },
  'Mepet sekali': { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/5 border-amber-100/70 dark:border-amber-900/30', icon: '🚨' },
  'Tidak layak': { text: 'text-red-700 dark:text-red-400', bg: 'bg-gradient-to-br from-rose-50 to-red-50/50 dark:from-rose-950/20 dark:to-rose-950/5 border-rose-100/70 dark:border-rose-900/30', icon: '🛑' },
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
  <div class="border-t border-gray-100 dark:border-gray-800 pt-6 mt-4">
    <!-- Verdict -->
    <div
      :class="verdictStyle.bg"
      class="rounded-xl px-5 py-4 mb-6 border transition-all duration-300"
    >
      <div class="flex items-center justify-between flex-wrap gap-2 mb-1.5">
        <div class="flex items-center gap-2">
          <span class="text-base leading-none">{{ verdictStyle.icon }}</span>
          <span :class="verdictStyle.text" class="text-base font-bold tracking-tight">{{ result.verdict }}</span>
        </div>
        <span :class="verdictStyle.text" class="text-xs font-semibold px-2 py-0.5 bg-white/60 dark:bg-black/20 rounded-md border border-black/5 dark:border-white/5 shadow-xs tabular-nums">
          {{ pct(Math.max(result.savingsRate, 0)) }} savings rate
        </span>
      </div>
      <p class="m-0 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{{ verdictNote }}</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <!-- Take Home -->
      <div class="bg-gradient-to-br from-blue-50/50 to-indigo-50/10 dark:from-blue-950/20 dark:to-indigo-950/5 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5">
        <p class="m-0 mb-1.5 text-[11px] font-bold text-blue-500/80 dark:text-blue-400/80 uppercase tracking-wider">Take-home / bulan</p>
        <p class="m-0 text-[16px] font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">{{ fmt(result.takeHome) }}</p>
      </div>

      <!-- Expenses -->
      <div class="bg-gradient-to-br from-purple-50/50 to-pink-50/10 dark:from-purple-950/20 dark:to-pink-950/5 border border-purple-100/50 dark:border-purple-900/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/5">
        <p class="m-0 mb-1.5 text-[11px] font-bold text-purple-500/80 dark:text-purple-400/80 uppercase tracking-wider">Total pengeluaran</p>
        <p class="m-0 text-[16px] font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">{{ fmt(result.totalExpense) }}</p>
      </div>

      <!-- Savings -->
      <div
        :class="result.savings >= 0
          ? 'from-emerald-50/50 to-teal-50/10 dark:from-emerald-950/20 dark:to-teal-950/5 border-emerald-100/50 dark:border-emerald-900/20 hover:shadow-emerald-500/5'
          : 'from-rose-50/50 to-red-50/10 dark:from-rose-950/20 dark:to-red-950/5 border-rose-100/50 dark:border-rose-900/20 hover:shadow-rose-500/5'"
        class="bg-gradient-to-br border rounded-2xl p-4 transition-all duration-300 hover:shadow-md"
      >
        <p class="m-0 mb-1.5 text-[11px] font-bold uppercase tracking-wider" :class="result.savings >= 0 ? 'text-emerald-500/80 dark:text-emerald-400/80' : 'text-rose-500/80 dark:text-rose-400/80'">
          {{ result.savings >= 0 ? 'Potensi tabungan' : 'Defisit' }}
        </p>
        <p
          :class="result.savings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
          class="m-0 text-[16px] font-bold tracking-tight tabular-nums"
        >
          {{ fmt(Math.abs(result.savings)) }}
        </p>
      </div>
    </div>

    <!-- Deduction breakdown -->
    <div class="mb-6">
      <p class="text-[11px] font-semibold text-gray-400 dark:text-gray-500 m-0 mb-2.5 uppercase tracking-wider">Rincian potongan gaji</p>
      <div class="grid grid-cols-3 gap-3 text-xs">
        <div class="border border-gray-100 dark:border-gray-800/80 bg-gray-50/30 dark:bg-gray-900/30 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
          <p class="m-0 mb-1 text-[10px] font-semibold text-gray-450 dark:text-gray-500 uppercase tracking-wider">PPh 21</p>
          <p class="m-0 font-bold text-gray-955 dark:text-gray-100 tabular-nums">{{ fmt(result.deductions.pph21) }}</p>
        </div>
        <div class="border border-gray-100 dark:border-gray-800/80 bg-gray-50/30 dark:bg-gray-900/30 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
          <p class="m-0 mb-1 text-[10px] font-semibold text-gray-450 dark:text-gray-500 uppercase tracking-wider">BPJS Kes</p>
          <p class="m-0 font-bold text-gray-955 dark:text-gray-100 tabular-nums">{{ fmt(result.deductions.bpjsKes) }}</p>
        </div>
        <div class="border border-gray-100 dark:border-gray-800/80 bg-gray-50/30 dark:bg-gray-900/30 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
          <p class="m-0 mb-1 text-[10px] font-semibold text-gray-450 dark:text-gray-500 uppercase tracking-wider">BPJS TK</p>
          <p class="m-0 font-bold text-gray-955 dark:text-gray-100 tabular-nums">{{ fmt(result.deductions.bpjsTK) }}</p>
        </div>
      </div>
    </div>

    <!-- Expense bars -->
    <div class="mb-6">
      <p class="text-[11px] font-semibold text-gray-400 dark:text-gray-500 m-0 mb-3 uppercase tracking-wider">Breakdown pengeluaran</p>
      <div
        v-for="(value, key) in result.expenses"
        :key="key"
        class="mb-3.5 group"
      >
        <div class="flex justify-between text-[13px] mb-1.5 font-medium">
          <span class="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">{{ expenseLabels[key as keyof Expenses] }}</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold tabular-nums">{{ fmt(value) }}</span>
        </div>
        <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500 ease-out"
            :style="{ width: barWidth(value) + '%', backgroundColor: barColors[key as keyof Expenses] }"
          />
        </div>
      </div>
    </div>

    <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-5 mb-0 leading-relaxed">
      Estimasi berdasarkan asumsi rata-rata biaya hidup 2024–2025. PPh 21 menggunakan tarif progresif PTKP standar. Tidak termasuk tanggungan cicilan, dana darurat, atau pengeluaran tak terduga.
    </p>

    <ShareCard :result="result" class="mt-5" />
  </div>
</template>
