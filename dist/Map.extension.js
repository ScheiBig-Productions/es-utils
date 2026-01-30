/* eslint-disable @typescript-eslint/no-explicit-any --
 * Following practices set in lib.es.d.ts
 */
import { Object_tag } from "./common/object-tag.js";
Map.groupBy ??= function groupBy(items, keySelector) {
    const result = new Map();
    for (let i = 0; i < items.length; i++) {
        const key = keySelector(items[i], i);
        if (!result.has(key)) {
            result.set(key, []);
        }
        result.get(key)
            ?.push(items[i]);
    }
    return result;
};
Map.Indexed ??= class IndexedMap extends Map {
    $;
    constructor(entries) {
        super(entries ?? []);
        this.$ = new Proxy(Object.defineProperty({}, Symbol.toStringTag, {
            value: "Map Proxy",
            enumerable: false,
            writable: true,
            configurable: true,
        }), {
            get: (_, prop) => this.get(prop),
            set: (_, prop, value) => ((this.set(prop, value), true)),
            deleteProperty: (_, prop) => this.delete(prop),
            has: (_, prop) => this.has(prop),
            ownKeys: () => Array.from(this.keys()),
            getOwnPropertyDescriptor: (_, prop) => {
                if (this.has(prop)) {
                    return {
                        configurable: true,
                        enumerable: true,
                        value: this.get(prop),
                        writable: true,
                    };
                }
                return undefined;
            },
        });
    }
};
Object_tag(Map.Indexed);
//# sourceMappingURL=Map.extension.js.map