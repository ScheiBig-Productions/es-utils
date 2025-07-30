Function.bound ??= function bound(instance, methodNameOrSelector) {
    if (typeof methodNameOrSelector === "function") {
        var method = methodNameOrSelector(instance);
    }
    else {
        var method = instance[methodNameOrSelector];
    }
    if (typeof method !== "function") {
        throw TypeError("Selected property is not a function");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- verified to be type-safe
    return method.bind(instance);
};
export {};
//# sourceMappingURL=Function.extension.js.map