/**
 * Constructor for {@link TodoError}.
 *
 * Supports both `new TodoError(...)` and `TodoError(...)` usage.
 */
/* eslint-disable-next-line func-names --
 * Relying on name propagation from const, as shadowing would be extremely annoying here.
 */
export const TodoError = function (message, cause) {
    // eslint-disable-next-line consistent-this -- Conditional creation of this
    const self = this instanceof TodoError
        ? this
        : Object.create(TodoError.prototype);
    self.name = "TodoError";
    self.message = message;
    if (cause) {
        self.cause = cause;
    }
    Error.call(self, message, cause ? { cause } : {});
    if (Error.captureStackTrace) {
        Error.captureStackTrace(self, TodoError);
    }
    else {
        // Unfortunately in some 3rd world browsers (Firefox as always)
        // `Error.captureStackTrace` is alarmingly recent addition,
        // which must be assumed to be unavailable
        const { stack } = new Error(message, cause ? { cause } : {});
        if (stack) {
            self.stack = stack;
        }
    }
    Object.setPrototypeOf(self, TodoError.prototype);
    return self;
};
TodoError.prototype = Object.create(Error.prototype);
TodoError.prototype.constructor = TodoError;
//# sourceMappingURL=todo-error.js.map