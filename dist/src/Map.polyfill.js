Map.groupBy ??= function groupBy(items, keySelector) {
    const result = new Map();
    for (let i = 0; i < items.length; i++) {
        const key = keySelector(items[i], i);
        if (!result.has(key)) {
            result.set(key, []);
        }
        result.get(key)
            ?.push(items[i]);
    }
    return result;
};
export {};
//# sourceMappingURL=Map.polyfill.js.map