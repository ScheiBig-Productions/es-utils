/**
 * Represents a runtime contract violation - typically thrown when a function
 * is called in a way that should never happen under correct program logic.
 *
 * Internally used by `Error.never`
 *
 * This error is designed to be used both with and without the `new` keyword,
 * and mimics native `Error` behavior as closely as possible in ES5-compatible environments.
 */
export interface ContractViolationError extends Error {
    /**
     * Cause of contract violation. In `Error.never`, this is populated by `msg`.
     *
     * This is only customizable part of error, as `message` is pre-set by implementation.
     * */
    cause?: string | Error;
}
/**
 * Constructor interface for {@link ContractViolationError}.
 *
 * Supports both `new ContractViolationError(...)` and `ContractViolationError(...)` usage.
 */
export interface ContractViolationErrorConstructor {
    /**
     * Creates new `ContractViolationError` with provided cause and preset message.
     *
     * @param cause - Cause of contract violation. In `Error.never`, this is populated by `msg`.
     */
    new (cause?: string | Error): ContractViolationError;
    /**
     * Creates new `ContractViolationError` with provided cause and preset message.
     *
     * @param cause - Cause of contract violation. In `Error.never`, this is populated by `msg`.
     */
    (cause?: string | Error): ContractViolationError;
    prototype: ContractViolationError;
}
/**
 * Constructor for {@link ContractViolationError}.
 *
 * Supports both `new ContractViolationError(...)` and `ContractViolationError(...)` usage.
 */
export declare const ContractViolationError: ContractViolationErrorConstructor;
//# sourceMappingURL=contract-violation-error.d.ts.map