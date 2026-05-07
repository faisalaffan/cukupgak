import type { SalaryInput } from '~/types/salary'

const FORM_KEYS = [
  'salary', 'salaryType', 'zone', 'status', 'transport',
  'housing', 'food', 'lifestyle', 'city',
  'cicilan', 'danaDarurat', 'tunjanganTransport', 'tunjanganMakan', 'bonusTahunan',
] as const

function parseQuery(query: Record<string, string | undefined>): Partial<SalaryInput> {
  const parsed: Record<string, unknown> = {}

  for (const key of FORM_KEYS) {
    const raw = query[key]
    if (raw === undefined) continue

    if (key === 'salary' || key === 'cicilan' || key === 'danaDarurat' || key === 'tunjanganTransport' || key === 'tunjanganMakan' || key === 'bonusTahunan') {
      const n = parseInt(raw, 10)
      if (!isNaN(n) && n >= 0) parsed[key] = n
    } else {
      parsed[key] = raw
    }
  }

  return parsed as Partial<SalaryInput>
}

function serializeForm(form: SalaryInput): Record<string, string> {
  const query: Record<string, string> = {}
  for (const key of FORM_KEYS) {
    const val = form[key as keyof SalaryInput]
    if (val !== undefined && val !== 0) {
      query[key] = String(val)
    }
  }
  return query
}

export function useUrlSync(
  form: ReturnType<typeof import('~/composables/use-salary-calculator').useSalaryCalculator>['form'],
  prefix?: string,
) {
  const router = useRouter()
  const route = useRoute()

  // Hydrate from URL on mount
  onMounted(() => {
    const query = route.query as Record<string, string | undefined>

    if (prefix) {
      const prefixed: Record<string, string | undefined> = {}
      for (const [k, v] of Object.entries(query)) {
        if (k.startsWith(prefix + '.')) {
          prefixed[k.slice(prefix.length + 1)] = Array.isArray(v) ? v[0] : v
        }
      }
      const parsed = parseQuery(prefixed)
      Object.assign(form, parsed)
    } else {
      const parsed = parseQuery(query)
      Object.assign(form, parsed)
    }
  })

  // Sync form changes to URL (debounced)
  let timeout: ReturnType<typeof setTimeout> | null = null
  watch(
    () => ({ ...form }),
    () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        let query: Record<string, string>
        if (prefix) {
          const serialized = serializeForm(form)
          query = {}
          for (const [k, v] of Object.entries(serialized)) {
            query[`${prefix}.${k}`] = v
          }
        } else {
          query = serializeForm(form)
        }
        router.replace({ query })
      }, 300)
    },
    { deep: true },
  )
}
