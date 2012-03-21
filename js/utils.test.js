/*global module, test, ok, equal, notEqual, deepEqual, raises */
(function ($utils) {
    module("Utils");

    test("Objects", function () {
        var tmp;

        deepEqual(
            $utils.keys({foo: "bar", hey: "ho"}),
            ['foo', 'hey'],
            "Obtaining keys of object"
        );

        tmp = {};
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

