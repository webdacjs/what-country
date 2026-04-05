const zlib = require("zlib");
const fs = require("fs");

const jsonCountries = fs.readFileSync("./data/countries.json");
fs.writeFileSync("./countries.json.gz", zlib.gzipSync(jsonCountries));

const jsonAlt = fs.readFileSync("./data/altcountrynames.json");
fs.writeFileSync("./altcountrynames.json.gz", zlib.gzipSync(jsonAlt));
