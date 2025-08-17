import type { Temporal } from "@js-temporal/polyfill"

interface AfterFn {

	/**
	 * Returns new Promise, that fulfills after given delay.
	 */
	(delay: number | Temporal.Duration): Promise<void>,

	/**
	 * Returns new Promise, that fulfills after given delay to specified value.
	 */
	<T>(delay: number | Temporal.Duration, value: T): Promise<T>,
}


/**
 * Returns new Promise, that fulfills after given delay to specified value.
 */
export const after = async function after(delay, value) {
	const actualDelay = typeof delay === "number"
		? delay
		: delay.total("milliseconds")

	return await new Promise((res) => void setTimeout(() => res(value), actualDelay))
} as AfterFn
