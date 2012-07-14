/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($Index) {
    module("Index");

    test("Bsearch", function () {
        var index = $Index.create();
        index._totals = [0, 1, 3, 5, 6, 9];

        equal(index._bsearch(4), 2, "Position of 4 (nearest hit)");
        equal(index._bsearch(6), 4, "Position of 6 (exact hit)");
        equal(index._bsearch(0), 0, "Position of 1 (low extreme)");
        equal(index._bsearch(9), 5, "Position of 9 (high extreme)");
    });

    test("Addition", function () {
        var index = $Index.create(),
            tmp;

        equal(index.lastTotal(), 0, "Last total is initially zero");

        tmp = index.add(5);
        equal(tmp, 1, "Index position");
        deepEqual(index._weights, [0, 5], "Weights after adding 5");
        deepEqual(index._totals, [0, 5], "Totals after adding 5");
        equal(index.lastTotal(), 5, "Last total after adding 5");

        tmp = index.add(1);
        equal(tmp, 2, "Index position");
        deepEqual(index._weights, [0, 5, 1], "Weights after adding 1");
        deepEqual(index._totals, [0, 5, 6], "Totals after adding 1");
        equal(index.lastTotal(), 6, "Last total after adding 1");
    });

    test("Removal", function () {
        var index = $Index.create(),
            lookup = {};

        lookup.foo = index.add(5);
        lookup.bar = index.add(1);
        lookup.hello = index.add(2);

        deepEqual(index._empties, {}, "Registry of empties before removal");

        index.remove(lookup.foo);

        deepEqual(index._weights, [0, 5, 1, 2], "Weights index unchanged after removal");
        deepEqual(index._totals, [0, 5, 6, 8], "Totals index unchanged after removal");
        deepEqual(
            index._empties,
            {
                5: {1: true}
            },
            "Registry of empties after removal"
        );
        equal(index.emptyCount, 1, "Empty count after removal");

        index.remove(lookup.hello);
        deepEqual(
            index._empties,
            {
                5: {1: true},
                2: {3: true}
            },
            "Registry of empties after removal"
        );
        equal(index.emptyCount, 2, "Empty count after removal");
    });

    test("Querying", function () {
        var index = $Index.create();
        index.add(5);
        index.add(1);
        index.add(2);

        equal(index.get(4), 0, "Position of 4 (inexact)");
        equal(index.get(6), 2, "Position of 6 (exact)");
        equal(index.get(8), 3, "Position of 8 (upper extreme, exact)");
    });
}(
    prime.PeerIndex,
    prime.Peer
));
