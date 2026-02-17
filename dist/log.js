/* eslint-disable no-shadow --
 * Namespace export shadows internals.
 */
/* eslint-disable @typescript-eslint/unbound-method --
 * Returning static-like functions that cannot be proved to be that.
 */
/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Checks are made in order to work under different runtimes.
 */
/* eslint-disable @typescript-eslint/naming-convention --
 * Using enum-like naming,
 */
/* eslint-disable @typescript-eslint/no-unnecessary-qualifier --
 * Use before declaration requires qualification.
 */
import { util_inspect } from "./common/util.inspect.js";
import { ContractViolationError } from "./contract-violation-error.js";
import "./JSON.extension.js";
const stdWriter = console;
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
const colorize = function Log_colorize(code, msg) {
    if (colorDisabled) {
        return msg;
    }
    const color = typeof code === "string" ? logShortColors[code] : code;
    return `\x1B[${color}m${msg}\x1B[0m`;
};
const handlers = Object.fromEntries([...logLevels].map((l) => [l, []]));
const emit = function emit(entry) {
    for (const hand of handlers[entry.lvl]) {
        hand(entry);
    }
};
const pauseBacklog = new Array();
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
/* eslint-disable-next-line func-style --
 * Necessary for namespace-merging
 */
export function Log(lvl, tag, message, time) {
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
        const msg = `${header}: ${message}`;
        let type;
        if (logLevel[lvl] > logLevel.Warning) {
            type = "log";
        }
        else {
            type = "error";
        }
        if (Log.isConsolePaused()) {
            pauseBacklog.push([type, msg]);
        }
        else {
            stdWriter[type](msg);
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
}
// Log.colorize = colorize
const __colorize__ = colorize;
(function (Log) {
    /**
     * Currently set level of verbosity of Log.
     *
     * Affects only printing to `console`, as listeners provide their own filters.
     */
    /* eslint-disable-next-line prefer-const --
     * This must be modifiable outside of module
     */
    Log.verbosity = "Verbose";
    let paused = false;
    /**
     * Whether Log is currently paused for {@link console}.
     */
    Log.isConsolePaused = () => paused;
    /**
     * Pauses logging to {@link console}.
     *
     * While log is paused, new messages are pushed to queue,
     * and replayed after resuming (by default).
     *
     * Paused log does not print to console, however it still emits to listeners.
     */
    Log.pauseConsole = function () {
        const timestamp = new Date();
        const localDT = new Date(timestamp.getTime() - (timestamp.getTimezoneOffset() * 1000));
        let dt = localDT.toJSON();
        dt = dt.replace("T", " ")
            .replace("Z", "")
            .replace(/\.\d\d\d/u, "");
        const yellow = Log.colorize.bind(null, 93);
        let header = yellow(`\x1b[1m[${dt} |-| `);
        header += Log.colorize("Verbose", "\x1b[1mes-utils/Log/pauseConsole");
        header += yellow("\x1b[1m]");
        stdWriter.log(header
            + yellow(": Pausing logging to console"));
        paused = true;
    };
    /**
     * Resumes logging to {@link console}.
     *
     * @param replay - Whether to replay all messages queued during pause (`true` by default).
     * @returns Number of messages queued during pause.
     */
    Log.resumeConsole = function (replay = true) {
        const queuedMsgCount = pauseBacklog.length;
        const timestamp = new Date();
        const localDT = new Date(timestamp.getTime() - (timestamp.getTimezoneOffset() * 1000));
        let dt = localDT.toJSON();
        dt = dt.replace("T", " ")
            .replace("Z", "")
            .replace(/\.\d\d\d/u, "");
        const yellow = Log.colorize.bind(null, 93);
        let header = yellow(`\x1b[1m[${dt} |-| `);
        header += Log.colorize("Verbose", "\x1b[1mes-utils/Log/resumeConsole");
        header += yellow("\x1b[1m]");
        if (replay) {
            stdWriter.log(header
                + yellow(`: Resuming logging to console - replaying ${queuedMsgCount} messaged...`));
            for (;;) {
                const first = pauseBacklog.shift();
                if (!first) {
                    break;
                }
                stdWriter[first[0]](first[1]);
            }
            stdWriter.log(header
                + yellow(": Resuming logging to console - finished replaying"));
        }
        else {
            stdWriter.log(header
                + yellow(`: Resuming logging to console - skipping ${queuedMsgCount} messages`));
            pauseBacklog.length = 0;
        }
        paused = false;
        return queuedMsgCount;
    };
    /**
     * Writes to log with level:
     * > Failure (0)   - System is unusable (calling this level will crash application)
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.F = function Log_Failure(tag, message, time) {
        return Log("Failure", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Alert (1) - Action must be taken immediately
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.A = function Log_Alert(tag, message, time) {
        return Log("Alert", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Critical (2) - Critical conditions
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.C = function Log_Critical(tag, message, time) {
        return Log("Critical", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Error (3) - Error conditions
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.E = function Log_Error(tag, message, time) {
        return Log("Error", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Warning (4) - Warning conditions
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.W = function Log_Warning(tag, message, time) {
        return Log("Warning", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Notice (5) - Normal but significant
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.N = function Log_Notice(tag, message, time) {
        return Log("Notice", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Info (6) - Information messaging
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.I = function Log_Info(tag, message, time) {
        return Log("Info", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Debug (7) - Debug-level messages
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.D = function Log_Debug(tag, message, time) {
        return Log("Debug", tag, message, time);
    };
    /**
     * Writes to log with level:
     * > Verbose (8) - Verbose messaging
     *
     * @param lvl - Level that message should have.
     * @param tag - Header of message - `null` if not desired.
     * @param message - Body of message.
     * @param time - Optional time for which log message should be printed.
     * Usable if message was preprocessed for a long time.
     *
     * @returns `time` if passed, timestamp of log message otherwise
     */
    Log.V = function Log_Verbose(tag, message, time) {
        return Log("Verbose", tag, message, time);
    };
    /**
     * Registers new listener to the logger
     */
    Log.on = function Log_on(filter, listener) {
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
    /**
     * Removes listener from the logger
     */
    Log.off = function Log_off(filter, listener) {
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
    /**
     * Produces string wrapped in color for given log level or ANSI code point.
     *
     * @param code - LogLevel or numerical code for given format.
     * @param msg - Message to wrap in color.
     * @returns Formatted message (if color is not disabled), with format reset at the end.
     */
    Log.colorize = __colorize__;
    /**
     * Returns tag for given value, which can be placed without worry of breaking
     * naming after refactor.
     *
     * @param val - Value to tag.
     * @param key - Selector of member of `val` to include in tag
     * @returns `primitive ${typeof}` for primitives, `constructor.name` for objects
     * or `name` for functions (and classes by extension).
     *
     * If key is provided for object value, ` : tag(key(val))` is added.
     *
     * If key is provided for function value, ` : <static> tag(key(val))` is added.
     */
    Log.tag = function Log_tag(val, key) {
        let valTag;
        let keyTag = "";
        switch (typeof val) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
            case "undefined": {
                valTag = `<primitive> ${typeof val}`;
                break;
            }
            case "object": {
                if (val === null) {
                    valTag = "<object> null";
                    break;
                }
                valTag = val.constructor.name;
                if (key) {
                    keyTag = `${Log.tag(key(val)) || "<anonymous>"}`;
                }
                break;
            }
            case "function": {
                valTag = val.name;
                if (key) {
                    keyTag = `<static> ${Log.tag(key(val)) || "<anonymous>"}`;
                }
                break;
            }
            default: {
                throw ContractViolationError(`There are no other primitive values: ${String(val)}`);
            }
        }
        valTag += keyTag && ` : ${keyTag}`;
        return valTag;
    };
    function inspect(lvl, tag, messages, timeOrOptions) {
        let time;
        let options;
        if (timeOrOptions === undefined) {
            time = undefined;
            options = inspect.defaultOptions;
        }
        else if (timeOrOptions instanceof Date) {
            time = timeOrOptions;
            options = inspect.defaultOptions;
        }
        else {
            /* eslint-disable-next-line @typescript-eslint/prefer-destructuring --
             * Not worth the hassle here
             */
            time = timeOrOptions.time;
            options = {
                ...inspect.defaultOptions,
                ...timeOrOptions,
            };
        }
        const message = messages.map((msg) => util_inspect?.(msg, options)
            ?? JSON.maybeStringify(msg))
            .join("\n");
        return Log(lvl, tag, message, time);
    }
    Log.inspect = inspect;
    (function (inspect) {
        /**
         * Default options passed to `util.inspect`.
         */
        /* eslint-disable-next-line prefer-const --
         * This must be modifiable outside of module
         */
        inspect.defaultOptions = {
            showHidden: true,
            depth: 4,
            compact: false,
            colors: !colorDisabled,
        };
        /**
         * Writes to log with level:
         * > Failure (0)   - System is unusable (calling this level will crash application)
         */
        inspect.F = function Log_inspect_Failure(tag, messages, timeOrOptions) {
            return inspect("Failure", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Alert (1) - Action must be taken immediately
         */
        inspect.A = function Log_inspect_Alert(tag, messages, timeOrOptions) {
            return inspect("Alert", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Critical (2) - Critical conditions
         */
        inspect.C = function Log_inspect_Critical(tag, messages, timeOrOptions) {
            return inspect("Critical", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Error (3) - Error conditions
         */
        inspect.E = function Log_inspect_Error(tag, messages, timeOrOptions) {
            return inspect("Error", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Warning (4) - Warning conditions
         */
        inspect.W = function Log_inspect_Warning(tag, messages, timeOrOptions) {
            return inspect("Warning", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Notice (5) - Normal but significant
         */
        inspect.N = function Log_inspect_Notice(tag, messages, timeOrOptions) {
            return inspect("Notice", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Info (6) - Information messaging
         */
        inspect.I = function Log_inspect_Info(tag, messages, timeOrOptions) {
            return inspect("Info", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Debug (7) - Debug-level messages
         */
        inspect.D = function Log_inspect_Debug(tag, messages, timeOrOptions) {
            return inspect("Debug", tag, messages, timeOrOptions);
        };
        /**
         * Writes to log with level:
         * > Verbose (8) - Verbose messaging
         */
        inspect.V = function Log_inspect_Verbose(tag, messages, timeOrOptions) {
            return inspect("Verbose", tag, messages, timeOrOptions);
        };
    })(inspect = Log.inspect || (Log.inspect = {}));
})(Log || (Log = {}));
//# sourceMappingURL=log.js.map