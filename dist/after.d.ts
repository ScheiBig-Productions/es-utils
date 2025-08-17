import type { Temporal } from "@js-temporal/polyfill";
interface AfterFn {
    /**
     * Returns new Promise, that fulfills after given delay.
     */
    (delay: number | Temporal.Duration): Promise<void>;
    /**
     * Returns new Promise, that fulfills after given delay to specified value.
     */
    <T>(delay: number | Temporal.Duration, value: T): Promise<T>;
}
/**
 * Returns new Promise, that fulfills after given delay to specified value.
 */
export declare const after: AfterFn;
export {};
//# sourceMappingURL=after.d.ts.map