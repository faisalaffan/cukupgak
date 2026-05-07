<script setup lang="ts">
import type { SalaryInput } from '~/types/salary'

const form = defineModel<SalaryInput>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
    <div>
      <label for="salary" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Gaji bruto (Rp/bulan)</label>
      <input
        id="salary"
        v-model.number="form.salary"
        type="number"
        step="500000"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label for="salaryType" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Tipe gaji</label>
      <select
        id="salaryType"
        v-model="form.salaryType"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="gross">Bruto (sebelum pajak)</option>
        <option value="net">Neto (sudah dipotong)</option>
      </select>
    </div>

    <div>
      <label for="zone" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Zona domisili</label>
      <select
        id="zone"
        v-model="form.zone"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="central">Jakarta Pusat / Selatan (premium)</option>
        <option value="outer">Jakarta Timur / Barat / Utara</option>
        <option value="satellite">Bekasi / Depok / Tangerang / Bogor</option>
      </select>
    </div>
    <div>
      <label for="status" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
      <select
        id="status"
        v-model="form.status"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="single">Lajang</option>
        <option value="married">Menikah (tanpa anak)</option>
        <option value="family1">Menikah + 1 anak</option>
        <option value="family2">Menikah + 2 anak</option>
      </select>
    </div>

    <div>
      <label for="transport" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Transportasi ke kantor</label>
      <select
        id="transport"
        v-model="form.transport"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="public">KRL / MRT / TransJakarta</option>
        <option value="ojol">Ojol harian</option>
        <option value="motor">Motor pribadi</option>
        <option value="car">Mobil pribadi</option>
      </select>
    </div>
    <div>
      <label for="housing" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Tempat tinggal</label>
      <select
        id="housing"
        v-model="form.housing"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="parents">Tinggal sama orang tua</option>
        <option value="kos_budget">Kos budget (Rp 700rb–1,2jt)</option>
        <option value="kos_mid">Kos menengah (Rp 1,5jt–2,5jt)</option>
        <option value="kos_premium">Kos premium (Rp 3jt–5jt)</option>
        <option value="rent">Sewa apartemen (Rp 4jt–8jt)</option>
      </select>
    </div>

    <div>
      <label for="food" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Gaya makan</label>
      <select
        id="food"
        v-model="form.food"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="warung">Warung / warteg setiap hari</option>
        <option value="mixed">Mix (warung + sesekali resto)</option>
        <option value="resto">Resto / GrabFood lebih sering</option>
      </select>
    </div>
    <div>
      <label for="lifestyle" class="block text-[13px] text-gray-500 dark:text-gray-400 mb-1.5">Gaya hidup</label>
      <select
        id="lifestyle"
        v-model="form.lifestyle"
        class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="frugal">Hemat ketat</option>
        <option value="normal">Normal (nongkrong sesekali)</option>
        <option value="social">Aktif sosial / hobi</option>
      </select>
    </div>
  </div>
</template>
