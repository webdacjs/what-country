const countries = require('./data/countries.json')
const soa = require('sort-objects-array')
const filter = require('lodash.filter')
const {
  lower,
  toInt,
  getFilterField,
  getCurrencyField,
  pickReturnFields,
  checkDupsAltNames
} = require('./utils')

function queryCurrency (q, f) {
  const lq = lower(q)
  const filtered = filter(countries, (x => lower(x[getCurrencyField(q)]) === lq))
  return pickReturnFields(filtered, f)
}

function queryPhone (q, f) {
  const intQuery = toInt(q)
  const filtered = filter(countries, x => toInt(x.phone) === intQuery)
  return pickReturnFields(filtered, f)
}

function queryCitizenship (q, f) {
  const lq = lower(q)
  const filtered = filter(countries, (x => x.nationality.map(nat => lower(nat)).includes(lq)))
  const sorted = filtered.length > 0 ? soa(filtered, 'population', 'desc') : filtered
  return pickReturnFields(sorted, f)
}

function query (q, f) {
  const lq = lower(q)
  const filtered = filter(countries, (x => lower(x[getFilterField(lq)]) === lq))
  return filtered.length > 0 ? pickReturnFields(filtered, f) : checkDupsAltNames(lq, f)
}

function queryfuzzy (q, f) {
  const lq = lower(q)
  const filtered = filter(countries, (x => lq.includes(lower(x.name)))) 
  const sorted = filtered.length > 0 ? soa(filtered, 'population', 'desc') : filtered
  return pickReturnFields(sorted, f)
}

module.exports = {
  queryCurrency,
  queryPhone,
  queryCitizenship,
  query,
  queryfuzzy
}
