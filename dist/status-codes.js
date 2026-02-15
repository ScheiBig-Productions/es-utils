/* eslint-disable @typescript-eslint/no-unnecessary-qualifier --
 * They are necessary, compiler/linter is just dumb.
 */
/**
 * HTTP response codes.
 */
export var SC;
(function (SC) {
    /**
     * Codes that indicate successful processing of request.
     */
    let Success;
    (function (Success) {
        /**
         * Standard response for success.
         *
         * Should provide body with requested entity or result of action
         */
        Success.ok = 200;
        /**
         * Response indicating successful creation of resource.
         *
         * Should provide body or [Location] header, with id or url to created resource.
         * Non-standard usage may provide created entity in body and reference uri in header.
         */
        Success.created = 201;
        /**
         * Response indicating acceptance of request for processing in later time.
         *
         * Response might contain current status of job (like position in queue),
         * reference/uri to status monitoring of job, or [Retry-After] header.
         */
        Success.accepted = 202;
        /**
         * Response indicating that request was fulfilled and no content is returned.
         *
         * Response does not contain body, but could contain informative headers.
         *
         * Usually used when endpoint accepts changes from user, that edits resource
         * in optimistic way or keeps full state.
         */
        Success.noContent = 204;
        /**
         * Response indicating that the client should reset its view or form.
         *
         * Often used after a successful action where the client’s local state
         * (like form fields or cached UI state) should be cleared.
         * No body is returned.
         */
        Success.resetContent = 205;
        /**
         * Response indicating that only part of the requested resource is returned.
         *
         * Typically used with Range requests (e.g., streaming, chunked downloads).
         * Body contains the partial content.
         */
        Success.partialContent = 206;
    })(Success = SC.Success || (SC.Success = {}));
    /**
     * Codes used to redirect request to different address.
     */
    let Redirect;
    (function (Redirect) {
        /**
         * Permanent redirect indicating that the requested resource has been moved
         * to a new URL permanently.
         *
         * Should include [Location] header with the new URL.
         * Useful when the resource has a long-term change of address.
         */
        Redirect.moved = 301;
        /**
         * Temporary redirect indicating that the requested resource is available
         * at a different URL for now.
         *
         * Should include [Location] header with the temporary URL.
         * Clients should not update links to the resource.
         */
        Redirect.found = 302;
        /**
         * Indicates that the client should perform a GET request to a different URL.
         *
         * The response includes [Location] header with the new URL.
         * Often used after a POST request, when the resource has been created
         * and a redirection is required to retrieve it.
         */
        Redirect.seeOther = 303;
        /**
         * Temporary redirect indicating that the resource is temporarily available
         * at a different URL.
         *
         * Should include [Location] header with the temporary URL.
         * Unlike {@link Redirect.found}, this code preserves the request method.
         */
        Redirect.temporary = 307;
        /**
         * Permanent redirect similar to {@link Redirect.moved}, but preserves the
         * request method.
         *
         * Should include [Location] header with the new URL.
         * Useful for transitioning APIs while ensuring method consistency.
         */
        Redirect.permanent = 308;
    })(Redirect = SC.Redirect || (SC.Redirect = {}));
    /**
     * Client error codes, which indicate problem with request.
     *
     * Responses should contain explanation to why request was rejected.
     */
    let Error;
    (function (Error) {
        /**
         * Response indicating inability to process received request.
         *
         * Usually send when required information was not provided in request
         * (like body, form, query params, url params, cookies, headers).
         */
        Error.badRequest = 400;
        /**
         * Response indicating that request does not contain credentials, while uri
         * requires them to be present.
         *
         * Usually send when user presents when anonymous user tries to access
         * not-public resource.
         */
        Error.unauthorized = 401;
        /**
         * Response indicating that the request could not be completed due to
         * insufficient funds.
         *
         * This is typically used in payment-related APIs when a user attempts
         * a transaction without enough balance.
         */
        Error.insufficientFunds = 402;
        /**
         * Response indicating that current **authenticated** user does not have
         * permissions to access this resource.
         *
         * Response might either be due to user not being able to access resources of
         * other user that was not shared to them, or them having insufficient role.
         */
        Error.forbidden = 403;
        /**
         * Response indicating that requested resource cannot be currently found.
         *
         * Response does not have any implications as to whether resource will be
         * available in the future, or not.
         */
        Error.notFound = 404;
        /**
         * Response indicating that the HTTP method used is not allowed for this endpoint.
         *
         * Should include an [Allow] header listing permitted methods.
         * Often used when client uses GET instead of POST, etc.
         */
        Error.methodNotAllowed = 405;
        /**
         * Response indicating that the server timed out waiting for the request.
         *
         * Commonly used when the client is too slow to send the body or headers.
         */
        Error.requestTimeout = 408;
        /**
         * Response indicating conflict in requested resources and state of the server.
         *
         * This response might for example apply to request for given amount of resource
         * (like when client of e-commerce tries to buy some amount of product, that
         * was already bought by someone else before shopping cart was updated).
         */
        Error.conflict = 409;
        /**
         * Response of similar information to {@link Error.notFound | not found},
         * but indicating permanent absence of requested resource.
         *
         * The response should be used when resource is forever gone and every single
         * request to resource will also fail in the future - for example when requesting
         * uuid token.
         */
        Error.gone = 410;
        /**
         * Response indicating that the request requires a Content-Length header.
         *
         * Often used when the server cannot process streaming or chunked requests
         * for this particular endpoint.
         */
        Error.lengthRequired = 411;
        /**
         * Response indicating that one or more preconditions were not met.
         *
         * Typically used with conditional headers (If-Match, If-Unmodified-Since),
         * or in APIs to enforce optimistic locking.
         */
        Error.preconditionFailed = 412;
        /**
         * Response indicating that the request payload is too large.
         *
         * Often used when file uploads exceed limits or when the server imposes
         * strict size constraints on request bodies.
         */
        Error.payloadTooLarge = 413;
        /**
         * Response indicating that the media type of the request is unsupported.
         *
         * Used when the server cannot process the provided Content-Type.
         * Common for JSON-only or multipart-only endpoints.
         */
        Error.unsupportedMediaType = 415;
        /**
         * Response indicating that the requested range cannot be satisfied.
         *
         * Often used when a Range header specifies bytes outside the resource size.
         */
        Error.rangeNotSatisfiable = 416;
        /**
         * Response indicating that expectations were not met.
         *
         * Semantically, this is used when server cannot met expectation requested in
         * "Expect" headers.
         *
         * Here, it is used to represent valid jwt, that is wrong type.
         */
        Error.expectationFailed = 417;
        /**
         * Response indicating that the request was misdirected.
         *
         * Typically used in multi‑tenant or proxy setups when the server
         * cannot serve the resource for the requested authority.
         */
        Error.misdirectedRequest = 421;
        /**
         * Response indicating that provided content is of valid type/format, but is
         * semantically invalid.
         *
         * This can be for example used for valid jwt, that is wrong type.
         */
        Error.unprocessableContent = 422;
        /**
         * Response indicating that the server is unwilling to process the request
         * because it might be replayed.
         *
         * Often used in APIs requiring idempotency keys for safety.
         */
        Error.tooEarly = 425;
        /**
         * Response indicating that the request was rejected due to exceeding
         * rate or quantity limits.
         *
         * This is typically used when a client surpasses allowed thresholds
         * for requests or resource usage, often in API rate and/or quota limiting scenarios.
         */
        Error.tooManyRequests = 429;
    })(Error = SC.Error || (SC.Error = {}));
    /**
     * Server error codes, which indicate error while processing request / creating response.
     *
     * Responses can contain explanation to what happened.
     */
    let Exception;
    (function (Exception) {
        /**
         * Response indicating generic exception while processing request / creating response.
         */
        Exception.internalServerError = 500;
        /**
         * Response indicating that request is valid, but functionality that it implies has
         * not been implemented yet.
         */
        Exception.notImplemented = 501;
        /**
         * Response indicating that server is acting as gateway/proxy and received invalid
         * response from upstream.
         */
        Exception.badGateway = 502;
        /**
         * Response indicating that the server is temporarily unable to handle the request.
         *
         * Often used for maintenance windows, overload protection, or dependency outages.
         * May include a [Retry-After] header.
         */
        Exception.serviceUnavailable = 503;
    })(Exception = SC.Exception || (SC.Exception = {}));
    /**
     * Wrapper over textual message, that is to be passed to Response.
     */
    SC.Message = function Message(msg, code) {
        const self = (this instanceof SC.Message
            ? this
            : Object.create(SC.Message.prototype));
        self.msg = msg;
        self.code = code;
        self.tuple = function tuple() {
            return [self.msg, self.code];
        };
        self.isSuccess = function isSuccess() {
            return Math.floor(self.code / 100) === 2;
        };
        self.isError = function isError() {
            return Math.floor(self.code / 100) === 4;
        };
        self.isException = function isException() {
            return Math.floor(self.code / 100) === 5;
        };
        Object.freeze(self);
        return self;
    };
    SC.Message.handler = function handler(err) {
        if (err instanceof SC.Message) {
            return err;
        }
        throw err;
    };
    /**
     * Wrapper over redirect happening as Response.
     */
    SC.Location = function Location(to, code = Redirect.found) {
        const self = (this instanceof SC.Location
            ? this
            : Object.create(SC.Location.prototype));
        self.to = to;
        self.code = code;
        self.tuple = function tuple() {
            return [self.to, self.code];
        };
        Object.freeze(self);
        return self;
    };
})(SC || (SC = {}));
//# sourceMappingURL=status-codes.js.map