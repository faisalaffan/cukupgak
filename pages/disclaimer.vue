<script setup lang="ts">
useHead({ title: 'Disclaimer — CukupGak' })
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Disclaimer</h1>

    <div class="prose prose-sm text-gray-600 dark:text-gray-300 max-w-none space-y-4">
      <p>
        CukupGak adalah alat estimasi, bukan alat perencanaan keuangan profesional.
        Semua hasil yang ditampilkan bersifat perkiraan berdasarkan asumsi rata-rata biaya
        hidup di Jakarta dan sekitarnya.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100">Batasan</h2>
      <ul class="list-disc pl-5 space-y-1">
        <li>Angka biaya hidup adalah estimasi rata-rata — realita bisa berbeda ±20–30% tergantung lokasi spesifik dan gaya hidup individu.</li>
        <li>Perhitungan PPh 21 menggunakan tarif progresif 2024 dengan PTKP standar. Tidak memperhitungkan tunjangan, bonus, THR, atau penghasilan tidak tetap lainnya.</li>
        <li>Mode gaji neto menggunakan kalkulasi balik satu langkah (aproksimasi) — semakin tinggi bracket pajak, semakin kurang akurat.</li>
        <li>Tidak termasuk: cicilan (KPR, kendaraan, kartu kredit), dana darurat, asuransi tambahan, tabungan pensiun, atau pengeluaran tak terduga.</li>
        <li>Iuran BPJS Ketenagakerjaan yang ditampilkan hanya porsi JHT (2% employee). Iuran JKK dan JKM dibayar oleh pemberi kerja dan tidak diperhitungkan di sini.</li>
      </ul>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">Bukan Nasihat Keuangan</h2>
      <p>
        Informasi di situs ini tidak dapat dianggap sebagai nasihat keuangan, hukum, atau pajak.
        Konsultasikan dengan perencana keuangan bersertifikat untuk keputusan finansial penting.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">Sumber Data</h2>
      <p>
        Estimasi biaya hidup bersumber dari data terbuka BPS, survei komunitas, dan publikasi
        ekonomi terkini. Data diperbarui secara berkala namun mungkin tidak mencerminkan kondisi real-time.
      </p>
    </div>
  </div>
</template>
