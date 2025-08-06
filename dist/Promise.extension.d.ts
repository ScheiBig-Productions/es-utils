import type { PromiseFactory } from "./promise-factory.js";
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
    }
}
//# sourceMappingURL=Promise.extension.d.ts.map