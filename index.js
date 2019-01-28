const countries = require('./data/countries.json')
const {getFilterField} = require('./utils')

const lower = str => String(str.toLowerCase())

const query = q => {
  const fieldFilter = getFilterField(q)
  return countries.filter(x => lower(x[fieldFilter]) === lower(q))
}

module.exports = {
  query
}
