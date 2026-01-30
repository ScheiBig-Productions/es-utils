/* eslint-disable complexity --
 * Not making helper function for fairly simple functions.
 */

import { Object_tag } from "./common/object-tag.js"

/* eslint-disable @typescript-eslint/no-non-null-assertion --
 * Known as defined at this point.
 */
type IntlCollatorProps = {
	locale?: string,
} & Intl.CollatorOptions

/**
 * Custom implementation of tc39/ecma262 Iterator helper.
 *
 * Iter holds non-frozen reference of used Iterable, so it can be reused multiple times,
 * although it is not recommended.
 */
export class Iter<T> implements Iterable<T> {

	/**
	 * Generates an iterator of numbers from `0` to `end - 1`, similar to Python's `range()`.
	 *
	 * @param end - The exclusive upper bound of the range.
	 * @returns An iterator containing numbers `[0, 1, 2, ..., end - 1]`.
	 */
	static range(end: number): Iter<number>

	/**
	 * Generates an iterator of numbers from `start` to `end - 1`, similar to Python's `range()`.
	 *
	 * @param start - The inclusive lower bound of the range.
	 * @param end - The exclusive upper bound of the range.
	 * @returns An iterator containing numbers `[start, start+1, ..., end - 1]`.
	 */
	static range(start: number, end: number): Iter<number>

	/**
	 * Generates an iterator of numbers from `start` to `end - 1`, incrementing by `step`.
	 * Similar to Python's `range(start, end, step)`.
	 *
	 * @param start - The inclusive lower bound of the range.
	 * @param end - The exclusive upper bound of the range.
	 * @param step - The step interval between numbers. Must be positive.
	 * @returns An array containing numbers `[start, start+step, ..., < end]`.
	 */
	static range(start: number, end: number, step: number): Iter<number>

	static range(
		startOrEnd: number,
		maybeEnd?: number,
		maybeStep: number = 1,
	): Iter<number> {
		const [ start, end, step ] = maybeEnd === undefined
			? [ 0, startOrEnd, maybeStep ]
			: [ startOrEnd, maybeEnd, maybeStep ]

		if (step <= 0) {
			throw RangeError("Step of range must be positive")
		}

		return new Iter<number>((function* rangeImpl() {
			for (let i = start; i < end; i += step) {
				yield i
			}
		})())
	}

	/**
	 * Returns `Iter` of given source.
	 *
	 * If source is {@link Iterable}, it returns `Iter` that can theoretically be reused,
	 * as it will supply new {@link Iterator} on each chain from `Iter`.
	 *
	 * If source is {@link Iterator}, it returns `Iter` that is single-usage,
	 * as it wil consume entire iterator passed in source.
	 *
	 * @param source - {@link Iterable} or {@link Iterator} to wrap with `Iter`
	 * @returns new `Iter` wrapping `source`
	 */
	static of<T>(source: Iterable<T> | Iterator<T>): Iter<T> {
		if (Symbol.iterator in source) {
			return new Iter(source)
		}
		return new Iter({ [Symbol.iterator]: () => source })
	}

	readonly #iterable: Iterable<T>

	/**
	 * Creates a new Iter instance from any iterable.
	 * @param iterable The source iterable.
	 */
	constructor(iterable: Iterable<T>) {
		this.#iterable = iterable
	}

	[Symbol.iterator](): Iterator<T> {
		return this.#iterable[Symbol.iterator]()
	}

	/**
	 * Transforms each item using the provided function.
	 * @param mapper Mapping function.
	 * @returns A new Iter of mapped values.
	 */
	map<U>(mapper: (value: T) => U): Iter<U> {
		const self = this
		return new Iter<U>((function* mapImpl() {
			for (const item of self) {
				yield mapper(item)
			}
		})())
	}

	/**
	 * Filters items based on a predicate.
	 * @param predicate Predicate function.
	 * @returns A new Iter of filtered values.
	 */
	filter(predicate: (value: T) => boolean): Iter<T> {
		const self = this
		return new Iter<T>((function* filterImpl() {
			for (const item of self) {
				if (predicate(item)) { yield item }
			}
		})())
	}

	/**
	 * Takes the first `n` items.
	 * @param n Number of items to take.
	 * @returns A new Iter with up to `n` items.
	 */
	take(n: number): Iter<T> {
		const self = this
		return new Iter<T>((function* takeImpl() {
			let count = 0
			for (const item of self) {
				if (count++ >= n) { break }
				yield item
			}
		})())
	}

	/**
	 * Skips the first `n` items.
	 * @param n Number of items to skip.
	 * @returns A new Iter without the first `n` items.
	 */
	drop(n: number): Iter<T> {
		const self = this
		return new Iter<T>((function* dropImpl() {
			let count = 0
			for (const item of self) {
				if (count++ < n) { continue }
				yield item
			}
		})())
	}

	/**
	 * Maps each item to an iterable and flattens the result.
	 * @param mapper Mapping function returning an iterable.
	 * @returns A new Iter of flattened values.
	 */
	flatMap<U>(mapper: (value: T) => Iterable<U>): Iter<U> {
		const self = this
		return new Iter<U>((function* flatMapImpl() {
			for (const item of self) {
				yield* mapper(item)
			}
		})())
	}

	/**
	 * Applies a function to each item (eager evaluation).
	 * @param callback Function to apply to each item.
	 */
	forEach(callback: (value: T) => void): void {
		for (const item of this) {
			callback(item)
		}
	}


	/**
	 * Reduces items to a single value.
	 * @param reducer Reducer function.
	 * @returns The reduced value.
	 * @throws TypeError if the iterator is empty and no initial value is provided.
	 */
	reduce(reducer: (acc: T, value: T) => T): T

