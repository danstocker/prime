/*global module, test, ok, equal, notEqual, deepEqual, raises */
(function ($utils) {
    module("Utils");

    test("Objects", function () {
        equal($utils.isEmpty({}), true, "Empty object");
        equal($utils.isEmpty({foo: 'bar'}), false, "Non-empty object");

        deepEqual(
            $utils.keys({foo: "bar", hey: "ho"}),
            ['foo', 'hey'],
            "Obtaining keys of object"
        );
    });

    test("Modifications", function () {
        var tmp = {};
        $utils.set(tmp, 'hello', 'dolly');
        deepEqual(
            tmp,
            {hello: 'dolly'},
            "Setting string value on non-existing path"
        );

        $utils.set(tmp, 'hello', 'my', {dear: 'dolly'});
        deepEqual(
            tmp,
            {
                hello: {
                    my: {
                        dear: 'dolly'
                    }
                }
            },
            "Setting object value on non-existing path"
        );

        $utils.set(tmp, 'hello', 'little', 'pony');
        deepEqual(
            tmp,
            {
                hello: {
                    my: {
                        dear: 'dolly'
                    },
                    little: 'pony'
                }
            },
            "Setting additional value on partially existing path"
        );

        equal($utils.unset(tmp, 'hello', 'boo'), false, "Attempting to unset invalid path");

        $utils.unset(tmp, 'hello', 'my', 'dear');
        deepEqual(
            tmp,
            {
                hello: {
                    little: 'pony'
                }
            },
            "Object removed and cleaned up"
        );

        $utils.unset(tmp, 'hello', 'little');
        deepEqual(tmp, {}, "Object completely emptied");
    });

    test("Copying", function () {
        var src = {hello: 'dolly'},
            dst = $utils.shallow(src);
        notEqual(src, dst, "Shallow copy is a different object");
        deepEqual(src, dst, "Shallow copy has identical contents");
        equal(src['hello'], dst['hello'], "Shallow copy property references match");
    });
}(
    prime.utils
));

