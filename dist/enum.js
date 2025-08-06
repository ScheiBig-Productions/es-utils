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
export var Enum;
(function (Enum) {
    const Symbol_enumValues = Symbol("Enum Values");
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
    Enum.create = function create(...rawValues) {
        const entries = rawValues.map((v) => typeof v === "string" ? [v, v] : v);
        const enumObj = Object.fromEntries(entries);
        Object.defineProperty(enumObj, Symbol_enumValues, {
            value: rawValues.map((v) => typeof v === "string" ? v : v[1]),
            enumerable: false,
        });
        Object.freeze(enumObj);
        return enumObj;
    };
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
    Enum.values = function values(enumObj) { return enumObj[Symbol_enumValues]; };
})(Enum || (Enum = {}));
//# sourceMappingURL=enum.js.map