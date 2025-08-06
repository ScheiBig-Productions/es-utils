/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
import type { MethodKeys } from "./types.js"

interface BoundFn {

	/**
	 * For a given object, selects function by name and creates a bound function that
	 * has the same body as the original function.
	 *
	 * The this object of the bound function is associated with the object it was selected from.
	 *
	 * Safer equivalent of `instance[methodName].bind(instance)`.
	 *
	 * @param instance - An object to which the function will be selected from.
	 * @param methodName - A name of function to pick.
	 * @returns Bound function `methodName` from object `instance`.
	 */
	<T, K extends MethodKeys<T>>(instance: T, methodName: K): T[K],

	/**
	 * For a given object, picks function with selector and creates a bound function that
	 * has the same body as the original function.
	 *
	 * The this object of the bound function is associated with the object it was selected from.
	 *
	 * Safer equivalent of `methodSelector(instance).bind(instance)`.
	 *
	 * @param instance - An object to which the function will be selected from.
	 * @param methodSelector - A selector of function.
	 * @returns Bound function from object `instance`.
	 */
	<T, K extends MethodKeys<T>>(instance: T, methodSelector: (o: T) => T[K]): T[K],
}

declare global {
	interface FunctionConstructor {

		/**
		 * For a given object, picks function by name or selector and creates a bound function
		 * that has the same body as the original function.
		 *
		 * The this object of the bound function is associated with the object it was selected from.
		 *
		 * @param instance - An object to which the function will be selected from.
		 * @returns Bound function `methodName` from object `instance`.
		 */
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
