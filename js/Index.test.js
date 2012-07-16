/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function (Index) {
    module("Index");

    test("Bsearch", function () {
        var totals = [0, 1, 3, 5, 6, 9];

        equal(Index._bsearch.call(totals, 4), 2, "Position of 4 (nearest hit)");
        equal(Index._bsearch.call(totals, 6), 4, "Position of 6 (exact hit)");
        equal(Index._bsearch.call(totals, 0), 0, "Position of 1 (low extreme)");
        equal(Index._bsearch.call(totals, 9), 5, "Position of 9 (high extreme)");
        equal(Index._bsearch.call(totals, -4), 0, "Position of -4 (out of bounds -)");
        equal(Index._bsearch.call(totals, 100), 5, "Position of 100 (out of bounds +)");
    });

    test("Addition", function () {
        var index = Index.create();

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
        var index = Index.create()
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

    test("Re-addition", function () {
        var index = Index.create()
            .add('foo', 5) // 0
            .add('bar', 1) // 1
            .add('hello', 2) // 2
            .add('world', 1)
            .remove('bar')
            .remove('world');

        deepEqual(index._loads, ['foo', undefined, 'hello', undefined], "Loads before re-addition");
        deepEqual(index._lookup, {'foo': 0, 'hello': 2}, "Lookup before re-addition");
        deepEqual(index._slots, {1: {1: true, 3: true}}, "Empty slots before re-addition");
        equal(index.slotCount, 2, "Slot count before re-addition");

        // re-adding one entry
        index.add('bam', 1);
        deepEqual(index._loads, ['foo', 'bam', 'hello', undefined], "Loads after re-addition");
        deepEqual(index._lookup, {'foo': 0, 'hello': 2, 'bam': 1}, "Lookup after re-addition");
        deepEqual(index._slots, {1: {3: true}}, "Empty slots after re-addition");
        equal(index.slotCount, 1, "Slot count after re-addition");

        // filling all remaining slots
        index.add('whoop', 1);
        deepEqual(index._loads, ['foo', 'bam', 'hello', 'whoop'], "Loads after re-addition");
        deepEqual(index._lookup, {'foo': 0, 'hello': 2, 'bam': 1, 'whoop': 3}, "Lookup after re-addition");
        deepEqual(index._slots, {}, "Empty slots after re-addition");
        equal(index.slotCount, 0, "Slot count after re-addition");
    });

    test("Rebuilding", function () {
        var index = Index.create()
            .add('foo', 5) // 0
            .add('bar', 1) // 1
            .add('hello', 2) // 2
            .remove('bar');

        index.rebuild();

        deepEqual(index._loads, ['foo', 'hello'], "Loads after rebuild");
        deepEqual(index._lookup, {foo: 0, hello: 1}, "Lookup after rebuild");
        deepEqual(index._weights, [5, 2], "Weights after rebuild");
        deepEqual(index._totals, [0, 5], "Totals after rebuild");
        equal(index.nextTotal, 7, "Next total after rebuild");
        deepEqual(index._slots, {}, "Slots emptied after rebuild");
        equal(index.slotCount, 0, "Slot count after rebuild");
    });

    test("Querying", function () {
        var index = Index.create()
            .add('foo', 5)
            .add('bar', 1)
            .add('hello', 2);

        equal(index.get(4), 'foo', "Load at 4 (inexact)");
        equal(index.get(6), 'hello', "Load at 6 (exact)");
        equal(index.get(8), 'hello', "Load at 8 (upper extreme, exact)");
    });

    test("Random query", function () {
        var index = Index.create()
            .add('foo', 5)
            .add('bar', 1)
            .add('hello', 2)
            .remove('bar');

        ok(index.random() in {'foo': true, 'hello': true}, "Random query yields one of remaining entries");
    });
}(
    prime.Index
));
