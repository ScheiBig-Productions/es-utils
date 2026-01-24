/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
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
	cause?: string | Error,
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
	new (cause?: string | Error): ContractViolationError,

	/**
	 * Creates new `ContractViolationError` with provided cause and preset message.
	 *
	 * @param cause - Cause of contract violation. In `Error.never`, this is populated by `msg`.
	 */
	(cause?: string | Error): ContractViolationError,
	prototype: ContractViolationError,
}

/**
 * Constructor for {@link ContractViolationError}.
 *
 * Supports both `new ContractViolationError(...)` and `ContractViolationError(...)` usage.
 */
/* eslint-disable-next-line func-names --
 * Relying on name propagation from const, as shadowing would be extremely annoying here.
 */
export const ContractViolationError: ContractViolationErrorConstructor = function (
	this: ContractViolationError | undefined,
	cause?: string | Error,
): ContractViolationError {
	// eslint-disable-next-line consistent-this -- Conditional creation of this
	const self = this instanceof ContractViolationError
		? this
		: Object.create(ContractViolationError.prototype) as ContractViolationError

	const message = "This function should never be successfully called!"
	self.name = "ContractViolationError"
	self.message = message
	if (cause) {
		self.cause = cause
	}
	Error.call(self, message, cause ? { cause } : {})

	if (Error.captureStackTrace) {
		Error.captureStackTrace(self, ContractViolationError)
	} else {
		// Unfortunately in some developer-unfriendly browsers (Firefox as always)
		// `Error.captureStackTrace` is alarmingly recent addition,
		// which must be assumed to be unavailable
		const { stack } = new Error(message, cause ? { cause } : {})
		if (stack) { self.stack = stack }
	}

	Object.setPrototypeOf(self, ContractViolationError.prototype)

	return self
} as ContractViolationErrorConstructor

ContractViolationError.prototype = Object.create(Error.prototype) as ContractViolationError
ContractViolationError.prototype.constructor = ContractViolationError
