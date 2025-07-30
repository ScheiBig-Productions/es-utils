/* eslint-disable @typescript-eslint/naming-convention --
 * Using enum-like naming
 */
const { log: c_log, error: c_err, } = console;
// eslint-disable-next-line complexity -- doing heavy checking to allow this
const colorDisabled = (() => {
    const global = globalThis;
    if ("Deno" in global
        && typeof global.Deno === "object"
        && global.Deno
        && "noColor" in global.Deno
        && typeof global.Deno.noColor === "boolean") {
        return global.Deno.noColor;
    }
    if ("process" in global
        && typeof global.process === "object"
        && global.process
        && "env" in global.process
        && typeof global.process.env === "object"
        && global.process.env) {
        return "NO_COLOR" in global.process.env;
    }
    return true;
})();
// eslint-disable-next-line complexity -- doing heavy checking to allow this
const exit = (() => {
    const global = globalThis;
    if ("Deno" in global
        && typeof global.Deno === "object"
        && global.Deno
        && "exit" in global.Deno
        && typeof global.Deno.exit === "function") {
        return global.Deno.exit;
    }
    if ("process" in global
        && typeof global.process === "object"
        && global.process
        && "exit" in global.process
        && typeof global.process.exit === "function") {
        return global.process.exit;
    }
    return (code) => {
        void code;
        throw TypeError("No known exit utility.");
    };
})();
const logLevels = [
    "Failure", "Alert", "Critical",
    "Error", "Warning", "Notice",
    "Info", "Debug", "Verbose",
];
const logLevel = {
    Failure: 0,
    Alert: 1,
    Critical: 2,
    Error: 3,
    Warning: 4,
    Notice: 5,
    Info: 6,
    Debug: 7,
    Verbose: 8,
};
const logShortLevel = {
    Failure: "F",
    Alert: "A",
    Critical: "C",
    Error: "E",
    Warning: "W",
    Notice: "N",
    Info: "I",
    Debug: "D",
    Verbose: "V",
};
const logShortColors = {
    Failure: 96,
    Alert: 95,
    Critical: 35,
    Error: 31,
    Warning: 33,
    Notice: 32,
    Info: 94,
    Debug: 0,
    Verbose: 90,
};
const colorize = (code, msg) => {
    if (colorDisabled) {
        return msg;
    }
    const color = typeof code === "string" ? logShortColors[code] : code;
    return `\x1B[${color}m${msg}\x1B[0m`;
};
const handlers = Object.fromEntries([...logLevels].map((l) => [l, []]));
const emit = function emit(entry) {
    /* eslint-disable-next-line @typescript-eslint/no-meaningless-void-operator --
     * This produces unexpected errors.
     */
    handlers[entry.lvl].forEach((func) => void func(entry));
};
/**
 * Logging callable, that should be used as central way of printing feedback from application.
 *
 * Logger implements log levels heavily inspired by RFC 5424:
 * ```
 * 0 - (F) Failure   - System is unusable (calling this level will crash application)
 * 1 - (A) Alert     - Action must be taken immediately
 * 2 - (C) Critical  - Critical conditions
 * 3 - (E) Error     - Error conditions
 * 4 - (W) Warning   - Warning conditions
 * 5 - (N) Notice    - Normal but significant
 * 6 - (I) Info      - Information messaging
 * 7 - (D) Debug     - Debug-level messages
 * 8 - (V) Verbose   - Verbose messaging
 * ```
 *
 * All log levels have utility methods on `log` named after first (capital) letter, that already
 * pass appropriate level to logger.
 *
 * Log verbosity can be set by changing value of {@link Log.verbosity}.
 * This only affects printing to console.
 *
 * Logger is global for whole application.
 *
 * Additionally, logger implements custom event emitter, that allows to listen to entries,
 * and react to them. This is especially useful for saving log to a file, or creating
 * filtered output of logger in different stream.
 *
 * @param lvl - Level that message should have.
 * @param tag - Header of message - `null` if not desired.
 * @param message - Body of message.
 * @param time - Optional time for which log message should be printed.
 * Usable if message was preprocessed for a long time.
 *
 * @returns `time` if passed, timestamp of log message otherwise
 */
export const Log = function log(lvl, tag, message, time) {
    const timestamp = time ?? new Date();
    const localDT = new Date(timestamp.getTime() - (timestamp.getTimezoneOffset() * 1000));
    let dt = localDT.toJSON();
    dt = dt.replace("T", " ")
        .replace("Z", "")
        .replace(/\.\d\d\d/u, "");
    let header = colorize(lvl, `[${dt} |${logShortLevel[lvl]}`);
    if (tag != null) {
        header += colorize(lvl, "| ") + colorize("Verbose", tag);
    }
    header += colorize(lvl, "]");
    if (logLevel[lvl] <= logLevel[Log.verbosity]) {
        if (logLevel[lvl] > logLevel.Warning) {
            c_log(`${header}: ${message}`);
        }
        else {
            c_err(`${header}: ${message}`);
        }
    }
    emit({
        lvl,
        tag,
        message,
        time: timestamp,
        output: `${header}: ${message}`,
        // eslint-disable-next-line no-control-regex -- targeting ANSI console controls
        simpleOutput: `${header}: ${message}`.replace(/\x1B\[\d+m/gu, ""),
    });
    if (lvl === "Failure") {
        return exit(42);
    }
    return timestamp;
};
Log.verbosity = "Verbose";
Log.F = (tag, message, time) => Log("Failure", tag, message, time);
Log.A = (tag, message, time) => Log("Alert", tag, message, time);
Log.C = (tag, message, time) => Log("Critical", tag, message, time);
Log.E = (tag, message, time) => Log("Error", tag, message, time);
Log.W = (tag, message, time) => Log("Warning", tag, message, time);
Log.N = (tag, message, time) => Log("Notice", tag, message, time);
Log.I = (tag, message, time) => Log("Info", tag, message, time);
Log.D = (tag, message, time) => Log("Debug", tag, message, time);
Log.V = (tag, message, time) => Log("Verbose", tag, message, time);
Log.on = (filter, listener) => {
    let requestedHandlers;
    if (filter === "Any") {
        requestedHandlers = logLevels;
    }
    else if (typeof filter === "string") {
        requestedHandlers = [filter];
    }
    else {
        requestedHandlers = filter;
    }
    requestedHandlers.forEach((h) => void handlers[h].push(listener));
};
Log.off = (filter, listener) => {
    let requestedHandlers;
    if (filter === "Any") {
        requestedHandlers = logLevels;
    }
    else if (typeof filter === "string") {
        requestedHandlers = [filter];
    }
    else {
        requestedHandlers = filter;
    }
    requestedHandlers.forEach((h) => {
        const i = handlers[h].indexOf(listener);
        if (i >= 0) {
            handlers[h].splice(i, 1);
        }
    });
};
Log.colorize = colorize;
//# sourceMappingURL=log.js.map