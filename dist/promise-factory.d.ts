/**
 * A factory wrapper around Promise-producing functions, enabling pipe-like chaining
 * of `.then`, `.catch`, and `.finally` behavior with deferred execution.
 *
 * @template TRes The resolved value type of the Promise.
 * @template TArgs The argument types accepted by the producer function.
 */
export interface PromiseFactory<TRes, TArgs extends ReadonlyArray<unknown>> {
    /**
     * Executes the wrapped Promise-producing function.
     * @returns A Promise of type T.
     */
    (...args: TArgs): Promise<TRes>;
    /**
     * Chains a `.then` call onto the factory.
     *
     * @template TFulRes The result type after fulfillment.
     * @template TRejRes The result type after rejection.
     * @param onfulfilled - Callback for successful resolution.
     * @param onrejected - Callback for rejection.
     * @returns A new PromiseFactory with the transformed result.
     */
    alwaysThen: <TFulRes = TRes, TRejRes = never>(onfulfilled?: (value: TRes) => TFulRes | PromiseLike<TFulRes>, onrejected?: (reason: unknown) => TRejRes | PromiseLike<TRejRes>) => PromiseFactory<TFulRes | TRejRes, TArgs>;
    /**
     * Chains a `.catch` call onto the factory.
     *
     * @template TRejRes The result type after rejection.
     * @param onrejected Callback for rejection.
     * @returns A new PromiseFactory with the transformed result.
     */
    alwaysCatch: <TRejRes = TRes>(onrejected: (reason: unknown) => TRejRes | PromiseLike<TRejRes>) => PromiseFactory<TRes | TRejRes, TArgs>;
    /**
     * Chains a `.finally` call onto the factory.
     *
     * @param onfinally Callback executed regardless of resolution or rejection.
     * @returns A new PromiseFactory with the same result type.
     */
    alwaysFinally: (onfinally: () => void) => PromiseFactory<TRes, TArgs>;
}
//# sourceMappingURL=promise-factory.d.ts.map