export type City = 'jakarta' | 'surabaya' | 'bandung' | 'medan' | 'yogyakarta'

export const CITY_LABELS: Record<City, string> = {
  jakarta: 'Jakarta',
  surabaya: 'Surabaya',
  bandung: 'Bandung',
  medan: 'Medan',
  yogyakarta: 'Yogyakarta',
}

export const CITY_MULTIPLIERS: Record<City, {
  housing: number; transport: number; food: number; lifestyle: number; utilities: number
}> = {
  jakarta:    { housing: 1.0, transport: 1.0,  food: 1.0,  lifestyle: 1.0,  utilities: 1.0 },
  surabaya:   { housing: 0.75, transport: 0.7, food: 0.85, lifestyle: 0.8,  utilities: 0.9 },
  bandung:    { housing: 0.7,  transport: 0.65, food: 0.8,  lifestyle: 0.9,  utilities: 0.9 },
  medan:      { housing: 0.65, transport: 0.7, food: 0.75, lifestyle: 0.75, utilities: 0.85 },
  yogyakarta: { housing: 0.5,  transport: 0.5, food: 0.6,  lifestyle: 0.7,  utilities: 0.75 },
}
