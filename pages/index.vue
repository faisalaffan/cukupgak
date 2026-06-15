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
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800/80 p-6 md:p-8">
    <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">Kalkulator Kelayakan Gaji Jakarta</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">Estimasi apakah gajimu cukup untuk biaya hidup di Jakarta dan sekitarnya.</p>

    <SalaryCalculator />

    <div class="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
      <NuxtLink
        to="/bandingkan"
        class="group flex items-center justify-between p-4 bg-gray-50/45 hover:bg-blue-50/20 dark:bg-gray-900/30 dark:hover:bg-blue-950/10 border border-gray-100 dark:border-gray-800/80 rounded-2xl transition-all duration-300"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-blue-50 dark:bg-blue-950 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <div class="text-left">
            <p class="text-xs font-bold text-gray-900 dark:text-gray-100">Bandingkan Dua Skenario</p>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">Bandingkan simulasi gaji, kota, atau gaya hidup secara side-by-side.</p>
          </div>
        </div>
        <div class="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
