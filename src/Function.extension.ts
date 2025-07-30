/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
import type { MethodKeys } from "./types.js"

interface BoundFn {
	<T, K extends MethodKeys<T>>(instance: T, methodName: K): T[K],
	<T, K extends MethodKeys<T>>(instance: T, methodSelector: (o: T) => T[K]): T[K],
}

declare global {
	interface FunctionConstructor {
		bound: BoundFn,
	}
}

Function.bound ??= function bound<T, K extends MethodKeys<T>>(
	instance: T,
	methodNameOrSelector: K | ((o: T) => T[K]),
) {
	if (typeof methodNameOrSelector === "function") {
		var method = methodNameOrSelector(instance)
	} else {
		var method = instance[methodNameOrSelector]
	}
	if (typeof method !== "function") {
		throw TypeError("Selected property is not a function")
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return -- verified to be type-safe
	return method.bind(instance)
} as BoundFn
