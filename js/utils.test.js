/*global prime, module, test, ok, equal, notEqual, deepEqual, raises */
(function () {
    "use strict";

    module("Utils");

    test("Objects", function () {
        equal(prime.utils.isEmpty({}), true, "Empty object");
        equal(prime.utils.isEmpty({foo: 'bar'}), false, "Non-empty object");

        equal(prime.utils.firstProperty({foo: 'bar', hello: 'world'}), 'foo', "First available key in object");
        equal(typeof prime.utils.firstProperty({}), 'undefined', "First available key in empty object");
        equal(typeof prime.utils.firstProperty(1), 'undefined', "First available key in invalid object");
    });
}());

