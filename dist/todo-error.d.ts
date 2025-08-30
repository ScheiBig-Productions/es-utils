/**
 * Represents a runtime code path violation - typically thrown when a function
 * is called because declaration is present, but implementation not.
 *
 * Internally used by `Error.todo`
 *
 * This error is designed to be used both with and without the `new` keyword,
 * and mimics native `Error` behavior as closely as possible in ES5-compatible environments.
 */
export interface TodoError extends Error {
    message: string;
    cause?: unknown;
}
/**
 * Constructor interface for {@link TodoError}.
 *
 * Supports both `new TodoError(...)` and `TodoError(...)` usage.
 */
export interface TodoErrorConstructor {
    /**
     * Creates new `TodoError` with provided cause and message.
     */
    new (message: string, cause?: unknown): TodoError;
    /**
     * Creates new `TodoError` with provided cause and message.
     */
    (message: string, cause?: unknown): TodoError;
    prototype: TodoError;
}
/**
 * Constructor for {@link TodoError}.
 *
 * Supports both `new TodoError(...)` and `TodoError(...)` usage.
 */
export declare const TodoError: TodoErrorConstructor;
//# sourceMappingURL=todo-error.d.ts.map