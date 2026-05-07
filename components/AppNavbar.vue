<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
  { to: '/', label: 'Simulasi' },
  { to: '/bandingkan', label: 'Bandingkan' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/privacy', label: 'Kebijakan Privasi' },
]

const route = useRoute()
</script>

<template>
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          CukupGak
          <span class="ml-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-normal">v{{ appConfig.version }}</span>
        </NuxtLink>

        <div class="hidden sm:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-2.5 py-1 text-[13px] rounded-md transition-colors"
            :class="route.path === link.to
              ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <button
        @click="toggleDark"
        class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span v-if="colorMode.value === 'dark'" class="text-sm">☀️</span>
        <span v-else class="text-sm">🌙</span>
      </button>
    </div>

    <!-- Mobile nav -->
    <div class="sm:hidden flex border-t border-gray-100 dark:border-gray-800">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="flex-1 text-center py-2 text-[12px] transition-colors"
        :class="route.path === link.to
          ? 'text-gray-900 dark:text-gray-100 border-b-2 border-blue-500'
          : 'text-gray-500 dark:text-gray-400'"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
