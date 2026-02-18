interface ElseFn {
    /**
     * Returns the provided value if it is defined, otherwise returns
     * the result of the fallback.
     *
     * @param val - Value to inspect for `null` or `undefined.
     * @param fallbacks - Function to invoke if `val` is `null` or `undefined`,
     * returning a replacement value.
     * @returns `val` if defined; otherwise result of `fallback()`.
     */
    <T, R>(val: T | null | undefined, fallback: (why: "null" | "undef") => R): T | R;
    /**
     * Returns the provided value if it's not `null`, otherwise returns
     * the result of the fallback.
     *
     * @param val - Value to inspect for `null`.
     * @param fallbacks - Object with function to invoke if `val` is `null`,
     * returning a replacement value.
     * @returns `val` if defined; otherwise result of `fallbacks.null()`.
     */
    <T, R>(val: T | null, fallbacks: {
        null: () => R;
    }): T | R;
    /**
     * Returns the provided value if it's not `undefined`, otherwise returns
     * the result of the fallback.
     *
     * @param val - Value to inspect for `undefined`.
     * @param fallbacks - Object with function to invoke if `val` is `undefined`,
     * returning a replacement value.
     * @returns `val` if defined; otherwise result of `fallbacks.undef()`.
     */
    <T, R>(val: T | undefined, fallbacks: {
        undef: () => R;
    }): T | R;
    /**
     * Returns the provided value if it is defined, otherwise returns
     * the result of the fallback.
     *
     * @param val - Value to inspect for `null` or `undefined.
     * @param fallbacks - Object with functions to invoke if `val` is `null` or `undefined`,
     * returning a replacement value.
     * @returns `val` if defined; result of `fallbacks.null()` if `val` is `null`,
     * result of `fallbacks.undef()` otherwise.
     */
    <T, R, S>(val: T | null | undefined, fallbacks: {
        null: () => R;
        undef: () => S;
    }): T | R | S;
}
interface LetFn {
    /**
     * Applies mapping to value, if it is defined, otherwise returns
     * the value itself.
     *
     * @param val - Value to inspect for `null` or `undefined.
     * @param mapping - Mapping function to be applied to `val` if val is not nullish.
     * @param passthrough - Type of non-defined `val` that is allowed to be returned
     * without mapping - defaults to "nullish".
     * @returns `mapping` result if val is not nullish, otherwise `val`.
     */
    <T, R>(val: T, mapping: (it: Exclude<T, null | undefined>) => R, passthrough?: "nullish"): R | Extract<T, null | undefined>;
    /**
     * Applies mapping to value, if it is defined, otherwise returns
     * the value itself.
     *
     * @param val - Value to inspect for `null`.
     * @param mapping - Mapping function to be applied to `val` if val is not null.
     * @param passthrough - Type of non-defined `val` that is allowed to be returned
     * without mapping - defaults to "nullish".
     * @returns `mapping` result if val is not null, otherwise `val`.
     */
    <T, R>(val: T, mapping: (it: Exclude<T, null>) => R, passthrough: "null"): R | Extract<T, null>;
    /**
     * Applies mapping to value, if it is defined, otherwise returns
     * the value itself.
     *
     * @param val - Value to inspect for `undefined`.
     * @param mapping - Mapping function to be applied to `val` if val is not undefined.
     * @param passthrough - Type of non-defined `val` that is allowed to be returned
     * without mapping - defaults to "nullish".
     * @returns `mapping` result if val is not undefined, otherwise `val`.
     */
    <T, R>(val: T | undefined, mapping: (it: Exclude<T, undefined>) => R, passthrough: "undef"): R | Extract<T, undefined>;
}
interface AlsoFn {
    /**
     * Applies builder to value and then returns the value itself.
     *
     * @param val - Value to inspect for being defined.
     * @param builder - Function that is applied to `val` before return.
     * @returns Promise to `val` with applied `builder` configuration.
     */
    <T>(value: T, builder: (it: T) => Promise<void>): Promise<T>;
    /**
     * Applies builder to value and then returns the value itself.
     *
     * @param val - Value to inspect for being defined.
     * @param builder - Function that is applied to `val` before return.
     * @returns `val` with applied `builder` configuration.
     */
    <T>(value: T, builder: (it: T) => void): T;
}
declare global {
    interface ObjectConstructor {
        /**
         * Removes specified keys from the object, returning a new object without them.
         * Runtime equivalent of `Omit<Type, Keys>`.
         *
         * @param obj - Source object to omit keys from.
         * @param keys - Keys to exclude.
         * @returns A new object with selected keys removed.
         */
        omit: <T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: Array<K>) => Omit<T, K>;
        /**
         * Returns the same object, but with specified keys marked optional.
         * Runtime equivalent of `Partial<Pick<T, K>> & Omit<T, K>`.
         *
         * Does not modify returned `obj` in any way.
         *
         * @param obj - Source object.
         * @param keys - Keys to mark optional.
         * @returns The object with relaxed type constraints on provided keys.
         */
        partial: <T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: Array<K>) => Omit<T, K> & Partial<Pick<T, K>>;
        /**
         * Picks only the specified keys from the object, returning a new one.
         * Runtime equivalent of `Pick<Type, Keys>`.
         *
         * @param obj - Source object to pick from.
         * @param keys - Keys to include.
         * @returns A new object with only the selected keys.
         */
        pick: <T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: Array<K>) => Pick<T, K>;
        /**
         * Ensures value is defined.
         * Runtime equivalent of `NonNullable<Type>`.
         *
         * @param value - Value to verify.
         * @returns The same value if not null or undefined.
         * @throws {@link ContractViolationError} if value is nullish.
         */
        require: <T>(value: T | null | undefined) => T;
        /**
         * Returns the provided value if it is defined, otherwise returns
         * the result of the fallback.
         *
         * @param val - Value to inspect for `null`.
         * @returns `val` if defined; result of fallback result in given other case.
         */
        else: ElseFn;
        /**
         * Applies mapping to value, if it is defined, otherwise returns
         * the value itself.
         *
         * @param val - Value to inspect for being defined.
         * @param mapping - Mapping function to be applied to `val` if val is not nullish.
         * @param passthrough - Type of non-defined `val` that is allowed to be returned
         * without mapping - defaults to "nullish".
         * @returns `mapping` result if val is not defined, otherwise `val`.
         */
        let: LetFn;
        /**
         * Applies builder to value and then returns the value itself.
         *
         * If builder is asynchronous, then result of function also is.
         *
         * @param val - Value to inspect for being defined.
         * @param builder - Function that is applied to `val` before return.
         * @returns `val` with applied `builder` configuration.
         */
        also: AlsoFn;
        /**
         * Tags class with {@link Symbol.toStringTag}.
         *
         * @param ctor - Class (constructor function) that should be tagged
         * @param name - Name to tag with; if omitted, `ctor.name` is used
         */
        tag: (ctor: new (...args: Array<any>) => unknown, name?: string) => void;
    }
}
export {};
//# sourceMappingURL=Object.extension.d.ts.map