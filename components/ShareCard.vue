<script setup lang="ts">
import { toPng } from 'html-to-image'
import type { SalaryResult } from '~/types/salary'

const props = defineProps<{ result: SalaryResult }>()

const cardRef = ref<HTMLElement>()
const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

async function downloadImage() {
  if (!cardRef.value) return
  const dataUrl = await toPng(cardRef.value, { quality: 0.95, pixelRatio: 2 })
  const link = document.createElement('a')
  link.download = 'cukupgak-ringkasan.png'
  link.href = dataUrl
  link.click()
}

async function shareNative() {
  if (!cardRef.value) return
  try {
    const dataUrl = await toPng(cardRef.value, { quality: 0.95, pixelRatio: 2 })
    const blob = await (await fetch(dataUrl)).blob()
    if (navigator.share) {
      await navigator.share({ files: [new File([blob], 'cukupgak.png', { type: 'image/png' })] })
    } else {
      downloadImage()
    }
  } catch { downloadImage() }
}

const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share
</script>

<template>
  <div>
    <div
      ref="cardRef"
      class="bg-white p-6 rounded-lg shadow w-[400px]"
    >
      <p class="text-xs text-gray-400 mb-2">CukupGak — Kalkulator Kelayakan Gaji</p>
      <p class="text-lg font-semibold text-gray-900 mb-1">{{ result.verdict }}</p>
      <p class="text-sm text-gray-500 mb-3">Savings rate: {{ (Math.max(result.savingsRate, 0) * 100).toFixed(1) }}%</p>
      <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div><span class="text-gray-400">Take-home</span><br/>{{ fmt(result.takeHome) }}</div>
        <div><span class="text-gray-400">Pengeluaran</span><br/>{{ fmt(result.totalExpense) }}</div>
      </div>
      <p class="text-[10px] text-gray-400 text-right">cukupgak.github.io</p>
    </div>

    <div class="flex gap-2 mt-3">
      <button @click="downloadImage" class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
        Unduh PNG
      </button>
      <button v-if="isShareSupported" @click="shareNative" class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        Bagikan
      </button>
    </div>
  </div>
</template>
