export {};
declare global {
    interface Array<T> {
        /**
         * Returns the last element that satisfies the provided testing function.
         * Iterates from the end of the array.
         *
         * @param predicate - Function to test each element.
         * @returns The last matching element, or `undefined` if none match.
         */
        findLast: (this: Array<T>, predicate: (value: T, index: number, array: Array<T>) => unknown) => T | undefined;
        /**
         * Returns the index of the last element that satisfies the provided testing function.
         * Iterates from the end of the array.
         *
         * @param predicate - Function to test each element.
         * @returns The index of the last matching element, or `-1` if none match.
         */
        findLastIndex: (this: Array<T>, predicate: (value: T, index: number, array: Array<T>) => unknown) => number;
        /**
         * Returns a copy of the array with elements reversed.
         *
         * @returns A new array with the order of elements reversed.
         */
        toReversed: (this: Array<T>) => Array<T>;
        /**
         * Returns a sorted copy of the array using optional comparator.
         *
         * @param compareFn - Optional function to define sort order.
         * @returns A new array sorted by the comparator or default behavior.
         */
        toSorted: <T>(this: Array<T>, compareFn?: (a: T, b: T) => number) => Array<T>;
        /**
         * Returns a copy of the array with some elements removed and/or replaced.
         *
         * @param start - Index to begin changing the array.
         * @param deleteCount - Number of elements to remove.
         * @param items - Items to insert into the array.
         * @returns A new array with modifications applied.
         */
        toSpliced: (this: Array<T>, start: number, deleteCount: number, ...items: Array<T>) => Array<T>;
        /**
         * Returns a copy of the array with the element at the given index replaced.
         *
         * @param index - Index of the item to replace.
         * @param value - New value to set at index.
         * @returns A new array with the item replaced.
         */
        with: (this: Array<T>, index: number, value: T) => Array<T>;
    }
}
//# sourceMappingURL=Array.polyfill.d.ts.map