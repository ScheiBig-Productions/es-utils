/**
 * A reusable retry executor with exponential backoff.
 *
 * Provides a configurable exponential‑backoff retry
 * mechanism with optional jitter, early‑cancel semantics, and aggregated
 * error reporting. It is suitable for connection logic, service discovery,
 * and any asynchronous operation that may require repeated attempts.
 *
 * Example:
 * ```ts
 * const retry = new Retry({ maxAttempts: 5 });
 * const result = await retry.run(() => fetch("http://localhost:3000"));
 * ```
 */
export interface Retry {
    /**
     * Initial delay before the first retry (in milliseconds).
     * Must be zero or greater.
     * @default 500
     */
    readonly initialDelay: number;
    /**
     * Exponential growth factor applied to the delay.
     * Must be greater than zero.
     * @default 1.8
     */
    readonly growth: number;
    /**
     * Jitter ratio applied to each delay.
     * Must be zero or greater.
     * @default 0.2
     */
    readonly jitter: number;
    /**
     * Maximum duration of retry campaign (in milliseconds).
     * Must be greater than zero.
     * @default 20000
     */
    readonly timeout: number;
    /**
     * Maximum number of retry attempts.
     * Must be greater than zero.
     * @default Infinity
     */
    readonly maxAttempts: number;
    /**
     * Executes an asynchronous function repeatedly until it succeeds,
     * is cancelled, or exceeds the maximum number of attempts.
     *
     * @template TRet The resolved type of the asynchronous function.
     * @template TErr The resolved type of error handler.
     *
     * @param fn The asynchronous operation to retry.
     * Optionally, might accept `AbortController` used by runner to cancel after timeout.
     * @param onEachError Optional error handler invoked after each failure.
     * Returning any non‑`undefined` value triggers early cancellation.
     * Allows for introspection of error, which gives ability to report that it happened.
     * @returns A promise resolving to the successful result of `fn`.
     *
     * @throws {Retry.CancelException}
     * Thrown when the error handler returns a non‑`undefined` value, caused by such value.
     *
     * @throws {Retry.TimeoutException}
     * Thrown when all retry attempts fail, caused by array of all errors.
     */
    run: <TRet, TErr = never>(this: Retry, fn: (() => Promise<TRet>) | ((signal: AbortSignal) => Promise<TRet>), onEachError?: (err: unknown, attempt: number, nextDelay: number) => TErr | undefined) => Promise<TRet | TErr>;
}
/**
 * Constructor interface for {@link Retry}.
 *
 * Supports both `new Retry(...)` and `Retry(...)` usage.
 */
export interface RetryConstructor {
    /**
     * Creates a new Retry runner.
     *
     * @param config Configuration object controlling backoff behavior.
     *
     * @throws {RangeError} If any configuration value violates constraints:
     * - `growth <= 0`
     * - `timeout <= 0`
     * - `maxAttempts <= 0`
     * - `initialDelay < 0`
     * - `jitter < 0`
     */
    new (config?: Retry.Config): Retry;
    /**
     * Creates a new Retry runner.
     *
     * @param config Configuration object controlling backoff behavior.
     *
     * @throws {RangeError} If any configuration value violates constraints:
     * - `growth <= 0`
     * - `timeout <= 0`
     * - `maxAttempts <= 0`
     * - `initialDelay < 0`
     * - `jitter < 0`
     */
    (config?: Retry.Config): Retry;
    prototype: Retry;
    /**
     * Exception thrown when retrying is cancelled early due to a critical error.
     */
    CancelError: Retry.CancelErrorConstructor;
    /**
     * Exception thrown when all retry attempts are exhausted.
     */
    TimeoutError: Retry.TimeoutErrorConstructor;
}
export declare const Retry: RetryConstructor;
export declare namespace Retry {
    /**
     * Configuration options for {@link Retry} constructor.
     */
    interface Config {
        /**
         * Initial delay before the first retry (in milliseconds).
         * Must be zero or greater.
         * @default 500
         */
        initialDelay?: number;
        /**
         * Exponential growth factor applied to the delay.
         * Must be greater than zero.
         * @default 1.8
         */
        growth?: number;
        /**
         * Jitter ratio applied to each delay.
         * Must be zero or greater.
         * @default 0.2
         */
        jitter?: number;
        /**
         * Maximum duration of retry campaign (in milliseconds).
         * Must be greater than zero.
         * @default Infinity
         */
        timeout?: number;
        /**
         * Maximum number of retry attempts.
         * Must be greater than zero.
         * @default 5
         */
        maxAttempts?: number;
    }
    /**
     * Exception thrown when retrying is cancelled early due to a critical error.
     */
    interface CancelError<E = unknown> extends Error {
        /**
         * The value returned by the error handler that triggered cancellation.
         */
        cause: E;
    }
    /**
     * Constructor interface for {@link CancelError}.
     *
     * Supports both `new CancelError(...)` and `CancelError(...)` usage.
     */
    interface CancelErrorConstructor {
        /**
         * Creates new `CancelError` with provided cause.
         */
        new <E = unknown>(cause: E): CancelError<E>;
        /**
         * Creates new `CancelError` with provided cause.
         */
        <E = unknown>(cause: E): CancelError<E>;
        prototype: CancelError;
    }
    /**
     * Exception thrown when all retry attempts are exhausted.
     */
    interface TimeoutError extends Error {
        /**
         * Array of all errors thrown during retry attempts.
         */
        cause: Array<unknown>;
        /**
         * Type of timeout:
         * - "attempt" - too many attempts,
         * - "timeout" - flat timeout reached,
         */
        type: "attempt" | "timeout";
    }
    /**
     * Constructor interface for {@link TimeoutError}.
     *
     * Supports both `new TimeoutError(...)` and `TimeoutError(...)` usage.
     */
    interface TimeoutErrorConstructor {
        /**
         * Creates new `TimeoutError` with provided cause.
         */
        new (cause: Array<unknown>, type: "attempt" | "timeout"): TimeoutError;
        /**
         * Creates new `TimeoutError` with provided cause.
         */
        (cause: Array<unknown>, type: "attempt" | "timeout"): TimeoutError;
        prototype: TimeoutError;
    }
}
//# sourceMappingURL=Retry.d.ts.map