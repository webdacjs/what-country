const countries = require('./data/countries.json')
const {
  getFilterField,
  getCurrencyField,
  pickReturnFields
} = require('./utils')

const lower = str => String(str.toLowerCase())

const queryCurrency = (q, f) => pickReturnFields(
  countries.filter(x => lower(x[getCurrencyField(q)]) === lower(q)), f)

const queryPhone = (q, f) => pickReturnFields(
  countries.filter(x => parseInt(x.phone) === parseInt(q)), f)

const query = (q, f) => pickReturnFields(
  countries.filter(x => lower(x[getFilterField(q)]) === lower(q)), f)

module.exports = {
  queryCurrency,
  queryPhone,
  query
}
