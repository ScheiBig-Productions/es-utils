/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */
export {}

declare global {
	interface ObjectConstructor {

		/**
		 * Groups array items by a key derived from each element.
		 * Returns an object mapping keys to arrays of grouped items.
		 *
		 * @param items - Array-like input to group.
		 * @param keySelector - Function selecting a key for each item.
		 * @returns An object with grouped arrays keyed by selected values.
		 */
		groupBy: <T, K extends PropertyKey>(
			items: ArrayLike<T>,
			keySelector: (item: T, index: number) => K
		) => Partial<Record<K, Array<T>>>,
	}
}

Object.groupBy ??= function groupBy<T, K extends PropertyKey>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K,
): Partial<Record<K, Array<T>>> {
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment --
	 * No other away to please type-checker
	 */
	const result: Partial<Record<K, Array<T>>> = Object.create(null)
	for (let i = 0; i < items.length; i++) {
		const key = keySelector(items[i], i)
			; (result[key] ??= []).push(items[i])
	}
	return result
}
