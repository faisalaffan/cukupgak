<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <AppNavbar />

    <main class="py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </main>

    <footer class="text-center text-xs text-gray-400 dark:text-gray-600 pb-8 px-4">
      Dibuat oleh <a href="https://faisalaffan.github.io" class="underline hover:text-gray-500 dark:hover:text-gray-400" target="_blank" rel="noopener">Faisal Affan</a> &middot; Data estimasi 2024–2025
    </footer>
  </div>
</template>
