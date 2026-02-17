/* eslint-disable no-useless-assignment --
 * Members are literally exported
 */
/* eslint-disable no-shadow --
 * Very weak shadowing assumptions
 */
/* eslint-disable @typescript-eslint/no-unnecessary-qualifier --
 * Necessary due to inference rules around namespaces
 */
import type { Awaitable, Mutable } from "./types.js"

import { Object_tag } from "./common/object.tag.js"
import { ContractViolationError } from "./contract-violation-error.js"

export type Result<TValue, TError = unknown> =
	| Result.Ok<TValue>
	| Result.Err<TError>

export namespace Result {

	class ResultBase<TValue, TError = unknown> {

		mapOk<TNewValue>(fn: (value: TValue) => TNewValue): Result<TNewValue, TError> {
			if (this instanceof Result.Ok) {
				return Result.Ok(fn(this.value as TValue))
			}
			if (this instanceof Result.Err) {
				return this as Result<TNewValue, TError>
			}
			throw ContractViolationError(
				`Unknown calee of type [${typeof this} ${this.constructor.name}]`,
			)
		}

		mapErr<TNewError>(fn: (error: TError) => TNewError): Result<TValue, TNewError> {
			if (this instanceof Result.Ok) {
				return this as Result<TValue, TNewError>
			}
			if (this instanceof Result.Err) {
				return Result.Err(fn(this.error as TError))
			}
			throw ContractViolationError(
				`Unknown calee of type [${typeof this} ${this.constructor.name}]`,
			)
		}

		map<TNewValue, TNewError>(
			okFn: (value: TValue) => TNewValue,
			errFn: (error: TError) => TNewError,
		): Result<TNewValue, TNewError> {
			if (this instanceof Result.Ok) {
				return Result.Ok(okFn(this.value as TValue))
			}
			if (this instanceof Result.Err) {
				return Result.Err(errFn(this.error as TError))
			}
			throw ContractViolationError(
				`Unknown calee of type [${typeof this} ${this.constructor.name}]`,
			)
		}
	}

	export type Ok<TValue> = {
		readonly ok: true,
		readonly value: TValue,
	}

	export interface OkConstructor {
		new<TValue>(value: TValue): Ok<TValue>,
		<TValue>(value: TValue): Result<TValue, never>,

		prototype: Ok<unknown>,
	}

	export type Err<TError> = {
		readonly ok: false,
		readonly error: TError,
	}

	export interface ErrConstructor {
		new<TError>(error: TError): Err<TError>,
		<TError>(error: TError): Result<never, TError>,

		prototype: Err<unknown>,
	}


	export const Ok = function Ok<TValue>(
		this: Result.Ok<TValue> | undefined,
		value: TValue,
	) {
		const self: Mutable<Result.Ok<TValue>> = this instanceof Result.Ok
			? this
			: Object.create(Result.Ok.prototype) as Result.Ok<TValue>

		self.ok = true
		self.value = value

		return self as Result<TValue, never>
	} as Result.OkConstructor

	Result.Ok.prototype = Object.create(ResultBase.prototype) as Result.Ok<unknown>
	Result.Ok.prototype.constructor = Result.Ok
	Object_tag(Result.Ok)

	export const Err = function Err<TError>(
		this: Result.Err<TError> | undefined,
		error: TError,
	) {
		const self: Mutable<Result.Err<TError>> = this instanceof Result.Err
			? this
			: Object.create(Result.Err.prototype) as Result.Err<TError>

		self.ok = false
		self.error = error

		return self as Result<never, TError>
	} as Result.ErrConstructor

	Result.Err.prototype = Object.create(ResultBase.prototype) as Result.Err<unknown>
	Result.Err.prototype.constructor = Result.Err
	Object_tag(Result.Err)

	export function wrap<TValue>(fn: () => TValue): Result<TValue>
	export function wrap<TValue>(fn: () => Promise<TValue>): Promise<Result<TValue>>
	export function wrap<TValue>(fn: () => Awaitable<TValue>): Awaitable<Result<TValue>> {
		try {
			const value = fn()

			if (value instanceof Promise) {
				return value
					.then((v) => Result.Ok(v))
					.catch((e: unknown) => Result.Err(e))
			}
accidental
			return Result.Ok(value)
		} catch(err) {
			return Result.Err(err)
		}
	}
}
