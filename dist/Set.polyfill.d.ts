export {};
declare global {
    interface Set<T> {
        /**
         * @returns a new Set containing elements in this set but not in the other.
         */
        difference: (this: Set<T>, other: Set<T>) => Set<T>;
        /**
         * @returns a new Set containing elements present in both sets.
         */
        intersection: (this: Set<T>, other: Set<T>) => Set<T>;
        /**
         * @returns a new Set containing elements in either set but not both.
         */
        symmetricDifference: (this: Set<T>, other: Set<T>) => Set<T>;
        /**
         * @returns a new Set containing all elements from both sets.
         */
        union: (this: Set<T>, other: Set<T>) => Set<T>;
        /**
         * @returns true if the sets share no elements.
         */
        isDisjointFrom: (this: Set<T>, other: Set<T>) => boolean;
        /**
         * @returns true if this set is a subset of the other.
         */
        isSubsetOf: (this: Set<T>, other: Set<T>) => boolean;
        /**
         * @returns true if this set is a superset of the other.
         */
        isSupersetOf: (this: Set<T>, other: Set<T>) => boolean;
    }
}
//# sourceMappingURL=Set.polyfill.d.ts.map