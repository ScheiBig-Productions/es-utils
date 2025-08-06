/**
 * A utility class for constructing and manipulating URL query parameters
 * with support for rich input types and serialization.
 *
 * Extends the native `URLSearchParams` class.
 *
 * @example
 * ```ts
 * const qp = new QueryParams({ foo: "bar", count: 42 });
 * qp.put("tags", ["node", "typescript"]);
 * console.log(qp.toString());
 * // "foo=bar&count=42&tags=node&tags=typescript"
 * ```
 */
export declare class QueryParams extends URLSearchParams {
    /**
     * Serializes a value into a string suitable for use in URL query parameters.
     *
     * Supported types:
     * - `null`, `string`, `number`, `boolean`: converted to string via `String()`
     * - `Date`: serialized using `toJSON()`
     *
     * Unsupported types:
     * - Nested arrays
     * - Objects or other complex types
     *
     * @param i - The input value to serialize.
     * @returns The serialized string representation.
     * @throws {ContractViolationError} If the value is a nested array or unsupported type.
     */
    static serializeParam(i: unknown): string;
    /**
     * Constructs a new `QueryParams` instance.
     *
     * Accepts various input formats:
     * - `string`: parsed as query string
     * - `URLSearchParams`: cloned
     * - `Record<string, unknown>` or `Array<[string, unknown]>`: serialized
     *
     * @param init - Initial query parameters.
     * @throws {ContractViolationError} If the value is a nested array or unsupported type.
     */
    constructor(init?: Array<[string, unknown]> | Record<string, unknown> | string | URLSearchParams);
    /**
     * Adds or sets a query parameter with automatic serialization.
     *
     * If the value is an array, each item is appended individually.
     * If `mode` is `"set"` and the key already exists, it is replaced.
     *
     * @param name - The query parameter name.
     * @param value - The value to serialize and insert.
     * @param mode - Whether to replace or append; replacing is default action.
     * @throws {ContractViolationError} If the value is a nested array or unsupported type.
     */
    put(this: QueryParams, name: string, value: unknown, mode?: "set" | "append"): void;
}
//# sourceMappingURL=query-params.d.ts.map