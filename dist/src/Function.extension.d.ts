import type { MethodKeys } from "./types.js";
interface BoundFn {
    <T, K extends MethodKeys<T>>(instance: T, methodName: K): T[K];
    <T, K extends MethodKeys<T>>(instance: T, methodSelector: (o: T) => T[K]): T[K];
}
declare global {
    interface FunctionConstructor {
        bound: BoundFn;
    }
}
export {};
//# sourceMappingURL=Function.extension.d.ts.map