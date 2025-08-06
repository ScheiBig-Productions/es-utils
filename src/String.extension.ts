/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/

export { }

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
		indent: (
			this: string,
			indent: string,
		) => string,

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
		trimIndent: (
			this: string,
			tabWidth?: number,
		) => string,

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
		pack: (this: string) => string,
	}
}

String.prototype.indent ??= function indent(
	this: string,
	// eslint-disable-next-line no-shadow -- no need for backreference with same name
	indent: string,
) {
	return this.replace(/^/ugm, indent)
}

String.prototype.trimIndent ??= function trimIndent(
	this: string,
	tabWith: number = 4,
) {
	const lines = this.split("\n")

	const indent = lines.filter((l) => l.trim())
		.map((l) => (/^\s*/u.exec(l))?.[0] ?? "")
		.map((l) => l.replace(/\t/gu, " ".repeat(tabWith)))
		.minBy((l) => l.length) ?? ""

	const firstNonBlank = lines.findIndex((l) => l.trim())
	const lastNonBlank = lines.findLastIndex((l) => l.trim())

	return lines.slice(firstNonBlank, lastNonBlank + 1)
		.map((l) => l.replace(
			/^(\s*)/gu,
			(m) => m.replace(/\t/gu, " ".repeat(tabWith)),
		))
		.map((l) => l.trimEnd())
		.map((l) => l.startsWith(indent) ? l.slice(indent.length) : l)
		.join("\n")
}

String.prototype.pack ??= function pack(this: string) {
	return this.split("\n")
		.map((l) => l.trim())
		.filter((l) => l)
		.join(" ")
}

type DecoratorConfig = { prefix: string }
	| { suffix: string }
	| { prefix: string, suffix: string }


declare global {
	interface StringConstructor {

		/**
		 * Creates decorator template function, that place prefix and/or suffix next
		 * to provided string.
		 *
		 * Returned function can also be used as wrapper function,
		 * if templating is not necessary.
		 *
		 * @param config - Configuration of prefix/suffix
		 * @param result - Requested function type
		 * @return Decorating template function
		 */
		/* eslint-disable-next-line @typescript-eslint/method-signature-style --
		 * Higher-order lambda messes-up the intellisense for parameters.
		 */
		decorator(config: DecoratorConfig): (
			(strings: TemplateStringsArray | string, ...values: Array<unknown>) => string
		),
	}
}

/* eslint-disable-next-line @typescript-eslint/unbound-method --
 * Static extension.
 */
String.decorator ??= function decorator(config: DecoratorConfig) {
	const prefix = "prefix" in config ? config.prefix : ""
	const suffix = "suffix" in config ? config.suffix : ""

	return (strings: TemplateStringsArray | string, ...values: Array<unknown>) => prefix + (
		typeof strings === "string"
			? strings
			: String.raw(strings, ...values)
	) + suffix

}