	/**
	 * Reduces items to a single value with an initial accumulator.
	 * @param reducer Reducer function.
	 * @param initial Initial accumulator value.
	 * @returns The reduced value.
	 */
	reduce<U = T>(reducer: (acc: U, value: T) => U, initial: U): U

	/**
	 * Reduces items to a single value.
	 * @param reducer Reducer function.
	 * @param initial Initial accumulator value.
	 * @returns The reduced value.
	 * @throws TypeError if the iterator is empty and no initial value is provided.
	 */
	reduce<U = T>(
		this: Iter<T>,
		reducer: (acc: U, value: T) => U,
		initial?: U,
	): U {
		let ac: unknown = initial
		let set = false
		for (const item of this) {
			if (ac === undefined) {
				ac = item
				set = true
				continue
			}
			ac = reducer(ac as U, item)
		}
		if (!set) {
			throw TypeError("Empty iterator cannot be reduced without initial value")
		}
		return ac as U
	}

	/**
	 * Finds the first item matching the predicate.
	 * @param fn Predicate function.
	 * @returns The first matching item, or undefined.
	 */
	find(fn: (value: T) => boolean): T | undefined {
		for (const item of this) {
			if (fn(item)) { return item }
		}
		return undefined
	}


	/**
	 * Checks if all items match the predicate.
	 * @param predicate Predicate function.
	 * @returns True if all items match, false otherwise.
	 */
	every(predicate: (value: T) => boolean): boolean {
		for (const item of this) {
			if (!predicate(item)) { return false }
		}
		return true
	}

	/**
	 * Checks if any item matches the predicate.
	 * @param predicate Predicate function.
	 * @returns True if any item matches, false otherwise.
	 */
	some(predicate: (value: T) => boolean): boolean {
		for (const item of this) {
			if (predicate(item)) { return true }
		}
		return false
	}

	/**
	 * Eagerly collects all items into an array.
	 * @returns An array of all items.
	 */
	toArray(): Array<T> {
		return Array.from(this)
	}

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * @param selector - Function returning a numeric value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	minBy(selector: (value: T) => number): T | undefined

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a chronological value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	minBy(selector: (value: T) => Date): T | undefined

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a textual value for comparison.
	 * @param config - Configuration for `Intl.Collator`
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	minBy(
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined

	/**
	 * Finds the minimum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * @param selector - Function returning a value for comparison.
	 * @returns The element with the lowest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	minBy(
		this: Iter<T>,
		selector: (item: T) => number | string | Date,
		config?: IntlCollatorProps,
	): T | undefined {
		let minItem: T | undefined
		let minValue: number | string | Date | undefined
		let set = false
		const col = new Intl.Collator(config?.locale, config)

		for (const item of this) {
			if (!set) {
				minItem = item
				minValue = selector(minItem)
				set = true
				continue
			}

			const value = selector(item)

			if (typeof value === "string" && typeof minValue === "string") {
				minItem = col.compare(value, minValue) < 0 ? item : minItem
			} else if (value instanceof Date && minValue instanceof Date) {
				minItem = value.valueOf() < minValue.valueOf() ? item : minItem
			} else {
				minItem = value < minValue! ? item : minItem
			}
			minValue = selector(minItem!)
		}
		return minItem
	}


	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * @param selector - Function returning a numeric value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	maxBy(selector: (value: T) => number): T | undefined

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * This function uses `Date.prototype.valueOf` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a chronological value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	maxBy(selector: (value: T) => Date): T | undefined

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * This function uses `Intl.Collator.prototype.compare` underneath, but only
	 * if overload contract is not nullified.
	 *
	 * @param selector - Function returning a textual value for comparison.
	 * @param config - Configuration for `Intl.Collator`
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	maxBy(
		selector: (value: T) => string,
		config?: IntlCollatorProps,
	): T | undefined

	/**
	 * Finds the maximum element based on a provided selector function.
	 * Returns `undefined` if the iterator is empty.
	 *
	 * @param selector - Function returning a value for comparison.
	 * @returns The element with the highest value according to `selector`,
	 * or `undefined` if this iterator is empty.
	 */
	maxBy(
		this: Iter<T>,
		selector: (item: T) => number | string | Date,
		config?: IntlCollatorProps,
	): T | undefined {
		let maxItem: T | undefined
		let maxValue: number | string | Date | undefined
		let set = false
		const col = new Intl.Collator(config?.locale, config)

		for (const item of this) {
			if (!set) {
				maxItem = item
				maxValue = selector(maxItem)
				set = true
				continue
			}

			const value = selector(item)

			if (typeof value === "string" && typeof maxValue === "string") {
				maxItem = col.compare(value, maxValue) > 0 ? item : maxItem
			} else if (value instanceof Date && maxValue instanceof Date) {
				maxItem = value.valueOf() > maxValue.valueOf() ? item : maxItem
			} else {
				maxItem = value > maxValue! ? item : maxItem
			}
			maxValue = selector(maxItem!)
		}

		return maxItem
	}

	/**
	 * @returns A new Iter of tuples [index, value].
	 */
	indexed(): Iter<[number, T]> {
		const self = this
		return new Iter<[number, T]>((function* indexedImpl() {
			let i = 0
			for (const item of self) {
				yield [ i++, item ]
			}
		})())
	}


	/**
	 * Repeats the iterable `times` times.
	 * @param times Number of repetitions.
	 * @returns A new Iter with repeated values.
	 */
	repeat(times: number): Iter<T> {
		const self = this
		return new Iter<T>((function* repeatImpl() {
			for (let i = 0; i < times; i++) {
				yield* self
			}
		})())
	}
}
Object_tag(Iter)
