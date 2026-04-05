"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCurrency = queryCurrency;
exports.queryPhone = queryPhone;
exports.queryCitizenship = queryCitizenship;
exports.query = query;
exports.queryfuzzy = queryfuzzy;
const utils_1 = require("./utils");
const countries = require("../data/countries.json");
/**
 * Sorts an array of countries by population in descending order.
 * Used internally to rank results when multiple matches are found.
 */
function sortByPopulationDesc(arr) {
    return [...arr].sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
}
/**
 * Finds countries by currency code (e.g. `"EUR"`) or currency name (e.g. `"Euro"`).
 * The distinction is automatic: 3-character queries match against the currency code,
 * longer queries match against the currency name.
 *
 * @param q - Currency code or currency name to search for.
 * @param fields - Optional list of country fields to include in each result.
 *                 If omitted, full country objects are returned.
 * @returns Array of matching countries, optionally projected to the requested fields.
 *
 * @example
 * queryCurrency('EUR')           // all countries using the Euro
 * queryCurrency('Euro', ['name', 'iso'])
 */
function queryCurrency(q, fields) {
    const lq = (0, utils_1.lower)(q);
    const filtered = countries.filter((x) => (0, utils_1.lower)(x[(0, utils_1.getCurrencyField)(q)]) === lq);
    return (0, utils_1.pickReturnFields)(filtered, fields);
}
/**
 * Finds countries by international phone dialling code.
 *
 * @param q - Phone code to search for, with or without a leading `+` (e.g. `"353"` or `353`).
 * @param fields - Optional list of country fields to include in each result.
 *                 If omitted, full country objects are returned.
 * @returns Array of matching countries, optionally projected to the requested fields.
 *
 * @example
 * queryPhone('353')              // Ireland
 * queryPhone('1', ['name', 'iso'])
 */
function queryPhone(q, fields) {
    const intQuery = (0, utils_1.toInt)(q);
    const filtered = countries.filter((x) => (0, utils_1.toInt)(x.phone) === intQuery);
    return (0, utils_1.pickReturnFields)(filtered, fields);
}
/**
 * Finds countries by the demonym (citizenship / nationality adjective),
 * e.g. `"Irish"`, `"French"`, `"Chinese"`.
 * When multiple countries share the same demonym, results are sorted by
 * population descending so the most prominent match comes first.
 *
 * @param q - Demonym to search for (case-insensitive).
 * @param fields - Optional list of country fields to include in each result.
 *                 If omitted, full country objects are returned.
 * @returns Array of matching countries sorted by population descending,
 *          optionally projected to the requested fields.
 *
 * @example
 * queryCitizenship('Irish')      // Ireland
 * queryCitizenship('Dominican')  // Dominican Republic ranked first
 */
function queryCitizenship(q, fields) {
    const lq = (0, utils_1.lower)(q);
    const filtered = countries.filter((x) => x.nationality.map((nat) => (0, utils_1.lower)(nat)).includes(lq));
    const sorted = filtered.length > 0 ? sortByPopulationDesc(filtered) : filtered;
    return (0, utils_1.pickReturnFields)(sorted, fields);
}
/**
 * General-purpose country lookup that automatically detects the query type
 * and searches the appropriate field:
 *
 * | Query pattern        | Field searched |
 * |----------------------|----------------|
 * | 2-letter string      | ISO 3166-1 alpha-2 (`iso`) |
 * | 3-letter string      | ISO 3166-1 alpha-3 (`iso3`) |
 * | Starts with `.`      | Top-level domain (`tld`) |
 * | Anything else        | Country name (`name`) |
 *
 * If no direct match is found, the query is also checked against known
 * alternative and localized country names (e.g. `"Irland"` → Ireland).
 *
 * @param q - Query string: country name, ISO2, ISO3, TLD, or a localized name.
 * @param fields - Optional list of country fields to include in each result.
 *                 If omitted, full country objects are returned.
 * @returns Array of matching countries, optionally projected to the requested fields.
 *
 * @example
 * query('IE')            // ISO2  → Ireland
 * query('IRL')           // ISO3  → Ireland
 * query('.ie')           // TLD   → Ireland
 * query('Ireland')       // name  → Ireland
 * query('Irlanda')       // alt name (Spanish) → Ireland
 */
function query(q, fields) {
    const lq = (0, utils_1.lower)(q);
    const filtered = countries.filter((x) => (0, utils_1.lower)(x[(0, utils_1.getFilterField)(lq)]) === lq);
    return filtered.length > 0
        ? (0, utils_1.pickReturnFields)(filtered, fields)
        : (0, utils_1.checkDupsAltNames)(lq, fields);
}
/**
 * Fuzzy lookup that finds countries whose name appears as a substring
 * of the query string. Useful when the query contains extra words or
 * context around the country name (e.g. `"Chilena"` contains `"Chile"`).
 * When multiple countries match, results are sorted by population descending.
 *
 * @param q - String that may contain a country name somewhere within it.
 * @param fields - Optional list of country fields to include in each result.
 *                 If omitted, full country objects are returned.
 * @returns Array of matching countries sorted by population descending,
 *          optionally projected to the requested fields.
 *
 * @example
 * queryfuzzy('Chilena')          // Chile
 * queryfuzzy('I live in France') // France
 */
function queryfuzzy(q, fields) {
    const lq = (0, utils_1.lower)(q);
    const filtered = countries.filter((x) => lq.includes((0, utils_1.lower)(x.name)));
    const sorted = filtered.length > 0 ? sortByPopulationDesc(filtered) : filtered;
    return (0, utils_1.pickReturnFields)(sorted, fields);
}
