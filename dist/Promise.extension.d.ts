import type { PromiseFactory } from "./promise-factory.js";
type TemporalishDuration = {
    total: (unit: "milliseconds" | (string & {})) => number;
};
interface AfterFn {
    /**
     * Returns new Promise, that fulfills after given delay.
     */
    (delay: number | TemporalishDuration): Promise<void>;
    /**
     * Returns new Promise, that fulfills after given delay.
     */
    (args: {
        delay: number | TemporalishDuration;
        signal?: AbortSignal;
    }): Promise<void>;
    /**
     * Returns new Promise, that fulfills after given delay to specified value.
     */
    <T>(args: {
        delay: number | TemporalishDuration;
        signal?: AbortSignal;
        value: T;
    }): Promise<T>;
}
/**
 * Augments the global PromiseConstructor with a `factory` method.
 */
declare global {
    interface PromiseConstructor {
        /**
         * Wraps a Promise-producing function into a chainable factory.
         *
         * Returned factory contains `always${do}` functions, where `do` corresponds
         * to Promise API (`then`, `catch`, `finally`).
         *
         * @template TRes The resolved value type of the Promise.
         * @template TArgs The argument types accepted by the producer function.
         * @param producer - A function that returns a Promise.
         * @returns A PromiseFactory with promise-like API chaining methods.
         */
        factory: <TRes, TArgs extends ReadonlyArray<unknown>>(producer: (...args: TArgs) => Promise<TRes>) => PromiseFactory<TRes, TArgs>;
        /**
         * Returns new Promise, that fulfills after given delay to specified value.
         *
         * Uses promise-based `setTimeout` on node.js-compatible engines.
         */
        after: AfterFn;
    }
}
export {};
//# sourceMappingURL=Promise.extension.d.ts.map