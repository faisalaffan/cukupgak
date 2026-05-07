<script setup lang="ts">
import { useSalaryCalculator } from '~/composables/use-salary-calculator'
import { useUrlSync } from '~/composables/use-url-sync'

useHead({
  title: 'Bandingkan Dua Skenario Gaji — CukupGak',
  meta: [
    { name: 'description', content: 'Bandingkan dua skenario gaji dan biaya hidup side-by-side. Lihat selisih take-home, pengeluaran, dan verdict antara dua profil berbeda.' },
    { property: 'og:title', content: 'Bandingkan Dua Skenario Gaji — CukupGak' },
    { property: 'og:description', content: 'Side-by-side comparison dua skenario gaji dan biaya hidup di Jakarta.' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://faisalaffan.github.io/bandingkan' }],
})
definePageMeta({ alias: '/bandingkan' })

const { form: formA, result: resultA } = useSalaryCalculator()
const { form: formB, result: resultB } = useSalaryCalculator()

useUrlSync(formA, 'a')
useUrlSync(formB, 'b')

const copyAToB = () => {
  Object.assign(formB, { ...formA })
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
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
        <ExpenseChart :expenses="resultA.expenses" :take-home="resultA.takeHome" class="mb-4" />
        <SalaryResults :result="resultA" />
      </div>

      <!-- Skenario B -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Skenario B</h2>
        <SalaryForm v-model="formB" />
        <ExpenseChart :expenses="resultB.expenses" :take-home="resultB.takeHome" class="mb-4" />
        <SalaryResults :result="resultB" />
      </div>
    </div>

    <!-- Comparison summary -->
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <CompareSummary :a="resultA" :b="resultB" />
    </div>
  </div>
</template>
