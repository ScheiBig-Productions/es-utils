export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
}

export type MethodKeys<T> = {
	[K in keyof T]: T[K] extends (...args: ReadonlyArray<any>) => unknown ? K : never;
}[keyof T]
