/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
export { }

type IntlCollatorProps = {
	locale?: string,
} & Intl.CollatorOptions

interface GroupByFn {

	/**
	 * Groups array elements by a specified key or function.
	 * Uses `Object.groupBy` internally.
	 *
	 * @param keySelector - Function extracting a key for grouping elements.
	 * @param returnType - "Object" (optional) - describes resulting type.
	 * @returns An object or map with keys mapped to arrays of corresponding elements.
	 */
	<T, K extends keyof T | ((string | number) & {})>(
		this: Array<T>,
		keySelector: (item: T, index: number) => K,
		returnType?: "Object",
	): Partial<Record<K, Array<T>>>,

	/**
	 * Groups array elements by a specified key or function.
	 * Uses `Map.groupBy` internally.
	 *
	 * @param keySelector - Function extracting a key for grouping elements.
	 * @param returnType - "Map" - describes resulting type.
	 * @returns An object or map with keys mapped to arrays of corresponding elements.
	 */
	<T, K extends keyof T | ((string | number) & {})>(
		this: Array<T>,
		keySelector: (item: T, index: number) => K,
		returnType: "Map",
	): Map<K, Array<T>>,
}

interface MinByFn {

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * @param selector - Function returning a numeric value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): T | undefined,

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a chronological value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): T | undefined,

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a textual value for comparison.
	 * @param config - Configuration for `Intl.Collator`
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined,
}

interface MaxByFn {

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * @param selector - Function returning a numeric value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): T | undefined,

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a chronological value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): T | undefined,

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the array is empty.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a textual value for comparison.
	 * @param config - Configuration for `Intl.Collator`
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this array is empty.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined,
}

interface AscByFn {

	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * @param selector - Function returning a numeric value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): T | undefined,

	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a chronological value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): T | undefined,

	/**
	 * Sorts the array in ascending order based on a given selector function.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a textual value for comparison.
	 * @returns A new array sorted in ascending order.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined,
}

interface DescByFn {

	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * @param selector - Function returning a numeric value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => number,
	): T | undefined,

	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a chronological value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => Date,
	): T | undefined,

	/**
	 * Sorts the array in descending order based on a given selector function.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a textual value for comparison.
	 * @returns A new array sorted in descending order.
	 */
	<T>(
		this: Array<T>,
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined,
}

declare global {
	interface Array<T> {

		/**
		 * Returns an iterable of tuples containing the array elements and their
		 * corresponding indices.
		 *
		 * @returns An iterable providing `[index, element]` pairs.
		 */
		indexed: (this: Array<T>) => Iterable<[i: number, v: T]>,

		/**
		 * Removes elements from the array based on a given predicate function.
		 * This modifies the original array by filtering out matching elements.
		 *
		 * @param predicate - Function determining which elements to remove.
		 * @returns The modified array with elements removed.
		 */
		removeBy: (
			this: Array<T>,
			predicate: (value: T, index: number, array: Array<T>) => boolean,
		) => Array<T>,

		/**
		 * Returns a new shuffled version of the array.
		 * Uses an optional seed for deterministic shuffling.
		 *
		 * @param seed - Optional seed value for deterministic shuffling.
		 * @returns A new shuffled array.
		 */
		toShuffled: (
			this: Array<T>,
			seed?: string
		) => Array<T>,

		minBy: MinByFn,

		maxBy: MaxByFn,

		ascBy: AscByFn,

		descBy: DescByFn,

		/**
		 * Splits the array into two sub-arrays based on a weight function and a limit threshold.
		 *
		 * @param limit - Maximum sum of weights for the first group.
		 * @param weight - Function returning the weight of an element.
		 * @returns A tuple containing two sub-arrays: `[withinLimit, exceedingLimit]`.
		 */
		splitBy: (
			this: Array<T>,
			limit: number,
			weight: (value: T, index: number, array: Array<T>) => number,
		) => [Array<T>, Array<T>],

		/**
		 * Pads the array with a given value until it reaches the specified length.
		 * Similar to `String.prototype.padEnd`.
		 *
		 * @param maxLength - Desired final length of the array.
		 * @param fillValue - Value used to pad the array.
		 * @returns A new array with padding applied.
		 */
		padEnd: (
			this: Array<T>,
			maxLength: number,
			fillValue: T
		) => Array<T>,

		/**
		 * Repeats the array `count` times to create a larger array.
		 * Similar to `String.prototype.repeat`.
		 *
		 * @param count - Number of times to repeat the array.
		 * @returns A new array repeated `count` times.
		 */
		repeat: (
			this: Array<T>,
			count: number,
		) => Array<T>,

		/**
		 * Randomly shuffles the array in place.
		 * Uses an optional seed for deterministic shuffling.
		 *
		 * @param seed - Optional seed value for deterministic shuffling.
		 * @returns The modified array.
		 */
		shuffle: (
			this: Array<T>,
			seed?: string,
		) => this,

		groupBy: GroupByFn,
	}
}

Array.prototype.indexed ??= function indexed<T>(this: Array<T>) {

	// Generator approach is necessary, due to limited support of iterator helpers
	return (function* indexedMap(values: ArrayIterator<T>) {
		let i = 0
		for (const v of values) {
			yield [ i++, v ] as const
		}
	})(this.values())
}

Array.prototype.removeBy ??= function removeBy<T>(
	this: Array<T>,
	predicate: (value: T, index: number, array: Array<T>) => boolean,
) {
	for (let i = this.length - 1; i >= 0; i--) {
		if (predicate(this[i], i, this)) {
			this.splice(i, 1)
		}
	}
	return this
}

