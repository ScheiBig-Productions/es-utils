/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
String.prototype.indent ??= function indent(
// eslint-disable-next-line no-shadow -- no need for backreference with same name
indent) {
    return this.replace(/^/ugm, indent);
};
String.prototype.trimIndent ??= function trimIndent(tabWith = 4) {
    const lines = this.split("\n");
    const indent = lines.filter((l) => l.trim())
        .map((l) => (/^\s*/u.exec(l))?.[0] ?? "")
        .map((l) => l.replace(/\t/gu, " ".repeat(tabWith)))
        .minBy((l) => l.length) ?? "";
    const firstNonBlank = lines.findIndex((l) => l.trim());
    const lastNonBlank = lines.findLastIndex((l) => l.trim());
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
export {};
//# sourceMappingURL=String.extension.js.map