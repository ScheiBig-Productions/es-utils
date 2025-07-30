export {};
declare global {
    namespace Intl {
        interface CollatorConstructor {
            /**
             * Configuration of `Intl.Collator` that simulates how MacOS Finder sorts files.
             */
            finderConfig: CollatorOptions;
        }
    }
}
//# sourceMappingURL=Intl.extensions.d.ts.map