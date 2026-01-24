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
let nodeSetTimeout = null;
try {
    const timers = await import("node:timers/promises");
    if (timers?.setTimeout) {
        nodeSetTimeout = timers.setTimeout;
    }
}
catch {
    nodeSetTimeout = null;
}
Promise.after ??= async function after(delay, value) {
    const actualDelay = typeof delay === "number"
        ? delay
        : delay.total("milliseconds");
    if (nodeSetTimeout) {
        return await nodeSetTimeout(actualDelay, value);
    }
    return await new Promise((res) => void setTimeout(() => res(value), actualDelay));
};
export {};
//# sourceMappingURL=Promise.extension.js.map