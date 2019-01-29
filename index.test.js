const {
  queryCurrency,
  queryPhone,
  query
}= require('./index.js')

test('Testing query country code', () => {
  const res = query('.ie')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query country ISO', () => {
  const res = query('IE')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query country ISO3', () => {
  const res = query('IRL')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query country', () => {
  const res = query('Ireland')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query phone', () => {
  const res = queryPhone('353')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query currency', () => {
  const res = queryCurrency('EUR')
  expect(res.filter(x => x.name === 'Ireland')[0].name).toBe('Ireland')
})
