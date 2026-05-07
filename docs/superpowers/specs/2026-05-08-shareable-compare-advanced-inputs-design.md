# Shareable Link, Comparison Mode & Advanced Inputs — Design Spec

## Overview

Tiga fitur yang diimplementasikan dalam satu spec karena shared infrastructure (URL sync):

1. **Shareable link** — encode semua input ke URL query params, bisa share hasil ke orang lain
2. **Input lanjutan** — cicilan, dana darurat, tunjangan kantor, bonus tahunan
3. **Side-by-side comparison** — dua kalkulator dalam satu halaman untuk membandingkan skenario

## Architecture

```
composables/
  use-url-sync.ts              — NEW: watch form → serialize to URL, hydrate from URL on mount
  use-salary-calculator.ts     — MODIFY: support optional field defaults

types/
  salary.ts                    — MODIFY: add 5 optional fields to SalaryInput

components/
  SalaryForm.vue               — MODIFY: add collapsible "Pengaturan lanjutan" section
  SalaryResults.vue            — no changes needed (already handles any expenses)

pages/
  index.vue                    — MODIFY: integrate URL sync, add "Bandingkan" CTA
  compare.vue                  — NEW: two calculator instances + comparison summary

components/
  CompareSummary.vue           — NEW: comparison table between two scenarios
```

## Feature 1: Shareable Link (`composables/use-url-sync.ts`)

### Data flow
```
Input change → debounce 300ms → serialize → router.replace({ query })
Page load → route.query → parse & validate → merge ke defaults → populate form
```

### URL format
```
/?salary=10000000&zone=central&status=family2&transport=public&housing=kos_mid&food=mixed&lifestyle=normal&salaryType=gross&cicilan=0&danaDarurat=500000&tunjanganTransport=0&tunjanganMakan=0&bonusTahunan=0
```

- `router.replace` (bukan push) — tidak spam history
- 300ms debounce — tidak rewrite setiap keystroke
- Invalid value → fallback ke default
- Field dengan nilai default (0) tetap di-encode

### Compare page URL
```
/bandingkan?a.salary=8000000&a.zone=outer&b.salary=10000000&b.zone=central&...
```
- Prefix `a.` dan `b.` untuk dua instance

## Feature 2: Input Lanjutan

### Type changes (`types/salary.ts`)

`SalaryInput` tambah 5 field opsional:
```typescript
interface SalaryInput {
  // ... existing fields
  cicilan?: number            // default 0
  danaDarurat?: number        // default 0
  tunjanganTransport?: number // default 0
  tunjanganMakan?: number     // default 0
  bonusTahunan?: number       // default 0
}
```

### Logic change (`utils/salary-calculator.ts`)

`computeResult` menerima parameter tambahan:
- Total expense = expense dasar + cicilan + danaDarurat - tunjanganTransport - tunjanganMakan
- Bonus tahunan dihitung terpisah, tidak mempengaruhi verdict bulanan

### UI
- `<details>` / accordion collapsible di bawah 8 field utama
- Default collapsed — tidak intimidasi user baru
- Label: "Pengaturan lanjutan"
- 5 input dalam 2 kolom (sama dengan pattern form existing)

## Feature 3: Comparison Page

### Halaman: `pages/compare.vue` → `/bandingkan`

**Layout:**
```
┌──────────────────────────────────────────────┐
│  [Skenario A]           [Skenario B]         │
│  ┌─────────────────┐    ┌─────────────────┐  │
│  │ SalaryForm      │    │ SalaryForm      │  │
│  │ + lanjutan      │    │ + lanjutan      │  │
│  ├─────────────────┤    ├─────────────────┤  │
│  │ SalaryResults   │    │ SalaryResults   │  │
│  └─────────────────┘    └─────────────────┘  │
│                                              │
│  ── Perbandingan ──────────────────────────  │
│  |            | A        | B        | Δ      │
│  | Take-home  | 8.000.000| 7.500.000| -500K  │
│  | Pengeluaran| 5.100.000| 6.200.000| +1.1M  │
│  | Savings    | 2.900.000| 1.300.000| -1.6M  │
│  | Verdict    | Layak    | Pas-pasan|        │
└──────────────────────────────────────────────┘
```

### State management
- Dua instance composable terpisah: tidak share state
- URL prefix `a.` dan `b.`
- Optional: tombol "Salin A ke B"

### CompareSummary component
- Tabel dengan 4 kolom: kategori, A, B, selisih
- Selisih diwarnai hijau/merah
- Verdict masing-masing

### Navigasi
- Dari halaman utama: tombol/CTA "Bandingkan dua skenario" → `/bandingkan`
- Dari halaman bandingkan: "Kembali ke kalkulator"
- Navbar: tambah 1 link "Bandingkan" (atau di desktop nav saja)

## Testing

### Unit tests
- `use-url-sync`: parse valid/invalid query params, serialize form to query
- `computeResult`: verify cicilan & tunjangan affect savings correctly

### E2E tests
- URL berubah saat input berubah
- Load halaman dengan query param → form terpopulasi
- Halaman bandingkan render dua kalkulator
- Input di A tidak mempengaruhi B

## Limitations
- URL bisa panjang dengan dua skenario (GET limit ~8KB — still safe)
- Tidak ada backend — share hanya via copy URL, bukan shortlink
- Tidak ada authentication — shared link hanya readable, tidak editable
