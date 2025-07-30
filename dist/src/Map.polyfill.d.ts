export {};
declare global {
    interface MapConstructor {
        /**
         * Groups array items by a key derived from each element.
         * Returns a Map preserving insertion order and key types.
         *
         * @param items - Array-like input to group.
         * @param keySelector - Function selecting a key for each item.
         * @returns A Map with grouped arrays keyed by selected values.
         */
        groupBy: <T, K>(items: ArrayLike<T>, keySelector: (item: T, index: number) => K) => Map<K, Array<T>>;
    }
}
//# sourceMappingURL=Map.polyfill.d.ts.map