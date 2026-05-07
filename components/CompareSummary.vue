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
