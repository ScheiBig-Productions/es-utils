export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
}

export type MethodKeys<T> = {
	[K in keyof T]: T[K] extends (...args: ReadonlyArray<any>) => unknown ? K : never;
}[keyof T]

export type Maybe<T> = T | null | undefined

export type Awaitable<T> = T | Promise<T>
