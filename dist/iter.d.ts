type IntlCollatorProps = {
    locale?: string;
} & Intl.CollatorOptions;
/**
 * Custom implementation of tc39/ecma262 Iterator helper.
 *
 * Iter holds non-frozen reference of used Iterable, so it can be reused multiple times,
 * although it is not recommended.
 */
export declare class Iter<T> implements Iterable<T> {
    #private;
    /**
     * Generates an iterator of numbers from `0` to `end - 1`, similar to Python's `range()`.
     *
     * @param end - The exclusive upper bound of the range.
     * @returns An iterator containing numbers `[0, 1, 2, ..., end - 1]`.
     */
    static range(end: number): Iter<number>;
    /**
     * Generates an iterator of numbers from `start` to `end - 1`, similar to Python's `range()`.
     *
     * @param start - The inclusive lower bound of the range.
     * @param end - The exclusive upper bound of the range.
     * @returns An iterator containing numbers `[start, start+1, ..., end - 1]`.
     */
    static range(start: number, end: number): Iter<number>;
    /**
     * Generates an iterator of numbers from `start` to `end - 1`, incrementing by `step`.
     * Similar to Python's `range(start, end, step)`.
     *
     * @param start - The inclusive lower bound of the range.
     * @param end - The exclusive upper bound of the range.
     * @param step - The step interval between numbers. Must be positive.
     * @returns An array containing numbers `[start, start+step, ..., < end]`.
     */
    static range(start: number, end: number, step: number): Iter<number>;
    /**
     * Creates a new Iter instance from any iterable.
     * @param iterable The source iterable.
     */
    constructor(iterable: Iterable<T>);
    [Symbol.iterator](): Iterator<T>;
    /**
     * Transforms each item using the provided function.
     * @param mapper Mapping function.
     * @returns A new Iter of mapped values.
     */
    map<U>(mapper: (value: T) => U): Iter<U>;
    /**
     * Filters items based on a predicate.
     * @param predicate Predicate function.
     * @returns A new Iter of filtered values.
     */
    filter(predicate: (value: T) => boolean): Iter<T>;
    /**
     * Takes the first `n` items.
     * @param n Number of items to take.
     * @returns A new Iter with up to `n` items.
     */
    take(n: number): Iter<T>;
    /**
     * Skips the first `n` items.
     * @param n Number of items to skip.
     * @returns A new Iter without the first `n` items.
     */
    drop(n: number): Iter<T>;
    /**
     * Maps each item to an iterable and flattens the result.
     * @param mapper Mapping function returning an iterable.
     * @returns A new Iter of flattened values.
     */
    flatMap<U>(mapper: (value: T) => Iterable<U>): Iter<U>;
    /**
     * Applies a function to each item (eager evaluation).
     * @param callback Function to apply to each item.
     */
    forEach(callback: (value: T) => void): void;
    /**
     * Reduces items to a single value.
     * @param reducer Reducer function.
     * @returns The reduced value.
     * @throws TypeError if the iterator is empty and no initial value is provided.
     */
    reduce(reducer: (acc: T, value: T) => T): T;
    /**
     * Reduces items to a single value with an initial accumulator.
     * @param reducer Reducer function.
     * @param initial Initial accumulator value.
     * @returns The reduced value.
     */
    reduce<U = T>(reducer: (acc: U, value: T) => U, initial: U): U;
    /**
     * Finds the first item matching the predicate.
     * @param fn Predicate function.
     * @returns The first matching item, or undefined.
     */
    find(fn: (value: T) => boolean): T | undefined;
    /**
     * Checks if all items match the predicate.
     * @param predicate Predicate function.
     * @returns True if all items match, false otherwise.
     */
    every(predicate: (value: T) => boolean): boolean;
    /**
     * Checks if any item matches the predicate.
     * @param predicate Predicate function.
     * @returns True if any item matches, false otherwise.
     */
    some(predicate: (value: T) => boolean): boolean;
    /**
     * Eagerly collects all items into an array.
     * @returns An array of all items.
     */
    toArray(): Array<T>;
    /**
     * Finds the minimum element based on a provided selector function.
     * Returns `undefined` if the iterator is empty.
     *
     * @param selector - Function returning a numeric value for comparison.
     * @returns The element with the lowest value according to `selector`,
     * or `undefined` if this iterator is empty.
     */
    minBy(selector: (value: T) => number): T | undefined;
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
    minBy(selector: (value: T) => Date): T | undefined;
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
    minBy(selector: (value: T) => string, config?: IntlCollatorProps): T | undefined;
    /**
     * Finds the maximum element based on a provided selector function.
     * Returns `undefined` if the iterator is empty.
     *
     * @param selector - Function returning a numeric value for comparison.
     * @returns The element with the highest value according to `selector`,
     * or `undefined` if this iterator is empty.
     */
    maxBy(selector: (value: T) => number): T | undefined;
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
    maxBy(selector: (value: T) => Date): T | undefined;
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
    maxBy(selector: (value: T) => string, config?: IntlCollatorProps): T | undefined;
    /**
     * @returns A new Iter of tuples [index, value].
     */
    indexed(): Iter<[number, T]>;
    /**
     * Repeats the iterable `times` times.
     * @param times Number of repetitions.
     * @returns A new Iter with repeated values.
     */
    repeat(times: number): Iter<T>;
}
export {};
//# sourceMappingURL=iter.d.ts.map