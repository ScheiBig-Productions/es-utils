declare global {
    interface ErrorConstructor {
        /**
         * Trips on contract violation.
         *
         * This call, as name suggests, should never be performed - it should be short-circuited
         * by truthy value or condition, that by contract should always be present.
         *
         * Logs context and throws error.
         *
         * @param msg - Optional message or error instance.
         * It is strongly recommended that message is provided for logging purpose.
         * @param context - Additional debug info.
         * @throws {ContractViolationError}
         * @see {@link ContractViolationError}
         */
        never: (msg?: string | Error, ...context: Array<any>) => never;
        /**
         * Determines whether a given value is a genuine Error object.
         * This includes native Error types like Error, TypeError, DOMException, etc.
         *
         * @param value - The value to test.
         * @returns `true` if the value is an actual Error object; otherwise `false`.
         *
         * @example
         * Error.isError(new Error()); // true
         * Error.isError({ message: "fail" }); // false
         */
        isError: (value: unknown) => value is InstanceType<typeof Error | typeof DOMException>;
        /**
         * Determines whether a given value is "error-like" - meaning it structurally
         * resembles an Error object (has `name`, `message`, and optionally `stack` and `cause`;
         * all of proper types).
         *
         * Useful for detecting errors from libraries that avoid subclassing Error.
         *
         * @param value - The value to test.
         * @returns `true` if the value looks like an Error object; otherwise `false`.
         *
         * @example
         * errorLike({ name: "CustomError", message: "Oops" }); // true
         * errorLike("fail"); // false
         */
        errorLike: (value: unknown) => value is Error;
    }
}
export {};
//# sourceMappingURL=Error.extension.d.ts.map