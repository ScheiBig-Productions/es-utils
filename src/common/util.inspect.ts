/* eslint-disable @typescript-eslint/naming-convention --
 * Following original usage for convenience
 */
/** @internal */
export let util_inspect: (((
	object: unknown,
	options?: inspectOptions,
) => string) & { custom: symbol }) | undefined

void (async () => {
	try {
		util_inspect = (await import("node:util")).inspect
	} catch {
		util_inspect = undefined
	}
})()

/** @internal */
export type inspectOptions = {
	showHidden?: boolean | undefined,
	depth?: number | null | undefined,
	colors?: boolean | undefined,
	customInspect?: boolean | undefined,
	showProxy?: boolean | undefined,
	maxArrayLength?: number | null | undefined,
	maxStringLength?: number | null | undefined,
	breakLength?: number | undefined,
	compact?: boolean | number | undefined,
	sorted?: boolean | ((a: string, b: string) => number) | undefined,
	getters?: "get" | "set" | boolean | undefined,
	numericSeparator?: boolean | undefined,
}
