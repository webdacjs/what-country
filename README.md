# What Country

Gives many countries datas.

## Install

You can install with [npm]:

```sh
$ npm install --save what-country
```
## Usage

You can do anything. Anything is possible. ANYTHING.

```js
> require('what-country').countries.filter(item => item.currencycode === 'EUR').map(item => item.name)
['Andorra',
 'Austria',
 'Aland Islands',
 'Belgium',
 'Saint Barthelemy',
 'Cyprus',
 'Germany',
 'Estonia',
 'Spain',
 'Finland',
 'France',
 'French Guiana',
 'Guadeloupe',
 'Greece',
 'Ireland',
 'Italy',
 'Kosovo',
 'Lithuania',
 'Luxembourg',
 'Latvia',
 'Monaco',
 'Montenegro',
 'Saint Martin',
 'Martinique',
 'Malta',
 'Netherlands',
 'Saint Pierre and Miquelon',
 'Portugal',
 'Reunion',
 'Slovenia',
 'Slovakia',
 'San Marino',
 'French Southern Territories',
 'Vatican',
 'Brazil']
```

You can even get results querying the country using another language:

```js
// In German
> require('what-country').countries.filter(country => [country.name, ...country.altNames].indexOf('irland'))
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

> require('what-country').countries.filter(country => [country.name, ...country.altNames].indexOf('irlande'))
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
> require('what-country').countries.filter(country => [country.name, ...country.altNames].indexOf('日本'))
[ { iso: 'JP',
    iso3: 'JPN',
    iso_numeric: '392',
    name: 'Japan',
    capital: 'Tokyo',
    mascot: 'Godzilla',
    continent: 'AS',
    tld: '.jp',
    currencycode: 'JPY',
    currencyname: 'Yen',
    phone: '81' } ]
```

### License

Copyright © 2019, [Juan Convers](https://juanconvers.com).
Released under the [MIT License](LICENSE).
