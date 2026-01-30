/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
import { Object_tag } from "./common/object-tag.js";
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
        // Unfortunately in some developer-unfriendly browsers (Firefox as always)
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
Object_tag(TodoError);
//# sourceMappingURL=todo-error.js.map