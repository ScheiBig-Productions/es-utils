/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
fetch.factory ??= function factory(url, init) {
    return async function fetchFactoryCreation(config) {
        const resolvedUrl = typeof url === "function"
            ? url(config)
            : url;
        const resolvedInit = init === undefined
            ? undefined
            : typeof init === "function"
                ? init(config)
                : init;
        return await fetch(resolvedUrl, resolvedInit);
    };
};
export {};
//# sourceMappingURL=fetch.extension.js.map