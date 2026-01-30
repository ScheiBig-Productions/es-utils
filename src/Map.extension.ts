/* eslint-disable @typescript-eslint/no-explicit-any --
 * Following practices set in lib.es.d.ts
 */

import type { Mutable } from "./types.js"

import { Object_tag } from "./common/object-tag.js"

/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */


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

	interface MapConstructor {
		// eslint-disable-next-line @typescript-eslint/naming-convention -- Internal class
		readonly Indexed: IndexedMapConstructor,
	}
}

Map.groupBy ??= function groupBy<T, K>(
	items: ArrayLike<T>,
	keySelector: (item: T, index: number) => K,
): Map<K, Array<T>> {
	const result = new Map<K, Array<T>>()
	for (let i = 0; i < items.length; i++) {
		const key = keySelector(items[i], i)
		if (!result.has(key)) {
			result.set(key, [])
		}
		result.get(key)
			?.push(items[i])
	}
	return result
}

; (
	Map as Mutable<MapConstructor>
).Indexed ??= class IndexedMap<K extends string | symbol, V> extends Map<K, V> {
	readonly $: Record<K, V>

	constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
		super(entries ?? [])

		this.$ = new Proxy(
			Object.defineProperty({} as Record<K, V>, Symbol.toStringTag, {
				value: "Map Proxy",
				enumerable: false,
				writable: true,
				configurable: true,
			}),
			{
				get: (_, prop: string | symbol) => this.get(prop as K),
				set: (_, prop: string | symbol, value: V) => (
					(this.set(prop as K, value), true)
				),
				deleteProperty: (_, prop: string | symbol) => this.delete(prop as K),
				has: (_, prop: string | symbol) => this.has(prop as K),
				ownKeys: () => Array.from(this.keys()),
				getOwnPropertyDescriptor: (_, prop: string | symbol) => {
					if (this.has(prop as K)) {
						return {
							configurable: true,
							enumerable: true,
							value: this.get(prop as K),
							writable: true,
						}
					}
					return undefined
				},
			},
		)
	}
} as IndexedMapConstructor
Object_tag(Map.Indexed)
