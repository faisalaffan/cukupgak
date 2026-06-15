<script setup lang="ts">
import { toPng } from 'html-to-image'
import type { SalaryResult } from '~/types/salary'

const props = defineProps<{ result: SalaryResult }>()

const cardRef = ref<HTMLElement>()
const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

async function downloadImage() {
  if (!cardRef.value) return
  // Menambahkan delay kecil untuk memastikan font ter-load sempurna di clone DOM
  const dataUrl = await toPng(cardRef.value, { 
    quality: 0.98, 
    pixelRatio: 2,
    style: {
      transform: 'scale(1)',
      left: '0',
      top: '0'
    }
  })
  const link = document.createElement('a')
  link.download = 'cukupgak-ringkasan.png'
  link.href = dataUrl
  link.click()
}

async function shareNative() {
  if (!cardRef.value) return
  try {
    const dataUrl = await toPng(cardRef.value, { quality: 0.98, pixelRatio: 2 })
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
    <!-- Pembungkus tersembunyi yang tetap mempertahankan hitungan layout browser -->
    <div class="absolute overflow-hidden w-0 h-0 pointer-events-none select-none" style="top: 0; left: 0;">
      <div
        ref="cardRef"
        class="bg-white p-7 rounded-2xl border border-gray-100 w-[380px] text-gray-900 font-sans flex flex-col gap-4 shadow-sm"
      >
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CukupGak — Ringkasan Kelayakan Gaji</p>
          <h3 class="text-xl font-extrabold text-gray-950 tracking-tight leading-tight mb-1">{{ result.verdict }}</h3>
          <p class="text-xs font-semibold text-gray-500">Savings rate: {{ (Math.max(result.savingsRate, 0) * 100).toFixed(1) }}%</p>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-3.5 text-xs font-semibold text-gray-500">
          <div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Take-home</span>
            <span class="text-sm font-bold text-gray-900">{{ fmt(result.takeHome) }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Pengeluaran</span>
            <span class="text-sm font-bold text-gray-900">{{ fmt(result.totalExpense) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Data estimasi 2024–2025</span>
          <span>faisalaffan.github.io</span>
        </div>
      </div>
    </div>

    <!-- Panel Aksi Premium (Vertikal Stacked) -->
    <div class="mt-6 p-5 bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-900/40 dark:to-gray-950/20 border border-gray-100 dark:border-gray-800/80 rounded-2xl flex flex-col gap-4">
      <div class="text-left">
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bagikan Hasil</p>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          Simpan ringkasan kelayakan gaji Anda dalam bentuk kartu gambar berkualitas tinggi atau bagikan ke media sosial.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2.5">
        <button 
          @click="downloadImage" 
          class="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 group/btn"
        >
          <svg class="w-3.5 h-3.5 mr-1.5 transform group-hover/btn:translate-y-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Unduh PNG
        </button>
        <button 
          v-if="isShareSupported" 
          @click="shareNative" 
          class="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-gray-250 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-[0.98] text-xs font-bold rounded-xl transition-all duration-200 group/share"
        >
          <svg class="w-3.5 h-3.5 mr-1.5 transform group-hover/share:rotate-12 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l5.577-3.253m-5.577 3.253l5.577 3.253m0 0a2.25 2.25 0 103.934 2.186 2.25 2.25 0 00-3.934-2.186zm0-8.318a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" />
          </svg>
          Bagikan
        </button>
      </div>
    </div>
  </div>
</template>
