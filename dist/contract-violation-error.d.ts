/**
 * Provides ES5 callable-class error, that is idiomatic for use in contracts and assertions.
 *
 * Per callable-class convention, class can be constructed with or without `new` keyword.
 * @module
 */
/**
 * Represents a runtime contract violation - typically thrown when a function
 * is called in a way that should never happen under correct program logic.
 *
 * Internally used by `Error.never` and `Object.require`.
 */
export interface ContractViolationError extends Error {
    /**
     * Cause of contract violation.
     *
     * This is only customizable part of error, as `message` is pre-set by implementation.
     * */
    cause?: string | Error;
}
/**
 * Callable-Constructor interface for {@link ContractViolationError}.
 *
 * Per callable-class convention, class can be constructed with or without `new` keyword.
 */
export interface ContractViolationErrorConstructor {
    /**
     * Creates new `ContractViolationError` with provided cause and preset message.
     *
     * @param cause - Cause of contract violation.
     */
    new (cause?: string | Error): ContractViolationError;
    /**
     * Creates new `ContractViolationError` with provided cause and preset message.
     *
     * @param cause - Cause of contract violation.
     */
    (cause?: string | Error): ContractViolationError;
    prototype: ContractViolationError;
}
/**
 * Callable-Constructor for {@link ContractViolationError}.
 *
 * Per callable-class convention, class can be constructed with or without `new` keyword.
 */
export declare const ContractViolationError: ContractViolationErrorConstructor;
//# sourceMappingURL=contract-violation-error.d.ts.map