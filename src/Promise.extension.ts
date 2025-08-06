/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */

import type { PromiseFactory } from "./promise-factory.js"

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
