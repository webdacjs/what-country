import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distEsm = resolve(__dirname, '../../dist/esm')

// ---------------------------------------------------------------------------
// Helper — read a built ESM file as a string
// ---------------------------------------------------------------------------
function readDist(filename: string): string {
  const full = resolve(distEsm, filename)
  if (!existsSync(full)) {
    throw new Error(`Built file not found: ${full} — did you run "pnpm build"?`)
  }
  return readFileSync(full, 'utf8')
}

// ---------------------------------------------------------------------------
// Artifact existence
// ---------------------------------------------------------------------------
describe('ESM build — artifact existence', () => {
  it('dist/esm/index.js exists', () => {
    expect(existsSync(resolve(distEsm, 'index.js'))).toBe(true)
  })

  it('dist/esm/utils.js exists', () => {
    expect(existsSync(resolve(distEsm, 'utils.js'))).toBe(true)
  })

  it('dist/esm/types.js exists', () => {
    expect(existsSync(resolve(distEsm, 'types.js'))).toBe(true)
  })

  it('dist/esm/index.d.ts exists', () => {
    expect(existsSync(resolve(distEsm, 'index.d.ts'))).toBe(true)
  })

  it('dist/esm/utils.d.ts exists', () => {
    expect(existsSync(resolve(distEsm, 'utils.d.ts'))).toBe(true)
  })

  it('dist/data/countries.json exists (copy:data step ran)', () => {
    expect(existsSync(resolve(distEsm, '../data/countries.json'))).toBe(true)
  })

  it('dist/data/altcountrynames.json exists (copy:data step ran)', () => {
    expect(existsSync(resolve(distEsm, '../data/altcountrynames.json'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// ESM syntax — index.js uses ES module export statements
// ---------------------------------------------------------------------------
describe('ESM build — index.js uses ES module syntax', () => {
  it('uses ES import statement for utils', () => {
    const src = readDist('index.js')
    expect(src).toMatch(/^import\s+/m)
  })

  it('does not use CommonJS exports object', () => {
    const src = readDist('index.js')
    expect(src).not.toMatch(/exports\.__esModule/)
  })

  it('exports queryCurrency', () => {
    const src = readDist('index.js')
    expect(src).toMatch(/export\s+function\s+queryCurrency/)
  })

  it('exports queryPhone', () => {
    const src = readDist('index.js')
    expect(src).toMatch(/export\s+function\s+queryPhone/)
  })

  it('exports queryCitizenship', () => {
    const src = readDist('index.js')
    expect(src).toMatch(/export\s+function\s+queryCitizenship/)
  })

  it('exports query', () => {
    const src = readDist('index.js')
    expect(src).toMatch(/export\s+function\s+query\b/)
  })

  it('exports queryfuzzy', () => {
    const src = readDist('index.js')
    expect(src).toMatch(/export\s+function\s+queryfuzzy/)
  })

  it('references the data file via the correct relative path', () => {
    const src = readDist('index.js')
    // From dist/esm/, "../data/countries.json" resolves to dist/data/countries.json
    expect(src).toMatch(/require\(["']\.\.\/data\/countries\.json["']\)/)
  })
})

// ---------------------------------------------------------------------------
// ESM syntax — utils.js uses ES module export statements
// ---------------------------------------------------------------------------
describe('ESM build — utils.js uses ES module syntax', () => {
  it('does not use CommonJS exports object', () => {
    const src = readDist('utils.js')
    expect(src).not.toMatch(/exports\.__esModule/)
  })

  it('exports lower', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+lower/)
  })

  it('exports toInt', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+toInt/)
  })

  it('exports dedup', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+dedup/)
  })

  it('exports getFilterField', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+getFilterField/)
  })

  it('exports pickReturnFields', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+pickReturnFields/)
  })

  it('exports getCurrencyField', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+getCurrencyField/)
  })

  it('exports checkDupsAltNames', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/export\s+(const|function)\s+checkDupsAltNames/)
  })

  it('references countries.json via the correct relative path', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/require\(["']\.\.\/data\/countries\.json["']\)/)
  })

  it('references altcountrynames.json via the correct relative path', () => {
    const src = readDist('utils.js')
    expect(src).toMatch(/require\(["']\.\.\/data\/altcountrynames\.json["']\)/)
  })
})

// ---------------------------------------------------------------------------
// Type declarations — index.d.ts declares all public functions
// ---------------------------------------------------------------------------
describe('ESM build — index.d.ts type declarations', () => {
  it('declares queryCurrency', () => {
    const src = readDist('index.d.ts')
    expect(src).toMatch(/export\s+declare\s+function\s+queryCurrency/)
  })

  it('declares queryPhone', () => {
    const src = readDist('index.d.ts')
    expect(src).toMatch(/export\s+declare\s+function\s+queryPhone/)
  })

  it('declares queryCitizenship', () => {
    const src = readDist('index.d.ts')
    expect(src).toMatch(/export\s+declare\s+function\s+queryCitizenship/)
  })

  it('declares query', () => {
    const src = readDist('index.d.ts')
    expect(src).toMatch(/export\s+declare\s+function\s+query\b/)
  })

  it('declares queryfuzzy', () => {
    const src = readDist('index.d.ts')
    expect(src).toMatch(/export\s+declare\s+function\s+queryfuzzy/)
  })
})
