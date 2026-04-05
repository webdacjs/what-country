import { describe, it, expect } from 'vitest'
import { query, queryCitizenship, queryPhone, queryCurrency, queryfuzzy } from './index'
import type { Country } from './types'

describe('query by TLD / ISO / ISO3 / name', () => {
  it('resolves country by TLD (.ie)', () => {
    const res = query('.ie') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves country by ISO2 (IE)', () => {
    const res = query('IE') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves country by ISO3 (IRL)', () => {
    const res = query('IRL') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves country by full name (Ireland)', () => {
    const res = query('Ireland') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves country with multi-word name (North Macedonia)', () => {
    const res = query('North Macedonia') as Country[]
    expect(res[0].name).toBe('North Macedonia')
  })
})

describe('query with deduplicated / repeated names', () => {
  it('handles repeated single-word country name', () => {
    const res = query('Ireland Ireland') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('handles repeated multi-word country name (United States)', () => {
    const res = query('United States United States') as Country[]
    expect(res[0].iso).toBe('US')
  })

  it('handles repeated multi-word Spanish country name', () => {
    const res = query('Estados Unidos de América Estados Unidos de América') as Country[]
    expect(res[0].iso).toBe('US')
  })
})

describe('query by alt name (localized)', () => {
  it('resolves Ireland by German name (Irland)', () => {
    const res = query('Irland') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves Ireland by Spanish name (Irlanda)', () => {
    const res = query('Irlanda') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves Ireland by French name (Irlande)', () => {
    const res = query('Irlande') as Country[]
    expect(res[0].name).toBe('Ireland')
  })
})

describe('queryCitizenship', () => {
  it('resolves Ireland by citizenship (Irish)', () => {
    const res = queryCitizenship('Irish') as Country[]
    expect(res[0].name).toBe('Ireland')
  })

  it('resolves Dominican Republic for ambiguous citizenship (Dominican)', () => {
    const res = queryCitizenship('Dominican') as Country[]
    expect(res[0].name).toBe('Dominican Republic')
  })

  it('resolves China for ambiguous citizenship (Chinese)', () => {
    const res = queryCitizenship('Chinese') as Country[]
    expect(res[0].name).toBe('China')
  })

  it('returns empty for gibberish citizenship', () => {
    const res = queryCitizenship('asdfasdfasdf') as Country[]
    expect(res[0]).toBeUndefined()
  })
})

describe('queryfuzzy', () => {
  it('fuzzy-matches Chile from partial string (Chilena)', () => {
    const res = queryfuzzy('Chilena') as Country[]
    expect(res[0].name).toBe('Chile')
  })
})

describe('queryPhone', () => {
  it('resolves Ireland by phone code (353)', () => {
    const res = queryPhone('353') as Country[]
    expect(res[0].name).toBe('Ireland')
  })
})

describe('queryCurrency', () => {
  it('resolves Ireland by currency code (EUR)', () => {
    const res = queryCurrency('EUR') as Country[]
    expect(res.filter(x => x.name === 'Ireland')[0].name).toBe('Ireland')
  })
})
