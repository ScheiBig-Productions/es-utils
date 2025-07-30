Object.groupBy ??= function groupBy(items, keySelector) {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment --
     * No other away to please type-checker
     */
    const result = Object.create(Object.prototype);
    for (let i = 0; i < items.length; i++) {
        const key = keySelector(items[i], i);
        (result[key] ??= []).push(items[i]);
    }
    return result;
};
export {};
//# sourceMappingURL=Object.polyfill.js.map