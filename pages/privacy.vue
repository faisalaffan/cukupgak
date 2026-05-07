<script setup lang="ts">
useHead({
  title: 'Kebijakan Privasi — Kalkulator Gaji CukupGak',
  meta: [
    { name: 'description', content: 'Kebijakan privasi CukupGak. Tidak ada data pribadi yang dikumpulkan — semua kalkulasi dilakukan di browser Anda. Tidak ada cookie, tidak ada tracking.' },
    { property: 'og:title', content: 'Kebijakan Privasi — CukupGak' },
    { property: 'og:description', content: 'Kebijakan privasi kalkulator kelayakan gaji Jakarta. Tidak ada data dikumpulkan.' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://faisalaffan.github.io/privacy' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Apakah CukupGak mengumpulkan data pribadi?', acceptedAnswer: { '@type': 'Answer', text: 'Tidak. CukupGak tidak mengumpulkan, menyimpan, atau mengirimkan data pribadi apa pun. Semua kalkulasi dilakukan sepenuhnya di browser Anda.' } },
          { '@type': 'Question', name: 'Apakah CukupGak menggunakan cookie?', acceptedAnswer: { '@type': 'Answer', text: 'Tidak. Situs ini tidak menggunakan cookie dan tidak melacak aktivitas pengguna.' } },
          { '@type': 'Question', name: 'Bagaimana cara menghapus data saya?', acceptedAnswer: { '@type': 'Answer', text: 'Karena tidak ada data yang disimpan di server, tidak ada yang perlu dihapus. Preferensi tampilan (tema gelap/terang) tersimpan di localStorage browser Anda dan bisa dihapus melalui pengaturan browser.' } },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <NuxtLink to="/" class="inline-block text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
      ← Kembali ke simulasi
    </NuxtLink>

    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Kebijakan Privasi</h1>
    <p class="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
      Terakhir diperbarui: 7 Mei 2026. Halaman ini menjelaskan praktik data aplikasi. Singkatnya: perhitungan dilakukan
      di peramban Pengguna, Pengembang tidak meminta data identitas, dan tidak ada akun login.
    </p>

    <div class="prose prose-sm text-gray-600 dark:text-gray-300 max-w-none space-y-4">
      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100">0. Definisi</h2>
      <p>
        Dalam kebijakan ini, <strong>Pengembang</strong> berarti pemilik dan pemelihara aplikasi/situs ini.
        <strong>Pengguna</strong> berarti setiap pihak yang mengakses aplikasi ini.
        <strong>Aplikasi</strong> berarti seluruh halaman dan kalkulator yang tersedia pada situs ini.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">1. Data yang dimasukkan ke kalkulator</h2>
      <p>
        Angka seperti gaji, zona domisili, status, transportasi, hunian, gaya makan, dan gaya hidup diproses
        <strong>secara lokal di perangkat Pengguna</strong> untuk menghasilkan estimasi kelayakan. Aplikasi
        <strong>tidak meminta</strong> nama, NIK, alamat, e-mail, nomor telepon, data rekening, atau identitas
        pribadi lainnya.
      </p>
      <p>
        Input simulasi <strong>tidak dikirim</strong> ke server aplikasi sebagai catatan/database pengguna.
        Bila Pengguna menutup atau memuat ulang halaman, data yang sedang dihitung umumnya hilang dari memori peramban.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">2. Penyimpanan di peramban (browser)</h2>
      <p>
        Aplikasi dapat menyimpan preferensi tampilan ringan di <strong>localStorage</strong> peramban Pengguna —
        misalnya pilihan tema (terang/gelap) — agar pengalaman konsisten saat Pengguna kembali. Data tersebut hanya
        dibaca oleh peramban Pengguna sendiri dan dapat dihapus kapan saja melalui pengaturan peramban (clear site data).
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">3. Analitik penggunaan (Google Analytics 4)</h2>
      <p>
        Untuk memahami penggunaan aplikasi secara agregat (mis. halaman yang dibuka, tanpa mengidentifikasi individu
        secara meyakinkan), situs dapat memuat <strong>Google Analytics 4</strong> (layanan Google). Pengukuran
        diaktifkan hanya bila Pengembang menyetel ID pengukuran di konfigurasi build/hosting. Data yang dikumpulkan
        mengikuti kebijakan Google; ringkasan umum tersedia di
        <a href="https://policies.google.com/privacy" class="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener">Kebijakan Privasi Google</a>
        dan dokumentasi produk Analytics.
      </p>
      <p>
        Aplikasi <strong>tidak</strong> memasang piksel iklan (mis. Meta Pixel) dan tidak meminta nama, e-mail, atau
        data identitas untuk analitik ini. Angka simulasi gaji yang Anda masukkan tetap diproses di peramban seperti
        di bagian 1; Analytics tidak menerima payload isian form sebagai data terstruktur dari kode aplikasi ini.
      </p>
      <p>
        Untuk tipografi halaman, jenis huruf dapat dimuat melalui <strong>Google Fonts</strong>. Pada saat font dimuat,
        peramban Pengguna mengirim permintaan HTTP ke penyedia CDN tersebut; penyedia dapat mencatat data teknis standar
        permintaan (mis. alamat IP, agen pengguna) sesuai kebijakan mereka.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">4. Log infrastruktur hosting</h2>
      <p>
        Penyedia hosting (GitHub Pages) dan jaringan Pengguna (ISP, DNS, peramban) dapat secara teknis mencatat
        permintaan akses, seperti alamat IP, agen peramban, dan URL yang diminta, sesuai kebijakan masing-masing
        penyedia. Pencatatan tersebut berada di <strong>luar kendali kode aplikasi</strong> dan diperlukan untuk
        operasional dasar internet.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">5. Tautan keluar (external links)</h2>
      <p>
        Halaman dapat memuat tautan ke situs pihak ketiga. Pengembang tidak bertanggung jawab atas isi, praktik privasi,
        atau tindakan situs lain. Pengguna sebaiknya membaca kebijakan privasi pihak yang dikunjungi.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">6. Anak di bawah umur</h2>
      <p>
        Aplikasi ini tidak ditargetkan untuk anak di bawah 17 tahun dan tidak meminta data pribadi apapun. Orang
        tua/wali bertanggung jawab atas akses anak terhadap situs ini.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">7. Hak Pengguna</h2>
      <p>
        Karena aplikasi tidak menyimpan data pribadi Pengguna di server Pengembang, tidak ada catatan untuk diakses,
        dikoreksi, atau dihapus berdasarkan permintaan Pengguna. Untuk preferensi tampilan yang tersimpan di peramban
        Pengguna, Pengguna dapat menghapusnya kapan saja melalui pengaturan peramban.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">8. Hukum yang berlaku</h2>
      <p>
        Kebijakan ini disusun mengacu pada hukum Republik Indonesia, termasuk semangat
        <em>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi</em>, sejauh relevan dengan sifat
        layanan ini.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">9. Perubahan kebijakan</h2>
      <p>
        Kebijakan ini dapat diperbarui sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Versi yang tampil di situs
        pada saat Pengguna mengakses adalah versi yang berlaku.
      </p>

      <h2 class="text-base font-medium text-gray-900 dark:text-gray-100 mt-4">10. Kontak</h2>
      <p>
        Untuk pertanyaan terkait privasi situs ini, Pengguna dapat menghubungi pemilik proyek melalui e-mail:
        <a href="mailto:faisallionel@gmail.com" class="text-blue-600 dark:text-blue-400 underline">faisallionel@gmail.com</a>.
      </p>
    </div>
  </div>
</template>
