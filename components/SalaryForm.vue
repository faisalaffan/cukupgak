<script setup lang="ts">
import type { SalaryInput } from '~/types/salary'

const form = defineModel<SalaryInput>({ required: true })

const formatNumber = (val: number | undefined) => {
  if (val === undefined || val === null || isNaN(val) || val === 0) return ''
  return val.toLocaleString('id-ID')
}

const handleInput = (event: Event, field: keyof SalaryInput) => {
  const target = event.target as HTMLInputElement
  const raw = target.value
  
  // Ambil hanya angka
  const cleaned = raw.replace(/\D/g, '')
  const num = cleaned ? parseInt(cleaned, 10) : 0
  
  // Set ke model
  form.value[field] = num
  
  // Format ulang input
  const formatted = num ? num.toLocaleString('id-ID') : ''
  
  // Simpan posisi kursor
  const selectionStart = target.selectionStart || 0
  const oldLength = raw.length
  
  target.value = formatted
  
  const diff = formatted.length - oldLength
  const newPos = Math.max(0, selectionStart + diff)
  
  // Kembalikan posisi kursor setelah Vue selesai rendering
  nextTick(() => {
    target.setSelectionRange(newPos, newPos)
  })
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div class="md:col-span-2">
      <label for="city" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Kota</label>
      <select
        id="city"
        v-model="form.city"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="jakarta">Jakarta</option>
        <option value="surabaya">Surabaya</option>
        <option value="bandung">Bandung</option>
        <option value="medan">Medan</option>
        <option value="yogyakarta">Yogyakarta</option>
      </select>
    </div>
    <div>
      <label for="salary" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Gaji bruto (Rp/bulan)</label>
      <input
        id="salary"
        type="text"
        inputmode="numeric"
        :value="formatNumber(form.salary)"
        @input="handleInput($event, 'salary')"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      />
    </div>
    <div>
      <label for="salaryType" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Tipe gaji</label>
      <select
        id="salaryType"
        v-model="form.salaryType"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="gross">Bruto (sebelum pajak)</option>
        <option value="net">Neto (sudah dipotong)</option>
      </select>
    </div>

    <div>
      <label for="zone" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Zona domisili</label>
      <select
        id="zone"
        v-model="form.zone"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="central">Jakarta Pusat / Selatan (premium)</option>
        <option value="outer">Jakarta Timur / Barat / Utara</option>
        <option value="satellite">Bekasi / Depok / Tangerang / Bogor</option>
      </select>
    </div>
    <div>
      <label for="status" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
      <select
        id="status"
        v-model="form.status"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="single">Lajang</option>
        <option value="married">Menikah (tanpa anak)</option>
        <option value="family1">Menikah + 1 anak</option>
        <option value="family2">Menikah + 2 anak</option>
      </select>
    </div>

    <div>
      <label for="transport" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Transportasi ke kantor</label>
      <select
        id="transport"
        v-model="form.transport"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="public">KRL / MRT / TransJakarta</option>
        <option value="ojol">Ojol harian</option>
        <option value="motor">Motor pribadi</option>
        <option value="car">Mobil pribadi</option>
      </select>
    </div>
    <div>
      <label for="housing" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Tempat tinggal</label>
      <select
        id="housing"
        v-model="form.housing"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="parents">Tinggal sama orang tua</option>
        <option value="kos_budget">Kos budget (Rp 700rb–1,2jt)</option>
        <option value="kos_mid">Kos menengah (Rp 1,5jt–2,5jt)</option>
        <option value="kos_premium">Kos premium (Rp 3jt–5jt)</option>
        <option value="rent">Sewa apartemen (Rp 4jt–8jt)</option>
      </select>
    </div>

    <div>
      <label for="food" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Gaya makan</label>
      <select
        id="food"
        v-model="form.food"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="warung">Warung / warteg setiap hari</option>
        <option value="mixed">Mix (warung + sesekali resto)</option>
        <option value="resto">Resto / GrabFood lebih sering</option>
      </select>
    </div>
    <div>
      <label for="lifestyle" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Gaya hidup</label>
      <select
        id="lifestyle"
        v-model="form.lifestyle"
        class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <option value="frugal">Hemat ketat</option>
        <option value="normal">Normal (nongkrong sesekali)</option>
        <option value="social">Aktif sosial / hobi</option>
      </select>
    </div>
  </div>

  <details class="group border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 mt-4 bg-gray-50/20 dark:bg-gray-900/10 transition-colors">
    <summary class="flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-350 select-none uppercase tracking-wider list-none [&::-webkit-details-marker]:hidden">
      <span>Pengaturan lanjutan</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 transform transition-transform duration-300 group-open:rotate-180"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </summary>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label for="cicilan" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Cicilan / bulan (KPR, motor, dll)</label>
        <input id="cicilan" type="text" inputmode="numeric" :value="formatNumber(form.cicilan)" @input="handleInput($event, 'cicilan')" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
      </div>
      <div>
        <label for="danaDarurat" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Dana darurat / bulan</label>
        <input id="danaDarurat" type="text" inputmode="numeric" :value="formatNumber(form.danaDarurat)" @input="handleInput($event, 'danaDarurat')" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
      </div>
      <div>
        <label for="tunjanganTransport" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Tunjangan transport dari kantor</label>
        <input id="tunjanganTransport" type="text" inputmode="numeric" :value="formatNumber(form.tunjanganTransport)" @input="handleInput($event, 'tunjanganTransport')" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
      </div>
      <div>
        <label for="tunjanganMakan" class="block text-[11px] font-semibold text-gray-450 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Tunjangan makan dari kantor</label>
        <input id="tunjanganMakan" type="text" inputmode="numeric" :value="formatNumber(form.tunjanganMakan)" @input="handleInput($event, 'tunjanganMakan')" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
      </div>
      <div class="md:col-span-2">
        <label for="bonusTahunan" class="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">Bonus tahunan (THR, bonus akhir tahun)</label>
        <input id="bonusTahunan" type="text" inputmode="numeric" :value="formatNumber(form.bonusTahunan)" @input="handleInput($event, 'bonusTahunan')" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" />
      </div>
    </div>
  </details>
</template>
