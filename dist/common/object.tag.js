/* eslint-disable-next-line @typescript-eslint/naming-convention --
 * Following final usage for convenience
 */
export const Object_tag = function tag(ctor, name) {
    const tagName = name ?? ctor.name;
    Object.defineProperty(ctor.prototype, Symbol.toStringTag, {
        configurable: true,
        get: () => tagName,
    });
};
//# sourceMappingURL=object.tag.js.map