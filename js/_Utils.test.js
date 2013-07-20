/*global prime, module, test, ok, equal, notEqual, deepEqual, raises */
(function () {
    "use strict";

    module("Utils");

    test("Objects", function () {
        equal(prime.Utils.isEmpty({}), true, "Empty object");
        equal(prime.Utils.isEmpty({foo: 'bar'}), false, "Non-empty object");

        equal(prime.Utils.firstProperty({foo: 'bar', hello: 'world'}), 'foo', "First available key in object");
        equal(typeof prime.Utils.firstProperty({}), 'undefined', "First available key in empty object");
        equal(typeof prime.Utils.firstProperty(1), 'undefined', "First available key in invalid object");
    });
}());

