import "./Array.polyfill.js"
import "./Map.polyfill.js"
import "./Object.polyfill.js"

import "./Array.extension.js"
import "./Error.extension.js"
import "./fetch.extension.js"
import "./Function.extension.js"
import "./Map.extension.js"
import "./Object.extension.js"
import "./String.extension.js"

export { Enum } from "./enum.js"
export { Mime } from "./mime.js"
export { sc } from "./status-codes.js"
export { Log, type LogEntry, type LogLevel } from "./log.js"

export type { Mutable, MethodKeys } from "./types.js"

export { Temporal, Intl } from "@js-temporal/polyfill"
