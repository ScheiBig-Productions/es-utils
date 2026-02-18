/**
 * Provides extensions to build-in `Array` objects - both static (installed on `ArrayConstructor`),
 * as well as instance (installed on `Array.prototype`).
 * @module
 */
/* eslint-disable @typescript-eslint/naming-convention --
 * Simulating paths of utilities
 */
/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
import type { IndexProxy, IntlCollatorProps } from "./Array.extension.declarations.js"

type Map_groupBy = <T, K>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K,
) => Map<K, Array<T>>

const Map_groupBy = "groupBy" in Map && typeof Map.groupBy === "function"
	? Map.groupBy as Map_groupBy
	: function groupBy<T, K>(
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

type Object_groupBy = <T, K extends PropertyKey>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K,
) => Partial<Record<K, Array<T>>>

const Object_groupBy = "groupBy" in Map && typeof Map.groupBy === "function"
	? Map.groupBy as Object_groupBy
	: function groupBy<T, K extends PropertyKey>(
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

/**
 * Namespace groups all members, that will be installed on `Array.prototype` (array instances).
 */
export namespace Array_prototype {

	/**
	 * Returns an iterable of tuples containing the array elements and their
	 * corresponding indices.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be indexed
	 * @returns An iterable providing `[index, element]` pairs.
	 */
	export function indexed<T>(
		this: Array<T>,
	): Iterable<[i: number, v: T]> {

		// Generator approach is necessary, due to limited support of iterator helpers
		return (function* indexedMap(values: ArrayIterator<T>) {
			let i = 0
			for (const v of values) {
				yield [ i++, v ] as const
			}
		})(this.values())
	}

	/**
	 * Removes elements from the array based on a given predicate function.
	 * This modifies the original array by filtering out matching elements.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be filtered
	 * @param predicate Function determining which elements to remove.
	 * @returns The modified array with elements removed.
	 */
	export function removeBy<T>(
		this: Array<T>,
		predicate: (value: T, index: number, array: Array<T>) => boolean,
	): Array<T> {
		for (let i = this.length - 1; i >= 0; i--) {
			if (predicate(this[i], i, this)) {
				this.splice(i, 1)
			}
		}
		return this
	}

	/**
	 * Returns a new shuffled version of the array.
	 * Uses an optional seed for deterministic shuffling.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be shuffled
	 * @param seed Optional seed value for deterministic shuffling (**unused**).
	 * @returns A new shuffled array.
	 */
	export function toShuffled<T>(
		this: Array<T>,
		seed?: string,
	): Array<T> {
	// currently unused, as there is no deterministic pseudo-random generator in vanilla ES
		void seed

		var sh = [ ...this ]
		var rng = (i: number) => Math.floor(Math.random() * (i + 1))
		for (let i = sh.length - 1; i > 0; i--) {
			const j = rng(i)
		;[ sh[i], sh[j] ] = [ sh[j], sh[i] ]
		}
		return sh
	}


	//


	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a numeric value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function minBy<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): T | undefined

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a chronological value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function minBy<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): T | undefined

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a textual value for comparison.
	 * @param config Configuration for `Intl.Collator`
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function minBy<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function minBy<T>(
		this: Array<T>,
		selector: (value: T) => number | string | Date,
		config?: IntlCollatorProps,
	): T | undefined {
		if (this.length === 0) { return undefined }

		const col = new Intl.Collator(config?.locale, config)

		return this.reduce((min, item) => {
			const i = selector(item)
			const m = selector(min)

			if (typeof i === "string" && typeof m === "string") {
				return col.compare(i, m) < 0 ? item : min
			}

			if (i instanceof Date && m instanceof Date) {
				return i.valueOf() < m.valueOf() ? item : min
			}

			return i < m ? item : min
		}, this[0])
	}


	//


	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a numeric value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function maxBy<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): T | undefined

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a chronological value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function maxBy<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): T | undefined

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a textual value for comparison.
	 * @param config Configuration for `Intl.Collator`
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function maxBy<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be searched
	 * @param selector Function returning a value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	export function maxBy<T>(
		this: Array<T>,
		selector: (value: T) => number | string | Date,
		config?: IntlCollatorProps,
	) {
		if (this.length === 0) { return undefined }

		const col = new Intl.Collator(config?.locale, config)

		return this.reduce((max, item) => {
			const i = selector(item)
			const m = selector(max)

			if (typeof i === "string" && typeof m === "string") {
				return col.compare(i, m) > 0 ? item : max
			}

			if (i instanceof Date && m instanceof Date) {
				return i.valueOf() > m.valueOf() ? item : max
			}

			return i > m ? item : max
		}, this[0])
	}


	//


	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a numeric value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	export function ascBy<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): Array<T> | undefined

	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a chronological value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	export function ascBy<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): Array<T> | undefined

	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a textual value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	export function ascBy<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): Array<T> | undefined

	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	export function ascBy<T>(
		this: Array<T>,
		selector: (value: T) => number | string | Date,
		config?: IntlCollatorProps,
	) {
		if (this.length === 0) { return [] }

		const col = new Intl.Collator(config?.locale, config)

		const ordering = (a: T, b: T) => {
			const f = selector(a)
			const s = selector(b)

			if (typeof f === "string" && typeof s === "string") {
				return col.compare(f, s)
			}

			if (f instanceof Date && s instanceof Date) {
				return Math.sign(f.valueOf() - s.valueOf())
			}

			return f < s ? -1 : f > s ? 1 : 0
		}

		if ("toSorted" in this && typeof this.toSorted === "function") {
			return (this.toSorted as typeof this.sort)(ordering)
		}
		const newThis = Array.from(this)
		newThis.sort(ordering)
		return newThis
	}


	//


	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a numeric value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	export function descBy<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): Array<T> | undefined

	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a chronological value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	export function descBy<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): Array<T> | undefined

	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a textual value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	export function descBy<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): Array<T> | undefined

	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be sorted
	 * @param selector Function returning a value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	export function descBy<T>(
		this: Array<T>,
		selector: (value: T) => number | string | Date,
		config?: IntlCollatorProps,
	) {
		if (this.length === 0) { return [] }

		const col = new Intl.Collator(config?.locale, config)

		const ordering = (a: T, b: T) => {
			const f = selector(a)
			const s = selector(b)

			if (typeof f === "string" && typeof s === "string") {
				return -col.compare(f, s)
			}

			if (f instanceof Date && s instanceof Date) {
				return -Math.sign(f.valueOf() - s.valueOf())
			}

			return f < s ? 1 : f > s ? -1 : 0
		}

		if ("toSorted" in this && typeof this.toSorted === "function") {
			return (this.toSorted as typeof this.sort)(ordering)
		}
		const newThis = Array.from(this)
		newThis.sort(ordering)
		return newThis
	}


	//


	/**
	 * Splits the array into two sub-arrays based on a weight function and a limit threshold.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be split
	 * @param limit Maximum sum of weights for the first group.
	 * @param weight Function returning the weight of an element.
	 * @returns A tuple containing two sub-arrays: `[withinLimit, exceedingLimit]`.
	 */
	export function splitBy<T>(
		this: Array<T>,
		limit: number,
		weight: (value: T, index: number, array: Array<T>) => number,
	): [Array<T>, Array<T>] {
		const removed: Array<T> = []
		const rest = [ ...this ]
		let currentWeight = 0

		for (let i = 0; i < this.length; i++) {
			const itemWeight = weight(this[i], i, this)

			if (currentWeight + itemWeight <= limit) {
				removed.push(this[i])
				rest.shift()
				currentWeight += itemWeight
			} else {
				break
			}
		}

		return [ removed, rest ]
	}

	/**
	 * Pads the array with a given value until it reaches the specified length.
	 * Similar to `String.prototype.padEnd`.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be padded
	 * @param targetLength Desired final length of the array.
	 * @param fillValue Value used to pad the array.
	 * @returns A new array with padding applied.
	 */
	export function padEnd<T>(
		this: Array<T>,
		targetLength: number,
		fillValue: T,
	): Array<T> {
		const that = [ ...this ]
		if (that.length < targetLength) {
			that.push(...Array.from({ length: targetLength - that.length }, () => fillValue))
		}
		return that
	}

	/**
	 * Repeats the array `count` times to create a larger array.
	 * Similar to `String.prototype.repeat`.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be repeated
	 * @param count Number of times to repeat the array.
	 * @returns A new array repeated `count` times.
	 */
	export function repeat<T>(
		this: Array<T>,
		count: number,
	): Array<T> {
		if (count < 0) { throw new Error("Repeat count must be non-negative.") }
		return Array.from({ length: count }, () => this)
			.flat()
	}

	/**
	 * Randomly shuffles the array in place.
	 * Uses an optional seed for deterministic shuffling.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be shuffled
	 * @param seed Optional seed value for deterministic shuffling.
	 * @returns The modified array.
	 */
	export function shuffle<T>(
		this: Array<T>,
		seed?: string,
	): Array<T> {
	// currently unused, as there is no deterministic pseudo-random generator in vanilla ES
		void seed

		var rng = (i: number) => Math.floor(Math.random() * (i + 1))
		for (let i = this.length - 1; i > 0; i--) {
			const j = rng(i)
		;[ this[i], this[j] ] = [ this[j], this[i] ]
		}
		return this
	}


	//

	/**
	 * Groups array elements by a specified key or function.
	 * Uses `Object.groupBy` internally, providing substitution if unavailable.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be grouped
	 * @param keySelector Function extracting a key for grouping elements.
	 * @param returnType "Object" (optional) - describes resulting type.
	 * @returns An object with keys mapped to arrays of corresponding elements.
	 */
	export function groupBy<T, K extends keyof T | ((string | number) & {})>(
		this: Array<T>,
		keySelector: (item: T, index: number) => K,
		returnType?: "Object",
	): Partial<Record<K, Array<T>>>

	/**
	 * Groups array elements by a specified key or function.
	 * Uses `Map.groupBy` internally, providing substitution if unavailable.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be grouped
	 * @param keySelector Function extracting a key for grouping elements.
	 * @param returnType "Map" - describes resulting type.
	 * @returns A map with keys mapped to arrays of corresponding elements.
	 */
	export function groupBy<T, K extends keyof T | ((string | number) & {})>(
		this: Array<T>,
		keySelector: (item: T, index: number) => K,
		returnType: "Map",
	): Map<K, Array<T>>

	/**
	 * Groups array elements by a specified key or function.
	 * Uses `Object.groupBy` or `Map.groupBy` internally.
	 *
	 * @template T Type of this array
	 * @this `this` array that should be grouped
	 * @param keySelector Function extracting a key for grouping elements.
	 * @param returnType "Object" or "Map" - describes resulting type. Object by default.
	 * @returns An object or map with keys mapped to arrays of corresponding elements.
	 */
	export function groupBy<T, K extends keyof T | ((string | number) & {})>(
		this: Array<T>,
		keySelector: (item: T, index: number) => K,
		returnType: "Object" | "Map" = "Object",
	) {
		if (returnType === "Object") { return Object_groupBy(this, keySelector) }
		if (returnType === "Map") { return Map_groupBy(this, keySelector) }
		throw TypeError(`Unknown grouping provider: ${String(returnType)}.`)
	}

	/**
	 * Provides unsafe indexing of an array with support for negative indices.
	 *
	 * Works similarly to `Array.at` in regards to index arithmetics,
	 * but it enforces hard bound checks.
	 *
	 * @important
	 * This property is scaffolding for documentation purposes only - it does not work
	 * in any meaningful way.
	 *
	 * @this `this` array that should be indexed
	 * @see {@link Array.at}
	 * @see {@link IndexedMap.$}
	 * @throws When index (positive or negative) exceeds elements of array - `RangeError`
	 */
	export const $: IndexProxy<unknown> = []
}

