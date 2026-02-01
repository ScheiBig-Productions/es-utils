/* eslint-disable-next-line @typescript-eslint/naming-convention --
 * Following original usage for convenience
 */
export let util_inspect;
void (async () => {
    try {
        util_inspect = (await import("node:util")).inspect;
    }
    catch {
        util_inspect = undefined;
    }
})();
//# sourceMappingURL=util.inspect.js.map