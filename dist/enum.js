import { Object_tag } from "./common/object.tag.js";
const Symbol_enumValues = Symbol("Enum Values");
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
export const Enum = Object.assign(function Enum(...rawValues) {
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof Enum
        ? this
        : Object.create(Enum.prototype);
    const entries = rawValues.map((v) => typeof v === "string" ? [v, v] : v);
    const enumObj = Object.fromEntries(entries);
    Object.assign(self, enumObj);
    Object.defineProperty(self, Symbol_enumValues, {
        value: rawValues.map((v) => typeof v === "string" ? v : v[1]),
        enumerable: false,
    });
    Object.freeze(self);
    return self;
}, {
    values: function Enum_values(enumObj) { return enumObj[Symbol_enumValues]; },
});
Object_tag(Enum);
//# sourceMappingURL=enum.js.map