Array.prototype.indexed ??= Array_prototype.indexed
Array.prototype.removeBy ??= Array_prototype.removeBy
Array.prototype.toShuffled ??= Array_prototype.toShuffled
Array.prototype.minBy ??= Array_prototype.minBy
Array.prototype.maxBy ??= Array_prototype.maxBy
Array.prototype.ascBy ??= Array_prototype.ascBy
Array.prototype.descBy ??= Array_prototype.descBy
Array.prototype.splitBy ??= Array_prototype.splitBy
Array.prototype.padEnd ??= Array_prototype.padEnd
Array.prototype.repeat ??= Array_prototype.repeat
Array.prototype.shuffle ??= Array_prototype.shuffle
Array.prototype.groupBy ??= Array_prototype.groupBy

const Symbol_indexProxy = Symbol("index proxy")
Array.prototype.$ ?? Object.defineProperty(Array.prototype, "$", {
	configurable: true,
	enumerable: false,
	get <T>(this: Array<T> & { [Symbol_indexProxy]?: IndexProxy<T> }): IndexProxy<T> {
		if (!this[Symbol_indexProxy]) {
			const handler: ProxyHandler<Array<T>> = {
				get(target, prop) {
					const index = Number(prop)
					if (Number.isInteger(index)) {
						let i = index
						const len = target.length

						if (i < 0 && i >= -len) {
							i += len
						}
						if (i < 0 || i >= len) {
							throw new RangeError("Index out of range")
						}
						return target[i]
					}
					throw TypeError("Indexer only support array element access")
				},
				set(target, prop, value: T) {
					const index = Number(prop)
					if (Number.isInteger(index)) {
						let i = index
						const len = target.length

						if (i < 0 && i >= -len) {
							i += len
						}
						if (i < 0 || i >= len) {
							throw new RangeError("Index out of range")
						}
						target[i] = value
						return true
					}
					throw TypeError("Indexer only support array element access")
				},
			}
			this[Symbol_indexProxy] = new Proxy(this, handler)
		}
		return this[Symbol_indexProxy]
	},
})

