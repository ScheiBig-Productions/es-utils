Set.prototype.difference ??= function difference(other) {
    return new Set([...this].filter((x) => !other.has(x)));
};
Set.prototype.intersection ??= function intersection(other) {
    return new Set([...this].filter((x) => other.has(x)));
};
Set.prototype.symmetricDifference ??= function symmetricDifference(other) {
    const result = new Set();
    for (const val of this) {
        if (!other.has(val)) {
            result.add(val);
        }
    }
    for (const val of other) {
        if (!this.has(val)) {
            result.add(val);
        }
    }
    return result;
};
Set.prototype.union ??= function union(other) {
    return new Set([...this, ...other]);
};
Set.prototype.isDisjointFrom ??= function isDisjointFrom(other) {
    for (const val of this) {
        if (other.has(val)) {
            return false;
        }
    }
    return true;
};
Set.prototype.isSubsetOf ??= function isSubsetOf(other) {
    for (const val of this) {
        if (!other.has(val)) {
            return false;
        }
    }
    return true;
};
Set.prototype.isSupersetOf ??= function isSupersetOf(other) {
    for (const val of other) {
        if (!this.has(val)) {
            return false;
        }
    }
    return true;
};
export {};
//# sourceMappingURL=Set.polyfill.js.map