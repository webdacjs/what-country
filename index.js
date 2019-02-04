const countries = require('./data/countries.json')
const {
  getFilterField,
  getCurrencyField,
  pickReturnFields,
  checkAltNames
} = require('./utils')

const lower = str => String(str.toLowerCase())

const queryCurrency = (q, f) => pickReturnFields(
  countries.filter(x => lower(x[getCurrencyField(q)]) === lower(q)), f)

const queryPhone = (q, f) => pickReturnFields(
  countries.filter(x => parseInt(x.phone) === parseInt(q)), f)

const query = (q, f) => pickReturnFields(checkAltNames(
  countries.filter(x => lower(x[getFilterField(q)]) === lower(q)), q), f)

module.exports = {
  queryCurrency,
  queryPhone,
  query
}
