<script setup lang="ts">
useHead({
  title: 'Kalkulator Kelayakan Gaji Jakarta — Cek Gaji Cukup untuk Hidup',
  meta: [
    { name: 'description', content: 'Kalkulator gratis untuk cek apakah gajimu cukup untuk biaya hidup di Jakarta. Input gaji, domisili, dan gaya hidup — dapatkan estimasi take-home, breakdown biaya, dan verdict kelayakan.' },
    { property: 'og:title', content: 'Kalkulator Kelayakan Gaji Jakarta — CukupGak' },
    { property: 'og:description', content: 'Cek apakah gajimu cukup untuk biaya hidup di Jakarta. Gratis, tanpa login, semua dihitung di browser.' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://faisalaffan.github.io/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'CukupGak — Kalkulator Kelayakan Gaji Jakarta',
        url: 'https://faisalaffan.github.io',
        description: 'Kalkulator gratis untuk estimasi kelayakan gaji terhadap biaya hidup di Jakarta dan sekitarnya.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
      }),
    },
  ],
})
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
