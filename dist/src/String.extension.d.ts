export {};
declare global {
    interface String {
        /**
         * Prepends the given indentation string to each line in the string.
         *
         * @param indent - The indentation string to prepend to each line.
         * @returns A new string with each line prefixed with `indent`.
         *
         * @example
         * "Hello\nWorld".indent("    ");
         * // Returns:
         * // "    Hello\n    World"
         */
        indent: (this: string, indent: string) => string;
        /**
         * Removes common leading whitespace from all lines and strips leading/trailing blank lines.
         * Similar to Kotlin's `trimIndent()`, ensuring consistent indentation in multiline strings.
         *
         * Useful for handling formatted text, preserving relative indentation while eliminating
         * excess whitespace.
        *
         * @param tabWith - The width used for tab (\t) characters - defaults to 4.
         * @returns A new string with leading indentation and blank lines stripped.
         * If all lines are blank, then empty string is returned.
         *
         * @example
         * `
         *
         *     Hello
         *       World
         *
         * `.trimIndent();
         * // Returns:
         * // "Hello\n  World"
         */
        trimIndent: (this: string, tabWidth?: number) => string;
        /**
         * Condenses all whitespace into single spaces and trims surrounding whitespace.
         * Useful for compacting multiline text (e.g., CSS, JSON, code).
         *
         * @returns A tightly packed string.
         *
         * @example
         * "   This    is \n   a   test  ".pack();
         * // Returns:
         * // "This is a test"
         */
        pack: (this: string) => string;
    }
}
//# sourceMappingURL=String.extension.d.ts.map