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

import "./JSON.extension.js"

const {
	log: c_log,
	error: c_err,
} = console

type inspectOptions = {
	showHidden?: boolean | undefined,
	depth?: number | null | undefined,
	colors?: boolean | undefined,
	customInspect?: boolean | undefined,
	showProxy?: boolean | undefined,
	maxArrayLength?: number | null | undefined,
	maxStringLength?: number | null | undefined,
	breakLength?: number | undefined,
	compact?: boolean | number | undefined,
	sorted?: boolean | ((a: string, b: string) => number) | undefined,
	getters?: "get" | "set" | boolean | undefined,
	numericSeparator?: boolean | undefined,
}

let util_inspect: ((
	object: unknown,
	options?: inspectOptions,
) => string) | undefined

void (async () => {
	try {
		util_inspect = (await import("node:util")).inspect
	} catch {
		util_inspect = undefined
	}
})()


// eslint-disable-next-line complexity -- doing heavy checking to allow this
const colorDisabled = (() => {
	const global = globalThis

	if ("Deno" in global
		&& typeof global.Deno === "object"
		&& global.Deno
		&& "noColor" in global.Deno
		&& typeof global.Deno.noColor === "boolean"
	) {
		return global.Deno.noColor
	}
	if ("process" in global
		&& typeof global.process === "object"
		&& global.process
		&& "env" in global.process
		&& typeof global.process.env === "object"
		&& global.process.env
	) {
		return "NO_COLOR" in global.process.env
	}

	return true
})()

// eslint-disable-next-line complexity -- doing heavy checking to allow this
const exit = (() => {
	const global = globalThis

	if ("Deno" in global
		&& typeof global.Deno === "object"
		&& global.Deno
		&& "exit" in global.Deno
		&& typeof global.Deno.exit === "function"
	) {
		return global.Deno.exit as (code: number) => never
	}
	if ("process" in global
		&& typeof global.process === "object"
		&& global.process
		&& "exit" in global.process
		&& typeof global.process.exit === "function"
	) {
		return global.process.exit as (code: number) => never
	}

	return (code: number) => {
		void code
		throw TypeError("No known exit utility.")
	}
})()


const logLevels = [
	"Failure", "Alert", "Critical",
	"Error", "Warning", "Notice",
	"Info", "Debug", "Verbose",
] as const
type LogLevel = typeof logLevels[number]

const logLevel: Record<LogLevel, number> = {
	Failure: 0,
	Alert: 1,
	Critical: 2,
	Error: 3,
	Warning: 4,
	Notice: 5,
	Info: 6,
	Debug: 7,
	Verbose: 8,
}

const logShortLevel: Record<LogLevel, string> = {
	Failure: "F",
	Alert: "A",
	Critical: "C",
	Error: "E",
	Warning: "W",
	Notice: "N",
	Info: "I",
	Debug: "D",
	Verbose: "V",
}

const logShortColors: Record<LogLevel, number> = {
	Failure: 96,
	Alert: 95,
	Critical: 35,
	Error: 31,
	Warning: 33,
	Notice: 32,
	Info: 94,
	Debug: 0,
	Verbose: 90,
}

type LoggerFunc = (tag: string | null, message: string, time?: Date) => Date
type LoggerInspectFunc =
	| ((tag: string | null, message: Array<unknown>, time?: Date) => Date)
	| ((tag: string | null, message: Array<unknown>, options?: inspectOptions & {
		time?: Date,
	}) => Date)

type LogEntry = {

	/** Level of message. */
	lvl: LogLevel,

	/** Header of message - `null` if not desired. */
	tag: string | null,

	/** Body of message. */
	message: string,

	/** Time at which entry occurred. */
	time: Date,

	/** Formatted output that was printed to console. */
	output: string,

	/** Formatted output that was printed to console (without color). */
	simpleOutput: string,
}
type RegisterFunc = (
	filter: LogLevel | Array<LogLevel> | "Any",
	listener: (entry: LogEntry) => void,
) => void

const colorize = function Log_colorize(code: LogLevel | number, msg: string): string {
	if (colorDisabled) {
		return msg
	}
	const color = typeof code === "string" ? logShortColors[code] : code
	return `\x1B[${color}m${msg}\x1B[0m`
}

const handlers = Object.fromEntries(
	[ ...logLevels ].map((l) => [ l, []] as const),
) as unknown as Record<LogLevel, Array<(entry: LogEntry) => void>>