/**
 * Namespace groups all members, that will be installed on `Array` (array constructor).
 */
export namespace Array_constructor {

	/**
	 * Generates an array of numbers from `0` to `end - 1`, similar to Python's `range(end)`.
	 *
	 * @param end The exclusive upper bound of the range.
	 * @returns An array containing numbers `[0, 1, 2, ..., end - 1]`.
	 * @example
	 * Array.range(5); // [0, 1, 2, 3, 4]
	 */
	export function range(end: number): Array<number>

	/**
	 * Generates an array of numbers from `start` to `end - 1`,
	 * similar to Python's `range(start, end)`.
	 *
	 * @param start The inclusive lower bound of the range.
	 * @param end The exclusive upper bound of the range.
	 * @returns An array containing numbers `[start, start+1, ..., end - 1]`.
	 * @example
	 * Array.range(2, 5); // [2, 3, 4]
	 */
	export function range(start: number, end: number): Array<number>

	/**
	 * Generates an array of numbers from `start` to `end - 1`, incrementing by `step`.
	 * Similar to Python's `range(start, end, step)`.
	 *
	 * @param start The inclusive lower bound of the range.
	 * @param end The exclusive upper bound of the range.
	 * @param step The step interval between numbers. Must be positive.
	 * @returns An array containing numbers `[start, start+step, ..., < end]`.
	 * @example
	 * Array.range(0, 10, 2); // [0, 2, 4, 6, 8]
	 */
	export function range(start: number, end: number, step: number): Array<number>