Array.prototype.toShuffled ??= function toShuffled<T>(
	this: Array<T>,
	seed?: string,
) {
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

Array.prototype.minBy ??= function minBy<T>(
	this: Array<T>,
	selector: (value: T) => number | string | Date,
	config?: IntlCollatorProps,
) {
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

Array.prototype.maxBy ??= function maxBy<T>(
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

Array.prototype.ascBy ??= function ascBy<T>(
	this: Array<T>,
	selector: (value: T) => number | string | Date,
	config?: IntlCollatorProps,
) {
	if (this.length === 0) { return [] }

	const col = new Intl.Collator(config?.locale, config)

	return this.toSorted((a, b) => {
		const f = selector(b)
		const s = selector(a)

		if (typeof f === "string" && typeof s === "string") {
			return col.compare(f, s)
		}

		if (f instanceof Date && s instanceof Date) {
			return Math.sign(f.valueOf() - s.valueOf())
		}

		return f < s ? -1 : f > s ? 1 : 0
	})
}

Array.prototype.descBy ??= function descBy<T>(
	this: Array<T>,
	selector: (value: T) => number | string | Date,
	config?: IntlCollatorProps,
) {
	if (this.length === 0) { return [] }

	const col = new Intl.Collator(config?.locale, config)

	return this.toSorted((a, b) => {
		const f = selector(b)
		const s = selector(a)

		if (typeof f === "string" && typeof s === "string") {
			return -col.compare(f, s)
		}

		if (f instanceof Date && s instanceof Date) {
			return -Math.sign(f.valueOf() - s.valueOf())
		}

		return f > s ? -1 : f < s ? 1 : 0
	})
}

Array.prototype.splitBy ??= function splitBy<T>(
	this: Array<T>,
	limit: number,
	weight: (value: T, index: number, array: Array<T>) => number,
) {
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

Array.prototype.padEnd ??= function padEnd<T>(
	this: Array<T>,
	targetLength: number,
	fillValue: T,
) {
	if (this.length < targetLength) {
		this.push(...Array.from({ length: targetLength - this.length }, () => fillValue))
	}
	return this
}

Array.prototype.repeat ??= function repeat<T>(
	this: Array<T>,
	count: number,
) {
	if (count < 0) { throw new Error("Repeat count must be non-negative.") }
	return Array.from({ length: count }, () => this)
		.flat()
}

Array.prototype.shuffle ??= function shuffle<T>(
	this: Array<T>,
	seed?: string,
) {
	// currently unused, as there is no deterministic pseudo-random generator in vanilla ES
	void seed

	var rng = (i: number) => Math.floor(Math.random() * (i + 1))
	for (let i = this.length - 1; i > 0; i--) {
		const j = rng(i)
		;[ this[i], this[j] ] = [ this[j], this[i] ]
	}
	return this
}

Array.prototype.groupBy ??= function groupBy<T, K extends keyof T | ((string | number) & {})>(
	this: Array<T>,
	keySelector: (item: T, index: number) => K,
	returnType: "Object" | "Map" = "Object",
) {
	return returnType === "Object"
		? Object.groupBy(this, keySelector)
		: Map.groupBy(this, keySelector)
} as GroupByFn

interface RangeFn {

	/**
	 * Generates an array of numbers from `0` to `end - 1`, similar to Python's `range()`.
	 *
	 * @param end - The exclusive upper bound of the range.
	 * @returns An array containing numbers `[0, 1, 2, ..., end - 1]`.
	 * @example
	 * Array.range(5); // [0, 1, 2, 3, 4]
	 */
	(end: number): Array<number>,

	/**
	 * Generates an array of numbers from `start` to `end - 1`, similar to Python's `range()`.
	 *
	 * @param start - The inclusive lower bound of the range.
	 * @param end - The exclusive upper bound of the range.
	 * @returns An array containing numbers `[start, start+1, ..., end - 1]`.
	 * @example
	 * Array.range(2, 5); // [2, 3, 4]
	 */
	(start: number, end: number): Array<number>,

	/**
	 * Generates an array of numbers from `start` to `end - 1`, incrementing by `step`.
	 * Similar to Python's `range(start, end, step)`.
	 *
	 * @param start - The inclusive lower bound of the range.
	 * @param end - The exclusive upper bound of the range.
	 * @param step - The step interval between numbers.
	 * @returns An array containing numbers `[start, start+step, ..., < end]`.
	 * @example
	 * Array.range(0, 10, 2); // [0, 2, 4, 6, 8]
	 */
	(start: number, end: number, step: number): Array<number>,
}


declare global {
	interface ArrayConstructor {

		range: RangeFn,

		/**
		 * Selects a random option based on weighted probabilities.
		 * Simulates rolling a weighted dice.
		 * @param options - Array of `[option, weight]` pairs.
		 * @returns A randomly selected option, influenced by the weights.
		 * @example
		 * Array.roll(["A", 3], ["B", 1]); // "A" is 3× more likely than "B"
		 */
		roll: <T>(...options: Array<[option: T, weight: number]>) => T,
	}
}

Array.range ??= function range(
	startOrEnd: number,
	maybeEnd?: number,
	maybeStep: number = 1,
) {
	const [ start, end, step ] = maybeEnd === undefined
		? [ 0, startOrEnd, maybeStep ]
		: [ startOrEnd, maybeEnd, maybeStep ]

	const result = Array<number>()
	for (let i = start; i < end; i += step) {
		result.push(i)
	}
	return result
}

Array.roll ??= function roll<T>(
	...options: Array<[option: T, weight: number]>
) {
	const mass = options.reduce((sum, [ _, w ]) => sum + w, 0)
	const pick = Math.floor(Math.random() * (mass - 1))

	let measure = 0
	for (const [ o, w ] of options) {
		measure += w
		if (pick < measure) { return o }
	}

	throw Error("Unreachable")
}
