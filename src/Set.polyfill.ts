/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
export { }

declare global {
	interface Set<T> {

		/**
		 * @returns a new Set containing elements in this set but not in the other.
		 */
		difference: (this: Set<T>, other: Set<T>) => Set<T>,

		/**
		 * @returns a new Set containing elements present in both sets.
		 */
		intersection: (this: Set<T>, other: Set<T>) => Set<T>,

		/**
		 * @returns a new Set containing elements in either set but not both.
		 */
		symmetricDifference: (this: Set<T>, other: Set<T>) => Set<T>,

		/**
		 * @returns a new Set containing all elements from both sets.
		 */
		union: (this: Set<T>, other: Set<T>) => Set<T>,

		/**
		 * @returns true if the sets share no elements.
		 */
		isDisjointFrom: (this: Set<T>, other: Set<T>) => boolean,

		/**
		 * @returns true if this set is a subset of the other.
		 */
		isSubsetOf: (this: Set<T>, other: Set<T>) => boolean,

		/**
		 * @returns true if this set is a superset of the other.
		 */
		isSupersetOf: (this: Set<T>, other: Set<T>) => boolean,
	}
}

Set.prototype.difference ??= function difference<T>(
	this: Set<T>,
	other: Set<T>,
) {
	return new Set([ ...this ].filter((x) => !other.has(x)))
}

Set.prototype.intersection ??= function intersection<T>(
	this: Set<T>,
	other: Set<T>,
) {
	return new Set([ ...this ].filter((x) => other.has(x)))
}

Set.prototype.symmetricDifference ??= function symmetricDifference<T>(
	this: Set<T>,
	other: Set<T>,
) {
	const result = new Set<T>()
	for (const val of this) {
		if (!other.has(val)) { result.add(val) }
	}
	for (const val of other) {
		if (!this.has(val)) { result.add(val) }
	}
	return result
}

Set.prototype.union ??= function union<T>(
	this: Set<T>,
	other: Set<T>,
): Set<T> {
	return new Set([ ...this, ...other ])
}

Set.prototype.isDisjointFrom ??= function isDisjointFrom<T>(
	this: Set<T>,
	other: Set<T>,
) {
	for (const val of this) {
		if (other.has(val)) { return false }
	}
	return true
}

Set.prototype.isSubsetOf ??= function isSubsetOf<T>(
	this: Set<T>,
	other: Set<T>,
) {
	for (const val of this) {
		if (!other.has(val)) { return false }
	}
	return true
}

Set.prototype.isSupersetOf ??= function isSupersetOf<T>(
	this: Set<T>,
	other: Set<T>,
) {
	for (const val of other) {
		if (!this.has(val)) { return false }
	}
	return true
}
