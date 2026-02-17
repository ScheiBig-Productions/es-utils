/**
 * Provides declarations that merge into global declarations of `Array`/`ArrayConstructor`,
 * which add types for installed extensions.
 * @module
 */
/**
 * Provides options passed to `Intl.Collator` in functions that use rich string comparison.
 *
 * @see {@link Intl.Collator}
 */
export type IntlCollatorProps = {
    locale?: string;
} & Intl.CollatorOptions;
interface MinByFn {
    /**
     * Finds the minimum element based on a provided selector function.
     * Returns `undefined` if the array is empty.
     *
     * @template T Type of this array
     * @this `this` array that should be searched
     * @param selector - Function returning a numeric value for comparison.
     * @returns The element with the lowest value according to `selector`,
     * or `undefined` if this array is empty.
     */
    <T>(this: Array<T>, selector: (value: T) => number): T | undefined;
    /**
     * Finds the minimum element based on a provided selector function.
     * Returns `undefined` if the array is empty.
     *
     * This function uses `Date.prototype.valueOf` underneath, but only
     * if overload contract is not nullified.
     *
     * @template T Type of this array
     * @this `this` array that should be searched
     * @param selector - Function returning a chronological value for comparison.
     * @returns The element with the lowest value according to `selector`,
     * or `undefined` if this array is empty.
     */
    <T>(this: Array<T>, selector: (value: T) => Date): T | undefined;
    /**
     * Finds the minimum element based on a provided selector function.
     * Returns `undefined` if the array is empty.
     *
     * This function uses `Intl.Collator.prototype.compare` underneath, but only
     * if overload contract is not nullified.
     *
     * @template T Type of this array
     * @this `this` array that should be searched
     * @param selector - Function returning a textual value for comparison.
     * @param config - Configuration for `Intl.Collator`
     * @returns The element with the lowest value according to `selector`,
     * or `undefined` if this array is empty.
     */
    <T>(this: Array<T>, selector: (value: T) => string, config?: IntlCollatorProps): T | undefined;
}
interface MaxByFn {
    /**
     * Finds the maximum element based on a provided selector function.
     * Returns `undefined` if the array is empty.
     *
     * @template T Type of this array
     * @this `this` array that should be searched
     * @param selector - Function returning a numeric value for comparison.
     * @returns The element with the highest value according to `selector`,
     * or `undefined` if this array is empty.
     */
    <T>(this: Array<T>, selector: (value: T) => number): T | undefined;
    /**
     * Finds the maximum element based on a provided selector function.
     * Returns `undefined` if the array is empty.
     *
     * This function uses `Date.prototype.valueOf` underneath, but only
     * if overload contract is not nullified.
     *
     * @template T Type of this array
     * @this `this` array that should be searched
     * @param selector - Function returning a chronological value for comparison.
     * @returns The element with the highest value according to `selector`,
     * or `undefined` if this array is empty.
     */
    <T>(this: Array<T>, selector: (value: T) => Date): T | undefined;
    /**
     * Finds the maximum element based on a provided selector function.
     * Returns `undefined` if the array is empty.
     *
     * This function uses `Intl.Collator.prototype.compare` underneath, but only
     * if overload contract is not nullified.
     *
     * @template T Type of this array
     * @this `this` array that should be searched
     * @param selector - Function returning a textual value for comparison.
     * @param config - Configuration for `Intl.Collator`
     * @returns The element with the highest value according to `selector`,
     * or `undefined` if this array is empty.
     */
    <T>(this: Array<T>, selector: (value: T) => string, config?: IntlCollatorProps): T | undefined;
}
interface AscByFn {
    /**
     * Sorts the array in ascending order based on a given selector function.
     *
     * @template T Type of this array
     * @this `this` array that should be sorted
     * @param selector - Function returning a numeric value for comparison.
     * @returns A new array sorted in ascending order.
     */
    <T>(this: Array<T>, selector: (value: T) => number): Array<T> | undefined;
    /**
     * Sorts the array in ascending order based on a given selector function.
     *
     * This function uses `Date.prototype.valueOf` underneath, but only
     * if overload contract is not nullified.
     *
     * @template T Type of this array
     * @this `this` array that should be sorted
     * @param selector - Function returning a chronological value for comparison.
     * @returns A new array sorted in ascending order.
     */
    <T>(this: Array<T>, selector: (value: T) => Date): Array<T> | undefined;
    /**
     * Sorts the array in ascending order based on a given selector function.
     *
     * This function uses `Intl.Collator.prototype.compare` underneath, but only
     * if overload contract is not nullified.
     *
     * @template T Type of this array
     * @this `this` array that should be sorted
     * @param selector - Function returning a textual value for comparison.
     * @returns A new array sorted in ascending order.
     */
    <T>(this: Array<T>, selector: (value: T) => string, config?: IntlCollatorProps): Array<T> | undefined;
}
interface DescByFn {
    /**
     * Sorts the array in descending order based on a given selector function.
     *
     * @param selector - Function returning a numeric value for comparison.
     * @returns A new array sorted in descending order.
     */
    <T>(this: Array<T>, selector: (value: T) => number): Array<T> | undefined;
    /**
     * Sorts the array in descending order based on a given selector function.
     *
     * This function uses `Date.prototype.valueOf` underneath, but only
     * if overload contract is not nullified.
     *
     * @param selector - Function returning a chronological value for comparison.
     * @returns A new array sorted in descending order.
     */
    <T>(this: Array<T>, selector: (value: T) => Date): Array<T> | undefined;
    /**
     * Sorts the array in descending order based on a given selector function.
     *
     * This function uses `Intl.Collator.prototype.compare` underneath, but only
     * if overload contract is not nullified.
     *
     * @param selector - Function returning a textual value for comparison.
     * @returns A new array sorted in descending order.
     */
    <T>(this: Array<T>, selector: (value: T) => string, config?: IntlCollatorProps): Array<T> | undefined;
}
interface GroupByFn {
    /**
     * Groups array elements by a specified key or function.
     * Uses `Object.groupBy` internally, providing substitution if unavailable.
     *
     * @template T Type of this array
     * @this `this` array that should be grouped
     * @param keySelector - Function extracting a key for grouping elements.
     * @param returnType - "Object" (optional) - describes resulting type.
     * @returns An object with keys mapped to arrays of corresponding elements.
     */
    <T, K extends keyof T | ((string | number) & {})>(this: Array<T>, keySelector: (item: T, index: number) => K, returnType?: "Object"): Partial<Record<K, Array<T>>>;
    /**
     * Groups array elements by a specified key or function.
     * Uses `Map.groupBy` internally, providing substitution if unavailable.
     *
     * @template T Type of this array
     * @this `this` array that should be grouped
     * @param keySelector - Function extracting a key for grouping elements.
     * @param returnType - "Map" - describes resulting type.
     * @returns A map with keys mapped to arrays of corresponding elements.
     */
    <T, K extends keyof T | ((string | number) & {})>(this: Array<T>, keySelector: (item: T, index: number) => K, returnType: "Map"): Map<K, Array<T>>;
}
/**
 * This type abstracts indexing proxy `Array.prototype.$` to resolved outer type.
 */
