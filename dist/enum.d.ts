/** Base type of enum definition - mix of string / string pairs. */
export type Entries = ReadonlyArray<string | readonly [k: string, v: string]>;
/**
 * Extractor that keeps string pairs and creates string pairs from direct strings in
 * enum definition.
 */
export type ExtractEnum<T extends Entries> = {
    readonly [K in T[number] as K extends string ? K : K[0]]: K extends string ? K : K[1];
};
/**
 * Extractor that lifts property values from enum definition.
 */
export type ExtractValues<T extends Entries> = Array<T[number] extends infer V ? V extends string ? V : V extends readonly [infer _K, infer W] ? W : never : never>;
/** Inspection symbol that is backing {@link Enum.values} */
declare const Symbol_enumValues: unique symbol;
/**
 * Allows for creation of `Enum`, which provides runtime-level enums, without disgusting
 * generated mess done by TypeScripts `enum`s.
 *
 * Created enums are frozen and cannot be modified in any way.
 * Per convention of pure-representation, enums are constructed on top
 * of `[Object: null prototype]` broken promise chain, ensuring that beside `constructor`
 * and inspection symbols, no other additional properties are present,
 * that are not defined by {@link T}.
 *
 * @template T Definition of enum properties, that can be direct (`myEnum.A === "A"`)
 * or aliased (`myEnum.B === "C"`).
 *
 * @example
 * const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
 * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
 *
 * type TCars = Enum.type<typeof Cars>
 * //   ^? => "Audi" | "Peugeot" | "Toyota"
 *
 * const supportedCars = Enum.values(Cars)
 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
 *
 *
 * const foo = (car: TCars) => { / some logic / }
 * // This is valid
 * foo(Cars.Audi)
 * // And this too
 * foo("Audi")
 */
export type Enum<T extends Entries> = ExtractEnum<T> & {
    readonly [Symbol_enumValues]: ExtractValues<T>;
};
/**
 * Callable-Constructor interface for {@link Enum}.
 *
 * Per callable-class convention, class can be constructed with or without `new` keyword.
 */
export interface EnumConstructor {
    /**
     * Creates new `Enum`.
     *
     * @param rawValues - A specification of enum properties.
     * Specification can consist of mix of strings, and string pairs; for strings,
     * direct properties are created, while pairs create aliased properties with first
     * element as property name and second as its value.
     * @returns Created object enum, which has all the specified keys and hidden tag
     * to represent stored values.
     *
     * @template T Definition of enum properties, that can be direct (enum.A = "A")
     * or aliased (enum.B = "C").
     *
     * @example
     * ```ts
     * const Cars = new Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
     * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
     * ```
     */
    new <const T extends Entries>(...rawValues: T): Enum<T>;
    /**
     * Creates new `Enum`.
     *
     * @param rawValues - A specification of enum properties.
     * Specification can consist of mix of strings, and string pairs; for strings,
     * direct properties are created, while pairs create aliased properties with first
     * element as property name and second as its value.
     * @returns Created object enum, which has all the specified keys and hidden tag
     * to represent stored values.
     *
     * @template T Definition of enum properties, that can be direct (enum.A = "A")
     * or aliased (enum.B = "C").
     *
     * @example
     * ```ts
     * const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
     * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
     * ```
     */
    <const T extends Entries>(...rawValues: T): Enum<T>;
    /**
     * Extracts an inspection array, which holds all values that are assigned to `Enum`s keys.
     *
     * Provided as static method, as to not pollute enum's prototype.
     *
     * @param enumObj - Created `Enum`; objects that looks like these on the outside
     * are not supported.
     *
     * @example
     * ```ts
     * const supportedCars = Enum.values(Cars)
     * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
     * ```
     */
    values: <const T extends Entries>(enumObj: Enum<T>) => ReadonlyArray<ExtractValues<T>[number]>;
    /** `[Object: null prototype]` with only constructor attached */
    prototype: object;
}
/**
 * Allows for creation of `Enum`, which provides runtime-level enums, without disgusting
 * generated mess done by TypeScripts `enum`s.
 *
 * Created enums are frozen and cannot be modified in any way.
 * Per convention of pure-representation, enums are constructed on top
 * of `[Object: null prototype]` broken promise chain, ensuring that beside `constructor`
 * and inspection symbols, no other additional properties are present,
 * that are not defined by {@link T}.
 *
 * @template T Definition of enum properties, that can be direct (`myEnum.A === "A"`)
 * or aliased (`myEnum.B === "C"`).
 *
 * @example
 * const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
 * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
 *
 * type TCars = Enum.type<typeof Cars>
 * //   ^? => "Audi" | "Peugeot" | "Toyota"
 *
 * const supportedCars = Enum.values(Cars)
 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
 *
 *
 * const foo = (car: TCars) => { / some logic / }
 * // This is valid
 * foo(Cars.Audi)
 * // And this too
 * foo("Audi")
 */
export declare const Enum: EnumConstructor;
/**
 * Allows for creation of `Enum`, which provides runtime-level enums, without disgusting
 * generated mess done by TypeScripts `enum`s.
 *
 * Created enums are frozen and cannot be modified in any way.
 * Per convention of pure-representation, enums are constructed on top
 * of `[Object: null prototype]` broken promise chain, ensuring that beside `constructor`
 * and inspection symbols, no other additional properties are present,
 * that are not defined by {@link T}.
 *
 * @template T Definition of enum properties, that can be direct (`myEnum.A === "A"`)
 * or aliased (`myEnum.B === "C"`).
 *
 * @example
 * const Cars = Enum("Audi", "Peugeot", ["Lexus", "Toyota"])
 * //    ^? => Enum { Audi: "Audi", Peugeot: "Peugeot", Lexus: "Toyota" }
 *
 * type TCars = Enum.type<typeof Cars>
 * //   ^? => "Audi" | "Peugeot" | "Toyota"
 *
 * const supportedCars = Enum.values(Cars)
 * //    ^? => ("Audi" | "Peugeot" | "Toyota")[]
 *
 *
 * const foo = (car: TCars) => { / some logic / }
 * // This is valid
 * foo(Cars.Audi)
 * // And this too
 * foo("Audi")
 */
export declare namespace Enum {
    /**
     * Extracts a type, which is an union of values that are assigned to `Enum`s keys.
     *
     * @param E - `typeof` created `Enum`; objects that looks like these on the outside
     * are not supported.
     *
     * @example
     * ```ts
     * type Cars = Enum.type<typeof Cars>
     * //   ^? => "Audi" | "Peugeot" | "Toyota"
     * ```
     */
    type type<E extends Enum<any>> = E[typeof Symbol_enumValues][number];
}
export {};
//# sourceMappingURL=enum.d.ts.map