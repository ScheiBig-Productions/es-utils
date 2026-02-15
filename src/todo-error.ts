/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/

import { Object_tag } from "./common/object.tag.js"

/**
 * Represents a runtime code path violation - typically thrown when a function
 * is called because declaration is present, but implementation not.
 *
 * Internally used by `Error.todo`
 *
 * This error is designed to be used both with and without the `new` keyword,
 * and mimics native `Error` behavior as closely as possible in ES5-compatible environments.
 */
export interface TodoError extends Error {

	message: string,
	cause?: unknown,
}

/**
 * Constructor interface for {@link TodoError}.
 *
 * Supports both `new TodoError(...)` and `TodoError(...)` usage.
 */
export interface TodoErrorConstructor {

	/**
	 * Creates new `TodoError` with provided cause and message.
	 */
	new (message: string, cause?: unknown): TodoError,

	/**
	 * Creates new `TodoError` with provided cause and message.
	 */
	(message: string, cause?: unknown): TodoError,
	prototype: TodoError,
}

/**
 * Constructor for {@link TodoError}.
 *
 * Supports both `new TodoError(...)` and `TodoError(...)` usage.
 */
/* eslint-disable-next-line func-names --
 * Relying on name propagation from const, as shadowing would be extremely annoying here.
 */
export const TodoError: TodoErrorConstructor = function (
	this: TodoError | undefined,
	message: string,
	cause?: unknown,
): TodoError {
	const self = this instanceof TodoError
		? this
		: Object.create(TodoError.prototype) as TodoError

	self.name = "TodoError"
	self.message = message
	if (cause) {
		self.cause = cause
	}
	Error.call(self, message, cause ? { cause } : {})

	if (Error.captureStackTrace) {
		Error.captureStackTrace(self, TodoError)
	} else {
		// Unfortunately in some developer-unfriendly browsers (Firefox as always)
		// `Error.captureStackTrace` is alarmingly recent addition,
		// which must be assumed to be unavailable
		const { stack } = new Error(message, cause ? { cause } : {})
		if (stack) { self.stack = stack }
	}

	Object.setPrototypeOf(self, TodoError.prototype)

	return self
} as TodoErrorConstructor

TodoError.prototype = Object.create(Error.prototype) as TodoError
TodoError.prototype.constructor = TodoError
Object_tag(TodoError)
