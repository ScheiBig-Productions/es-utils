declare global {
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
         * map.idx["foo"]
         * map.idx.foo
         *
         * map.set("baz", 3)
         * // vs
         * map.idx["qux"] = 4
         * map.idx.qux = 4
         *
         * map.has("baz")
         * // vs
         * "baz" in map.idx
         *
         * map.delete("bar")
         * // vs
         * delete map.idx["baz"]
         */
        readonly $: Record<K, V>;
    }
    interface IndexedMapConstructor {
        /**
         * Creates a new `Map.Indexed` object with general signature.
         */
        new (): IndexedMap<string, any>;
        /**
         * Creates a new `Map.Indexed` object with specific signature.
         *
         * @param entries - Array of entries to pre-populate map with.
         */
        new <K extends string, V>(entries?: ReadonlyArray<readonly [K, V]> | null): IndexedMap<K, V>;
        readonly prototype: IndexedMap<string, any>;
    }
    interface MapConstructor {
        readonly Indexed: IndexedMapConstructor;
    }
}
export {};
//# sourceMappingURL=Map.extension.d.ts.map