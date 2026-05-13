<p align="right">
  <a href="./README.id.md">🇮🇩 Bahasa Indonesia</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/02_BANNER_DARK.png">
    <img src="./assets/01_BANNER_LIGHT.png" alt="CukupGak Banner" width="100%" />
  </picture>
</p>

<p align="center">
  <img src="./assets/03_LOGO_LIGHT.png" alt="CukupGak Logo" width="180" />
</p>

<h1 align="center">CukupGak — Jakarta Salary Feasibility Calculator</h1>

<p align="center">
  Estimate whether your salary is enough to live in Jakarta and surrounding areas. <br/>
  Enter your salary and lifestyle profile — get take-home pay after tax, cost breakdown, and a verdict.
</p>

<p align="center">
  <a href="https://faisalaffan.github.io/cukupgak"><strong>🔗 Live Demo</strong></a>
  &nbsp;·&nbsp;
  <a href="#-stack"><strong>Stack</strong></a>
  &nbsp;·&nbsp;
  <a href="#-how-it-works"><strong>How It Works</strong></a>
  &nbsp;·&nbsp;
  <a href="#-development"><strong>Development</strong></a>
  &nbsp;·&nbsp;
  <a href="#-limitations"><strong>Limitations</strong></a>
</p>

## 📦 Stack

Nuxt 3 + TypeScript + Tailwind CSS, static generate (hybrid ready).

## 🧠 How It Works

1. **Input:** gross/net salary, domicile zone, marital status, transport mode, housing type, eating style, lifestyle level
2. **Deductions:** 2024 progressive PPh 21 + BPJS Kesehatan (1%, cap Rp 120.000) + BPJS Ketenagakerjaan (2%)
3. **Living costs:** estimated from the combination of zone × status × lifestyle patterns
4. **Verdict:** from "Very Feasible" (≥30% savings) to "Not Feasible" (deficit)

## 🛠 Development

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # Vitest (unit)
pnpm test:e2e       # Playwright (e2e)
pnpm generate       # Static build → .output/public/
```

## ⚠️ Limitations

- Excludes: loan installments, emergency funds, office allowances, bonuses/holiday pay
- Living cost estimates are averages — reality may vary ±20–30%
- Net salary mode uses a one-step reverse calculation (approximation)

## 📄 License

MIT © 2026 Faisal Affan
