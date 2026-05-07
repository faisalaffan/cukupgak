# Kalkulator Kelayakan Gaji Jakarta

Estimasi apakah gajimu cukup untuk biaya hidup di Jakarta dan sekitarnya. Masukkan gaji dan profil hidup — dapatkan take-home setelah pajak, breakdown biaya, dan verdict.

**Live:** [faisalaffan.github.io/cukupgak](https://faisalaffan.github.io/cukupgak)

## Stack

Nuxt 3 + TypeScript + Tailwind CSS, static generate.

## Development

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # Vitest (unit)
pnpm test:e2e       # Playwright (e2e)
pnpm generate       # Static build → .output/public/
```

## Cara Kerja

1. **Input:** gaji bruto/neto, zona domisili, status pernikahan, transportasi, hunian, gaya makan, gaya hidup
2. **Potongan:** PPh 21 tarif progresif 2024 + BPJS Kesehatan (1%, cap Rp 120.000) + BPJS Ketenagakerjaan (2%)
3. **Biaya hidup:** estimasi berdasarkan kombinasi zona × status × pola hidup
4. **Verdict:** Layak banget (≥30% tabungan) sampai Tidak layak (defisit)

## Batasan

- Tidak termasuk: cicilan, dana darurat, tunjangan kantor, bonus/THR
- Estimasi biaya hidup adalah rata-rata — realita bisa ±20–30%
- Mode gaji neto menggunakan kalkulasi balik satu langkah (aproksimasi)

## Lisensi

MIT © 2026 Faisal Affan
