<script setup lang="ts">
import type { City } from '~/utils/city-data'
import { getExpenses, reverseCalcGross, calcTax } from '~/utils/salary-calculator'

useHead({
  title: 'Kalkulator Negosiasi Gaji — CukupGak',
  meta: [
    { name: 'description', content: 'Cari tahu berapa gaji minimum yang harus diminta berdasarkan target tabungan dan gaya hidup yang diinginkan.' },
    { property: 'og:title', content: 'Kalkulator Negosiasi Gaji — CukupGak' },
    { property: 'og:description', content: 'Hitung gaji minimum berdasarkan target tabungan dan gaya hidup.' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://faisalaffan.github.io/negosiasi' }],
})

const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

const targetTabungan = ref(2_000_000)

const formatNumber = (val: number | undefined) => {
  if (val === undefined || val === null || isNaN(val) || val === 0) return ''
  return val.toLocaleString('id-ID')
}

const handleTargetTabunganInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const raw = target.value
  const cleaned = raw.replace(/\D/g, '')
  const num = cleaned ? parseInt(cleaned, 10) : 0
  
  targetTabungan.value = num
  
  const formatted = num ? num.toLocaleString('id-ID') : ''
  const selectionStart = target.selectionStart || 0
  const oldLength = raw.length
  
  target.value = formatted
  const diff = formatted.length - oldLength
  const newPos = Math.max(0, selectionStart + diff)
  
  nextTick(() => {
    target.setSelectionRange(newPos, newPos)
  })
}

const profile = reactive({
  city: 'jakarta' as City,
  status: 'single' as const,
  transport: 'public' as const,
  housing: 'kos_mid' as const,
  food: 'mixed' as const,
  lifestyle: 'normal' as const,
})

const computedGross = computed(() => {
  const expenses = getExpenses(
    profile.city, 'outer', profile.status,
    profile.transport, profile.housing, profile.food, profile.lifestyle,
  )
  const totalExpense = Object.values(expenses).reduce((a, b) => a + b, 0)
  const target = totalExpense + targetTabungan.value
  return reverseCalcGross(target, profile.status)
})

const computedTakeHome = computed(() => {
  const { pph21, bpjsKes, bpjsTK } = calcTax(computedGross.value, profile.status)
  return computedGross.value - pph21 - bpjsKes - bpjsTK
})

const computedExpenses = computed(() => {
  return getExpenses(
    profile.city, 'outer', profile.status,
    profile.transport, profile.housing, profile.food, profile.lifestyle,
  )
})

const totalExpense = computed(() =>
  Object.values(computedExpenses.value).reduce((a, b) => a + b, 0)
)
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800/80 p-6 md:p-8">
    <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">Kalkulator Negosiasi Gaji</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Cari tahu berapa gaji minimum yang harus diminta berdasarkan target tabungan dan gaya hidupmu.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="md:col-span-2">
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Target tabungan (Rp/bulan)</label>
        <input type="text" inputmode="numeric" :value="formatNumber(targetTabungan)" @input="handleTargetTabunganInput" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Kota</label>
        <select v-model="profile.city" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="jakarta">Jakarta</option>
          <option value="surabaya">Surabaya</option>
          <option value="bandung">Bandung</option>
          <option value="medan">Medan</option>
          <option value="yogyakarta">Yogyakarta</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
        <select v-model="profile.status" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="single">Lajang</option>
          <option value="married">Menikah (tanpa anak)</option>
          <option value="family1">Menikah + 1 anak</option>
          <option value="family2">Menikah + 2 anak</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Transportasi ke kantor</label>
        <select v-model="profile.transport" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="public">KRL / MRT / TransJakarta</option>
          <option value="ojol">Ojol harian</option>
          <option value="motor">Motor pribadi</option>
          <option value="car">Mobil pribadi</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Tempat tinggal</label>
        <select v-model="profile.housing" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="parents">Tinggal sama orang tua</option>
          <option value="kos_budget">Kos budget (Rp 700rb-1,2jt)</option>
          <option value="kos_mid">Kos menengah (Rp 1,5jt-2,5jt)</option>
          <option value="kos_premium">Kos premium (Rp 3jt-5jt)</option>
          <option value="rent">Sewa apartemen (Rp 4jt-8jt)</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Gaya makan</label>
        <select v-model="profile.food" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="warung">Warung / warteg setiap hari</option>
          <option value="mixed">Mix (warung + sesekali resto)</option>
          <option value="resto">Resto / GrabFood lebih sering</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Gaya hidup</label>
        <select v-model="profile.lifestyle" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="frugal">Hemat ketat</option>
          <option value="normal">Normal (nongkrong sesekali)</option>
          <option value="social">Aktif sosial / hobi</option>
        </select>
      </div>
    </div>

    <div class="border-t border-gray-100 dark:border-gray-800 pt-6">
      <div class="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/5 border border-emerald-100/70 dark:border-emerald-900/30 rounded-2xl p-5 mb-5 transition-all duration-300">
        <p class="text-[11px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mb-1">Gaji bruto minimum yang direkomendasikan</p>
        <p class="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight tabular-nums">
          {{ fmt(computedGross) }}
          <span class="text-xs font-normal text-gray-450 dark:text-gray-500">/ bulan</span>
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-gradient-to-br from-blue-50/50 to-indigo-50/10 dark:from-blue-950/20 dark:to-indigo-950/5 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
          <p class="text-[10px] font-bold text-blue-500/80 dark:text-blue-400/80 uppercase tracking-wider mb-1">Take-home</p>
          <p class="text-[16px] font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ fmt(computedTakeHome) }}</p>
        </div>
        <div class="bg-gradient-to-br from-purple-50/50 to-pink-50/10 dark:from-purple-950/20 dark:to-pink-950/5 border border-purple-100/50 dark:border-purple-900/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
          <p class="text-[10px] font-bold text-purple-500/80 dark:text-purple-400/80 uppercase tracking-wider mb-1">Target tabungan</p>
          <p class="text-[16px] font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ fmt(targetTabungan) }}</p>
        </div>
        <div class="bg-gradient-to-br from-amber-50/50 to-orange-50/10 dark:from-amber-950/20 dark:to-orange-950/5 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
          <p class="text-[10px] font-bold text-amber-500/80 dark:text-amber-400/80 uppercase tracking-wider mb-1">Estimasi biaya hidup</p>
          <p class="text-[16px] font-bold text-gray-900 dark:text-gray-100 tabular-nums">{{ fmt(totalExpense) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
