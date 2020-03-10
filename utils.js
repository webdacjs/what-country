const pick = require('object.pick')
const filter = require('lodash.filter')
const altnames = new Map(require('./data/altcountrynames.json'))
const countries = require('./data/countries.json')

const lower = str => (str || '').toLowerCase()

const toInt = str => parseInt(str || 0)

const dedup = str => Array.from(
  new Set(str.replace(/,/g, ' ').split(' '))).join(' ')

const getFilterField = q => {
  switch (`${q.indexOf('.')}-${q.length}`) {
    case '-1-2':
      return 'iso'
    case '-1-3':
      return 'iso3'
    case '0-3':
      return 'tld'
    default:
      return 'name'
  }
}

const pickReturnFields = (r, f) => !f ? r : r.map(t => pick(t, f))

const getCurrencyField = q => q.length === 3 ? 'currencycode' : 'currencyname'

const testAltNames = q => altnames.get(q)
  ? filter(countries, x => x.iso === altnames.get(q))
  : []

function checkDedupAltNames (dedupq, f) {
  const filtered = testAltNames(dedupq)
  return filtered.length > 0 ? pickReturnFields(filtered, f) : []
}

function checkAltNames(lq, dedupq, f) {
  const filtered = testAltNames(lq)
  return filtered.length > 0 ? pickReturnFields(filtered, f) : checkDedupAltNames(dedupq, f)
}

function checkDupsAltNames (lq, f) {
  const dedupq = dedup(lq)
  const filtered = filter(countries, (x => lower(x[getFilterField(lq)]) === dedupq))
  return filtered.length > 0 ? pickReturnFields(filtered, f) : checkAltNames(lq, dedupq, f)
}

module.exports = {
  lower,
  toInt,
  getFilterField,
  pickReturnFields,
  getCurrencyField,
  checkDupsAltNames
}
