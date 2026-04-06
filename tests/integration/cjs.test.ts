import { describe, it, expect } from 'vitest'
import { createRequire } from 'module'
import type { Country } from '../../src/types'

// Load the built CJS artifact directly — this is what consumers get when they
// `require('what-country')` in a Node.js project.
const _require = createRequire(import.meta.url)
const {
  query,
  queryCitizenship,
  queryPhone,
  queryCurrency,
  queryfuzzy,
} = _require('../../dist/cjs/index.js')

// ---------------------------------------------------------------------------
// Smoke-test: data files are found and the module actually loads
// ---------------------------------------------------------------------------
describe('CJS build — module loads and data is available', () => {
  it('exports query as a function', () => {
    expect(typeof query).toBe('function')
  })

  it('exports queryCitizenship as a function', () => {
    expect(typeof queryCitizenship).toBe('function')
  })

  it('exports queryPhone as a function', () => {
    expect(typeof queryPhone).toBe('function')
  })

  it('exports queryCurrency as a function', () => {
    expect(typeof queryCurrency).toBe('function')
  })

  it('exports queryfuzzy as a function', () => {
    expect(typeof queryfuzzy).toBe('function')
  })

  it('returns a non-empty array for a known country (proves JSON data was loaded)', () => {
    const res = query('IE') as Country[]
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// query — ISO2 / ISO3 / TLD / name / alt-name / dedup
// ---------------------------------------------------------------------------
describe('CJS build — query()', () => {
  it('resolves by ISO2 (IE → Ireland)', () => {
    const res = query('IE') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves by ISO3 (IRL → Ireland)', () => {
    const res = query('IRL') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves by TLD (.ie → Ireland)', () => {
    const res = query('.ie') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves by full English name (Ireland)', () => {
    const res = query('Ireland') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves a multi-word country name (North Macedonia)', () => {
    const res = query('North Macedonia') as Country[]
    expect(res[0].name).toBe('North Macedonia')
  })

  it('resolves United States by ISO2 (US)', () => {
    const res = query('US') as Country[]
    expect(res[0].iso).toBe('US')
  })

  it('returns empty array for an unknown query', () => {
    const res = query('zzzzz') as Country[]
    expect(res).toEqual([])
  })

  // alt-names (loaded from altcountrynames.json — verifies that file too)
  it('resolves Ireland by German alt-name (Irland)', () => {
    const res = query('Irland') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves Ireland by Spanish alt-name (Irlanda)', () => {
    const res = query('Irlanda') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves Ireland by French alt-name (Irlande)', () => {
    const res = query('Irlande') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  // dedup
  it('handles repeated country name (Ireland Ireland)', () => {
    const res = query('Ireland Ireland') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('handles repeated multi-word name (United States United States)', () => {
    const res = query('United States United States') as Country[]
    expect(res[0].iso).toBe('US')
  })

  // field projection
  it('returns only requested fields when fields array is provided', () => {
    const res = query('IE', ['name', 'iso']) as Partial<Country>[]
    expect(res[0]).toEqual({ name: 'Ireland', iso: 'IE' })
    expect((res[0] as any).capital).toBeUndefined()
  })

  it('returns full Country objects when no fields array is provided', () => {
    const res = query('IE') as Country[]
    expect(res[0].capital).toBeDefined()
    expect(res[0].iso).toBeDefined()
    expect(res[0].population).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// queryCitizenship
// ---------------------------------------------------------------------------
describe('CJS build — queryCitizenship()', () => {
  it('resolves Ireland by demonym (Irish)', () => {
    const res = queryCitizenship('Irish') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('returns Dominican Republic first for ambiguous demonym (Dominican)', () => {
    const res = queryCitizenship('Dominican') as Country[]
    expect(res[0].name).toBe('Dominican Republic')
  })

  it('returns China first for ambiguous demonym (Chinese)', () => {
    const res = queryCitizenship('Chinese') as Country[]
    expect(res[0].name).toBe('China')
  })

  it('returns empty array for unknown demonym', () => {
    const res = queryCitizenship('asdfghjkl') as Country[]
    expect(res).toEqual([])
  })

  it('returns only requested fields when fields array is provided', () => {
    const res = queryCitizenship('Irish', ['name', 'iso']) as Partial<Country>[]
    expect(res[0]).toEqual({ name: 'Ireland', iso: 'IE' })
  })
})

// ---------------------------------------------------------------------------
// queryPhone
// ---------------------------------------------------------------------------
describe('CJS build — queryPhone()', () => {
  it('resolves Ireland by phone code (353)', () => {
    const res = queryPhone('353') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves United States by phone code (1)', () => {
    const res = queryPhone('1') as Country[]
    expect(res.some((c: Country) => c.iso === 'US')).toBe(true)
  })

  it('resolves Germany by phone code (49)', () => {
    const res = queryPhone('49') as Country[]
    expect(res[0].iso).toBe('DE')
  })

  it('strips leading + when provided (+353)', () => {
    const res = queryPhone('+353') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('returns empty array for unknown phone code', () => {
    const res = queryPhone('99999') as Country[]
    expect(res).toEqual([])
  })

  it('returns only requested fields when fields array is provided', () => {
    const res = queryPhone('353', ['name', 'phone']) as Partial<Country>[]
    expect(res[0].name).toBe('Ireland')
    expect((res[0] as any).iso).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// queryCurrency
// ---------------------------------------------------------------------------
describe('CJS build — queryCurrency()', () => {
  it('resolves euro-zone countries by currency code (EUR)', () => {
    const res = queryCurrency('EUR') as Country[]
    expect(res.some((c: Country) => c.name === 'Ireland')).toBe(true)
    expect(res.some((c: Country) => c.name === 'Germany')).toBe(true)
    expect(res.some((c: Country) => c.name === 'France')).toBe(true)
  })

  it('resolves United States by currency code (USD)', () => {
    const res = queryCurrency('USD') as Country[]
    expect(res.some((c: Country) => c.iso === 'US')).toBe(true)
  })

  it('resolves countries by currency name (Euro)', () => {
    const res = queryCurrency('Euro') as Country[]
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((c: Country) => c.currencycode === 'EUR')).toBe(true)
  })

  it('returns empty array for unknown currency code', () => {
    const res = queryCurrency('ZZZ') as Country[]
    expect(res).toEqual([])
  })

  it('returns only requested fields when fields array is provided', () => {
    const res = queryCurrency('EUR', ['name', 'currencycode']) as Partial<Country>[]
    expect(res[0].currencycode).toBe('EUR')
    expect((res[0] as any).iso).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// queryfuzzy
// ---------------------------------------------------------------------------
describe('CJS build — queryfuzzy()', () => {
  it('fuzzy-matches Chile from a string containing it (Chilena)', () => {
    const res = queryfuzzy('Chilena') as Country[]
    expect(res[0].name).toBe('Chile')
  })

  it('fuzzy-matches France from a sentence', () => {
    const res = queryfuzzy('I live in France') as Country[]
    expect(res.some((c: Country) => c.name === 'France')).toBe(true)
  })

  it('returns results sorted by population descending when multiple match', () => {
    const res = queryfuzzy('I visited China and Chad') as Country[]
    expect(res[0].name).toBe('China')
  })

  it('returns empty array when no country name is found in the string', () => {
    const res = queryfuzzy('no country here xyzxyz') as Country[]
    expect(res).toEqual([])
  })

  it('returns only requested fields when fields array is provided', () => {
    const res = queryfuzzy('Chilena', ['name', 'iso']) as Partial<Country>[]
    expect(res[0]).toEqual({ name: 'Chile', iso: 'CL' })
  })
})

// ---------------------------------------------------------------------------
// Shape / data integrity spot-checks
// ---------------------------------------------------------------------------
describe('CJS build — Country object shape', () => {
  it('Ireland has all expected top-level fields', () => {
    const [ireland] = query('IE') as Country[]
    expect(ireland).toMatchObject({
      iso: 'IE',
      iso3: 'IRL',
      name: 'Ireland',
      capital: 'Dublin',
      continent: 'EU',
      tld: '.ie',
      currencycode: 'EUR',
      currencyname: 'Euro',
    })
  })

  it('Ireland phone field starts with +', () => {
    const [ireland] = query('IE') as Country[]
    expect(ireland.phone).toMatch(/^\+/)
  })

  it('Ireland nationality array contains "Irish"', () => {
    const [ireland] = query('IE') as Country[]
    expect(ireland.nationality).toContain('Irish')
  })

  it('Ireland flag_emoji is the correct flag', () => {
    const [ireland] = query('IE') as Country[]
    expect(ireland.flag_emoji).toBe('🇮🇪')
  })

  it('population is a positive integer', () => {
    const [ireland] = query('IE') as Country[]
    expect(typeof ireland.population).toBe('number')
    expect(ireland.population).toBeGreaterThan(0)
  })
})
