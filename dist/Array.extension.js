Array.prototype.indexed ??= function indexed() {
    // Generator approach is necessary, due to limited support of iterator helpers
    return (function* indexedMap(values) {
        let i = 0;
        for (const v of values) {
            yield [i++, v];
        }
    })(this.values());
};
Array.prototype.removeBy ??= function removeBy(predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i], i, this)) {
            this.splice(i, 1);
        }
    }
    return this;
};
Array.prototype.toShuffled ??= function toShuffled(seed) {
    // currently unused, as there is no deterministic pseudo-random generator in vanilla ES
    void seed;
    var sh = [...this];
    var rng = (i) => Math.floor(Math.random() * (i + 1));
    for (let i = sh.length - 1; i > 0; i--) {
        const j = rng(i);
        [sh[i], sh[j]] = [sh[j], sh[i]];
    }
    return sh;
};
Array.prototype.minBy ??= function minBy(selector, config) {
    if (this.length === 0) {
        return undefined;
    }
    const col = new Intl.Collator(config?.locale, config);
    return this.reduce((min, item) => {
        const i = selector(item);
        const m = selector(min);
        if (typeof i === "string" && typeof m === "string") {
            return col.compare(i, m) < 0 ? item : min;
        }
        if (i instanceof Date && m instanceof Date) {
            return i.valueOf() < m.valueOf() ? item : min;
        }
        return i < m ? item : min;
    }, this[0]);
};
Array.prototype.maxBy ??= function maxBy(selector, config) {
    if (this.length === 0) {
        return undefined;
    }
    const col = new Intl.Collator(config?.locale, config);
    return this.reduce((max, item) => {
        const i = selector(item);
        const m = selector(max);
        if (typeof i === "string" && typeof m === "string") {
            return col.compare(i, m) > 0 ? item : max;
        }
        if (i instanceof Date && m instanceof Date) {
            return i.valueOf() > m.valueOf() ? item : max;
        }
        return i > m ? item : max;
    }, this[0]);
};
Array.prototype.ascBy ??= function ascBy(selector, config) {
    if (this.length === 0) {
        return [];
    }
    const col = new Intl.Collator(config?.locale, config);
    return this.toSorted((a, b) => {
        const f = selector(a);
        const s = selector(b);
        if (typeof f === "string" && typeof s === "string") {
            return col.compare(f, s);
        }
        if (f instanceof Date && s instanceof Date) {
            return Math.sign(f.valueOf() - s.valueOf());
        }
        return f < s ? -1 : f > s ? 1 : 0;
    });
};
Array.prototype.descBy ??= function descBy(selector, config) {
    if (this.length === 0) {
        return [];
    }
    const col = new Intl.Collator(config?.locale, config);
    return this.toSorted((a, b) => {
        const f = selector(a);
        const s = selector(b);
        if (typeof f === "string" && typeof s === "string") {
            return -col.compare(f, s);
        }
        if (f instanceof Date && s instanceof Date) {
            return -Math.sign(f.valueOf() - s.valueOf());
        }
        return f < s ? 1 : f > s ? -1 : 0;
    });
};
Array.prototype.splitBy ??= function splitBy(limit, weight) {
    const removed = [];
    const rest = [...this];
    let currentWeight = 0;
    for (let i = 0; i < this.length; i++) {
        const itemWeight = weight(this[i], i, this);
        if (currentWeight + itemWeight <= limit) {
            removed.push(this[i]);
            rest.shift();
            currentWeight += itemWeight;
        }
        else {
            break;
        }
    }
    return [removed, rest];
};
Array.prototype.padEnd ??= function padEnd(targetLength, fillValue) {
    const that = [...this];
    if (that.length < targetLength) {
        that.push(...Array.from({ length: targetLength - that.length }, () => fillValue));
    }
    return that;
};
Array.prototype.repeat ??= function repeat(count) {
    if (count < 0) {
        throw new Error("Repeat count must be non-negative.");
    }
    return Array.from({ length: count }, () => this)
        .flat();
};
Array.prototype.shuffle ??= function shuffle(seed) {
    // currently unused, as there is no deterministic pseudo-random generator in vanilla ES
    void seed;
    var rng = (i) => Math.floor(Math.random() * (i + 1));
    for (let i = this.length - 1; i > 0; i--) {
        const j = rng(i);
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};
Array.prototype.groupBy ??= function groupBy(keySelector, returnType = "Object") {
    if (returnType === "Object") {
        return Object.groupBy(this, keySelector);
    }
    if (returnType === "Map") {
        return Map.groupBy(this, keySelector);
    }
    throw TypeError(`Unknown grouping provider: ${String(returnType)}.`);
};
Array.prototype.get = function get(index) {
    let i = index;
    const len = this.length;
    if (i < 0 && i > -len) {
        i += len;
    }
    if (i < 0 || i >= len) {
        throw new RangeError("Index out of range");
    }
    return this[i];
};
Array.range ??= function range(startOrEnd, maybeEnd, maybeStep = 1) {
    const [start, end, step] = maybeEnd === undefined
        ? [0, startOrEnd, maybeStep]
        : [startOrEnd, maybeEnd, maybeStep];
    const result = Array();
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
};
Array.roll ??= function roll(...options) {
    const mass = options.reduce((sum, [_, w]) => sum + w, 0);
    const pick = Math.floor(Math.random() * (mass - 1));
    let measure = 0;
    for (const [o, w] of options) {
        measure += w;
        if (pick < measure) {
            return o;
        }
    }
    throw Error("Unreachable");
};
export {};
//# sourceMappingURL=Array.extension.js.map