/**
 * Provides utility for creating JS-optimized enums without heavy syntactic sugar
 * of typescript enums.
 * @module
 */
import { Object_tag } from "./common/object.tag.js";
/** Inspection symbol that is backing {@link Enum.values} */
const Symbol_enumValues = Symbol("Enum Values");
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
// eslint-disable-next-line no-shadow -- Shadow necessary due to object merging
export const Enum = Object.assign(function Enum(...rawValues) {
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
Enum.prototype = Object.create(null);
Enum.prototype.constructor = Enum;
Object_tag(Enum);
//# sourceMappingURL=enum.js.map