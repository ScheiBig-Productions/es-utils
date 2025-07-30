export {};
declare global {
    interface ObjectConstructor {
        /**
         * Groups array items by a key derived from each element.
         * Returns an object mapping keys to arrays of grouped items.
         *
         * @param items - Array-like input to group.
         * @param keySelector - Function selecting a key for each item.
         * @returns An object with grouped arrays keyed by selected values.
         */
        groupBy: <T, K extends PropertyKey>(items: ArrayLike<T>, keySelector: (item: T, index: number) => K) => Partial<Record<K, Array<T>>>;
    }
}
//# sourceMappingURL=Object.polyfill.d.ts.map