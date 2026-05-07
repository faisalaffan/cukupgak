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
