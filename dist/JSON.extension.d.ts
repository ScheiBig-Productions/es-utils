export {};
type Replacer = ((this: any, key: string, value: any) => any) | Array<number | string> | null;
declare global {
    interface JSON {
        /**
         * Attempts conversion of a JavaScript value to a JavaScript Object Notation (JSON) string.
         *
         * Fail gracefully, with fallback to `String(value)`.
         * @param value A value to be converted.
         * @param replacer Either function that transforms the results,
         * array of whitelisted property keys, or `null` for no transformation.
         * @param space Number of spaces or indentation character - when passed,
         * the result is pretty-printed.
         */
        maybeStringify: (value: unknown, replacer?: Replacer, space?: string | number) => string;
    }
}
//# sourceMappingURL=JSON.extension.d.ts.map