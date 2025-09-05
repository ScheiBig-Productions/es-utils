/**
 * Custom implementation of tc39/ecma262 Iterator helper.
 */
export class Iter {
    static range = function range(startOrEnd, maybeEnd, maybeStep = 1) {
        const [start, end, step] = maybeEnd === undefined
            ? [0, startOrEnd, maybeStep]
            : [startOrEnd, maybeEnd, maybeStep];
        if (step <= 0) {
            throw RangeError("Step of range must be positive");
        }
        return new Iter((function* rangeImpl() {
            for (let i = start; i < end; i += step) {
                yield i;
            }
        })());
    };
    #iterable;
    /**
     * Creates a new Iter instance from any iterable.
     * @param iterable The source iterable.
     */
    constructor(iterable) {
        this.#iterable = iterable;
    }
    [Symbol.iterator]() {
        return this.#iterable[Symbol.iterator]();
    }
    /**
     * Transforms each item using the provided function.
     * @param mapper Mapping function.
     * @returns A new Iter of mapped values.
     */
    map(mapper) {
        const self = this;
        return new Iter((function* mapImpl() {
            for (const item of self) {
                yield mapper(item);
            }
        })());
    }
    /**
     * Filters items based on a predicate.
     * @param predicate Predicate function.
     * @returns A new Iter of filtered values.
     */
    filter(predicate) {
        const self = this;
        return new Iter((function* filterImpl() {
            for (const item of self) {
                if (predicate(item)) {
                    yield item;
                }
            }
        })());
    }
    /**
     * Takes the first `n` items.
     * @param n Number of items to take.
     * @returns A new Iter with up to `n` items.
     */
    take(n) {
        const self = this;
        return new Iter((function* takeImpl() {
            let count = 0;
            for (const item of self) {
                if (count++ >= n) {
                    break;
                }
                yield item;
            }
        })());
    }
    /**
     * Skips the first `n` items.
     * @param n Number of items to skip.
     * @returns A new Iter without the first `n` items.
     */
    drop(n) {
        const self = this;
        return new Iter((function* dropImpl() {
            let count = 0;
            for (const item of self) {
                if (count++ < n) {
                    continue;
                }
                yield item;
            }
        })());
    }
    /**
     * Maps each item to an iterable and flattens the result.
     * @param mapper Mapping function returning an iterable.
     * @returns A new Iter of flattened values.
     */
    flatMap(mapper) {
        const self = this;
        return new Iter((function* flatMapImpl() {
            for (const item of self) {
                yield* mapper(item);
            }
        })());
    }
    /**
     * Applies a function to each item (eager evaluation).
     * @param callback Function to apply to each item.
     */
    forEach(callback) {
        for (const item of this) {
            callback(item);
        }
    }
    /**
     * Reduces items to a single value.
     * @param reducer Reducer function.
     * @param initial Initial accumulator value.
     * @returns The reduced value.
     * @throws TypeError if the iterator is empty and no initial value is provided.
     */
    reduce = function reduce(fn, initial) {
        let ac = initial;
        let set = false;
        for (const item of this) {
            if (ac === undefined) {
                ac = item;
                set = true;
                continue;
            }
            ac = fn(ac, item);
        }
        if (!set) {
            throw TypeError("Empty iterator cannot be reduced without initial value");
        }
        return ac;
    };
    /**
     * Finds the first item matching the predicate.
     * @param fn Predicate function.
     * @returns The first matching item, or undefined.
     */
    find(fn) {
        for (const item of this) {
            if (fn(item)) {
                return item;
            }
        }
        return undefined;
    }
    /**
     * Checks if all items match the predicate.
     * @param predicate Predicate function.
     * @returns True if all items match, false otherwise.
     */
    every(predicate) {
        for (const item of this) {
            if (!predicate(item)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if any item matches the predicate.
     * @param predicate Predicate function.
     * @returns True if any item matches, false otherwise.
     */
    some(predicate) {
        for (const item of this) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Eagerly collects all items into an array.
     * @returns An array of all items.
     */
    toArray() {
        return Array.from(this);
    }
    /**
     * Finds the minimum element based on a provided selector function.
     * Returns `undefined` if the iterator is empty.
     *
     * @param selector - Function returning a value for comparison.
     * @returns The element with the lowest value according to `selector`,
     * or `undefined` if this iterator is empty.
     */
    minBy = function minBy(selector, config) {
        let minItem;
        let minValue;
        let set = false;
        const col = new Intl.Collator(config?.locale, config);
        for (const item of this) {
            if (!set) {
                minItem = item;
                minValue = selector(minItem);
                set = true;
                continue;
            }
            const value = selector(item);
            if (typeof value === "string" && typeof minValue === "string") {
                minItem = col.compare(value, minValue) < 0 ? item : minItem;
            }
            else if (value instanceof Date && minValue instanceof Date) {
                minItem = value.valueOf() < minValue.valueOf() ? item : minItem;
            }
            else {
                minItem = value < minValue ? item : minItem;
            }
            minValue = selector(minItem);
        }
        return minItem;
    };
    /**
     * Finds the maximum element based on a provided selector function.
     * Returns `undefined` if the iterator is empty.
     *
     * @param selector - Function returning a value for comparison.
     * @returns The element with the highest value according to `selector`,
     * or `undefined` if this iterator is empty.
     */
    maxBy = function maxBy(selector, config) {
        let maxItem;
        let maxValue;
        let set = false;
        const col = new Intl.Collator(config?.locale, config);
        for (const item of this) {
            if (!set) {
                maxItem = item;
                maxValue = selector(maxItem);
                set = true;
                continue;
            }
            const value = selector(item);
            if (typeof value === "string" && typeof maxValue === "string") {
                maxItem = col.compare(value, maxValue) > 0 ? item : maxItem;
            }
            else if (value instanceof Date && maxValue instanceof Date) {
                maxItem = value.valueOf() > maxValue.valueOf() ? item : maxItem;
            }
            else {
                maxItem = value > maxValue ? item : maxItem;
            }
            maxValue = selector(maxItem);
        }
        return maxItem;
    };
    /**
     * @returns A new Iter of tuples [index, value].
     */
    indexed() {
        const self = this;
        return new Iter((function* indexedImpl() {
            let i = 0;
            for (const item of self) {
                yield [i++, item];
            }
        })());
    }
    /**
     * Repeats the iterable `times` times.
     * @param times Number of repetitions.
     * @returns A new Iter with repeated values.
     */
    repeat(times) {
        const self = this;
        return new Iter((function* repeatImpl() {
            for (let i = 0; i < times; i++) {
                yield* self;
            }
        })());
    }
}
//# sourceMappingURL=iter.js.map