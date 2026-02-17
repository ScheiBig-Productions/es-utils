import { Object_tag } from "./common/object.tag.js";
import { ContractViolationError } from "./contract-violation-error.js";
export var Result;
(function (Result) {
    class ResultBase {
        mapOk(fn) {
            if (this instanceof Result.Ok) {
                return Result.Ok(fn(this.value));
            }
            if (this instanceof Result.Err) {
                return this;
            }
            throw ContractViolationError(`Unknown calee of type [${typeof this} ${this.constructor.name}]`);
        }
        mapErr(fn) {
            if (this instanceof Result.Ok) {
                return this;
            }
            if (this instanceof Result.Err) {
                return Result.Err(fn(this.error));
            }
            throw ContractViolationError(`Unknown calee of type [${typeof this} ${this.constructor.name}]`);
        }
        map(okFn, errFn) {
            if (this instanceof Result.Ok) {
                return Result.Ok(okFn(this.value));
            }
            if (this instanceof Result.Err) {
                return Result.Err(errFn(this.error));
            }
            throw ContractViolationError(`Unknown calee of type [${typeof this} ${this.constructor.name}]`);
        }
    }
    Result.Ok = function Ok(value) {
        const self = this instanceof Result.Ok
            ? this
            : Object.create(Result.Ok.prototype);
        self.ok = true;
        self.value = value;
        return self;
    };
    Result.Ok.prototype = Object.create(ResultBase.prototype);
    Result.Ok.prototype.constructor = Result.Ok;
    Object_tag(Result.Ok);
    Result.Err = function Err(error) {
        const self = this instanceof Result.Err
            ? this
            : Object.create(Result.Err.prototype);
        self.ok = false;
        self.error = error;
        return self;
    };
    Result.Err.prototype = Object.create(ResultBase.prototype);
    Result.Err.prototype.constructor = Result.Err;
    Object_tag(Result.Err);
    function wrap(fn) {
        try {
            const value = fn();
            if (value instanceof Promise) {
                return value
                    .then((v) => Result.Ok(v))
                    .catch((e) => Result.Err(e));
            }
            return Result.Ok(value);
        }
        catch (err) {
            return Result.Err(err);
        }
    }
    Result.wrap = wrap;
})(Result || (Result = {}));
//# sourceMappingURL=result.js.map