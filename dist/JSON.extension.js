const JSON_minimify_Tag = {
    "JSON.minimify.Tag": class extends String {
        /**
         * Reference to constructor of overflown property.
         */
        refCtor;
        constructor(value, refCtor) {
            super(value);
            this.refCtor = refCtor;
        }
    },
};
class PruningReplacer {
    userReplacer;
    maxDepth;
    branchStack;
    replacer;
    constructor(userReplacer, maxDepth) {
        this.userReplacer = userReplacer ?? ((_, v) => v);
        this.maxDepth = maxDepth ?? Infinity;
        this.branchStack = [];
        const self = this;
        this.replacer = function PruningReplacer_replacer(key, value) {
            if (key === "" && self.branchStack.length === 0) {
                self.branchStack.push({
                    path: [],
                    node: value,
                });
            }
        };
    }
}
JSON.minimify ??= Object.assign(function minimify(value, options = {}) {
    const { replacer, space, async, maxDepth } = options;
    const s = {
        "JSON.minimify.serialize"() {
            const pruner = new PruningReplacer(replacer, maxDepth);
            return JSON.stringify(value, pruner.replacer, space);
        },
    };
    if (async) {
        if (typeof async !== "number") {
            return new Promise((res) => { res(s["JSON.minimify.serialize"]()); });
        }
        return Promise.race([
            new Promise((res, rej) => {
                queueMicrotask(() => {
                    try {
                        res(s["JSON.minimify.serialize"]());
                    }
                    catch (e) {
                        rej(e);
                    }
                });
            }),
            new Promise((_, rej) => void setTimeout(() => {
                rej(new Error(`Serialization exceeded timeout ${async}ms.`));
            }, async)),
        ]);
    }
    return s["JSON.minimify.serialize"]();
}, {
    Tag: JSON_minimify_Tag["JSON.minimify.Tag"],
});
export {};
//# sourceMappingURL=JSON.extension.js.map