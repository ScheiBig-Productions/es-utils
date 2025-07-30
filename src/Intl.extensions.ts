/* eslint-disable @typescript-eslint/no-unnecessary-condition --
* Conditional assignment for `Array.prototype` props (`??=`) is intentional and context-aware:
* it acts as a runtime polyfill or extension, only defining the method if it doesn't already exist.
* Although the method may appear always present in type definitions,
* the actual environment might lack it (e.g. ES2022 targets).
*/
export { }

declare global {
	namespace Intl {
		interface CollatorConstructor {

			/**
             * Configuration of `Intl.Collator` that simulates how MacOS Finder sorts files.
             */
			finderConfig: CollatorOptions,
		}
	}
}

Intl.Collator.finderConfig ??= {
	sensitivity: "accent",
	numeric: true,
	ignorePunctuation: false,
}
