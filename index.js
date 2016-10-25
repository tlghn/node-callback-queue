module.exports = function (done) {

    argsIndex = 1;
    var extraArgs = [];

    if (Array.isArray(done)) {
        extraArgs = done;
        done = arguments[1];
        argsIndex = 2;
    }

    if (extraArgs.length) {
        var superDone = done;
        done = function (err) {
            var args = Array.prototype.slice.call(arguments, 1);
            Array.prototype.unshift.apply(args, extraArgs);
            args.unshift(err);
            superDone.apply(null, args);
        };
    }

    var args = Array.prototype.slice.call(arguments, argsIndex);

    function next(err, done, args) {
        if (err) {
            return done(err);
        }

        var result = Array.prototype.slice.call(arguments, 3);

        if (!args.length) {
            result.unshift(null);
            return done.apply(null, result);
        }

        var current = args.shift();

        result.push(function (err) {
            var cbArgs = Array.prototype.slice.call(arguments, 1);
            cbArgs.unshift(err, done, args);
            next.apply(null, cbArgs);
        });


        current.apply(null, result);
    }

    process.nextTick((function (next, done, args) {
        return function () {
            next(null, done, args);
        };
    })(next, done, args));
};