const emit = function emit(entry: LogEntry) {
	for (const hand of handlers[entry.lvl]) {
		hand(entry)
	}
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
/* eslint-disable-next-line func-style --
 * Necessary for namespace-merging
 */
export function Log(lvl: LogLevel, tag: string | null, message: string, time?: Date): Date {
	const timestamp = time ?? new Date()
	const localDT = new Date(timestamp.getTime() - (timestamp.getTimezoneOffset() * 1000))
	let dt = localDT.toJSON()
	dt = dt.replace("T", " ")
		.replace("Z", "")
		.replace(/\.\d\d\d/u, "")

	let header = colorize(lvl, `[${dt} |${logShortLevel[lvl]}`)
	if (tag != null) {
		header += colorize(lvl, "| ") + colorize("Verbose", tag)
	}
	header += colorize(lvl, "]")

	if (logLevel[lvl] <= logLevel[Log.verbosity]) {
		if (logLevel[lvl] > logLevel.Warning) {
			c_log(`${header}: ${message}`)
		} else {
			c_err(`${header}: ${message}`)
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
	})

	if (lvl === "Failure") {
		return exit(42)
	}

	return timestamp
}


// Log.colorize = colorize

const __colorize__ = colorize

export namespace Log {

	/**
	 * Available levels of logging severity.
	 */
	export type Level = LogLevel

	/**
	 * Structure used by {@link Log.on} listeners, containing full context of log entry,
	 */
	export type Entry = LogEntry

	/**
	 * Currently set level of verbosity of Log.
	 *
	 * Affects only printing to `console`, as listeners provide their own filters.
	 */
	/* eslint-disable-next-line prefer-const --
	 * This must be modifiable outside of module
	 */
	export let verbosity: LogLevel = "Verbose"

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
	export const F: LoggerFunc = function Log_Failure(tag, message, time) {
		return Log("Failure", tag, message, time)
	}

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
	export const A: LoggerFunc = function Log_Alert(tag, message, time) {
		return Log("Alert", tag, message, time)
	}

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
	export const C: LoggerFunc = function Log_Critical(tag, message, time) {
		return Log("Critical", tag, message, time)
	}

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
	export const E: LoggerFunc = function Log_Error(tag, message, time) {
		return Log("Error", tag, message, time)
	}

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
	export const W: LoggerFunc = function Log_Warning(tag, message, time) {
		return Log("Warning", tag, message, time)
	}

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
	export const N: LoggerFunc = function Log_Notice(tag, message, time) {
		return Log("Notice", tag, message, time)
	}

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
	export const I: LoggerFunc = function Log_Info(tag, message, time) {
		return Log("Info", tag, message, time)
	}

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
	export const D: LoggerFunc = function Log_Debug(tag, message, time) {
		return Log("Debug", tag, message, time)
	}

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
	export const V: LoggerFunc = function Log_Verbose(tag, message, time) {
		return Log("Verbose", tag, message, time)
	}

	/**
	 * Registers new listener to the logger
	 */
	export const on: RegisterFunc = function Log_on(filter, listener) {
		let requestedHandlers: ReadonlyArray<LogLevel>
		if (filter === "Any") {
			requestedHandlers = logLevels
		} else if (typeof filter === "string") {
			requestedHandlers = [ filter ]
		} else {
			requestedHandlers = filter
		}
		requestedHandlers.forEach((h) => void handlers[h].push(listener))
	}

	/**
	 * Removes listener from the logger
	 */
	export const off: RegisterFunc = function Log_off(filter, listener) {
		let requestedHandlers: ReadonlyArray<LogLevel>
		if (filter === "Any") {
			requestedHandlers = logLevels
		} else if (typeof filter === "string") {
			requestedHandlers = [ filter ]
		} else {
			requestedHandlers = filter
		}
		requestedHandlers.forEach((h) => {
			const i = handlers[h].indexOf(listener)
			if (i >= 0) { handlers[h].splice(i, 1) }
		})
	}

	/**
	 * Produces string wrapped in color for given log level or ANSI code point.
	 *
	 * @param code - LogLevel or numerical code for given format.
	 * @param msg - Message to wrap in color.
	 * @returns Formatted message (if color is not disabled), with format reset at the end.
	 */
	export const colorize = __colorize__

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
	// eslint-disable-next-line complexity -- This is already as simple, as possible
	export const tag = function Log_tag<T>(
		val: T,
		key?: (o: T) => unknown,
	): string {
		let valTag: string
		let keyTag = ""
		switch (typeof val) {
			case "string" :
			case "number" :
			case "bigint" :
			case "boolean" :
			case "symbol" :
			case "undefined" : {
				valTag = `<primitive> ${typeof val}`
				break
			}
			case "object" : {
				if (val === null) {
					valTag = "<object> null"
					break
				}
				valTag = val.constructor.name
				if (key) {
					keyTag = `${tag(key(val)) || "<anonymous>"}`
				}
				break
			}
			case "function" : {
				valTag = val.name
				if (key) {
					keyTag = `<static> ${tag(key(val)) || "<anonymous>"}`
				}
				break
			}
			default : {
				return Error.never("There are no other primitive values", val)
			}
		}
		valTag += keyTag && ` : ${keyTag}`
		return valTag
	}

	/**
	 * Logger sub-utility for logging non-string values.
	 *
	 * Attempts to use `util.inspect` if available,
	 * falling back to `JSON.stringify` and then `String`.
	 *
	 * Due to simplicity for passing context with object, array of messages is used.
	 */

	export function inspect(
		lvl: LogLevel,
		tag: string | null,
		messages: Array<unknown>,
		time?: Date,
	): Date
	export function inspect(
		lvl: LogLevel,
		tag: string | null,
		messages: Array<unknown>,
		options?: inspectOptions & { time?: Date },
	): Date
	export function inspect(
		lvl: LogLevel,
		tag: string | null,
		messages: Array<unknown>,
		timeOrOptions?: Date | (inspectOptions & { time?: Date }),
	): Date {
		let time: Date | undefined
		let options: inspectOptions
		if (timeOrOptions === undefined) {
			time = undefined
			options = inspect.defaultOptions
		} else if (timeOrOptions instanceof Date) {
			time = timeOrOptions
			options = inspect.defaultOptions
		} else {
			/* eslint-disable-next-line @typescript-eslint/prefer-destructuring --
			 * Not worth the hassle here
			 */
			time = timeOrOptions.time
			options = {
				...inspect.defaultOptions,
				...timeOrOptions,
			}
		}
		const message = messages.map(
			(msg) => util_inspect?.(msg, options)
				?? JSON.maybeStringify(msg),
		)
			.join("\n")

		return Log(lvl, tag, message, time)
	}

	export namespace inspect {

		/**
		 * Default options passed to `util.inspect`.
		 */
		/* eslint-disable-next-line prefer-const --
		 * This must be modifiable outside of module
		 */
		export let defaultOptions: inspectOptions = {
			showHidden: true,
			depth: 4,
			compact: false,
			colors: !colorDisabled,
		}

		/**
		 * Writes to log with level:
		 * > Failure (0)   - System is unusable (calling this level will crash application)
		 */
		export const F: LoggerInspectFunc = function Log_inspect_Failure(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Failure", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Alert (1) - Action must be taken immediately
		 */
		export const A: LoggerInspectFunc = function Log_inspect_Alert(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Alert", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Critical (2) - Critical conditions
		 */
		export const C: LoggerInspectFunc = function Log_inspect_Critical(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Critical", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Error (3) - Error conditions
		 */
		export const E: LoggerInspectFunc = function Log_inspect_Error(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Error", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Warning (4) - Warning conditions
		 */
		export const W: LoggerInspectFunc = function Log_inspect_Warning(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Warning", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Notice (5) - Normal but significant
		 */
		export const N: LoggerInspectFunc = function Log_inspect_Notice(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Notice", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Info (6) - Information messaging
		 */
		export const I: LoggerInspectFunc = function Log_inspect_Info(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Info", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Debug (7) - Debug-level messages
		 */
		export const D: LoggerInspectFunc = function Log_inspect_Debug(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Debug", tag, messages, timeOrOptions as object)
		}

		/**
		 * Writes to log with level:
		 * > Verbose (8) - Verbose messaging
		 */
		export const V: LoggerInspectFunc = function Log_inspect_Verbose(
			tag: string | null,
			messages: Array<unknown>,
			timeOrOptions?: Date | (inspectOptions & { time?: Date }),
		) {
			return inspect("Verbose", tag, messages, timeOrOptions as object)
		}
	}
}
