// eslint-disable-next-line complexity -- doing heavy checking to allow this
const isDev = (() => {
    const global = globalThis;
    if ("Deno" in global
        && typeof global.Deno === "object"
        && global.Deno
        && "env" in global.Deno
        && typeof global.Deno.env === "object"
        && global.Deno.env
        && "get" in global.Deno.env
        && typeof global.Deno.env.get === "function") {
        const getDenoEnv = global.Deno.env.get;
        return getDenoEnv("DENO_ENV") !== "production"
            || getDenoEnv("NODE_ENV") !== "production";
    }
    if ("process" in global
        && typeof global.process === "object"
        && global.process
        && "env" in global.process
        && typeof global.process.env === "object"
        && global.process.env
        && "NODE_ENV" in global.process.env) {
        return global.process.env.NODE_ENV !== "production";
    }
    return true;
})();
Error.never ??= function never(msg, ...context) {
    const { error } = console;
    if (msg) {
        error(msg);
    }
    for (const ctx of context) {
        error(ctx);
    }
    /* eslint-disable-next-line no-debugger --
     * Explicitly using only in dev-mode.
     */
    if (isDev) {
        debugger;
    }
    throw new Error(`Assertion failed; this should not occur!${msg ? ` (${msg instanceof Error ? msg.message : msg})` : ""}`, { cause: msg });
};
Error.isError ??= function isError(value) {
    const first = Object.prototype.toString.call(value) === "[object Error]"
        || Object.prototype.toString.call(value) === "[object DOMException]";
    if (first) {
        return true;
    }
    if (globalThis.process) {
        return (
        /* eslint-disable-next-line
         @typescript-eslint/no-require-imports,
         @typescript-eslint/no-unsafe-call --
         * Synchronous import in NodeJS context
         */
        require("util/types"))?.isNativeError?.(value);
    }
    return false;
};
Error.errorLike ??= function errorLike(value) {
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value !== "object" && typeof value !== "function") {
        return false;
    }
    const hasName = "name" in value && typeof value.name === "string";
    const hasMessage = "message" in value && typeof value.message === "string";
    const hasStack = !("stack" in value) || typeof value.stack === "string";
    return hasName && hasMessage && hasStack;
};
export {};
//# sourceMappingURL=Error.extension.js.map