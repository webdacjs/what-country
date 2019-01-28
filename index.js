const countries = require('./data/countries.json')
const pick = require('object.pick')
const {getFilterField} = require('./utils')

const pickReturnFields = (r, f) => !f ? r : r.map(t => pick(t, f))

const lower = str => String(str.toLowerCase())

const queryCurrency = (q, f) => {
  const fieldFilter = q.length === 3 ? 'currencycode' : 'currencyname'
  return pickReturnFields(countries.filter(x => lower(x[fieldFilter]) === lower(q)), f)
}

const queryPhone = (q, f) => {
  return pickReturnFields(countries.filter(x => parseInt(x.phone) === parseInt(q)), f)
}

const query = (q, f) => {
  const fieldFilter = getFilterField(q)
  return pickReturnFields(countries.filter(x => lower(x[fieldFilter]) === lower(q)), f)
}

module.exports = {
  queryCurrency,
  queryPhone,
  query
}
