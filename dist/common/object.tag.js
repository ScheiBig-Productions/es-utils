/* eslint-disable @typescript-eslint/naming-convention --
 * Following final usage for convenience
 */
/** @internal */
export const Object_tag = function tag(ctor, name) {
    const tagName = name ?? ctor.name;
    Object.defineProperty(ctor.prototype, Symbol.toStringTag, {
        configurable: true,
        get: () => tagName,
    });
};
//# sourceMappingURL=object.tag.js.map