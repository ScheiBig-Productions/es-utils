/* eslint-disable @typescript-eslint/no-unnecessary-qualifier --
 * They are necessary, compiler/linter is just dumb.
 */

/* eslint-disable no-shadow  --
* Every shadowing here is intentional.
*/

import type { Mutable } from "./types.js"

/**
 * HTTP response codes.
 */
export namespace sc {

	/**
	 * Codes that indicate successful processing of request.
	 */
	export namespace Success {

		/**
		 * Standard response for success.
		 *
		 * Should provide body with requested entity or result of action
		 */
		export const ok = 200

		/**
		 * Response indicating successful creation of resource.
		 *
		 * Should provide body or [Location] header, with id or url to created resource.
		 * Non-standard usage may provide created entity in body and reference uri in header.
		 */
		export const created = 201

		/**
		 * Response indicating acceptance of request for processing in later time.
		 *
		 * Response might contain current status of job (like position in queue),
		 * reference/uri to status monitoring of job, or [Retry-After] header.
		 */
		export const accepted = 202

		/**
		 * Response indicating that request was fulfilled and no content is returned.
		 *
		 * Response does not contain body, but could contain informative headers.
		 *
		 * Usually used when endpoint accepts changes from user, that edits resource
		 * in optimistic way or keeps full state.
		 */
		export const noContent = 204
	}

	export namespace Redirect {

		/**
		 * Permanent redirect indicating that the requested resource has been moved
		 * to a new URL permanently.
		 *
		 * Should include [Location] header with the new URL.
		 * Useful when the resource has a long-term change of address.
		 */
		export const moved = 301

		/**
		 * Temporary redirect indicating that the requested resource is available
		 * at a different URL for now.
		 *
		 * Should include [Location] header with the temporary URL.
		 * Clients should not update links to the resource.
		 */
		export const found = 302

		/**
		 * Indicates that the client should perform a GET request to a different URL.
		 *
		 * The response includes [Location] header with the new URL.
		 * Often used after a POST request, when the resource has been created
		 * and a redirection is required to retrieve it.
		 */
		export const seeOther = 303

		/**
		 * Temporary redirect indicating that the resource is temporarily available
		 * at a different URL.
		 *
		 * Should include [Location] header with the temporary URL.
		 * Unlike {@link Redirect.found}, this code preserves the request method.
		 */
		export const temporary = 307

		/**
		 * Permanent redirect similar to {@link Redirect.moved}, but preserves the
		 * request method.
		 *
		 * Should include [Location] header with the new URL.
		 * Useful for transitioning APIs while ensuring method consistency.
		 */
		export const permanent = 308
	}


	/**
	 * Client error codes, which indicate problem with request.
	 *
	 * Responses should contain explanation to why request was rejected.
	 */

	export namespace Error {

		/**
		 * Response indicating inability to process received request.
		 *
		 * Usually send when required information was not provided in request
		 * (like body, form, query params, url params, cookies, headers).
		 */
		export const badRequest = 400

		/**
		 * Response indicating that request does not contain credentials, while uri
		 * requires them to be present.
		 *
		 * Usually send when user presents when anonymous user tries to access
		 * not-public resource.
		 */
		export const unauthorized = 401

		/**
		 * Response indicating that the request could not be completed due to
		 * insufficient funds.
		 *
		 * This is typically used in payment-related APIs when a user attempts
		 * a transaction without enough balance.
		 */
		export const insufficientFunds = 402

		/**
		 * Response indicating that current **authenticated** user does not have
		 * permissions to access this resource.
		 *
		 * Response might either be due to user not being able to access resources of
		 * other user that was not shared to them, or them having insufficient role.
		 */
		export const forbidden = 403

		/**
		 * Response indicating that requested resource cannot be currently found.
		 *
		 * Response does not have any implications as to whether resource will be
		 * available in the future, or not.
		 */
		export const notFound = 404

		/**
		 * Response indicating conflict in requested resources and state of the server.
		 *
		 * This response might for example apply to request for given amount of resource
		 * (like when client of e-commerce tries to buy some amount of product, that
		 * was already bought by someone else before shopping cart was updated).
		 */
		export const conflict = 409

