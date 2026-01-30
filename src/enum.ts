import { Object_tag } from "./common/object-tag.js"

type Entries = ReadonlyArray<string | readonly [k: string, v: string]>

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

type Enum<T extends Entries> = ExtractEnum<T> & {
	readonly [Symbol_enumValues]: ExtractValues<T>,
}

interface EnumConstructor {

	/**
	 * Creates new `Enum`.
	 *
	 * @param rawValues - A set of strings to be turned into enums elements.
	 * A tuple of two strings can also be provided, in which case first one will
	 * be used as key and a second as a value.
	 * @returns Created object enum, which has all the specified keys and hidden tag
	 * to represent stored values.
	 *
	 * @example
	 * ```ts
	 * const Cars = new Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
	 * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
	 * ```
	 */
	new<const T extends Entries>(...rawValues: T): Enum<T>,

	/**
	 * Creates new `Enum`.
	 *
	 * @param rawValues - A set of strings to be turned into enums elements.
	 * A tuple of two strings can also be provided, in which case first one will
	 * be used as key and a second as a value.
	 * @returns Created object enum, which has all the specified keys and hidden tag
	 * to represent stored values.
	 *
	 * @example
	 * ```ts
	 * const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
	 * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
	 * ```
	 */
	<const T extends Entries>(...rawValues: T): Enum<T>,

	/**
	 * Extracts an array, which holds all values that are assigned to `Enum`s keys.
	 *
	 * Provided as static method, as to not clash with enum keys.
	 *
	 * @param enumObj - Created `Enum`; objects that looks like these on the outside
	 * are not supported.
	 *
	 * @example
	 *
	 * const supportedCars = Enum.values(Cars)
	 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
	 */
	values: <const T extends Entries>(enumObj: Enum<T>) => ReadonlyArray<ExtractValues<T>[number]>,
}

/**
 * Allows for creation of `Enum`, which provides runtime-level enums, without disgusting
 * generated mess done by TypeScripts `enum`s.
 *
 * It facilitates storage of allowed values, which might come in handy in parsing scenarios.
 *
 * Created enums are frozen and cannot be modified in any way.
 * Due to specific quirks of JS, `Enum` instances still have Object prototype,
 * however any property from it can be shadowed safely.
 *
 * @example
 * const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
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

// eslint-disable-next-line no-shadow -- Shadow necessary due to object merging
export const Enum = Object.assign(function Enum<const T extends Entries>(
	this: Enum<T> | undefined,
	...rawValues: T
): Enum<T> {
	// eslint-disable-next-line consistent-this -- Conditional creation of this
	const self = this instanceof Enum
		? this
		: Object.create(Enum.prototype as object) as Enum<T>

	const entries = rawValues.map((v) => typeof v === "string" ? [ v, v ] : v)
	const enumObj = Object.fromEntries(entries) as Enum<T>
	Object.assign(self, enumObj)
	Object.defineProperty(self, Symbol_enumValues, {
		value: rawValues.map((v) => typeof v === "string" ? v : v[1]),
		enumerable: false,
	})
	Object.freeze(self)

	return self
}, {
	values: function Enum_values<const T extends Entries>(
		enumObj: Enum<T>,
	): ReadonlyArray<ExtractValues<T>[number]> { return enumObj[Symbol_enumValues] },
}) as EnumConstructor
Object_tag(Enum)

export namespace Enum {

	/**
	 * Extracts a type, which is an union of values that are assigned to `Enum`s keys.
	 *
	 * @param E - `typeof` created `Enum`; objects that looks like these on the outside
	 * are not supported.
	 *
	 * @example
	 *
	 * type Cars = Enum.type<typeof Cars>
	 * //   ^? => "Audi" | "Peugeot" | "Toyota"
	 */
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- there is no simpler way
	   to get inference */
	export type type<E extends Enum<any>> =
		E[typeof Symbol_enumValues][number]
}
