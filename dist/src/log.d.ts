declare const logLevels: readonly ["Failure", "Alert", "Critical", "Error", "Warning", "Notice", "Info", "Debug", "Verbose"];
export type LogLevel = typeof logLevels[number];
type LoggerFunc = (tag: string | null, message: string, time?: Date) => Date;
export type LogEntry = {
    /** Level of message. */
    lvl: LogLevel;
    /** Header of message - `null` if not desired. */
    tag: string | null;
    /** Body of message. */
    message: string;
    /** Time at which entry occurred. */
    time: Date;
    /** Formatted output that was printed to console. */
    output: string;
    /** Formatted output that was printed to console (without color). */
    simpleOutput: string;
};
type RegisterFunc = (filter: LogLevel | Array<LogLevel> | "Any", listener: (entry: LogEntry) => void) => void;
declare const colorize: (code: LogLevel | number, msg: string) => string;
interface Log {
    (lvl: LogLevel, tag: string | null, message: string, time?: Date): Date;
    verbosity: LogLevel;
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
    F: LoggerFunc;
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
    A: LoggerFunc;
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
    C: LoggerFunc;
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
    E: LoggerFunc;
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
    W: LoggerFunc;
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
    N: LoggerFunc;
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
    I: LoggerFunc;
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
    D: LoggerFunc;
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
    V: LoggerFunc;
    /**
     * Registers new listener to the logger
     */
    on: RegisterFunc;
    /**
     * Removes listener from the logger
     */
    off: RegisterFunc;
    /**
     * Produces string wrapped in color for given log level or ANSI code point.
     *
     * @param code - LogLevel or numerical code for given format.
     * @param msg - Message to wrap in color.
     * @returns Formatted message (if color is not disabled), with format reset at the end.
     */
    colorize: typeof colorize;
}
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
export declare const Log: Log;
export {};
//# sourceMappingURL=log.d.ts.map