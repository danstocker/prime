/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($Index) {
    module("Index");

    test("Bsearch", function () {
        var totals = [0, 1, 3, 5, 6, 9];

        equal($Index._bsearch.call(totals, 4), 2, "Position of 4 (nearest hit)");
        equal($Index._bsearch.call(totals, 6), 4, "Position of 6 (exact hit)");
        equal($Index._bsearch.call(totals, 0), 0, "Position of 1 (low extreme)");
        equal($Index._bsearch.call(totals, 9), 5, "Position of 9 (high extreme)");
        equal($Index._bsearch.call(totals, -4), 0, "Position of -4 (out of bounds -)");
        equal($Index._bsearch.call(totals, 100), 5, "Position of 100 (out of bounds +)");
    });

    test("Addition", function () {
        var index = $Index.create();

        equal(index.nextTotal, 0, "Next total is initially zero");
        equal(index.slotCount, 0, "Slot count is initially zero");

        index.add('foo', 5);
        deepEqual(index._weights, [5], "Weights after addition");
        deepEqual(index._totals, [0], "Totals after addition");
        deepEqual(index._loads, ['foo'], "Loads after addition");
        deepEqual(index._lookup, {foo: 0}, "Lookup after addition");
        equal(index.nextTotal, 5, "Next total after addition");
    });

    test("Removal", function () {
        var index = $Index.create();

        index
            .add('foo', 5)
            .add('bar', 1)
            .add('hello', 2);

        deepEqual(index._slots, {}, "Empty slots before removal");
        equal(index.slotCount, 0, "Empty count before removal");

        index.remove('foo');

        deepEqual(index._weights, [5, 1, 2], "Weights index unchanged after removal");
        deepEqual(index._totals, [0, 5, 6], "Totals index unchanged after removal");
        deepEqual(index._loads, [undefined, 'bar', 'hello'], "Loads after removal");
        deepEqual(index._lookup, {bar: 1, hello: 2}, "Lookup after removal");
        deepEqual(
            index._slots,
            {
                5: {0: true}
            },
            "Registry of empties after removal"
        );
        equal(index.slotCount, 1, "Empty count after removal");
    });

    test("Querying", function () {
        var index = $Index.create();
        index.add('foo', 5);
        index.add('bar', 1);
        index.add('hello', 2);

        equal(index.get(4), 'foo', "Load at 4 (inexact)");
        equal(index.get(6), 'hello', "Load at 6 (exact)");
        equal(index.get(8), 'hello', "Load at 8 (upper extreme, exact)");
    });
}(
    prime.Index,
    prime.Peer
));
