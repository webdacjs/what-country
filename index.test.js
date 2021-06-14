const {
  queryCurrency,
  queryCitizenship,
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

test('Testing query repeated country name', () => {
  const res = query('Ireland Ireland')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query repeated country name with multiple words', () => {
  const res = query('United States United States')
  expect(res[0].iso).toBe('US')
})

test('Testing query repeated country name with multiple spnaish words', () => {
  const res = query('Estados Unidos de América Estados Unidos de América')
  expect(res[0].iso).toBe('US')
})

test('Testing query country in German', () => {
  const res = query('Irland')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query country citizenship', () => {
  const res = queryCitizenship('Irish')
  expect(res[0].name).toBe('Ireland')
})

test('Testing query ambigous country citizenship', () => {
  const res = queryCitizenship('Dominican')
  expect(res[0].name).toBe('Dominican Republic')
})

test('Testing query gibberish citizenship', () => {
  const res = queryCitizenship('asdfasdfasdf')
  expect(res[0]).toBeUndefined()
})

test('Testing query country in French', () => {
  const res = query('Irlande')
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
