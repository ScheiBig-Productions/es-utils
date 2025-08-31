/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */
/* eslint-disable @typescript-eslint/no-explicit-any --
 * Following original API.
 */

export { }

type Replacer =
	| ((this: any, key: string, value: any) => any)
	| Array<number | string>
	| null

declare global {
	interface JSON {

		/**
		 * Attempts conversion of a JavaScript value to a JavaScript Object Notation (JSON) string.
		 *
		 * Fail gracefully, with fallback to `String(value)`.
		 * @param value A value to be converted.
		 * @param replacer Either function that transforms the results,
		 * array of whitelisted property keys, or `null` for no transformation.
		 * @param space Number of spaces or indentation character - when passed,
		 * the result is pretty-printed.
		 */
		maybeStringify: (value: unknown, replacer?: Replacer, space?: string | number) => string,
	}
}

JSON.maybeStringify ??= function maybeStringify(
	value: unknown,
	replacer?: Replacer,
	space?: string | number,
): string {
	try {
		/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
		 * Unsafe cast to silence overload usage.
		 */
		return JSON.stringify(value, replacer as any, space)
	} catch {
		return String(value)
	}
}
