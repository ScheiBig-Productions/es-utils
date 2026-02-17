export type Result<TValue, TError = unknown> = Result.Ok<TValue> | Result.Err<TError>;
export declare namespace Result {
    type Ok<TValue> = {
        readonly ok: true;
        readonly value: TValue;
    };
    interface OkConstructor {
        new <TValue>(value: TValue): Ok<TValue>;
        <TValue>(value: TValue): Result<TValue, never>;
        prototype: Ok<unknown>;
    }
    type Err<TError> = {
        readonly ok: false;
        readonly error: TError;
    };
    interface ErrConstructor {
        new <TError>(error: TError): Err<TError>;
        <TError>(error: TError): Result<never, TError>;
        prototype: Err<unknown>;
    }
    const Ok: Result.OkConstructor;
    const Err: Result.ErrConstructor;
    function wrap<TValue>(fn: () => TValue): Result<TValue>;
    function wrap<TValue>(fn: () => Promise<TValue>): Promise<Result<TValue>>;
}
//# sourceMappingURL=result.d.ts.map