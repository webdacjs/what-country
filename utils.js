const getFilterField = q => {
  switch (`${q.indexOf('.')}-${q.length}`) {
    case '-1-2':
      return 'iso'
    case '-1-3':
      return 'iso3'
    case '0-3':
      return 'tld'
    default:
      return 'country'
  }
}

module.exports = {
  getFilterField
}
