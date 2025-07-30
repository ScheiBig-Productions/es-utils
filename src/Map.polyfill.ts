/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */
export {}

declare global {
	interface MapConstructor {

		/**
		 * Groups array items by a key derived from each element.
		 * Returns a Map preserving insertion order and key types.
		 *
		 * @param items - Array-like input to group.
		 * @param keySelector - Function selecting a key for each item.
		 * @returns A Map with grouped arrays keyed by selected values.
		 */
		groupBy: <T, K>(
			items: ArrayLike<T>,
			keySelector: (item: T, index: number) => K
		) => Map<K, Array<T>>,
	}
}

Map.groupBy ??= function groupBy<T, K>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K,
): Map<K, Array<T>> {
	const result = new Map<K, Array<T>>()
	for (let i = 0; i < items.length; i++) {
		const key = keySelector(items[i], i)
		if (!result.has(key)) {
			result.set(key, [])
		}
		result.get(key)
			?.push(items[i])
	}
	return result
}
