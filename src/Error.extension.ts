/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
import { ContractViolationError } from "./contract-violation-error.js"
import { TodoError } from "./todo-error.js"


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
		never: (msg?: string | Error, ...context: Array<any>) => never,

		/**
		 * Trips on implementation violation.
		 *
		 * This call indicates that code path is defined, but not yet implemented.
		 * @throws {TodoError}
		 * @see {@link TodoError}
		 */
		todo: (message: string, cause?: unknown) => never,

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
		isError: (value: unknown) => value is InstanceType<typeof Error | typeof DOMException>,

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
		errorLike: (value: unknown) => value is Error,
	}
}

// eslint-disable-next-line complexity -- doing heavy checking to allow this
const isDev = (() => {
	const global = globalThis

	if ("Deno" in global
		&& typeof global.Deno === "object"
		&& global.Deno
		&& "env" in global.Deno
		&& typeof global.Deno.env === "object"
		&& global.Deno.env
		&& "get" in global.Deno.env
		&& typeof global.Deno.env.get === "function"
	) {
		const getDenoEnv = global.Deno.env.get as (env: string) => string
		return getDenoEnv("DENO_ENV") !== "production"
			|| getDenoEnv("NODE_ENV") !== "production"
	}
	if ("process" in global
		&& typeof global.process === "object"
		&& global.process
		&& "env" in global.process
		&& typeof global.process.env === "object"
		&& global.process.env
		&& "NODE_ENV" in global.process.env
	) {
		return global.process.env.NODE_ENV !== "production"
	}
	return true
})()

Error.never ??= function never(msg?: string | Error, ...context: Array<any>): never {
	const { error } = console
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
	 * Any values permitted by design - this mimics `console.error` signature.
	 */
	if (msg) { error(msg, ...context) }

	/* eslint-disable-next-line no-debugger --
	 * Explicitly using only in dev-mode.
	 */
	if (isDev) { debugger }

	throw ContractViolationError(msg)
}

Error.todo ??= function todo(message: string, cause?: unknown) {
	throw TodoError(message, cause)
}

Error.isError ??= function isError(value: unknown) {
	const first = Object.prototype.toString.call(value) === "[object Error]"
		|| Object.prototype.toString.call(value) === "[object DOMException]"
	if (first) { return true }

	if (globalThis.process) {
		return (
			/* eslint-disable-next-line
			 @typescript-eslint/no-require-imports --
			 * Synchronous import in NodeJS context
			 */
			require("util/types") as { isNativeError?: (v: unknown) => boolean }
		)?.isNativeError?.(value)
	}

	return false
} as typeof Error.isError

Error.errorLike ??= function errorLike(value: unknown) {
	if (value === undefined || value === null) { return false }
	if (typeof value !== "object" && typeof value !== "function") { return false }

	const hasName = "name" in value && typeof value.name === "string"
	const hasMessage = "message" in value && typeof value.message === "string"
	const hasStack = !("stack" in value) || typeof value.stack === "string"

	return hasName && hasMessage && hasStack
} as typeof Error.errorLike
