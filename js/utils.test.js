/*global prime, module, test, ok, equal, notEqual, deepEqual, raises */
(function (utils) {
    module("Utils");

    test("Objects", function () {
        equal(utils.isEmpty({}), true, "Empty object");
        equal(utils.isEmpty({foo: 'bar'}), false, "Non-empty object");

        equal(utils.firstProperty({foo: 'bar', hello: 'world'}), 'foo', "First available key in object");
        equal(typeof utils.firstProperty({}), 'undefined', "First available key in empty object");
        equal(typeof utils.firstProperty(1), 'undefined', "First available key in invalid object");
    });
}(
    prime.utils
));

