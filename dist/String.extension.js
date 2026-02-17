/* eslint-disable @typescript-eslint/naming-convention --
 * Simulating paths of utilities
 */
/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
 * it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
 * Although the method may appear always present in type definitions,
 * the actual environment might lack it (e.g. ES2022 targets).
 */
import { util_inspect } from "./common/util.inspect.js";
String.prototype.indent ??= function indent(
// eslint-disable-next-line no-shadow -- no need for backreference with same name
indent) {
    return this.replace(/^/ugm, indent);
};
const __findLastIndex = "findLastIndex" in Array.prototype
    && typeof Array.prototype.findLastIndex === "function"
    ? Array.prototype.findLastIndex
    : null;
const Array_findLastIndex = __findLastIndex
    ? ((that, predicate) => __findLastIndex.call(that, predicate))
    : function findLastIndex(that, predicate) {
        for (let i = that.length - 1; i >= 0; i--) {
            if (predicate(that[i], i, that)) {
                return i;
            }
        }
        return -1;
    };
String.prototype.trimIndent ??= function trimIndent(tabWith = 4) {
    const lines = this.split("\n");
    const indent = lines.filter((l) => l.trim())
        .map((l) => (/^\s*/u.exec(l))?.[0] ?? "")
        .map((l) => l.replace(/\t/gu, " ".repeat(tabWith)))
        .minBy((l) => l.length) ?? "";
    const firstNonBlank = lines.findIndex((l) => l.trim());
    const lastNonBlank = Array_findLastIndex(lines, (l) => l.trim());
    return lines.slice(firstNonBlank, lastNonBlank + 1)
        .map((l) => l.replace(/^(\s*)/gu, (m) => m.replace(/\t/gu, " ".repeat(tabWith))))
        .map((l) => l.trimEnd())
        .map((l) => l.startsWith(indent) ? l.slice(indent.length) : l)
        .join("\n");
};
String.prototype.pack ??= function pack() {
    return this.split("\n")
        .map((l) => l.trim())
        .filter((l) => l)
        .join(" ");
};
String.prototype.divide ??= function divide(chunkCount, rem = true) {
    if (typeof chunkCount !== "number" || chunkCount <= 0 || !Number.isFinite(chunkCount)) {
        throw new TypeError("chunkSize must be a positive finite number");
    }
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion --
     * Simplest way to copy a string.
     */
    const str = String(this);
    const chunkSize = Math.floor(str.length / chunkCount);
    const result = [];
    for (let i = 0; i < chunkCount; i++) {
        const start = i * chunkSize;
        const end = rem
            ? i === chunkCount - 1
                ? str.length
                : start + chunkSize
            : start + chunkSize;
        result.push(str.slice(start, end));
    }
    return result;
};
if (String.prototype.noInspect === undefined) {
    Object.defineProperty(String.prototype, "noInspect", {
        configurable: true,
        enumerable: false,
        get() {
            const customSymbol = util_inspect?.custom;
            if (customSymbol) {
                return Object.assign(this, {
                    [customSymbol]: () => this,
                });
            }
            return this;
        },
    });
}
/* eslint-disable-next-line @typescript-eslint/unbound-method --
 * Static extension.
 */
String.decorator ??= function decorator(config) {
    const prefix = "prefix" in config ? config.prefix : "";
    const suffix = "suffix" in config ? config.suffix : "";
    return (strings, ...values) => prefix + (typeof strings === "string"
        ? strings
        : String.raw(strings, ...values)) + suffix;
};
//# sourceMappingURL=String.extension.js.map