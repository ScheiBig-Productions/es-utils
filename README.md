# es-utils

Various utilities for working in ECMAScript/TypeScript codebase

---

# API docs

Package introduces following additions - both to global objects, as well as new ones:

#### Global polyfills (add some functionalities introduced after ES2022):
- [Array](#array---polyfills),
- [Map](#map---polyfills),
- [Object](#object---polyfills),
- [Set](#set---polyfills).

#### Global extensions (instance and static methods extending existing classes / functions):
- [Array](#array---extensions),
- [Error](#error---extensions),
- [fetch](#fetch---extensions),
- [Function](#function---extensions),
- [Map](#map---extensions),
- [Object](#object---extensions),
- [Promise](#promise---extensions)
- [String](#string---extensions).

#### New APIs:
- [after](#after),
- [ContractViolationError](#contractviolationerror),
- [Enum](#enum),
- [Log](#log),
- [Mime](#mime),
- type [PromiseFactory](#type-promisefactory)
- [SC](#sc),
- Temporal (as import, not polyfill - re-export of [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill))

---

## Polyfills

### Array - polyfills

#### `Array.prototype.findLast`:
```ts
/**
 * Returns the last element that satisfies the provided testing function.
 * Iterates from the end of the array.
 *
 * @param predicate - Function to test each element.
 * @returns The last matching element, or `undefined` if none match.
 */
var /*Array.prototype.*/findLast: (
	this: Array<T>,
	predicate: (value: T, index: number, array: Array<T>) => unknown,
) => T | undefined
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.findLast((n) => n % 2 === 0)
// 10
```

#### `Array.prototype.findLastIndex`:
```ts
/**
 * Returns the index of the last element that satisfies the provided testing function.
 * Iterates from the end of the array.
 *
 * @param predicate - Function to test each element.
 * @returns The index of the last matching element, or `-1` if none match.
 */
var /*Array.prototype.*/findLastIndex: (
	this: Array<T>,
	predicate: (value: T, index: number, array: Array<T>) => unknown,
) => number
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.findLastIndex((n) => n < 5)
// 5
```

#### `Array.prototype.toReversed`:
```ts
/**
 * Returns a copy of the array with elements reversed.
 *
 * @returns A new array with the order of elements reversed.
 */
var /*Array.prototype.*/toReversed: (this: Array<T>) => Array<T>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.toReversed()
// [ 10, 9, 8, 7, 5, 6, 4, 3, 2, 1 ]
```

#### `Array.prototype.toSorted`:
```ts
/**
 * Returns a sorted copy of the array using optional comparator.
 *
 * @param compareFn - Optional function to define sort order.
 * @returns A new array sorted by the comparator or default behavior.
 */
var /*Array.prototype.*/toSorted: <T>(
	this: Array<T>,
	compareFn?: (a: T, b: T) => number,
) => Array<T>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.toSorted()
// [ 1, 10, 2, 3, 4, 5, 6, 7, 8, 9 ]
arr.toSorted((a,b) => b - a)
// [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
```

#### `Array.prototype.toSpliced`:
```ts
/**
 * Returns a copy of the array with some elements removed and/or replaced.
 *
 * @param start - Index to begin changing the array.
 * @param deleteCount - Number of elements to remove.
 * @param items - Items to insert into the array.
 * @returns A new array with modifications applied.
 */
var /*Array.prototype.*/toSpliced: (
	this: Array<T>,
	start: number,
	deleteCount: number,
	...items: Array<T>
) => Array<T>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.toSpliced(2, 1, 'a', 'b')
// [ 1, 2, 'a', 'b', 4, 5, 6, 7, 8, 9, 10 ]
```

#### `Array.prototype.with`:
```ts
/**
 * Returns a copy of the array with the element at the given index replaced.
 *
 * @param index - Index of the item to replace.
 * @param value - New value to set at index.
 * @returns A new array with the item replaced.
 */
var /*Array.prototype.*/with: (
	this: Array<T>,
	index: number,
	value: T,
) => Array<T>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.with(4, 1000)
// [ 1, 2, 3, 4, 1000, 6, 7, 8, 9, 10 ]
```

### Map - polyfills

#### `Map.groupBy`:
```ts
/**
 * Groups array items by a key derived from each element.
 * Returns a Map preserving insertion order and key types.
 *
 * @param items - Array-like input to group.
 * @param keySelector - Function selecting a key for each item.
 * @returns A Map with grouped arrays keyed by selected values.
 */
var /*Map.*/groupBy: <T, K>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K
) => Map<K, Array<T>>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Map.groupBy(arr, (n) => n % 2 === 0)
// Map(2) {
//   false => [ 1, 3, 5, 7, 9 ],
//   true => [ 2, 4, 6, 8, 10 ]
// }
```

### Object - polyfills

#### `Object.groupBy`:
```ts
/**
 * Groups array items by a key derived from each element.
 * Returns an object mapping keys to arrays of grouped items.
 *
 * @param items - Array-like input to group.
 * @param keySelector - Function selecting a key for each item.
 * @returns An object with grouped arrays keyed by selected values.
 */
var /*Object.*/groupBy: <T, K extends PropertyKey>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K
) => Partial<Record<K, Array<T>>>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Object.groupBy(arr, (n) => n % 2 === 0)
// [Object: null prototype] {
//   false: [ 1, 3, 5, 7, 9 ],
//   true: [ 2, 4, 6, 8, 10 ]
// }
```

### Set - polyfills

#### `Set.prototype.difference`
```ts
/**
 * @returns a new Set containing elements in this set but not in the other.
 */
var /*Set<T>.prototype.*/difference: (this: Set<T>, other: Set<T>) => Set<T>,
```

#### `Set.prototype.intersection`
```ts
/**
 * @returns a new Set containing elements present in both sets.
 */
var /*Set<T>.prototype.*/intersection: (this: Set<T>, other: Set<T>) => Set<T>,
```

#### `Set.prototype.symmetricDifference`
```ts
/**
 * @returns a new Set containing elements in either set but not both.
 */
var /*Set<T>.prototype.*/symmetricDifference: (this: Set<T>, other: Set<T>) => Set<T>,
```

#### `Set.prototype.union`
```ts
/**
 * @returns a new Set containing all elements from both sets.
 */
var /*Set<T>.prototype.*/union: (this: Set<T>, other: Set<T>) => Set<T>,
```

#### `Set.prototype.isDisjointFrom`
```ts
/**
 * @returns true if the sets share no elements.
 */
var /*Set<T>.prototype.*/isDisjointFrom: (this: Set<T>, other: Set<T>) => boolean,
```

#### `Set.prototype.isSubsetOf`
```ts
/**
 * @returns true if this set is a subset of the other.
 */
var /*Set<T>.prototype.*/isSubsetOf: (this: Set<T>, other: Set<T>) => boolean,
```

#### `Set.prototype.isSupersetOf`
```ts
/**
 * @returns true if this set is a superset of the other.
 */
var /*Set<T>.prototype.*/isSupersetOf: (this: Set<T>, other: Set<T>) => boolean,
```

## Extensions
### Array - extensions

#### `Array.prototype.indexed`:
```ts
/**
 * Returns an iterable of tuples containing the array elements and their
 * corresponding indices.
 *
 * @returns An iterable providing `[index, element]` pairs.
 */
var /*Array.prototype.*/indexed: (this: Array<T>) => Iterable<[i: number, v: T]>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
[...arr.map(String).indexed()]
// [
//   [ 0, '1' ], [ 1, '2' ], [ 2, '3' ], [ 3, '4' ], [ 4, '5' ],
//   [ 5, '6' ], [ 6, '7' ], [ 7, '8' ], [ 8, '9' ], [ 9, '10' ]
// ]
```

#### `Array.prototype.removeBy`:
```ts
/**
 * Removes elements from the array based on a given predicate function.
 * This modifies the original array by filtering out matching elements.
 *
 * @param predicate - Function determining which elements to remove.
 * @returns The modified array with elements removed.
 */
var /*Array.prototype.*/removeBy: (
	this: Array<T>,
	predicate: (value: T, index: number, array: Array<T>) => boolean,
) => this
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
arr.removeBy((n) => n % 2 === 1)
// [ 2, 4, 6, 8, 10 ]
```
> [!WARNING] This function modifies array in place!
>
> To get a new array with expected output, simply use `Array.prototype.filer` with same predicate.

#### `Array.prototype.toShuffled`:
```ts
/**
 * Returns a new shuffled version of the array.
 * Uses an optional seed for deterministic shuffling.
 *
 * @param seed - Optional seed value for deterministic shuffling.
 * @returns A new shuffled array.
 */
var /*Array.prototype.*/toShuffled: (
	this: Array<T>,
	seed?: string
) => Array<T>
```

> [!IMPORTANT] Seed parameter is currently completely ignored!
>
> JS runtimes do not natively support seeded pseudorandom generators at this time.

For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.toShuffled()
// [ 2, 7, 1, 9, 5, 4, 10, 8, 3, 6 ]
```

#### `Array.prototype.minBy`:
```ts
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
/**
 * ...
 */
var /*Array.prototype.*/minBy: MinByFn
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.minBy((n) => Math.abs(5 - n))
// 5
```

#### `Array.prototype.maxBy`:
```ts
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
/**
 * ...
 */
var /*Array.prototype.*/maxBy: MaxByFn
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.maxBy(String)
// 9
arr.maxBy((n) => String(n).length)
// 10
```

#### `Array.prototype.ascBy`:
```ts
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
/**
 * ...
 */
var /*Array.prototype.*/ascBy: AscByFn
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.ascBy((n) => Math.abs(4.4 - n))
// [ 4, 5, 3, 6, 2, 7, 1, 8, 9, 10 ]
```

#### `Array.prototype.descBy`:
```ts
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
/**
 * ...
 */
var /*Array.prototype.*/descBy: DescByFn
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.descBy((n) => String(n), { numeric: true })
// [ 10, 9, 8, 7, 5, 6, 4, 3, 2, 1 ]
```

#### `Array.prototype.splitBy`:
```ts
/**
 * Splits the array into two sub-arrays based on a weight function and a limit threshold.
 *
 * @param limit - Maximum sum of weights for the first group.
 * @param weight - Function returning the weight of an element.
 * @returns A tuple containing two sub-arrays: `[withinLimit, exceedingLimit]`.
 */
var /*Array.prototype.*/splitBy: (
	this: Array<T>,
	limit: number,
	weight: (value: T, index: number, array: Array<T>) => number,
) => [Array<T>, Array<T>]
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.splitBy(10, (n) => n)
// [[ 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9, 10 ]]
```

#### `Array.prototype.padEnd`:
```ts
/**
 * Pads the array with a given value until it reaches the specified length.
 * Similar to `String.prototype.padEnd`.
 *
 * @param maxLength - Desired final length of the array.
 * @param fillValue - Value used to pad the array.
 * @returns A new array with padding applied.
 */
var /*Array.prototype.*/padEnd: (
	this: Array<T>,
	maxLength: number,
	fillValue: T
) => Array<T>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.padEnd(20, 0)
// [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0
// ]
```

#### `Array.prototype.repeat`:
```ts
/**
 * Repeats the array `count` times to create a larger array.
 * Similar to `String.prototype.repeat`.
 *
 * @param count - Number of times to repeat the array.
 * @returns A new array repeated `count` times.
 */
var /*Array.prototype.*/repeat: (
	this: Array<T>,
	count: number,
) => Array<T>
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.repeat(3)
// [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10
// ]
```

#### `Array.prototype.shuffle`:
```ts
/**
 * Randomly shuffles the array in place.
 * Uses an optional seed for deterministic shuffling.
 *
 * @param seed - Optional seed value for deterministic shuffling.
 * @returns The modified array.
 */
var /*Array.prototype.*/shuffle: (
	this: Array<T>,
	seed?: string,
) => this
```
For example:
```ts
const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.toShuffled()
// [ 4, 7, 2, 6, 8, 5, 10, 1, 9, 3 ]
```

#### `Array.prototype.groupBy`:
```ts
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
/**
 * ...
 */
var /*Array.prototype.*/groupBy: GroupByFn
```
For example:
```ts
arr.groupBy((n) => n % 2 == 0)
// [Object: null prototype] {
//   false: [ 1, 3, 5, 7, 9 ],
//   true: [ 2, 4, 6, 8, 10 ]
// }
arr.groupBy((n) => n % 2 == 0, "Map")
// Map(2) {
//   false => [ 1, 3, 5, 7, 9 ],
//   true => [ 2, 4, 6, 8, 10 ] 
// }
```

### Error - extensions
#### Error.never
```ts
/**
 * Trips on contract violation.
 *
 * This call, as name suggests, should never be performed - it should be short-circuited
 * by truthy value or condition, that by contract should always be present.
 *
 * Logs context and throws error.
 *
 * @param msg - Optional message or error instance.
 * It is strongly recommended that message is provided for logging purpose.
 * @param context - Additional debug info.
 * @throws ContractViolationError
 */
var /*Error.*/never: (msg?: string | Error, ...context: Array<any>) => never
```
For example:
```ts
app.get(
	authMiddleware.requireAuthorized(),
	async (c) => {
		const userId = c.get("user-id") ?? Error.never("Failure of auth middleware")

		/* ... /*
	}
)
```

Throws [ContractViolationError](#errorextensioncontractviolationerror).

#### Error.isError
```ts
/**
 * Determines whether a given value is a genuine Error object.
 * This includes native Error types like Error, TypeError, DOMException, etc.
 *
 * @param value - The value to test.
 * @returns `true` if the value is an actual Error object; otherwise `false`.
 *
 * @example
 * Error.isError(new Error()); // true
 * Error.isError({ message: "fail" }); // false
 */
var /*Error.*/isError: (value: unknown) => value is InstanceType<typeof Error | typeof DOMException>
```
> [!WARNING] This is a very loose implementation of <code>Error.isError</code>
>
> For better implementation, default to something like [es-shims/Error.isError](https://github.com/es-shims/Error.isError/tree/main)

For example:
```ts
Error.isError(Error("Something is wrong"))
// true
Error.isError({ name: "Error", message: "Something is wrong" })
// false
```

#### Error.errorLike
```ts
/**
 * Determines whether a given value is "error-like" - meaning it structurally
 * resembles an Error object (has `name`, `message`, and optionally `stack` and `cause`;
 * all of proper types).
 *
 * Useful for detecting errors from libraries that avoid subclassing Error.
 *
 * @param value - The value to test.
 * @returns `true` if the value looks like an Error object; otherwise `false`.
 *
 * @example
 * errorLike({ name: "CustomError", message: "Oops" }); // true
 * errorLike("fail"); // false
 */
var /*Error.*/errorLike: (value: unknown) => value is Error
```

For example:
```ts
Error.errorLike(Error("Something is wrong"))
// true
Error.errorLike({ name: "Error", message: "Something is wrong" })
// true
Error.errorLike({ name: 123, message: "Something is wrong" })
// false
```

### fetch - extensions

#### `fetch.factory`
```ts
/**
 * Creates a factory that allows for calling specific `Request`s in repeatable,
 * configurable way.
 *
 * It allows for parameterize 3 basic configurations: URL slug, URL query,
 * and init config.
 *
 * Each call will create new `Response` (call fetch underneath), but success is not
 * guaranteed if provided streams are consumed in meantime or in previous call; it is
 * caller responsibility to make sure that dynamic config will DI streams.
 *
 * @param url - Static URL-like path or dynamic URL-like path parameterized
 * with `config.slug` and `config.query`.
 * @param init - Static init config or dynamic init config parameterized
 * with init
 * @returns Function that accepts anticipated configuration and returns the same type
 * as calling `fetch` with resolved configuration would.
 */
var /*fetch.*/factory: <
	T extends InputConfig = object,
>(
	url: URLLike | ((p: URLConfig<T>) => URLLike),
	init?: RequestInit | ((p: InitConfig<T>) => RequestInit),
) => PromiseFactory<Response, [config: ResolveConfig<T>]>
```
For example:
```ts
const getUser = fetch.factory<{
	slug: {
		user: string,
	},
	query: {
		getAvatar: boolean,
		getFriends: string[],
	},
	init: {
		token: string,
	}
}>(
	({ slug, query }) => `http://example.com/user/${slug.user}?${new QueryParams(query)}`,
	({ init }) => {
		headers: { Authorization: `Bearer ${init.token}` },
	},
)
// function PromiseFactory<Response, { slug: ..., query: ..., init: ... }>

await getUser({
	slug: { user: "user~12345678" },
	query: {
		getAvatar: true,
		getFriends: [
			"user~23456789",
			"user~34567890",
		],
	},
	init: { token: "eyJhbGciOiA..." },
})
// Response {}
```

### Function - extensions

#### `Function.bound`
```ts
interface BoundFn {

	/**
	 * For a given object, selects function by name and creates a bound function that
	 * has the same body as the original function.
	 *
	 * The this object of the bound function is associated with the object it was selected from.
	 *
	 * Safer equivalent of `instance[methodName].bind(instance)`.
	 *
	 * @param instance - An object to which the function will be selected from.
	 * @param methodName - A name of function to pick.
	 * @returns Bound function `methodName` from object `instance`.
	 */
	<T, K extends MethodKeys<T>>(instance: T, methodName: K): T[K],

	/**
	 * For a given object, picks function with selector and creates a bound function that
	 * has the same body as the original function.
	 *
	 * The this object of the bound function is associated with the object it was selected from.
	 *
	 * Safer equivalent of `methodSelector(instance).bind(instance)`.
	 *
	 * @param instance - An object to which the function will be selected from.
	 * @param methodSelector - A selector of function.
	 * @returns Bound function from object `instance`.
	 */
	<T, K extends MethodKeys<T>>(instance: T, methodSelector: (o: T) => T[K]): T[K],
}

declare global {
	interface FunctionConstructor {

		/**
		 * ...
		 */
		bound: BoundFn,
	}
}
```
For example:
```ts
const a = [1, 2, 3]
a.at(1)
// 2
let at = a.at
at(1)
// TypeError: Cannot convert undefined or null to object
at = Function.bound(a, "at") // or `Function.bound(a, o => o.at)` - longer but refactor-safe
at(1)
// 2
```

### Map - extensions

#### `Map.Indexed`
```ts
/**
 * Extension of `Map<K extends string, V>`, which provides indexer syntactic sugar,
 * which allows for interacting with maps as if they were normal objects.
 */
interface IndexedMap<K extends string, V> extends Map<K, V> {

	/**
	 * Syntactic sugar over map, which allows for interacting like with normal object.
	 *
	 * @example
	 * declare var map: IndexedMap
	 *
	 * map.get("foo")
	 * // vs
	 * map.$["foo"]
	 * map.$.foo
	 *
	 * map.set("baz", 3)
	 * // vs
	 * map.$["qux"] = 4
	 * map.$.qux = 4
	 *
	 * map.has("baz")
	 * // vs
	 * "baz" in map.$
	 *
	 * map.delete("bar")
	 * // vs
	 * delete map.$["baz"]
	 */
	readonly $: Record<K, V>,
}

interface IndexedMapConstructor {

	/**
	 * Creates a new `Map.Indexed` object with general signature.
	 */
	new(): IndexedMap<string, any>,

	/**
	 * Creates a new `Map.Indexed` object with specific signature.
	 *
	 * @param entries - Array of entries to pre-populate map with.
	 */
	new<K extends string, V>(entries?: ReadonlyArray<readonly [K, V]> | null): IndexedMap<K, V>,

	readonly prototype: IndexedMap<string, any>,
}
var /*Map.*/Indexed: IndexedMapConstructor
```
For example:
```ts
const map = new Map.Indexed()

map.$["foo"] = "Bar"
map.$.foo
// "Bar"

"foo" in map.$
// true

Object.keys(map.$)
// [ "foo" ]

Object.entries(map.$)
// [[ "foo", "Bar" ]]

delete map.$["foo"]
map.size
// 0
```

### Object - extensions

#### `Object.omit`
```ts
/**
 * Removes specified keys from the object, returning a new object without  them.
 * Runtime equivalent of `Omit<Type, Keys>`.
 *
 * @param obj - Source object to omit keys from.
 * @param keys - Keys to exclude.
 * @returns A new object with selected keys removed.
 */
var /*Object.*/omit: <T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	...keys: Array<K>
) => Omit<T, K>
```
For example:
```ts
let a = { foo: "Bar", baz: "Qux" }
// { foo: "Bar", baz: "Qux" }
let b = Object.omit(a, "foo")
// { baz: "Qux" }
```

#### `Object.partial`
```ts
/**
 * Returns the same object, but with specified keys marked optional.
 * Runtime equivalent of `Partial<Pick<T, K>> & Omit<T, K>`.
 * 
 * Does not modify returned `obj` in any way.
 *
 * @param obj - Source object.
 * @param keys - Keys to mark optional.
 * @returns The object with relaxed type constraints on provided keys.
 */
var /*Object.*/partial: <T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	...keys: Array<K>
) => Omit<T, K> & Partial<Pick<T, K>>
```
For example:
```ts
let a = { foo: "Bar", baz: "Qux" }
// { foo: "Bar", baz: "Qux" }
//  ^? -> { foo: "Bar", baz: "Qux" }
let b = Object.partial(a, "foo")
// { foo: "Bar", baz: "Qux" }
//  ^? -> { foo?: "Bar", baz: "Qux" }
```

#### `Object.pick`
```ts
/**
 * Picks only the specified keys from the object, returning a new one.
 * Runtime equivalent of `Pick<Type, Keys>`.
 *
 * @param obj - Source object to pick from.
 * @param keys - Keys to include.
 * @returns A new object with only the selected keys.
 */
var /*Object.*/pick: <T extends Record<string, unknown>, K extends keyof T>(
	obj: T,
	...keys: Array<K>
) => Pick<T, K>
```
For example:
```ts
let a = { foo: "Bar", baz: "Qux" }
// { foo: "Bar", baz: "Qux" }
let b = Object.pick(a, "foo")
// { foo: "Bar" }
```

#### `Object.require`
```ts
/**
 * Ensures value is defined.
 * Runtime equivalent of `NonNullable<Type>`.
 *
 * @param value - Value to verify.
 * @returns The same value if not null or undefined.
 * @throws TypeError if value is nullish.
 */
var /*Object.*/require: <T>(value: T | null | undefined) => T
```
For example:
```ts
const { a, b } = { a: 1 }

Object.require(a)
// 1
Object.require(b)
// Uncaught TypeError: Value cannot be null or undefined
```

#### `Object.else`
```ts
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
	<T, R>(val: T | null | undefined, fallback: (why: "null" | "undef") => R): T | R,

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
	}): T | R | S,
}
/**
 * ...
 */
var /*Object.*/else: ElseFn
```
For example:
```ts
const { a, b, c } = { a: 0, c: null }
Object.else(b, () => 1)
// 1

Object.else(b, (why) =>  why === null ? 2 : 3)
// 3

Object.else(c, {
	null: 4,
	undef: 5,
})
// 4

Object.else(c, {
	undef: 5,
})
// null
```

### Promise - extensions

#### `Promise.factory`
```ts
/**
 * Wraps a Promise-producing function into a chainable factory.
 *
 * Returned factory contains `always${do}` functions, where `do` corresponds
 * to Promise API (`then`, `catch`, `finally`).
 *
 * @template TRes The resolved value type of the Promise.
 * @template TArgs The argument types accepted by the producer function.
 * @param producer - A function that returns a Promise.
 * @returns A PromiseFactory with promise-like API chaining methods.
 */
var /*Promise.*/factory: <TRes, TArgs extends ReadonlyArray<unknown>> (
	producer: (...args: TArgs) => Promise<TRes>
) => PromiseFactory<TRes, TArgs>
```
For example:
```ts
const introduce = Promise.factory(async (name: string, age: number) => 
	`${name} is ${age} years old`
)
await introduce("Alice", 21)
// "Alice is 21 years old"

const praise = introduce.alwaysThen(v => `${v}. They are very good friend!`)
await praise("John", 32)
// "John is 32 years old. They are very goof friend!"
```
For documentation of factory, see [PromiseFactory](#type-promisefactory).

### String - extensions

#### `String.prototype.pack`
```ts
/**
 * Prepends the given indentation string to each line in the string.
 *
 * @param indent - The indentation string to prepend to each line.
 * @returns A new string with each line prefixed with `indent`.
 */
var /*String.prototype.*/indent: (
	this: string,
	indent: string,
) => string
```
For example:
```ts
"Hello\nWorld".indent("  ");
// "  Hello\n  World"
```

#### `String.prototype.trimIndent()`
```ts
/**
 * Removes common leading whitespace from all lines and strips leading/trailing blank lines.
 * Similar to Kotlin's `trimIndent()`, ensuring consistent indentation in multiline strings.
 *
 * Useful for handling formatted text, preserving relative indentation while eliminating
 * excess whitespace.
*
 * @param tabWith - The width used for tab (\t) characters - defaults to 4.
 * @returns A new string with leading indentation and blank lines stripped.
 * If all lines are blank, then empty string is returned.
 *
 */
var /*String.prototype.*/trimIndent: (
	this: string,
	tabWidth?: number,
) => string
```
For example:
```ts
`

    Hello
      World

`.trimIndent();
// "Hello\n  World"
```

#### `String.prototype.pack`
```ts
/**
 * Condenses all whitespace into single spaces and trims surrounding whitespace.
 * Useful for compacting multiline text (e.g., CSS, JSON, code).
 *
 * @returns A tightly packed string.
 */
var /*String.prototype.*/pack: (this: string) => string
```
For example:
```ts
"   This    is \n   a   test  ".pack();
// "This is a test"
```

#### `String.decorator`
```ts
type DecoratorConfig = { prefix: string }
	| { suffix: string }
	| { prefix: string, suffix: string }

/**
 * Creates decorator template function, that place prefix and/or suffix next
 * to provided string.
 *
 * Returned function can also be used as wrapper function,
 * if templating is not necessary.
 *
 * @param config - Configuration of prefix/suffix
 * @param result - Requested function type
 * @return Decorating template function
 */
var /*String.*/decorator: (config: DecoratorConfig) => (
	(strings: TemplateStringsArray | string, ...values: Array<unknown>) => string
)
```
For example:
```ts
const api = String.decorator({ prefix: "http://localhost:4200" })
api`/users`
// "http://localhost:4200/users"

const sparkle = String.decorator({ prefix: "✨ ", suffix: " 🎉" })
sparkle("Hi")
// '✨ Hi 🎉'
```

## New APIs

### after

Simple function that can work as asynchronous delay, 
either with or without returned value.
```ts
interface AfterFn {

	/**
	 * Returns new Promise, that fulfills after given delay.
	 */
	(delay: number | Temporal.Duration): Promise<void>,

	/**
	 * Returns new Promise, that fulfills after given delay to specified value.
	 */
	<T>(delay: number | Temporal.Duration, value: T): Promise<T>,
}


/**
 * Returns new Promise, that fulfills after given delay to specified value.
 */
export const after = async function after(delay, value) { ... } as AfterFn
```

### ContractViolationError

Callable-class error, used internally by `Error.never`.

By design, this error does not allow modification of message, relying on cause
to indicate what happened - it should be thrown only in paths of code, that should
not be accessible as marked by assertions/preconditions.
```ts
/* callable */ class ContractViolationError extends Error {
	name = "ContractViolationError"

	/**
	 * Creates new `ContractViolationError` with provided cause and preset message.
	 *
	 * @param cause - Cause of contract violation. In `Error.never`, this is populated by `msg`.
	 */
	constructor(cause?: string | Error) { 
		super(
			"This function should never be successfully called!",
			 cause && { cause },
		)
	}
}
```
For example:
```ts
ContractViolationError() // callable-class - `new` keyword might be omitted
// ContractViolationError: This function should never be successfully called!

new ContractViolationError("Missing user credentials")
// ContractViolationError: This function should never be successfully called!
//     at ...
//   cause: 'Missing user credentials'
```
Used internally by [Error.never](#errornever).

### Enum

Utility namespace class that allows for creation of proper-runtime enums,
without any sugarcoat magic.

`Enum` objects are stamped with private, unique symbol, used to detect them,
as well as quickly store array of values for access. For created `Enum`,
its "type" (union of values) as well as array of values can be obtained.

It is important to remember, that shown below is only replacement code,
as for proper type-safety, ES5 class was necessary.
```ts
/**
 * Allows for creation of `Enum`, which provides runtime-level enums, without disgusting
 * generated mess done by TypeScripts `enum`s.
 *
 * It facilitates storage of allowed values, which might come in handy in parsing scenarios.
 *
 * Created enums are frozen and cannot be modified in any way.
 */
/* callable */ class Enum<const T extends Entries> {

	/**
	 * Creates new `Enum`.
	 *
	 * @param rawValues - A set of strings to be turned into enums elements.
	 * A tuple of two strings can also be provided, in which case first one will
	 * be used as key and a second as a value.
	 * @returns Created object enum, which has all the specified keys and hidden tag
	 * to represent stored values.
	 *
	 * @example
	 * ```ts
	 * const Cars = Enum.create("Audi", "Peugeot", ["Lexus", "Toyota"])
	 * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
	 * ```
	 */
	constructor(...rawValues: T) { ... }

	/**
	 * Extracts an array, which holds all values that are assigned to `Enum`s keys.
	 *
	 * Provided as static method, as to not clash with enum keys.
	 *
	 * @param enumObj - Created `Enum`; objects that looks like these on the outside
	 * are not supported.
	 *
	 * @example
	 *
	 * const supportedCars = Enum.values(Cars)
	 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
	 */
	static values<const T extends Entries>(enumObj: Enum<T>): ReadonlyArray<ExtractValues<T>[number]> { ... }
}
```

#### type `Enum.type`
```ts
/**
 * Extracts a type, which is an union of values that are assigned to `Enum`s keys.
 *
 * @param E - `typeof` created `Enum`; objects that looks like these on the outside
 * are not supported.
 */
type /*Enum.*/type<E extends Enum<any>> = E[typeof Symbol_enumValues][number]
```


<br>

For example:
```ts
const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
//    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
const supportedCars = Enum.values(Cars)
//    ^? => ("Audi" | "Peugeot" | "Toyota")[]
type Cars = Enum.type<typeof Cars>
//   ^? => "Audi" | "Peugeot" | "Toyota"
```

### Log

Global (singleton) logging utility callable-namespace.

Call provides access to logging with verbosity level specification; 
additionally shorthand method for each level (named by first character of that level)
is provided.

`Log` prints to console, namely log (stdout) and error (stderr), with filter on minimal
log level via `Log.verbosity`. Type `Log.Level` contains accepted verbosity levels.

If color is enabled, as checked for common runtime flags,
then messages are formatted using ANSI codes. Access to coloring utility is available
via `Log.colorize`.

Additionally, all messages are emitted into internal custom event bus, in structure
of `Log.Entry`. Functions `Log.on` and `Log.off` can be used to manage subscriptions.

```ts
/**
 * Logging callable, that should be used as central way of printing feedback from application.
 *
 * Logger implements log levels heavily inspired by RFC 5424:
 * ```
 * 0 - (F) Failure   - System is unusable (calling this level will crash application)
 * 1 - (A) Alert     - Action must be taken immediately
 * 2 - (C) Critical  - Critical conditions
 * 3 - (E) Error     - Error conditions
 * 4 - (W) Warning   - Warning conditions
 * 5 - (N) Notice    - Normal but significant
 * 6 - (I) Info      - Information messaging
 * 7 - (D) Debug     - Debug-level messages
 * 8 - (V) Verbose   - Verbose messaging
 * ```
 *
 * All log levels have utility methods on `log` named after first (capital) letter, that already
 * pass appropriate level to logger.
 *
 * Log verbosity can be set by changing value of {@link Log.verbosity}.
 * This only affects printing to console.
 *
 * Logger is global for whole application.
 *
 * Additionally, logger implements custom event emitter, that allows to listen to entries,
 * and react to them. This is especially useful for saving log to a file, or creating
 * filtered output of logger in different stream.
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
function Log(lvl: LogLevel, tag: string | null, message: string, time?: Date): Date { ... }
namespace Log { ... }
```

#### type `Log.Level`
```ts
/**
 * Available levels of logging severity.
 */
type /*Log.*/Level = "Failure" | "Alert" | "Critical" | "Error" 
	| "Warning" | "Notice" | "Info" | "Debug" | "Verbose"
```

#### type `Log.Entry`
```ts
/**
 * Structure used by {@link Log.on} listeners, containing full context of log entry,
 */
type /*Log.*/Entry = {
	lvl: LogLevel,
	tag: string | null,
	message: string,
	time: Date,
	output: string,
	simpleOutput: string,
}
```

#### `Log.verbosity`
```ts
/**
 * Currently set level of verbosity of Log.
 *
 * Affects only printing to `console`, as listeners provide their own filters.
 */
var /*Log.*/verbosity: LogLevel = "Verbose"
```

#### `Log.F`
```ts
/**
 * Writes to log with level:
 * > Failure (0)   - System is unusable (calling this level will crash application)
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/F: LoggerFunc = function Log_Failure(tag, message, time) {
	return Log("Failure", tag, message, time)
}
```

#### `Log.A`
```ts
/**
 * Writes to log with level:
 * > Alert (1) - Action must be taken immediately
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/A: LoggerFunc = function Log_Alert(tag, message, time) {
	return Log("Alert", tag, message, time)
}
```

#### `Log.C`
```ts
/**
 * Writes to log with level:
 * > Critical (2) - Critical conditions
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/C: LoggerFunc = function Log_Critical(tag, message, time) {
	return Log("Critical", tag, message, time)
}
```

#### `Log.E`
```ts
/**
 * Writes to log with level:
 * > Error (3) - Error conditions
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/E: LoggerFunc = function Log_Error(tag, message, time) {
	return Log("Error", tag, message, time)
}
```

#### `Log.W`
```ts
/**
 * Writes to log with level:
 * > Warning (4) - Warning conditions
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/W: LoggerFunc = function Log_Warning(tag, message, time) {
	return Log("Warning", tag, message, time)
}
```

#### `Log.N`
```ts
/**
 * Writes to log with level:
 * > Notice (5) - Normal but significant
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/N: LoggerFunc = function Log_Notice(tag, message, time) {
	return Log("Notice", tag, message, time)
}
```

#### `Log.I`
```ts
/**
 * Writes to log with level:
 * > Info (6) - Information messaging
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/I: LoggerFunc = function Log_Info(tag, message, time) {
	return Log("Info", tag, message, time)
}
```

#### `Log.D`
```ts
/**
 * Writes to log with level:
 * > Debug (7) - Debug-level messages
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/D: LoggerFunc = function Log_Debug(tag, message, time) {
	return Log("Debug", tag, message, time)
}
```

#### `Log.V`
```ts
/**
 * Writes to log with level:
 * > Verbose (8) - Verbose messaging
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
var /*Log.*/V: LoggerFunc = function Log_Verbose(tag, message, time) {
	return Log("Verbose", tag, message, time)
}
```

#### `Log.on`
```ts
/**
 * Registers new listener to the logger
 */
var /*Log.*/on: RegisterFunc = function Log_on(filter, listener): void { ... }
```

#### `Log.off`
```ts
/**
 * Removes listener from the logger
 */
var /*Log.*/off: RegisterFunc = function Log_off(filter, listener): void { ... }
```

#### `Log.colorize`
```ts
/**
 * Produces string wrapped in color for given log level or ANSI code point.
 *
 * @param code - LogLevel or numerical code for given format.
 * @param msg - Message to wrap in color.
 * @returns Formatted message (if color is not disabled), with format reset at the end.
 */
var /*Log.*/colorize = function Log_colorize(code: LogLevel | number, msg: string): string { ... }
```

### Mime

Namespace containing commonly-used mime types.
```ts
namespace Mime {
	export const txt = "text/plain"
	export const html = "text/html"

	export const json = "application/json"
	export const xml = "application/xml"
	export const pdf = "application/pdf"

	export const jpg = "image/jpeg"
	export const png = "image/png"
	export const gif = "image/gif"
	export const webp = "image/webp"
	export const ico = "image/x-icon"

	export const svg = "image/svg+xml"
}
```

### QueryParams
Extension to `URLSearchParams`. Uses same serialization algorithm as HonoJS validators for "query",
meaning that it supports:
- `null`,
- `string`,
- `number`,
- `boolean`,
- `Date`,
- flat `Array` of either of above.

On any other data type, it will produce error. Additionally, it silently removes `undefined` values, as long as value is passed to constructor or `put` method.

Constructor of class expects same format as parent `URLSearchParams`, 
and all methods of parent are not modified.

```ts
/**
 * A utility class for constructing and manipulating URL query parameters
 * with support for rich input types and serialization.
 *
 * Extends the native `URLSearchParams` class.
 *
 * @example
 * ```ts
 * const qp = new QueryParams({ foo: "bar", count: 42 });
 * qp.put("tags", ["node", "typescript"]);
 * console.log(qp.toString());
 * // "foo=bar&count=42&tags=node&tags=typescript"
 * ```
 */
export class QueryParams extends URLSearchParams { ... }
```

#### `QueryParams.serializeParam`
```ts
/**
 * Serializes a value into a string suitable for use in URL query parameters.
 *
 * Supported types:
 * - `null`, `string`, `number`, `boolean`: converted to string via `String()`
 * - `Date`: serialized using `toJSON()`
 *
 * Unsupported types:
 * - Nested arrays
 * - Objects or other complex types
 *
 * @param i - The input value to serialize.
 * @returns The serialized string representation.
 * @throws {ContractViolationError} If the value is a nested array or unsupported type.
 */
var /*QueryParams.*/serializeParam: (i: unknown) => string
```

#### `QueryParams.prototype.put`
```ts
/**
 * Adds or sets a query parameter with automatic serialization.
 *
 * If the value is an array, each item is appended individually.
 * If `mode` is `"set"` and the key already exists, it is replaced.
 *
 * @param name - The query parameter name.
 * @param value - The value to serialize and insert.
 * @param mode - Whether to replace or append; replacing is default action.
 * @throws {ContractViolationError} If the value is a nested array or unsupported type.
 */
var /*QueryParams.prototype.*/put: (
	this: QueryParams,
	name: string,
	value: unknown,
	mode: "set" | "append" = "set",
) => void
```

### type PromiseFactory
Type of factory function created by [Promise.factory](#promisefactory).
```ts
/**
 * A factory wrapper around Promise-producing functions, enabling pipe-like chaining
 * of `.then`, `.catch`, and `.finally` behavior with deferred execution.
 *
 * @template TRes The resolved value type of the Promise.
 * @template TArgs The argument types accepted by the producer function.
 */
export interface PromiseFactory<TRes, TArgs extends ReadonlyArray<unknown>> { ... }
```

#### `PromiseFactory.prototype.[call signature]`
```ts
/**
 * Executes the wrapped Promise-producing function.
 * @returns A Promise of type T.
 */
/*PromiseFactory.prototype.[call signature]*/(...args: TArgs): Promise<TRes>
```


#### `PromiseFactory.prototype.alwaysThen`
```ts
/**
 * Chains a `.then` call onto the factory.
 *
 * @template TFulRes - The result type after fulfillment.
 * @template TRejRes - The result type after rejection.
 * @param onfulfilled - Callback for successful resolution.
 * @param onrejected - Callback for rejection.
 * @returns A new PromiseFactory with the transformed result.
 */
var /*PromiseFactory.prototype.*/alwaysThen: <TFulRes = TRes, TRejRes = never>(
	onfulfilled?: (value: TRes) => TFulRes | PromiseLike<TFulRes>,
	onrejected?: (reason: unknown) => TRejRes | PromiseLike<TRejRes>,
) => PromiseFactory<TFulRes | TRejRes, TArgs>,
```

#### `PromiseFactory.prototype.alwaysCatch`
```ts
/**
 * Chains a `.catch` call onto the factory.
 *
 * @template TRejRes The result type after rejection.
 * @param onrejected Callback for rejection.
 * @returns A new PromiseFactory with the transformed result.
 */
var /*PromiseFactory.prototype.*/alwaysCatch: <TRejRes = TRes>(
	onrejected: (reason: unknown) => TRejRes | PromiseLike<TRejRes>,
) => PromiseFactory<TRes | TRejRes, TArgs>,
```

#### `PromiseFactory.prototype.alwaysFinally`
```ts
/**
 * Chains a `.finally` call onto the factory.
 *
 * @param onfinally Callback executed regardless of resolution or rejection.
 * @returns A new PromiseFactory with the same result type.
 */
var /*PromiseFactory.prototype.*/alwaysFinally: (onfinally: () => void) => PromiseFactory<TRes, TArgs>,
```

### SC

Namespace containing commonly-used HTTP Status Codes, available by name.

For details of each code, consult its doc-comment, or commonly available RFCs.

Additionally, namespace contains wrapper records for contentful responses 
and redirecting responses, for convenient return out of functions used in handlers.

```ts
/**
 * HTTP response codes.
 */
export namespace SC {
	/**
	 * Codes that indicate successful processing of request.
	 */
	export namespace Success {
		/** ... */ export const ok = 200
		/** ... */ export const created = 201
		/** ... */ export const accepted = 202
		/** ... */ export const noContent = 204
	}
	/**
	 * Codes used to redirect request to different address.
	 */
	export namespace Redirect {
		/** ... */ export const moved = 301
		/** ... */ export const found = 302
		/** ... */ export const seeOther = 303
		/** ... */ export const temporary = 307
		/** ... */ export const permanent = 308
	}
	/**
	 * Client error codes, which indicate problem with request.
	 *
	 * Responses should contain explanation to why request was rejected.
	 */
	export namespace Error {
		/** ... */ export const badRequest = 400
		/** ... */ export const unauthorized = 401
		/** ... */ export const insufficientFunds = 402
		/** ... */ export const forbidden = 403
		/** ... */ export const notFound = 404
		/** ... */ export const conflict = 409
		/** ... */ export const gone = 410
		/** ... */ export const expectationFailed = 417
		/** ... */ export const unprocessableContent = 422
		/** ... */ export const tooManyRequests = 429
	}
	/**
	 * Server error codes, which indicate error while processing request / creating response.
	 *
	 * Responses can contain explanation to what happened.
	 */
	export namespace Exception {
		/** ... */ export const internalServerError = 500
		/** ... */ export const notImplemented = 501
		/** ... */ export const badGateway = 502
	}
	
	/* callable */ class Message { ... }
	/* callable */ class Location { ... }
}
```

#### `SC.Message`
```ts
/**
 * Wrapper over textual message, that is to be passed to Response.
 * Can be invoked directly or via `new`.
 *
 * It might be useful to throw `Message` inside promise, as escape signal from inner handler;
 * such throw can be anticipated via `Message.expect` promise wrapper.
 */

/* callable */ class /*SC.*/Message {

	/**
	 * Awaits a promise and returns either its resolved value or a `Message` if it throws.
	 * Useful for wrapping async operations with typed error signaling.
	 * @param inside - A promise to monitor.
	 * @returns A promise resolving to the original value or a `Message` if an error occurs.
	 */
	static expect: <T>(inside: Promise<T>) => Promise<T | Message>,

	/**
	 * Constructs a new `Message` instance.
	 * @param msg - The message string.
	 * @param code - The content status code.
	 */
	constructor(msg: string, code: ContentStatusCode) { ... }

	/** The message string describing the status. */
	readonly msg: string

	/** A status code indicating the type of content status. */
	readonly code: ContentStatusCode

	/** Returns a tuple representation of the message. */
	tuple: () => readonly [msg: string, code: ContentStatusCode]

	/** Indicates whether the message represents a successful status. */
	isSuccess: () => boolean

	/** Indicates whether the message represents an error status. */
	isError: () => boolean

	/** Indicates whether the message represents an exceptional status. */
	isException: () => boolean
}
```

#### `SC.Location`
```ts
/**
 * Wrapper over redirect happening as Response.
 */
/* callable */ class /*SC.*/Location {

	/**
	 * Constructs a new `Location` instance.
	 * @param msg - The target location string.
	 * @param code - Optional redirect status code. Defaults to a standard redirect.
	 * @returns A new `Location` object.
	 */
	constructor (msg: string, code?: RedirectStatusCode)

	/** The target location or URL. */
	readonly to: string

	/** A status code indicating the type of redirect. */
	readonly code: RedirectStatusCode

	/** Returns a tuple representation of the location. */
	tuple: () => readonly [to: string, code: RedirectStatusCode]
}
```
