/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
Object.omit ??= function omit(obj, ...keys) {
    return Object.fromEntries(Object.entries(obj)
        .filter(([key]) => !keys.includes(key)));
};
Object.partial ??= function partial(obj, ..._keys) {
    return obj;
};
Object.pick ??= function pick(obj, ...keys) {
    return Object.fromEntries(Object.entries(obj)
        .filter(([key]) => keys.includes(key)));
};
Object.require ??= function require(value) {
    if (value === null || value === undefined) {
        throw TypeError("Value cannot be null or undefined");
    }
    return value;
};
/* eslint-disable-next-line @typescript-eslint/unbound-method --
 * This function assignment intentionally mirrors native prototype methods,
 * which are unbound by design (e.g. `[].map`, `[].find`, etc.).
 * Consumers should call via array instance to preserve `this` context:
 * e.g. `array.with(...)`, not `const fn = array.with; fn(...)`
 */
Object.else ??= {
    else(val, fallback) {
        // First overload
        if (typeof fallback === "function") {
            const orElse = fallback;
            return val ?? orElse(val === undefined ? "undef" : "null");
        }
        // Guard against invalid fallback object
        if (typeof fallback !== "object" || fallback === null) {
            throw TypeError("Invalid overload: missing fallbacks.");
        }
        const ifNull = "null" in fallback ? fallback.null : () => null;
        const ifUndef = "undef" in fallback ? fallback.undef : () => undefined;
        if (val === null) {
            return ifNull();
        }
        if (val === undefined) {
            return ifUndef();
        }
        return val;
    },
}.else;
export {};
//# sourceMappingURL=Object.extension.js.map