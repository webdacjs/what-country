const getFilterField = q => {
  switch (`${q.indexOf('.')}-${q.length}`) {
    case '-1-2':
      return 'ISO'
    case '-1-3':
      return 'ISO3'
    case '0-3':
      return 'tld'
    default:
      return 'Country'
  }
}

module.exports = {
  getFilterField
}
