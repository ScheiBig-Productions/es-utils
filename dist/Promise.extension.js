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
    nodeSetTimeout = timers?.setTimeout ?? null;
}
catch {
    nodeSetTimeout = null;
}
Promise.after ??= async function after(args) {
    const { delay, signal, value } = typeof args === "number" || !("delay" in args)
        ? { delay: args }
        : args;
    const actualDelay = typeof delay === "number"
        ? delay
        : delay.total("milliseconds");
    if (nodeSetTimeout) {
        return await nodeSetTimeout(actualDelay, value, signal ? { signal } : undefined);
    }
    return await new Promise((res, rej) => {
        if (signal?.aborted) {
            rej(signal.reason);
        }
        // eslint-disable-next-line prefer-const -- how do you expect me to assign to frozen const?
        let abort;
        const tid = setTimeout(() => {
            signal?.removeEventListener("abort", abort);
            res(value);
        }, actualDelay);
        abort = () => {
            clearTimeout(tid);
            signal?.removeEventListener("abort", abort);
            rej(signal?.reason);
        };
        if (signal) {
            signal.addEventListener("abort", abort);
        }
    });
};
export {};
//# sourceMappingURL=Promise.extension.js.map