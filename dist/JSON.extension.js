/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */
/* eslint-disable @typescript-eslint/no-explicit-any --
 * Following original API.
 */
JSON.maybeStringify ??= function maybeStringify(value, replacer, space) {
    try {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
         * Unsafe cast to silence overload usage.
         */
        return JSON.stringify(value, replacer, space);
    }
    catch {
        return String(value);
    }
};
export {};
//# sourceMappingURL=JSON.extension.js.map