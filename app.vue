<script setup lang="ts">
useHead({ title: 'Kalkulator Kelayakan Gaji Jakarta' })
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 class="text-xl font-semibold text-gray-900 mb-1">Kalkulator Kelayakan Gaji Jakarta</h1>
        <p class="text-sm text-gray-500 mb-6">Estimasi apakah gajimu cukup untuk biaya hidup di Jakarta dan sekitarnya.</p>

        <SalaryCalculator />
      </div>

      <footer class="text-center text-xs text-gray-400 mt-6">
        Dibuat oleh <a href="https://faisalaffan.github.io" class="underline">Faisal Affan</a> &middot; Data estimasi 2024–2025
      </footer>
    </div>
  </div>
</template>
