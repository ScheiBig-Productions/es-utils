/**
 * Constructor for {@link ContractViolationError}.
 *
 * Supports both `new ContractViolationError(...)` and `ContractViolationError(...)` usage.
 */
/* eslint-disable-next-line func-names --
 * Relying on name propagation from const, as shadowing would be extremely annoying here.
 */
export const ContractViolationError = function (cause) {
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof ContractViolationError
        ? this
        : Object.create(ContractViolationError.prototype);
    const message = "This function should never be successfully called!";
    self.name = "ContractViolationError";
    self.message = message;
    if (cause) {
        self.cause = cause;
    }
    Error.call(self, message, cause ? { cause } : {});
    if (Error.captureStackTrace) {
        Error.captureStackTrace(self, ContractViolationError);
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
    Object.setPrototypeOf(self, ContractViolationError.prototype);
    return self;
};
ContractViolationError.prototype = Object.create(Error.prototype);
ContractViolationError.prototype.constructor = ContractViolationError;
Object.tag(ContractViolationError);
//# sourceMappingURL=contract-violation-error.js.map