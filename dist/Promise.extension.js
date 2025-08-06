/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */
Promise.factory ??= function promiseFactory(producer) {
    // const base = async () => await producer()
    const base = producer;
    const factory = Object.assign(base, {
        alwaysThen(onfulfilled, onrejected) {
            return Promise.factory(async (...args) => await base(...args)
                .then(onfulfilled, onrejected));
        },
        alwaysCatch(onrejected) {
            return Promise.factory(async (...args) => await base(...args)
                .catch(onrejected));
        },
        alwaysFinally(onfinally) {
            return Promise.factory(async (...args) => await base(...args)
                .finally(onfinally));
        },
    });
    return factory;
};
export {};
//# sourceMappingURL=Promise.extension.js.map