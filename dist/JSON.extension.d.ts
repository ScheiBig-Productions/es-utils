type AnyCtor = (new (...args: Array<any>) => any) | Function;
declare const JSON_minimify_Tag: {
    "JSON.minimify.Tag": {
        new (value: string, refCtor: AnyCtor): {
            readonly [index: number]: string;
            /**
             * Reference to constructor of overflown property.
             */
            refCtor: AnyCtor;
            toString(): string;
            charAt(pos: number): string;
            charCodeAt(index: number): number;
            concat(...strings: string[]): string;
            indexOf(searchString: string, position?: number): number;
            lastIndexOf(searchString: string, position?: number): number;
            localeCompare(that: string): number;
            localeCompare(that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
            localeCompare(that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
            match(regexp: string | RegExp): RegExpMatchArray | null;
            match(matcher: {
                [Symbol.match](string: string): RegExpMatchArray | null;
            }): RegExpMatchArray | null;
            replace(searchValue: string | RegExp, replaceValue: string): string;
            replace(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
            replace(searchValue: {
                [Symbol.replace](string: string, replaceValue: string): string;
            }, replaceValue: string): string;
            replace(searchValue: {
                [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
            }, replacer: (substring: string, ...args: any[]) => string): string;
            search(regexp: string | RegExp): number;
            search(searcher: {
                [Symbol.search](string: string): number;
            }): number;
            slice(start?: number, end?: number): string;
            split(separator: string | RegExp, limit?: number): string[];
            split(splitter: {
                [Symbol.split](string: string, limit?: number): string[];
            }, limit?: number): string[];
            substring(start: number, end?: number): string;
            toLowerCase(): string;
            toLocaleLowerCase(locales?: string | string[]): string;
            toLocaleLowerCase(locales?: Intl.LocalesArgument): string;
            toUpperCase(): string;
            toLocaleUpperCase(locales?: string | string[]): string;
            toLocaleUpperCase(locales?: Intl.LocalesArgument): string;
            trim(): string;
            readonly length: number;
            substr(from: number, length?: number): string;
            valueOf(): string;
            codePointAt(pos: number): number | undefined;
            includes(searchString: string, position?: number): boolean;
            endsWith(searchString: string, endPosition?: number): boolean;
            normalize(form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
            normalize(form?: string): string;
            repeat(count: number): string;
            startsWith(searchString: string, position?: number): boolean;
            anchor(name: string): string;
            big(): string;
            blink(): string;
            bold(): string;
            fixed(): string;
            fontcolor(color: string): string;
            fontsize(size: number): string;
            fontsize(size: string): string;
            italics(): string;
            link(url: string): string;
            small(): string;
            strike(): string;
            sub(): string;
            sup(): string;
            padStart(maxLength: number, fillString?: string): string;
            padEnd(maxLength: number, fillString?: string): string;
            trimEnd(): string;
            trimStart(): string;
            trimLeft(): string;
            trimRight(): string;
            matchAll(regexp: RegExp): RegExpStringIterator<RegExpExecArray>;
            replaceAll(searchValue: string | RegExp, replaceValue: string): string;
            replaceAll(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
            at(index: number): string | undefined;
            indent: (this: string, indent: string) => string;
            trimIndent: (this: string, tabWidth?: number) => string;
            pack: (this: string) => string;
            [Symbol.iterator](): StringIterator<string>;
        };
        fromCharCode(...codes: number[]): string;
        fromCodePoint(...codePoints: number[]): string;
        raw(template: {
            raw: readonly string[] | ArrayLike<string>;
        }, ...substitutions: any[]): string;
        decorator(config: {
            prefix: string;
        } | {
            suffix: string;
        } | {
            prefix: string;
            suffix: string;
        }): ((strings: TemplateStringsArray | string, ...values: Array<unknown>) => string);
    };
};
type MinimifyOptions = {
    /**
     * Custom replacer function, same as in `JSON.stringify`.
     *
     * @see {@link JSON.stringify}
     */
    replacer?: (key: string, value: any) => any;
    /**
     * Indentation for pretty-printing.
     *
     * @see {@link JSON.stringify}
     */
    space?: string | number;
    /**
     * Maximum depth to traverse before replacing with a tagged representation.
     *
     * Default: Infinity (undefined).
     */
    maxDepth?: number;
    /**
     * If true, returns a Promise that resolves with the result.
     * If a number, sets a timeout in milliseconds - the promise will reject
     * if serialization exceeds this time.
     */
    async?: true | number;
};
interface MinimifyFn {
    /**
     * Serializes a JavaScript value into a JSON string, with depth control
     * and optional timeout-based asynchronous execution.
     *
     * @param value The value to serialize.
     * @param options Optional configuration object.
     *
     * @returns A JSON string or a Promise that resolves to one.
     * @throws Error in Promise if timeout is exceeded in async mode.
     */
    (value: any, options?: MinimifyOptions): string | Promise<string>;
    /**
     * Tagged representation used when an object exceeds maxDepth or is cyclic.
     * Extends String to allow easy detection in replacer functions.
     *
     * @example
     * new JSON.minimify.Tag("[object MyClass]")
     */
    Tag: typeof JSON_minimify_Tag["JSON.minimify.Tag"];
}
declare global {
    interface JSON {
        /**
         * Serializes a JavaScript value into a JSON string, with depth control
         * and optional timeout-based asynchronous execution.
         *
         * @param value The value to serialize.
         * @param options Optional configuration object.
         *
         * @returns A JSON string or a Promise that resolves to one.
         * @throws Error in Promise if timeout is exceeded in async mode,
         * or when JSON.stringify errors due to cyclic references in unbound serialization,
         * or BigInts etc..
         */
        minimify: MinimifyFn;
    }
}
export {};
//# sourceMappingURL=JSON.extension.d.ts.map