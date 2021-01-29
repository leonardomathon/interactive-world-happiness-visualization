// Cache function
export function memoize(fn) {
    const cache = {};
    return function () {
        const args = JSON.stringify(arguments);
        if (cache[args] === undefined) {
            const val = fn.apply(null, arguments);
            cache[args] = val;
            return val;
        } else {
            return cache[args];
        }
    };
}
