import { Country, QueryResult } from "./types";

// JSON data files - paths relative to compiled output
const altnames = new Map<string, string>(
  require("../data/altcountrynames.json"),
);
const countries: Country[] = require("../data/countries.json");

/**
 * Safely lowercases a string, returning an empty string for null/undefined.
 *
 * @param str - The string to lowercase.
 * @returns Lowercased string, or `""` if the input is null or undefined.
 *
 * @example
 * lower('Ireland')  // 'ireland'
 * lower(null)       // ''
 */
export const lower = (str: string | undefined | null): string =>
  (str ?? "").toLowerCase();

/**
 * Parses a value as an integer, defaulting to `0` for null/undefined.
 *
 * @param str - The value to parse.
 * @returns Parsed integer, or `0` if the input is null or undefined.
 *
 * @example
 * toInt('353')  // 353
 * toInt(null)   // 0
 */
export const toInt = (str: string | number | undefined | null): number =>
  parseInt(String(str ?? 0));

/**
 * Removes duplicate words from a string.
 * Commas are treated as word separators before deduplication.
 * Used to normalise repeated country names in a query (e.g. `"Ireland Ireland"` → `"Ireland"`).
 *
 * @param str - The string to deduplicate.
 * @returns String with duplicate words removed, preserving first-occurrence order.
 *
 * @example
 * dedup('Ireland Ireland')               // 'Ireland'
 * dedup('United States United States')   // 'United States'
 * dedup('foo, foo, bar')                 // 'foo bar'
 */
export const dedup = (str: string): string =>
  Array.from(new Set(str.replace(/,/g, " ").split(" "))).join(" ");

/**
 * Determines which country field to search based on the shape of the query string.
 *
 * | Query pattern             | Returns        |
 * |---------------------------|----------------|
 * | 2 chars, no leading dot   | `"iso"`        |
 * | 3 chars, no leading dot   | `"iso3"`       |
 * | 3 chars, starts with `.`  | `"tld"`        |
 * | Anything else             | `"name"`       |
 *
 * @param q - Lowercased query string.
 * @returns The name of the `Country` field to filter against.
 *
 * @example
 * getFilterField('ie')       // 'iso'
 * getFilterField('irl')      // 'iso3'
 * getFilterField('.ie')      // 'tld'
 * getFilterField('ireland')  // 'name'
 */
export const getFilterField = (q: string): string => {
  switch (`${q.indexOf(".")}-${q.length}`) {
    case "-1-2":
      return "iso";
    case "-1-3":
      return "iso3";
    case "0-3":
      return "tld";
    default:
      return "name";
  }
};

/**
 * Projects an array of countries down to only the requested fields.
 * If no fields are specified the full country objects are returned as-is.
 *
 * @param results - Array of full `Country` objects to project.
 * @param fields  - Optional list of field names to keep. Unrecognised field
 *                  names are silently ignored.
 * @returns Full country objects when `fields` is omitted, otherwise an array
 *          of partial objects containing only the requested fields.
 *
 * @example
 * pickReturnFields(results, ['name', 'iso'])  // [{ name: 'Ireland', iso: 'IE' }, ...]
 * pickReturnFields(results)                   // full Country objects unchanged
 */
export const pickReturnFields = (
  results: Country[],
  fields?: string[],
): QueryResult =>
  !fields
    ? results
    : results.map((country) => {
        return fields.reduce<Partial<Country>>((acc, field) => {
          if (field in country) {
            acc[field as keyof Country] = country[
              field as keyof Country
            ] as never;
          }
          return acc;
        }, {});
      });

/**
 * Determines which currency field to search based on the length of the query.
 * A 3-character query is assumed to be an ISO 4217 currency code; anything
 * longer is treated as a currency name.
 *
 * @param q - Currency query string.
 * @returns `"currencycode"` for 3-character queries, `"currencyname"` otherwise.
 *
 * @example
 * getCurrencyField('EUR')   // 'currencycode'
 * getCurrencyField('Euro')  // 'currencyname'
 */
export const getCurrencyField = (q: string): string =>
  q.length === 3 ? "currencycode" : "currencyname";

/**
 * Looks up a query string in the alternative/localised country names map
 * and returns the matching countries by ISO code.
 * Returns an empty array if the query is not found in the map.
 *
 * @param q - Lowercased query string to look up in the alt-names map.
 * @returns Array of matching `Country` objects, or `[]` if not found.
 */
const testAltNames = (q: string): Country[] =>
  altnames.get(q) ? countries.filter((x) => x.iso === altnames.get(q)) : [];

/**
 * Checks the deduplicated form of a query against the alt-names map.
 * Called as a fallback when the original query yields no alt-name match.
 *
 * @param dedupq  - Already-deduplicated lowercased query string.
 * @param fields  - Optional list of fields to include in each result.
 * @returns Matching countries (optionally projected), or `[]` if none found.
 */
function checkDedupAltNames(dedupq: string, fields?: string[]): QueryResult {
  const filtered = testAltNames(dedupq);
  return filtered.length > 0 ? pickReturnFields(filtered, fields) : [];
}

/**
 * Checks both the original query and its deduplicated form against the
 * alt-names map, trying the original first and falling back to the deduped form.
 *
 * @param lq      - Lowercased original query string.
 * @param dedupq  - Deduplicated form of `lq`.
 * @param fields  - Optional list of fields to include in each result.
 * @returns Matching countries (optionally projected), or `[]` if neither form matches.
 */
function checkAltNames(
  lq: string,
  dedupq: string,
  fields?: string[],
): QueryResult {
  const filtered = testAltNames(lq);
  return filtered.length > 0
    ? pickReturnFields(filtered, fields)
    : checkDedupAltNames(dedupq, fields);
}

/**
 * Fallback resolver used when a direct country lookup returns no results.
 * Applies a three-stage strategy:
 *
 * 1. **Dedup** — strip repeated words from the query (e.g. `"Ireland Ireland"` → `"Ireland"`)
 *    and retry the primary field lookup with the cleaned string.
 * 2. **Alt-name (original)** — check the original query against the localised
 *    names map (e.g. `"Irlanda"`, `"Irland"`, `"Irlande"`).
 * 3. **Alt-name (deduped)** — check the deduplicated query against the same map.
 *
 * @param lq     - Lowercased query string that produced no direct match.
 * @param fields - Optional list of fields to include in each result.
 * @returns Matching countries (optionally projected), or `[]` if all strategies fail.
 *
 * @example
 * checkDupsAltNames('ireland ireland')  // dedup → Ireland
 * checkDupsAltNames('irlanda')          // alt-name → Ireland
 */
export function checkDupsAltNames(lq: string, fields?: string[]): QueryResult {
  const dedupq = dedup(lq);
  const filtered = countries.filter(
    (x) => lower(x[getFilterField(lq)] as string) === dedupq,
  );
  return filtered.length > 0
    ? pickReturnFields(filtered, fields)
    : checkAltNames(lq, dedupq, fields);
}
