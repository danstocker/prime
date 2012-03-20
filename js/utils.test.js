/*global module, test, ok, equal, notEqual, deepEqual, raises */
(function () {
    module("Utils");

    test("Objects", function () {
        deepEqual(
            prime.utils.keys({foo: "bar", hey: "ho"}),
            ['foo', 'hey'],
            "Obtaining keys of object"
        );
    });
}());

