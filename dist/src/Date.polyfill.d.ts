import { toTemporalInstant } from "@js-temporal/polyfill";
declare global {
    interface DateConstructor {
        toTemporalInstant: typeof toTemporalInstant;
    }
}
//# sourceMappingURL=Date.polyfill.d.ts.map