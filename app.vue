<script setup lang="ts">
const appConfig = useAppConfig()
const gaId = appConfig.googleAnalyticsId
const route = useRoute()

const isWidePage = computed(() => route.path === '/bandingkan' || route.path === '/compare')

if (gaId) {
  useHead({
    script: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true },
      {
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
        type: 'text/javascript',
      },
    ],
  })
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CukupGak',
        url: 'https://faisalaffan.github.io',
        description: 'Kalkulator kelayakan gaji di Jakarta. Estimasi apakah gajimu cukup untuk biaya hidup.',
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <AppNavbar />

    <main class="py-8 px-4">
      <div :class="isWidePage ? 'max-w-6xl' : 'max-w-2xl'" class="mx-auto transition-all duration-300 ease-in-out">
        <NuxtPage />
      </div>
    </main>

    <footer class="text-center text-xs text-gray-400 dark:text-gray-600 pb-8 px-4 space-x-2">
      <span>Dibuat oleh <a href="https://faisalaffan.github.io" class="underline hover:text-gray-500 dark:hover:text-gray-400" target="_blank" rel="noopener">Faisal Affan</a> &middot; Data estimasi 2024–2025</span>
      <span>&middot;</span>
      <NuxtLink to="/disclaimer" class="underline hover:text-gray-500 dark:hover:text-gray-400">Disclaimer</NuxtLink>
      <span>&middot;</span>
      <NuxtLink to="/privacy" class="underline hover:text-gray-500 dark:hover:text-gray-400">Kebijakan Privasi</NuxtLink>
    </footer>
  </div>
</template>