	/**
	 * Generates an array of numbers to `end - 1`, from optional `start`,
	 * incrementing by optional `step`.
	 * Similar to Python's `range()` in parametrization.
	 * @returns An array containing numbers
	 */
	export function range(
		startOrEnd: number,
		maybeEnd?: number,
		maybeStep: number = 1,
	): Array<number> {
		const [ start, end, step ] = maybeEnd === undefined
			? [ 0, startOrEnd, maybeStep ]
			: [ startOrEnd, maybeEnd, maybeStep ]

		if (step <= 0) {
			throw RangeError("Step of range must be positive")
		}

		const result = Array<number>()
		for (let i = start; i < end; i += step) {
			result.push(i)
		}
		return result
	}

	/**
	 * Selects a random option based on weighted probabilities.
	 * Simulates rolling a weighted dice.
	 *
	 * @template T Type of option values
	 * @param options Array of `[option, weight]` pairs.
	 * @returns A randomly selected option, influenced by the weights.
	 * @example
	 * Array.roll(["A", 3], ["B", 1]); // "A" is 3× more likely than "B"
	 */
	export function roll<T>(
		...options: Array<[option: T, weight: number]>
	): T {
		const mass = options.reduce((sum, [ _, w ]) => sum + w, 0)
		const pick = Math.floor(Math.random() * (mass - 1))

		let measure = 0
		for (const [ o, w ] of options) {
			measure += w
			if (pick < measure) { return o }
		}

		throw Error("Unreachable")
	}
}

Array.range ??= Array_constructor.range
Array.roll ??= Array_constructor.roll
