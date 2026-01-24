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
export const Retry = function (config) {
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof Retry
        ? this
        : Object.create(Retry.prototype);
    self.initialDelay = config?.initialDelay ?? 500;
    self.growth = config?.growth ?? 1.8;
    self.jitter = config?.jitter ?? 0.2;
    self.timeout = config?.timeout ?? Infinity;
    self.maxAttempts = config?.maxAttempts ?? 5;
    if (self.growth <= 0) {
        throw new RangeError("growth must be greater than zero");
    }
    if (self.timeout <= 0) {
        throw new RangeError("timeout must be greater than zero");
    }
    if (self.maxAttempts <= 0) {
        throw new RangeError("maxAttempts must be greater than zero");
    }
    if (self.initialDelay < 0) {
        throw new RangeError("initialDelay must be zero or greater");
    }
    if (self.jitter < 0) {
        throw new RangeError("jitter must be zero or greater");
    }
    return self;
};
Retry.prototype.run = async function run(fn, 
// eslint-disable-next-line no-shadow -- This is not a shadowing
onEachError) {
    const jitter = (delay) => delay * this.jitter * (Math.random() - 0.5) * 2;
    let baseDelay = this.initialDelay;
    let nextDelay = baseDelay + jitter(baseDelay);
    let timeSpent = 0;
    let attempt = 0;
    const errors = Array();
    while (true) {
        const delay = nextDelay;
        timeSpent += delay;
        baseDelay *= this.growth;
        nextDelay = baseDelay + jitter(baseDelay);
        try {
            return await fn();
        }
        catch (err) {
            errors.push(err);
            if (onEachError) {
                const result = onEachError(err, attempt, nextDelay);
                if (result !== undefined) {
                    throw Retry.CancelError(result);
                }
            }
            attempt++;
            if (attempt >= this.maxAttempts) {
                throw Retry.TimeoutError(errors, "attempts");
            }
            if (timeSpent > this.timeout) {
                throw Retry.TimeoutError(errors, "delay");
            }
            await Promise.after(delay);
        }
    }
};
Retry.CancelError = function (cause) {
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
Retry.TimeoutError = function (cause, type) {
    const message = `Retry cancelled due to ${type === "attempts"
        ? "too many attempts"
        : "too long of a timeout"}`;
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof Retry.TimeoutError
        ? this
        : Object.create(Retry.TimeoutError.prototype);
    self.name = "TimeoutError";
    self.message = message;
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
//# sourceMappingURL=Retry.js.map