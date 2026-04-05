import { Country, QueryResult } from "./types";
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
export declare const lower: (str: string | undefined | null) => string;
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
export declare const toInt: (str: string | number | undefined | null) => number;
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
export declare const dedup: (str: string) => string;
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
export declare const getFilterField: (q: string) => string;
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
export declare const pickReturnFields: (results: Country[], fields?: string[]) => QueryResult;
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
export declare const getCurrencyField: (q: string) => string;
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
export declare function checkDupsAltNames(lq: string, fields?: string[]): QueryResult;
