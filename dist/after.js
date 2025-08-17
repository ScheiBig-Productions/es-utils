/**
 * Returns new Promise, that fulfills after given delay to specified value.
 */
export const after = async function after(delay, value) {
    const actualDelay = typeof delay === "number"
        ? delay
        : delay.total("milliseconds");
    return await new Promise((res) => void setTimeout(() => res(value), actualDelay));
};
//# sourceMappingURL=after.js.map