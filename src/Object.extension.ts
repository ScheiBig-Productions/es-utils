/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/

export { }

interface ElseFn {

	/**
	 * Returns the provided value if it is defined, otherwise returns
	 * the result of the fallback.
	 *
	 * @param val - Value to inspect for `null`.
	 * @param fallbacks - Function to invoke if `val` is `null` or `undefined`,
	 * returning a replacement value.
	 * @returns `val` if defined; otherwise result of `fallback()`.
	 */
	<T, R>(val: T | null | undefined, fallback: () => R): T | R,

	/**
	 * Returns the provided value if it's not `null`, otherwise returns
	 * the result of the fallback.
	 *
	 * @param val - Value to inspect for `null`.
	 * @param fallbacks - Object with function to invoke if `val` is `null`,
	 * returning a replacement value.
	 * @returns `val` if defined; otherwise result of `fallbacks.null()`.
	 */
	<T, R>(val: T | null, fallbacks: {
		null: () => R,
	}): T | R,

	/**
	 * Returns the provided value if it's not `undefined`, otherwise returns
	 * the result of the fallback.
	 *
	 * @param val - Value to inspect for `undefined`.
	 * @param fallbacks - Object with function to invoke if `val` is `undefined`,
	 * returning a replacement value.
	 * @returns `val` if defined; otherwise result of `fallbacks.undef()`.
	 */
	<T, R>(val: T | undefined, fallbacks: {
		undef: () => R,
	}): T | R,

	/**
	 * Returns the provided value if it is defined, otherwise returns
	 * the result of the fallback.
	 *
	 * @param val - Value to inspect for `null`.
	 * @param fallbacks - Object with functions to invoke if `val` is `null` or `undefined`,
	 * returning a replacement value.
	 * @returns `val` if defined; result of `fallbacks.null()` if `val` is `null`,
	 * result of `fallbacks.undef()` otherwise.
	 */
	<T, R, S>(val: T | null | undefined, fallbacks: {
		null: () => R,
		undef: () => S,
	}): T | R| S,
}

declare global {
	interface ObjectConstructor {

		/**
		 * Removes specified keys from the object, returning a new object without them.
		 * Runtime equivalent of `Omit<Type, Keys>`.
		 *
		 * @param obj - Source object to omit keys from.
		 * @param keys - Keys to exclude.
		 * @returns A new object with selected keys removed.
		 */
		omit: <T extends Record<string, unknown>, K extends keyof T>(
			obj: T,
			...keys: Array<K>
		) => Omit<T, K>,

		/**
		 * Returns the same object, but with specified keys marked optional.
		 * Runtime equivalent of `Partial<Pick<T, K>> & Omit<T, K>`.
		 *
		 * @param obj - Source object.
		 * @param keys - Keys to mark optional.
		 * @returns The object with relaxed type constraints on provided keys.
		 */
		partial: <T extends Record<string, unknown>, K extends keyof T>(
			obj: T,
			...keys: Array<K>
		) => Omit<T, K> & Partial<Pick<T, K>>,

		/**
		 * Picks only the specified keys from the object, returning a new one.
		 * Runtime equivalent of `Pick<Type, Keys>`.
		 *
		 * @param obj - Source object to pick from.
		 * @param keys - Keys to include.
		 * @returns A new object with only the selected keys.
		 */
		pick: <T extends Record<string, unknown>, K extends keyof T>(
			obj: T,
			...keys: Array<K>
		) => Pick<T, K>,

		/**
		 * Ensures value is defined.
		 * Runtime equivalent of `NonNullable<Type>`.
		 *
		 * @param value - Value to verify.
		 * @returns The same value if not null or undefined.
		 * @throws TypeError if value is nullish.
		 */
		require: <T>(value: T | null | undefined) => T,

		else: ElseFn,
	}
}

Object.omit ??= function omit<T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	...keys: Array<K>
): Omit<T, K> {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(
				([ key ]) => !keys.includes(key as K),
			),
	) as Omit<T, K>
}

Object.partial ??= function partial<T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	..._keys: Array<K>
) {
	return obj as Omit<T, K> & Partial<Pick<T, K>>
}

Object.pick ??= function pick<
	T extends Record<string, unknown>,
	K extends keyof T,
>(
	obj: T,
	...keys: Array<K>
): Pick<T, K> {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(
				([ key ]) => keys.includes(key as K),
			),
	) as Pick<T, K>
}

Object.require ??= function require<T>(value: T | null | undefined): T {
	if (value === null || value === undefined) {
		throw TypeError("Value cannot be null or undefined")
	}
	return value
}

/* eslint-disable-next-line @typescript-eslint/unbound-method --
 * This function assignment intentionally mirrors native prototype methods,
 * which are unbound by design (e.g. `[].map`, `[].find`, etc.).
 * Consumers should call via array instance to preserve `this` context:
 * e.g. `array.with(...)`, not `const fn = array.with; fn(...)`
 */
Object.else ??= {
	else<T, R, S>(
		val: T | null | undefined,
		fallback: R | (() => R) | {
			null?: () => R,
			undef?: () => S,
		},
	) {
		// First overload
		if (typeof fallback === "function") {
			const orElse = fallback as () => R
			return val ?? orElse()
		}

		// Guard against invalid fallback object
		if (typeof fallback !== "object" || fallback === null) {
			throw TypeError("Invalid overload: missing fallbacks.")
		}

		const ifNull = "null" in fallback ? fallback.null : () => null
		const ifUndef = "undef" in fallback ? fallback.undef : () => undefined

		if (val === null) { return ifNull() }
		if (val === undefined) { return ifUndef() }

		return val
	},
}.else
