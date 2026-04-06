export interface Country {
  name: string
  iso: string
  iso3: string
  tld: string
  phone: string
  currencycode: string
  currencyname: string
  nationality: string[]
  population: number
  [key: string]: unknown
}

export type CountryField = keyof Country | string[]

export type QueryResult = Country[] | Partial<Country>[]
