/**
 * Allows for creation of `ObjectEnum`, which provides runtime-level enums, without disgusting
 * generated mess done by TypeScripts `enum`s.
 *
 * It facilitates storage of allowed values, which might come in handy in parsing scenarios.
 *
 * Created enums are frozen and cannot be modified in any way.
 *
 * @example
 * const Cars = Enum.create("Audi", "Peugeot", ["Lexus", "Toyota"])
 * //    ^? => { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
 *
 * type Cars = Enum.type<typeof Cars>
 * //   ^? => "Audi" | "Peugeot" | "Toyota"
 *
 * const supportedCars = Enum.values(Cars)
 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
 *
*
 * const foo = (car: Cars) => { / some logic / }
 * // This is valid
 * foo(Cars.Audi)
 * // And this too
 * foo("Audi")
 */
export namespace Enum {

	type Entries = Array<string | readonly [k: string, v: string]>

	type ExtractEnum<T extends Entries> = {
		readonly [K in T[number] as K extends string
			? K
			: K[0]
		]: K extends string ? K : K[1]
	}

	type ExtractValues<T extends Entries> = Array<
		T[number] extends infer V
			? V extends string
				? V
				: V extends readonly [infer _K, infer W]
					? W
					: never
			: never
	>

	const Symbol_enumValues = Symbol("Enum Values")

	type ObjectEnum<T extends Entries> = ExtractEnum<T> & {
		readonly [Symbol_enumValues]: ExtractValues<T>,
	}


	/**
	 * Creates new `ObjectEnum`.
	 *
	 * @param rawValues - A set of strings to be turned into enums elements.
	 * A tuple of two strings can also be provided, in which case first one will
	 * be used as key and a second as a value.
	 * @returns Created object enum, which has all the specified keys and hidden tag
	 * to represent stored values.
	 *
	 * @example
	 * ```ts
	 * const Cars = Enum.create("Audi", "Peugeot", ["Lexus", "Toyota"])
	 * //    ^? => { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
	 * ```
	 */
	export const create = function create<const T extends Entries>(...rawValues: T): ObjectEnum<T> {
		const entries = rawValues.map((v) => typeof v === "string" ? [ v, v ] : v)
		const enumObj = Object.fromEntries(entries) as ObjectEnum<T>
		Object.defineProperty(enumObj, Symbol_enumValues, {
			value: rawValues.map((v) => typeof v === "string" ? v : v[1]),
			enumerable: false,
		})
		Object.freeze(enumObj)

		return enumObj
	}

	/**
	 * Extracts a type, which is an union of values that are assigned to `ObjectEnum`s keys.
	 *
	 * @param E - `typeof` created `ObjectEnum`; objects that looks like these on the outside
	 * are not supported.
	 *
	 * @example
	 *
	 * type Cars = Enum.type<typeof Cars>
	 * //   ^? => "Audi" | "Peugeot" | "Toyota"
	 */
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- there is no simpler way
	   to get inference */
	export type type<E extends ObjectEnum<any>> =
		E[typeof Symbol_enumValues][number]


	/**
	 * Extracts an array, which holds all values that are assigned to `ObjectEnum`s keys.
	 *
	 * @param enumObj - Created `ObjectEnum`; objects that looks like these on the outside
	 * are not supported.
	 *
	 * @example
	 *
	 * const supportedCars = Enum.values(Cars)
	 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
	 */
	export const values = function values<const T extends Entries>(
		enumObj: ObjectEnum<T>,
	): ReadonlyArray<ExtractValues<T>[number]> { return enumObj[Symbol_enumValues] }
}
