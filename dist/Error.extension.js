/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
import { ContractViolationError } from "./contract-violation-error.js";
import { TodoError } from "./todo-error.js";
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
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
     * Any values permitted by design - this mimics `console.error` signature.
     */
    if (msg) {
        error(msg, ...context);
    }
    /* eslint-disable-next-line no-debugger --
     * Explicitly using only in dev-mode.
     */
    if (isDev) {
        debugger;
    }
    throw ContractViolationError(msg);
};
Error.todo ??= function todo(message, cause) {
    throw TodoError(message, cause);
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
         @typescript-eslint/no-require-imports --
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
//# sourceMappingURL=Error.extension.js.map