		/**
		 * Response of similar information to {@link Error.notFound | not found},
		 * but indicating permanent absence of requested resource.
		 *
		 * The response should be used when resource is forever gone and every single
		 * request to resource will also fail in the future - for example when requesting
		 * uuid token.
		 */
		export const gone = 410

		/**
		 * Response indicating that expectations were not met.
		 *
		 * Semantically, this is used when server cannot met expectation requested in
		 * "Expect" headers.
		 *
		 * Here, it is used to represent valid jwt, that is wrong type.
		 */
		export const expectationFailed = 417

		/**
		 * Response indicating that provided content is of valid type/format, but is
		 * semantically invalid.
		 *
		 * This can be for example used for valid jwt, that is wrong type.
		 */
		export const unprocessableContent = 422

		/**
		 * Response indicating that the request was rejected due to exceeding
		 * rate or quantity limits.
		 *
		 * This is typically used when a client surpasses allowed thresholds
		 * for requests or resource usage, often in API rate and/or quota limiting scenarios.
		 */
		export const tooManyRequests = 429
	}

	/**
	 * Server error codes, which indicate error while processing request / creating response.
	 *
	 * Responses can contain explanation to what happened.
	 */
	export namespace Exception {

		/**
		 * Response indicating generic exception while processing request / creating response.
		 */
		export const internalServerError = 500

		/**
		 * Response indicating that request is valid, but functionality that it implies has
		 * not been implemented yet.
		 */
		export const notImplemented = 501

		/**
		 * Response indicating that server is acting as gateway/proxy and received invalid
		 * response from upstream.
		 */
		export const badGateway = 502
	}

	type ExtractValues<T> = T[keyof T]
	type ContentStatusCode = Exclude<ExtractValues<typeof Success>, 204>
		| ExtractValues<typeof Error>
		| ExtractValues<typeof Exception>

	export interface Message {
		readonly msg: string,
		readonly code: ContentStatusCode,
		tuple: () => readonly [msg: string, code: ContentStatusCode],
		isSuccess: () => boolean,
		isError: () => boolean,
		isException: () => boolean,
	}
	interface MessageConstructor {
		new(msg: string, code: ContentStatusCode): Message,
		(msg: string, code: ContentStatusCode): Message,

		/** Expects that Message can be thrown inside of specified Promise. */
		expect: <T>(inside: Promise<T>) => Promise<T | Message>,
	}

	/**
	 * Wrapper over textual message, that is to be passed to Response.
	 */
	export const Message = function Message(
		this: Message | object,
		msg: string,
		code: ContentStatusCode,
	): Message {
		if (!(this instanceof sc.Message)) {
			return new sc.Message(msg, code)
		}

		const self = this as Mutable<Message>

		self.msg = msg
		self.code = code

		this.tuple = function tuple(): readonly [msg: string, code: ContentStatusCode] {
			return [ this.msg, this.code ] as const
		}

		this.isSuccess = function isSuccess(): boolean {
			return Math.floor(this.code / 100) === 2
		}

		this.isError = function isError(): boolean {
			return Math.floor(this.code / 100) === 4
		}

		this.isException = function isException(): boolean {
			return Math.floor(this.code / 100) === 5
		}

		return this
	} as MessageConstructor

	Message.expect = async (inside) => await inside.catch((e: unknown) => {
		if (e instanceof Message) { return e }
		throw e
	})

	type RedirectStatusCode = ExtractValues<typeof Redirect>
	interface Location {
		readonly to: string,
		readonly code: RedirectStatusCode,
		tuple: () => readonly [to: string, code: RedirectStatusCode],
	}
	interface LocationConstructor {
		new(msg: string, code?: RedirectStatusCode): Location,
		(msg: string, code?: RedirectStatusCode): Location,
	}

	/**
	 * Wrapper over redirect happening as Response.
	 */
	export const Location = function Location(
		this: Location | undefined,
		to: string,
		code: RedirectStatusCode = Redirect.found,
	): Location {
		if (!(this instanceof sc.Location)) {
			return new sc.Location(to, code)
		}

		const self = this as Mutable<Location>
		self.to = to
		self.code = code

		this.tuple = function tuple(): readonly [to: string, code: RedirectStatusCode] {
			return [ this.to, this.code ] as const
		}

		return this
	} as LocationConstructor
}