export type IndexProxy<T> = Record<number, T>;
declare global {
    interface Array<T> {
        /**
         * Returns an iterable of tuples containing the array elements and their
         * corresponding indices.
         *
         * @template T Type of this array
         * @this `this` array that should be indexed
         * @returns An iterable providing `[index, element]` pairs.
         */
        indexed: (this: Array<T>) => Iterable<[i: number, v: T]>;
        /**
         * Removes elements from the array based on a given predicate function.
         * This modifies the original array by filtering out matching elements.
         *
         * @template T Type of this array
         * @this `this` array that should be filtered
         * @param predicate Function determining which elements to remove.
         * @returns The modified array with elements removed.
         */
        removeBy: (this: Array<T>, predicate: (value: T, index: number, array: Array<T>) => boolean) => this;
        /**
         * Returns a new shuffled version of the array.
         * Uses an optional seed for deterministic shuffling.
         *
         * @template T Type of this array
         * @this `this` array that should be shuffled
         * @param seed - Optional seed value for deterministic shuffling (**unused**).
         * @returns A new shuffled array.
         */
        toShuffled: (this: Array<T>, seed?: string) => Array<T>;
        /**
         * Finds the minimum element based on a provided selector function.
         * Returns `undefined` if the array is empty.
         *
         * @param selector - Function returning a value for comparison.
         * @returns The element with the lowest value according to `selector`,
         * or `undefined` if this array is empty.
         */
        minBy: MinByFn;
        /**
         * Finds the maximum element based on a provided selector function.
         * Returns `undefined` if the array is empty.
         *
         * @template T Type of this array
         * @this `this` array that should be searched
         * @param selector - Function returning a value for comparison.
         * @returns The element with the highest value according to `selector`,
         * or `undefined` if this array is empty.
         */
        maxBy: MaxByFn;
        /**
         * Sorts the array in ascending order based on a given selector function.
         *
         * @template T Type of this array
         * @this `this` array that should be sorted
         * @param selector - Function returning a value for comparison.
         * @returns A new array sorted in ascending order.
         */
        ascBy: AscByFn;
        /**
         * Sorts the array in descending order based on a given selector function.
         *
         * @template T Type of this array
         * @this `this` array that should be sorted
         * @param selector - Function returning a value for comparison.
         * @returns A new array sorted in descending order.
         */
        descBy: DescByFn;
        /**
         * Splits the array into two sub-arrays based on a weight function and a limit threshold.
         *
         * @template T Type of this array
         * @this `this` array that should be split
         * @param limit - Maximum sum of weights for the first group.
         * @param weight - Function returning the weight of an element.
         * @returns A tuple containing two sub-arrays: `[withinLimit, exceedingLimit]`.
         */
        splitBy: (this: Array<T>, limit: number, weight: (value: T, index: number, array: Array<T>) => number) => [Array<T>, Array<T>];
        /**
         * Pads the array with a given value until it reaches the specified length.
         * Similar to `String.prototype.padEnd`.
         *
         * @template T Type of this array
         * @this `this` array that should be padded
         * @param maxLength - Desired final length of the array.
         * @param fillValue - Value used to pad the array.
         * @returns A new array with padding applied.
         */
        padEnd: (this: Array<T>, maxLength: number, fillValue: T) => Array<T>;
        /**
         * Repeats the array `count` times to create a larger array.
         * Similar to `String.prototype.repeat`.
         *
         * @template T Type of this array
         * @this `this` array that should be repeated
         * @param count - Number of times to repeat the array.
         * @returns A new array repeated `count` times.
         */
        repeat: (this: Array<T>, count: number) => Array<T>;
        /**
         * Randomly shuffles the array in place.
         * Uses an optional seed for deterministic shuffling.
         *
         * @template T Type of this array
         * @this `this` array that should be shuffled
         * @param seed - Optional seed value for deterministic shuffling.
         * @returns The modified array.
         */
        shuffle: (this: Array<T>, seed?: string) => this;
        /**
         * Groups array elements by a specified key or function.
         * Uses `Object.groupBy` or `Map.groupBy` internally.
         *
         * @template T Type of this array
         * @this `this` array that should be grouped
         * @param keySelector - Function extracting a key for grouping elements.
         * @param returnType - "Object" or "Map" - describes resulting type. Object by default.
         * @returns An object or map with keys mapped to arrays of corresponding elements.
         */
        groupBy: GroupByFn;
        /**
         * Provides unsafe indexing of an array with support for negative indices.
         *
         * @template T Type of this array
         * @this `this` array that should be indexed
         * @see {@link Array.at}
         * @see {@link IndexedMap.$}
         */
        readonly $: IndexProxy<T>;
    }
}
interface RangeFn {
    /**
     * Generates an array of numbers from `0` to `end - 1`, similar to Python's `range()`.
     *
     * @param end - The exclusive upper bound of the range.
     * @returns An array containing numbers `[0, 1, 2, ..., end - 1]`.
     * @example
     * Array.range(5); // [0, 1, 2, 3, 4]
     */
    (end: number): Array<number>;
    /**
     * Generates an array of numbers from `start` to `end - 1`, similar to Python's `range()`.
     *
     * @param start - The inclusive lower bound of the range.
     * @param end - The exclusive upper bound of the range.
     * @returns An array containing numbers `[start, start+1, ..., end - 1]`.
     * @example
     * Array.range(2, 5); // [2, 3, 4]
     */
    (start: number, end: number): Array<number>;
    /**
     * Generates an array of numbers from `start` to `end - 1`, incrementing by `step`.
     * Similar to Python's `range(start, end, step)`.
     *
     * @param start - The inclusive lower bound of the range.
     * @param end - The exclusive upper bound of the range.
     * @param step - The step interval between numbers. Must be positive.
     * @returns An array containing numbers `[start, start+step, ..., < end]`.
     * @example
     * Array.range(0, 10, 2); // [0, 2, 4, 6, 8]
     */
    (start: number, end: number, step: number): Array<number>;
}
declare global {
    interface ArrayConstructor {
        /**
         * Generates an array of numbers to `end - 1`, from optional `start`,
         * incrementing by optional `step`.
         * Similar to Python's `range()` in parametrization.
         * @returns An array containing numbers
         */
        range: RangeFn;
        /**
         * Selects a random option based on weighted probabilities.
         * Simulates rolling a weighted dice.
         * @param options - Array of `[option, weight]` pairs.
         * @returns A randomly selected option, influenced by the weights.
         * @example
         * Array.roll(["A", 3], ["B", 1]); // "A" is 3× more likely than "B"
         */
        roll: <T>(...options: Array<[option: T, weight: number]>) => T;
    }
}
export {};
//# sourceMappingURL=Array.extension.declarations.d.ts.map