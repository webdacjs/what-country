const pick = require('object.pick')

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

module.exports = {
  getFilterField,
  pickReturnFields,
  getCurrencyField
}
