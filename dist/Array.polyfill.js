/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
Array.prototype.findLast ??= function findLast(predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
};
Array.prototype.findLastIndex ??= function findLastIndex(predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i], i, this)) {
            return i;
        }
    }
    return -1;
};
Array.prototype.toReversed ??= function toReversed() {
    return [...this].reverse();
};
Array.prototype.toSorted ??= function toSorted(compareFn) {
    return [...this].sort(compareFn);
};
Array.prototype.toSpliced ??= function toSpliced(start, deleteCount, ...items) {
    const copy = [...this];
    copy.splice(start, deleteCount, ...items);
    return copy;
};
Array.prototype.with ??= ({
    with(index, value) {
        const copy = [...this];
        const len = copy.length >>> 0;
        let i = index;
        if (i < 0 && i > -len) {
            i += len;
        }
        if (i < 0 || i >= len) {
            throw new RangeError("Index out of range");
        }
        copy[i] = value;
        return copy;
    },
}).with;
export {};
//# sourceMappingURL=Array.polyfill.js.map