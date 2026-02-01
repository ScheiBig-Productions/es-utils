/* eslint-disable no-await-in-loop --
 * Exponential backoff implementation.
 */
/* eslint-disable @typescript-eslint/naming-convention --
 * Inner classes.
 */
/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Unfortunately in some developer-unfriendly browsers (Firefox as always)
 * `Error.captureStackTrace` is alarmingly recent addition,
 * which must be assumed to be unavailable
 */
/* eslint-disable func-names --
 * Relying on name propagation from const, as shadowing would be extremely annoying here.
 */
/* eslint-disable complexity --
 * Bound single-use logic should live inside function.
 */

import type { Mutable } from "src/types.js"

import { Object_tag } from "./common/object.tag.js"

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
 * const retry = new Retry({ attempts: 5 });
 * const result = await retry.run(() => fetch("http://localhost:3000"));
 * ```
 */
export interface Retry {

	/**
	 * Initial delay before the first retry (in milliseconds).
	 * Must be zero or greater.
	 * @default 500
	 */
	readonly initialDelay: number,

	/**
	 * Exponential growth factor applied to the delay.
	 * Must be greater than zero.
	 * @default 1.8
	 */
	readonly growth: number,

	/**
	 * Jitter ratio applied to each delay.
	 * Must be zero or greater.
	 * @default 0.2
	 */
	readonly jitter: number,

	/**
	 * Maximum duration of retry campaign (in milliseconds).
	 * Must be greater than zero.
	 * @default 20000
	 */
	readonly timeout: number,

	/**
	 * Maximum number of retry attempts.
	 * Must be greater than zero.
	 * @default Infinity
	 */
	readonly attempts: number,

	/**
	 * Maximum delay between retries - delay length is clamped to this value,
	 * which is useful for "forever" retries.
	 * Must be greater than zero.
	 * @default Infinity
	 */
	readonly maxDelay: number,

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
	run: <TRet, TErr = never>(
		this: Retry,
		fn: (() => Promise<TRet>) | ((signal: AbortSignal) => Promise<TRet>),
		onEachError?: (err: unknown, attempt: number, nextDelay: number) => TErr | undefined,
	) => Promise<TRet | TErr>,
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
	 * - `initialDelay < 0`
	 * - `growth <= 0`
	 * - `jitter < 0`
	 * - `timeout <= 0`
	 * - `attempts <= 0`
	 * - `maxDelay <= 0`
	 */
	new (config?: Retry.Config): Retry,

	/**
	 * Creates a new Retry runner.
	 *
	 * @param config Configuration object controlling backoff behavior.
	 *
	 * @throws {RangeError} If any configuration value violates constraints:
	 * - `initialDelay < 0`
	 * - `growth <= 0`
	 * - `jitter < 0`
	 * - `timeout <= 0`
	 * - `attempts <= 0`
	 * - `maxDelay <= 0`
	 */
	(config?: Retry.Config): Retry,

	prototype: Retry,

	/**
	 * Exception thrown when retrying is cancelled early due to a critical error.
	 */
	CancelError: Retry.CancelErrorConstructor,

	/**
	 * Exception thrown when all retry attempts are exhausted.
	 */
	TimeoutError: Retry.TimeoutErrorConstructor,
}

export const Retry = function (
	this: Retry | undefined,
	config: Retry.Config,
) {
	// eslint-disable-next-line consistent-this -- Conditional creation of this
	const self: Mutable<Retry> = this instanceof Retry
		? this
		: Object.create(Retry.prototype) as Retry

	self.initialDelay = config?.initialDelay ?? 500
	self.growth = config?.growth ?? 1.8
	self.jitter = config?.jitter ?? 0.2
	self.timeout = config?.timeout ?? Infinity
	self.attempts = config?.attempts ?? 5
	self.maxDelay = config?.maxDelay ?? Infinity

	if (self.initialDelay < 0) {
		throw new RangeError("initialDelay must be zero or greater")
	}
	if (self.growth <= 0) {
		throw new RangeError("growth must be greater than zero")
	}
	if (self.jitter < 0) {
		throw new RangeError("jitter must be zero or greater")
	}
	if (self.timeout <= 0) {
		throw new RangeError("timeout must be greater than zero")
	}
	if (self.attempts <= 0) {
		throw new RangeError("attempts must be greater than zero")
	}
	if (self.maxDelay <= 0) {
		throw new RangeError("maxDelay must be greater than zero")
	}

	return self as Retry
} as RetryConstructor
Object_tag(Retry)

// eslint-disable-next-line id-length -- Name must be descriptive
const __INERT_SIGNAL__YOU_ARE_NOT_ALLOWED_TO_USE_IT = new AbortController().signal

Retry.prototype.run = async function run<TRet, TErr = never>(
	this: Retry,
	// eslint-disable-next-line no-shadow -- This is not a shadowing
	fn: (() => Promise<TRet>) | ((signal: AbortSignal) => Promise<TRet>),
	// eslint-disable-next-line no-shadow -- This is not a shadowing
	onEachError?: (err: unknown, attempt: number, nextDelay: number) => TErr | undefined,
): Promise<TRet | TErr> {
	const jitter = (delay: number) => delay * this.jitter * (Math.random() - 0.5) * 2
	let baseDelay = this.initialDelay
	let nextDelay = Math.max(baseDelay + jitter(baseDelay), this.maxDelay)
	let attempt = 0
	const errors = Array<unknown>()

	const signal: AbortSignal = this.timeout === Infinity
		? __INERT_SIGNAL__YOU_ARE_NOT_ALLOWED_TO_USE_IT
		: AbortSignal.timeout(this.timeout)

	while (true) {
		if (signal.aborted) {
			throw Retry.TimeoutError(errors, "timeout")
		}

		const delay = nextDelay
		baseDelay *= this.growth
		nextDelay = Math.min(baseDelay + jitter(baseDelay), this.maxDelay)
		try {
			return await fn(signal)
		} catch(err) {
			errors.push(err)

			if (signal.aborted) {
				throw Retry.TimeoutError(errors, "timeout")
			}

			if (onEachError) {
				const result = onEachError(err, attempt, nextDelay)
				if (result !== undefined) {
					throw Retry.CancelError(result)
				}
			}

			attempt++
			if (attempt >= this.attempts) {
				throw Retry.TimeoutError(errors, "attempt")
			}

			try {
				await Promise.after({ delay, signal })
			} catch {
				if (signal.aborted) {
					throw Retry.TimeoutError(errors, "timeout")
				}
			}
		}
	}
}

Retry.CancelError = function CancelError<E = unknown>(
	this: Retry.CancelError<E> | undefined,
	cause: E,
) {
	const message = "Retry cancelled due to critical error"
	// eslint-disable-next-line consistent-this -- Conditional creation of this
	const self = this instanceof Retry.CancelError
		? this
		: Object.create(Retry.CancelError.prototype) as Retry.CancelError<E>

	self.name = "CancelError"
	self.message = message
	self.cause = cause
	if (Error.captureStackTrace) {
		Error.captureStackTrace(self, Retry.CancelError)
	} else {
		// Unfortunately in some developer-unfriendly browsers (Firefox as always)
		// `Error.captureStackTrace` is alarmingly recent addition,
		// which must be assumed to be unavailable
		const { stack } = new Error(message, cause ? { cause } : {})
		if (stack) { self.stack = stack }
	}

	Object.setPrototypeOf(self, Retry.CancelError.prototype)

	return self
} as Retry.CancelErrorConstructor

Retry.CancelError.prototype = Object.create(Error.prototype) as Retry.CancelError
Retry.CancelError.prototype.constructor = Retry.CancelError
Object_tag(Retry.CancelError)


Retry.TimeoutError = function TimeoutError(
	this: Retry.TimeoutError | undefined,
	cause: Array<unknown>,
	type: "attempt" | "timeout",
) {
	const message = `Retry cancelled due to ${type === "attempt"
		? "too many attempts"
		: "too long of a timeout"
	}`
	// eslint-disable-next-line consistent-this -- Conditional creation of this
	const self = this instanceof Retry.TimeoutError
		? this
		: Object.create(Retry.TimeoutError.prototype) as Retry.TimeoutError

	self.name = "TimeoutError"
	self.message = message
	self.type = type
	self.cause = cause
	if (Error.captureStackTrace) {
		Error.captureStackTrace(self, Retry.TimeoutError)
	} else {
		// Unfortunately in some developer-unfriendly browsers (Firefox as always)
		// `Error.captureStackTrace` is alarmingly recent addition,
		// which must be assumed to be unavailable
		const { stack } = new Error(message, cause ? { cause } : {})
		if (stack) { self.stack = stack }
	}

	Object.setPrototypeOf(self, Retry.TimeoutError.prototype)

	return self
} as Retry.TimeoutErrorConstructor

Retry.TimeoutError.prototype = Object.create(Error.prototype) as Retry.TimeoutError
Retry.TimeoutError.prototype.constructor = Retry.TimeoutError
Object_tag(Retry.TimeoutError)

export namespace Retry {

	/**
	 * Configuration options for {@link Retry} constructor.
	 */
	export interface Config {

		/**
		 * Initial delay before the first retry (in milliseconds).
		 * Must be zero or greater.
		 * @default 500
		 */
		initialDelay?: number,

		/**
		 * Exponential growth factor applied to the delay.
		 * Must be greater than zero.
		 * @default 1.8
		 */
		growth?: number,

		/**
		 * Jitter ratio applied to each delay.
		 * Must be zero or greater.
		 * @default 0.2
		 */
		jitter?: number,

		/**
		 * Maximum duration of retry campaign (in milliseconds).
		 * Must be greater than zero.
		 * @default Infinity
		 */
		timeout?: number,

		/**
		 * Maximum number of retry attempts.
		 * Must be greater than zero.
		 * @default 5
		 */
		attempts?: number,

		/**
		 * Maximum delay between retries - delay length is clamped to this value,
		 * hich is useful for "forever" retries.
		 * Must be greater than zero.
		 * @default Infinity
		 */
		maxDelay?: number,
	}

	/**
	 * Exception thrown when retrying is cancelled early due to a critical error.
	 */
	export interface CancelError<E = unknown> extends Error {

		/**
		 * The value returned by the error handler that triggered cancellation.
		 */
		cause: E,
	}

	/**
	 * Constructor interface for {@link CancelError}.
	 *
	 * Supports both `new CancelError(...)` and `CancelError(...)` usage.
	 */
	export interface CancelErrorConstructor {

		/**
		 * Creates new `CancelError` with provided cause.
		 */
		new<E = unknown>(cause: E): CancelError<E>,

		/**
		 * Creates new `CancelError` with provided cause.
		 */
		<E = unknown>(cause: E): CancelError<E>,
		prototype: CancelError,
	}

	/**
	 * Exception thrown when all retry attempts are exhausted.
	 */
	export interface TimeoutError extends Error {

		/**
		 * Array of all errors thrown during retry attempts.
		 */
		cause: Array<unknown>,

		/**
		 * Type of timeout:
		 * - "attempt" - too many attempts,
		 * - "timeout" - flat timeout reached,
		 */
		type: "attempt" | "timeout",
	}

	/**
	 * Constructor interface for {@link TimeoutError}.
	 *
	 * Supports both `new TimeoutError(...)` and `TimeoutError(...)` usage.
	 */
	export interface TimeoutErrorConstructor {

		/**
		 * Creates new `TimeoutError` with provided cause.
		 */
		new (cause: Array<unknown>, type: "attempt" | "timeout"): TimeoutError,

		/**
		 * Creates new `TimeoutError` with provided cause.
		 */
		(cause: Array<unknown>, type: "attempt" | "timeout"): TimeoutError,
		prototype: TimeoutError,
	}
}

