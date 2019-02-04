# What Country

This module get company information based on the query provided based on different parameters such as name, iso code, tld, currency, phone, etc. The module supports querying the country in multiple languages.

The most basic use is:

```js
> const {query} = require('what-country')
> query('ireland')
[ { iso: 'IE',
    iso3: 'IRL',
    iso_numeric: '372',
    name: 'Ireland',
    capital: 'Dublin',
    continent: 'EU',
    tld: '.ie',
    currencycode: 'EUR',
    currencyname: 'Euro',
    phone: '353' } ]
// or
> query('.ie')
[ { iso: 'IE',
    iso3: 'IRL',
    iso_numeric: '372',
    name: 'Ireland',
    capital: 'Dublin',
    continent: 'EU',
    tld: '.ie',
    currencycode: 'EUR',
    currencyname: 'Euro',
    phone: '353' } ]
```

## Install

You can install with [npm]:

```sh
$ npm install --save what-country
```
## Usage

The module provides a `query` function to get the country information by name, iso code, iso3 code or tld. You can also specific get data by currency using `queryCurrency` or by phone using `queryPhone`.

You can specify the field / fields to get in the reply with an optional second argument:

```js
> queryCurrency('EUR', 'name')
[ { name: 'Andorra' },
  { name: 'Austria' },
  { name: 'Aland Islands' },
  { name: 'Belgium' },
  { name: 'Saint Barthelemy' },
  { name: 'Cyprus' },
  { name: 'Germany' },
  { name: 'Estonia' },
  { name: 'Spain' },
  { name: 'Finland' },
  { name: 'France' },
  { name: 'French Guiana' },
  { name: 'Guadeloupe' },
  { name: 'Greece' },
  { name: 'Ireland' },
  { name: 'Italy' },
  { name: 'Kosovo' },
  { name: 'Lithuania' },
  { name: 'Luxembourg' },
  { name: 'Latvia' },
  { name: 'Monaco' },
  { name: 'Montenegro' },
  { name: 'Saint Martin' },
  { name: 'Martinique' },
  { name: 'Malta' },
  { name: 'Netherlands' },
  { name: 'Saint Pierre and Miquelon' },
  { name: 'Portugal' },
  { name: 'Reunion' },
  { name: 'Slovenia' },
  { name: 'Slovakia' },
  { name: 'San Marino' },
  { name: 'French Southern Territories' },
  { name: 'Vatican' },
  { name: 'Mayotte' } ]
```

You can even get results querying the country using another language:

```js
> const {query} = require('what-country')
// In German
> query('irland')
[ { iso: 'IE',
    iso3: 'IRL',
    iso_numeric: '372',
    name: 'Ireland',
    capital: 'Dublin',
    continent: 'EU',
    tld: '.ie',
    currencycode: 'EUR',
    currencyname: 'Euro',
    phone: '353' } ]

// or in French

// In German
> query('irlande')
[ { iso: 'IE',
    iso3: 'IRL',
    iso_numeric: '372',
    name: 'Ireland',
    capital: 'Dublin',
    continent: 'EU',
    tld: '.ie',
    currencycode: 'EUR',
    currencyname: 'Euro',
    phone: '353' } ]

// Or even Japan in Japanese!!!
> f.query('日本')
[ { iso: 'JP',
    iso3: 'JPN',
    iso_numeric: '392',
    name: 'Japan',
    capital: 'Tokyo',
    continent: 'AS',
    tld: '.jp',
    currencycode: 'JPY',
    currencyname: 'Yen',
    phone: '81' } ]
```

### License

Copyright © 2019, [Juan Convers](https://juanconvers.com).
Released under the [MIT License](LICENSE).
