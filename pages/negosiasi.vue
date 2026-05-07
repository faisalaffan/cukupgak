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
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Kalkulator Negosiasi Gaji</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Cari tahu berapa gaji minimum yang harus diminta berdasarkan target tabungan dan gaya hidupmu.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      <div class="md:col-span-2">
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Target tabungan (Rp/bulan)</label>
        <input v-model.number="targetTabungan" type="number" step="500000" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Kota</label>
        <select v-model="profile.city" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="jakarta">Jakarta</option>
          <option value="surabaya">Surabaya</option>
          <option value="bandung">Bandung</option>
          <option value="medan">Medan</option>
          <option value="yogyakarta">Yogyakarta</option>
        </select>
      </div>

      <div>
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
        <select v-model="profile.status" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="single">Lajang</option>
          <option value="married">Menikah (tanpa anak)</option>
          <option value="family1">Menikah + 1 anak</option>
          <option value="family2">Menikah + 2 anak</option>
        </select>
      </div>

      <div>
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Transportasi ke kantor</label>
        <select v-model="profile.transport" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="public">KRL / MRT / TransJakarta</option>
          <option value="ojol">Ojol harian</option>
          <option value="motor">Motor pribadi</option>
          <option value="car">Mobil pribadi</option>
        </select>
      </div>

      <div>
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Tempat tinggal</label>
        <select v-model="profile.housing" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="parents">Tinggal sama orang tua</option>
          <option value="kos_budget">Kos budget (Rp 700rb-1,2jt)</option>
          <option value="kos_mid">Kos menengah (Rp 1,5jt-2,5jt)</option>
          <option value="kos_premium">Kos premium (Rp 3jt-5jt)</option>
          <option value="rent">Sewa apartemen (Rp 4jt-8jt)</option>
        </select>
      </div>

      <div>
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Gaya makan</label>
        <select v-model="profile.food" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="warung">Warung / warteg setiap hari</option>
          <option value="mixed">Mix (warung + sesekali resto)</option>
          <option value="resto">Resto / GrabFood lebih sering</option>
        </select>
      </div>

      <div>
        <label class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Gaya hidup</label>
        <select v-model="profile.lifestyle" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="frugal">Hemat ketat</option>
          <option value="normal">Normal (nongkrong sesekali)</option>
          <option value="social">Aktif sosial / hobi</option>
        </select>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Gaji minimum yang dibutuhkan</p>
        <p class="text-2xl font-semibold text-green-700 dark:text-green-400">{{ fmt(computedGross) }}<span class="text-sm font-normal text-gray-500 dark:text-gray-400">/bulan</span></p>
      </div>

      <div class="grid grid-cols-3 gap-2.5 mb-4">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3.5">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Take-home</p>
          <p class="text-[15px] font-medium text-gray-900 dark:text-gray-100">{{ fmt(computedTakeHome) }}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3.5">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Target tabungan</p>
          <p class="text-[15px] font-medium text-blue-600 dark:text-blue-400">{{ fmt(targetTabungan) }}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3.5">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Biaya hidup</p>
          <p class="text-[15px] font-medium text-gray-900 dark:text-gray-100">{{ fmt(totalExpense) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
