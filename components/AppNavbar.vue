<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Hanya tampilkan navigasi utama di header untuk menghindari kepadatan
const navLinks = [
  { to: '/', label: 'Simulasi' },
  { to: '/bandingkan', label: 'Bandingkan' },
  { to: '/negosiasi', label: 'Negosiasi' },
]

const route = useRoute()
const isWidePage = computed(() => route.path === '/bandingkan' || route.path === '/compare')

// State untuk dropdown info tambahan (Disclaimer & Privasi)
const isMenuOpen = ref(false)
const menuContainer = ref<HTMLElement | null>(null)

const toggleMenu = (event: Event) => {
  event.stopPropagation()
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuContainer.value && !menuContainer.value.contains(event.target as Node)) {
      isMenuOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <nav class="bg-white/85 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-colors">
    <div :class="isWidePage ? 'max-w-6xl' : 'max-w-2xl'" class="mx-auto px-4 h-14 flex items-center justify-between transition-all duration-300 ease-in-out">
      
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-1.5 hover:opacity-85 transition-opacity">
        <span class="font-extrabold text-gray-900 dark:text-gray-100 text-[15px] tracking-tight">CukupGak</span>
        <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-900/60 px-1.5 py-0.5 rounded-full">v{{ appConfig.version }}</span>
      </NuxtLink>

      <!-- Center Segmented Pill Switcher (Desktop) -->
      <div class="hidden sm:flex bg-gray-100/60 dark:bg-gray-900/40 p-0.5 rounded-full border border-black/5 dark:border-white/5 items-center gap-0.5">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-1 text-[13px] font-bold rounded-full transition-all whitespace-nowrap"
          :class="route.path === link.to
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-black/5 dark:border-white/5'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Right Actions (Theme Switcher + Info Dropdown) -->
      <div class="flex items-center gap-1.5">
        <!-- Info Dropdown -->
        <div ref="menuContainer" class="relative">
          <button
            @click="toggleMenu"
            class="flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-900/50 transition-colors"
            aria-label="Informasi Lainnya"
          >
            Info
            <svg class="w-3.5 h-3.5 transform transition-transform duration-200" :class="{ 'rotate-180': isMenuOpen }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/80 rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-none p-1.5 z-50"
            >
              <NuxtLink
                to="/disclaimer"
                @click="isMenuOpen = false"
                class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <span>⚠️</span> Disclaimer & Batasan
              </NuxtLink>
              <NuxtLink
                to="/privacy"
                @click="isMenuOpen = false"
                class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-650 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <span>🛡️</span> Kebijakan Privasi
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <!-- Dark/Light switch -->
        <button
          @click="toggleDark"
          class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-900/50 transition-colors"
          :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span v-if="colorMode.value === 'dark'" class="text-sm">☀️</span>
          <span v-else class="text-sm">🌙</span>
        </button>
      </div>

    </div>

    <!-- Mobile Segmented Navigation -->
    <div class="sm:hidden flex border-t border-gray-150 dark:border-gray-900/50 p-1 bg-gray-50/50 dark:bg-gray-950/40">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="flex-1 text-center py-2 text-[12px] font-bold transition-all rounded-lg whitespace-nowrap"
        :class="route.path === link.to
          ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-black/5 dark:border-white/5'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
