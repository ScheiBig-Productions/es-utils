/* eslint-disable no-await-in-loop --
 * Exponential backoff implementation.
 */
/* eslint-disable @typescript-eslint/naming-convention --
 * Inner classes.
 */
/* eslint-disable @typescript-eslint/no-unnecessary-condition --
 * Unfortunately in some developer-unfriendly browsers (Firefox as always)
 * `Error.captureStackTrace` is alarmingly recent addition,
 * which must be assumed to be unavailable
 */
/* eslint-disable func-names --
 * Relying on name propagation from const, as shadowing would be extremely annoying here.
 */
/* eslint-disable complexity --
 * Bound single-use logic should live inside function.
 */
import { Object_tag } from "./common/object-tag.js";
export const Retry = function (config) {
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof Retry
        ? this
        : Object.create(Retry.prototype);
    self.initialDelay = config?.initialDelay ?? 500;
    self.growth = config?.growth ?? 1.8;
    self.jitter = config?.jitter ?? 0.2;
    self.timeout = config?.timeout ?? Infinity;
    self.attempts = config?.attempts ?? 5;
    self.maxDelay = config?.maxDelay ?? Infinity;
    if (self.initialDelay < 0) {
        throw new RangeError("initialDelay must be zero or greater");
    }
    if (self.growth <= 0) {
        throw new RangeError("growth must be greater than zero");
    }
    if (self.jitter < 0) {
        throw new RangeError("jitter must be zero or greater");
    }
    if (self.timeout <= 0) {
        throw new RangeError("timeout must be greater than zero");
    }
    if (self.attempts <= 0) {
        throw new RangeError("attempts must be greater than zero");
    }
    if (self.maxDelay <= 0) {
        throw new RangeError("maxDelay must be greater than zero");
    }
    return self;
};
Object_tag(Retry);
// eslint-disable-next-line id-length -- Name must be descriptive
const __INERT_SIGNAL__YOU_ARE_NOT_ALLOWED_TO_USE_IT = new AbortController().signal;
Retry.prototype.run = async function run(
// eslint-disable-next-line no-shadow -- This is not a shadowing
fn, 
// eslint-disable-next-line no-shadow -- This is not a shadowing
onEachError) {
    const jitter = (delay) => delay * this.jitter * (Math.random() - 0.5) * 2;
    let baseDelay = this.initialDelay;
    let nextDelay = Math.max(baseDelay + jitter(baseDelay), this.maxDelay);
    let attempt = 0;
    const errors = Array();
    const signal = this.timeout === Infinity
        ? __INERT_SIGNAL__YOU_ARE_NOT_ALLOWED_TO_USE_IT
        : AbortSignal.timeout(this.timeout);
    while (true) {
        if (signal.aborted) {
            throw Retry.TimeoutError(errors, "timeout");
        }
        const delay = nextDelay;
        baseDelay *= this.growth;
        nextDelay = Math.min(baseDelay + jitter(baseDelay), this.maxDelay);
        try {
            return await fn(signal);
        }
        catch (err) {
            errors.push(err);
            if (signal.aborted) {
                throw Retry.TimeoutError(errors, "timeout");
            }
            if (onEachError) {
                const result = onEachError(err, attempt, nextDelay);
                if (result !== undefined) {
                    throw Retry.CancelError(result);
                }
            }
            attempt++;
            if (attempt >= this.attempts) {
                throw Retry.TimeoutError(errors, "attempt");
            }
            try {
                await Promise.after({ delay, signal });
            }
            catch {
                if (signal.aborted) {
                    throw Retry.TimeoutError(errors, "timeout");
                }
            }
        }
    }
};
Retry.CancelError = function CancelError(cause) {
    const message = "Retry cancelled due to critical error";
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof Retry.CancelError
        ? this
        : Object.create(Retry.CancelError.prototype);
    self.name = "CancelError";
    self.message = message;
    self.cause = cause;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(self, Retry.CancelError);
    }
    else {
        // Unfortunately in some developer-unfriendly browsers (Firefox as always)
        // `Error.captureStackTrace` is alarmingly recent addition,
        // which must be assumed to be unavailable
        const { stack } = new Error(message, cause ? { cause } : {});
        if (stack) {
            self.stack = stack;
        }
    }
    Object.setPrototypeOf(self, Retry.CancelError.prototype);
    return self;
};
Retry.CancelError.prototype = Object.create(Error.prototype);
Retry.CancelError.prototype.constructor = Retry.CancelError;
Object_tag(Retry.CancelError);
Retry.TimeoutError = function TimeoutError(cause, type) {
    const message = `Retry cancelled due to ${type === "attempt"
        ? "too many attempts"
        : "too long of a timeout"}`;
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof Retry.TimeoutError
        ? this
        : Object.create(Retry.TimeoutError.prototype);
    self.name = "TimeoutError";
    self.message = message;
    self.type = type;
    self.cause = cause;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(self, Retry.TimeoutError);
    }
    else {
        // Unfortunately in some developer-unfriendly browsers (Firefox as always)
        // `Error.captureStackTrace` is alarmingly recent addition,
        // which must be assumed to be unavailable
        const { stack } = new Error(message, cause ? { cause } : {});
        if (stack) {
            self.stack = stack;
        }
    }
    Object.setPrototypeOf(self, Retry.TimeoutError.prototype);
    return self;
};
Retry.TimeoutError.prototype = Object.create(Error.prototype);
Retry.TimeoutError.prototype.constructor = Retry.TimeoutError;
Object_tag(Retry.TimeoutError);
//# sourceMappingURL=Retry.js.map