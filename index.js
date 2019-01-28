const countries = require('./data/countries.json')
const {getFilterField} = require('./utils')

const lower = str => String(str.toLowerCase())

const queryCurrency = q => {
  const fieldFilter = q.length === 3 ? 'CurrencyCode' : 'CurrencyName'
  return countries.filter(x => lower(x[fieldFilter]) === lower(q))
}

const queryPhone = q => {
  return countries.filter(x => parseInt(x.Phone) === parseInt(q))
}

const query = q => {
  const fieldFilter = getFilterField(q)
  return countries.filter(x => lower(x[fieldFilter]) === lower(q))
}

module.exports = {
  queryCurrency,
  queryPhone,
  query
}
