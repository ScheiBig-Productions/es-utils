/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/

/* eslint-disable @typescript-eslint/no-invalid-void-type --
 * This intentionally enables creating generic function which might or might not
 * have a parameter.
 */
export { }

type URLParams = Record<string,
	string | number | boolean | Date
	| Array<string> | Array<number> | Array<boolean> | Array<Date>
> | undefined

type UnknownConfig = {
	slug?: unknown,
	query?: unknown,
	init?: unknown,
}

type InputConfig = {
	slug?: URLParams,
	query?: URLParams,
	init?: Record<string, unknown>,
}

type ResolveConfig<T extends {
	slug?: URLParams,
	query?: URLParams,
	init?: Record<string, unknown>,
}> =
	T["slug"] extends object
		? T["query"] extends object
			? T["init"] extends object
				? { slug: T["slug"], query: T["query"], init: T["init"] }
				: { slug: T["slug"], query: T["query"] }
			: T["init"] extends object
				? { slug: T["slug"], init: T["init"] }
				: { slug: T["slug"] }
		: T["query"] extends object
			? T["init"] extends object
				? { query: T["query"], init: T["init"] }
				: { query: T["query"] }
			: T["init"] extends object
				? { init: T["init"] }
				: void

type URLConfig<T extends UnknownConfig> =
	T["slug"] extends object
		? T["query"] extends object
			? { slug: T["slug"], query: T["query"] }
			: { slug: T["slug"] }
		: T["query"] extends object
			? { query: T["query"] }
			: void

type InitConfig<T extends UnknownConfig> =
	T["init"] extends object
		? { init: T["init"] }
		: void

type URLLike = string | URL

declare global {
	namespace fetch {

		/**
		 * Creates a factory that allows for calling specific `Request`s in repeatable,
		 * configurable way.
		 *
		 * It allows for parameterize 3 basic configurations: URL slug, URL query,
		 * and init config.
		 *
		 * Each call will create new `Response` (call fetch underneath), but success is not
		 * guaranteed if provided streams are consumed in meantime or in previous call; it is
		 * caller responsibility to make sure that dynamic config will DI streams.
		 *
		 * @param url - Static URL-like path or dynamic URL-like path parameterized
		 * with `config.slug` and `config.query`.
		 * @param init - Static init config or dynamic init config parameterized
		 * with init
		 * @returns Function that accepts anticipated configuration and returns the same type
		 * as calling `fetch` with resolved configuration would.
		 */
		var factory: <
			T extends InputConfig = object,
		>(
			url: URLLike | ((p: URLConfig<T>) => URLLike),
			init?: RequestInit | ((p: InitConfig<T>) => RequestInit),
		) => (config: ResolveConfig<T>) => Promise<Response>
	}
}

fetch.factory ??= function factory<
	T extends InputConfig,
>(
	url: URLLike | ((p: URLConfig<T>) => URLLike),
	init?: RequestInit | ((p: InitConfig<T>) => RequestInit),
) {

	return async function fetchFactoryCreation(config: ResolveConfig<T>) {
		const resolvedUrl = typeof url === "function"
			? url(config as unknown as URLConfig<T>)
			: url

		const resolvedInit = init === undefined
			? undefined
			: typeof init === "function"
				? init(config as unknown as InitConfig<T>)
				: init

		return await fetch(resolvedUrl, resolvedInit)
	}
}
