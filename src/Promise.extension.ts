/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */

import type { PromiseFactory } from "./promise-factory.js"
import type { Temporal } from "@js-temporal/polyfill"

interface AfterFn {

	/**
	 * Returns new Promise, that fulfills after given delay.
	 */
	(delay: number | Temporal.Duration): Promise<void>,

	/**
	 * Returns new Promise, that fulfills after given delay to specified value.
	 */
	<T>(delay: number | Temporal.Duration, value: T): Promise<T>,
}

/**
 * Augments the global PromiseConstructor with a `factory` method.
 */
declare global {
	interface PromiseConstructor {

		/**
		 * Wraps a Promise-producing function into a chainable factory.
		 *
		 * Returned factory contains `always${do}` functions, where `do` corresponds
		 * to Promise API (`then`, `catch`, `finally`).
		 *
		 * @template TRes The resolved value type of the Promise.
		 * @template TArgs The argument types accepted by the producer function.
		 * @param producer - A function that returns a Promise.
		 * @returns A PromiseFactory with promise-like API chaining methods.
		 */
		factory: <TRes, TArgs extends ReadonlyArray<unknown>> (
			producer: (...args: TArgs) => Promise<TRes>
		) => PromiseFactory<TRes, TArgs>,

		/**
		 * Returns new Promise, that fulfills after given delay to specified value.
		 *
		 * Uses promise-based `setTimeout` on node.js-compatible engines.
		 */
		after: AfterFn,
	}
}

Promise.factory ??= function promiseFactory<TRes, TArgs extends ReadonlyArray<unknown>>(
	producer: (...args: TArgs) => Promise<TRes>,
) {
	// const base = async () => await producer()
	const base = producer

	const factory = Object.assign(base, {
		alwaysThen<TFulRes = TRes, TRejRes = never>(
			onfulfilled?: (value: TRes) => TFulRes | PromiseLike<TFulRes>,
			onrejected?: (reason: unknown) => TRejRes | PromiseLike<TRejRes>,
		) {
			return Promise.factory(async (...args: TArgs) => await base(...args)
				.then(onfulfilled, onrejected))
		},

		alwaysCatch<TRejRes = TRes>(
			onrejected: (reason: unknown) => TRejRes | PromiseLike<TRejRes>,
		) {
			return Promise.factory(async (...args: TArgs) => await base(...args)
				.catch(onrejected))
		},

		alwaysFinally(onfinally: () => void) {
			return Promise.factory(async (...args: TArgs) => await base(...args)
				.finally(onfinally))
		},
	})

	return factory
}

let nodeSetTimeout: (<T = void>(ms: number, value?: T) => Promise<T>) | null = null

try {
	const timers = await import("node:timers/promises")
	nodeSetTimeout = timers?.setTimeout ?? null
} catch {
	nodeSetTimeout = null
}

Promise.after ??= async function after<T = void>(
	delay: number | Temporal.Duration,
	value: T,
) {
	const actualDelay = typeof delay === "number"
		? delay
		: delay.total("milliseconds")

	if (nodeSetTimeout) {
		return await nodeSetTimeout(actualDelay, value)
	}

	return await new Promise<T>((res) => void setTimeout(() => res(value), actualDelay))
} as AfterFn
