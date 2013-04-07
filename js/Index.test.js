/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function () {
    module("Index");

    test("Bsearch", function () {
        var buffer = [0, 1, 3, 5, 6, 9];

        equal(prime.Index._bSearch.call(buffer, 4), 2, "Position of 4 (nearest hit)");
        equal(prime.Index._bSearch.call(buffer, 6), 4, "Position of 6 (exact hit)");
        equal(prime.Index._bSearch.call(buffer, 0), 0, "Position of 1 (low extreme)");
        equal(prime.Index._bSearch.call(buffer, 9), 5, "Position of 9 (high extreme)");
        equal(prime.Index._bSearch.call(buffer, -4), 0, "Position of -4 (out of bounds -)");
        equal(prime.Index._bSearch.call(buffer, 100), 5, "Position of 100 (out of bounds +)");

        // extreme case, only 1 element
        buffer = [4];
        equal(prime.Index._bSearch.call(buffer, 4), 0, "Position of 4 in 1-elem buffer (exact hit)");
        equal(prime.Index._bSearch.call(buffer, -4), 0, "Position of -4 in 1-elem buffer (out of bounds -)");
        equal(prime.Index._bSearch.call(buffer, 100), 0, "Position of 100 in 1-elem buffer (out of bounds +)");

        // extreme case, zero elements
        buffer = [];
        equal(prime.Index._bSearch.call(buffer, 4), 0, "Position of 4 in empty");
    });

    test("Addition", function () {
        var index = prime.Index.create();

        equal(index.nextTotal, 0, "Next total is initially zero");
        equal(index.getSlotCount(), 0, "Slot count is initially zero");

        index.addEntry('foo', 5);
        deepEqual(index._weights, [5], "Weights after addition");
        deepEqual(index._totals, [0], "Totals after addition");
        deepEqual(index._loads, ['foo'], "Loads after addition");
        deepEqual(index._lookup, {foo: 0}, "Lookup after addition");
        equal(index.nextTotal, 5, "Next total after addition");
    });

    test("Removal", function () {
        var index = prime.Index.create()
            .addEntry('foo', 5)
            .addEntry('bar', 1)
            .addEntry('hello', 2);

        deepEqual(index._slots, {}, "Empty slots before removal");
        equal(index.getSlotCount(), 0, "Empty count before removal");

        index.removeEntry('foo');

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
        equal(index.getSlotCount(), 1, "Empty count after removal");
    });

    test("Re-addition", function () {
        var index = prime.Index.create()
            .addEntry('foo', 5) // 0
            .addEntry('bar', 1) // 1
            .addEntry('hello', 2) // 2
            .addEntry('world', 1)
            .removeEntry('bar')
            .removeEntry('world');

        deepEqual(index._loads, ['foo', undefined, 'hello', undefined], "Loads before re-addition");
        deepEqual(index._lookup, {'foo': 0, 'hello': 2}, "Lookup before re-addition");
        deepEqual(index._slots, {1: {1: true, 3: true}}, "Empty slots before re-addition");
        equal(index.getSlotCount(), 2, "Slot count before re-addition");

        // re-adding one entry
        index.addEntry('bam', 1);
        deepEqual(index._loads, ['foo', 'bam', 'hello', undefined], "Loads after re-addition");
        deepEqual(index._lookup, {'foo': 0, 'hello': 2, 'bam': 1}, "Lookup after re-addition");
        deepEqual(index._slots, {1: {3: true}}, "Empty slots after re-addition");
        equal(index.getSlotCount(), 1, "Slot count after re-addition");

        // filling all remaining slots
        index.addEntry('whoop', 1);
        deepEqual(index._loads, ['foo', 'bam', 'hello', 'whoop'], "Loads after re-addition");
        deepEqual(index._lookup, {'foo': 0, 'hello': 2, 'bam': 1, 'whoop': 3}, "Lookup after re-addition");
        deepEqual(index._slots, {}, "Empty slots after re-addition");
        equal(index.getSlotCount(), 0, "Slot count after re-addition");
    });

    test("Rebuilding", function () {
        var index = prime.Index.create()
            .addEntry('foo', 5) // 0
            .addEntry('bar', 1) // 1
            .addEntry('hello', 2) // 2
            .removeEntry('bar');

        index.rebuild();

        deepEqual(index._loads, ['foo', 'hello'], "Loads after rebuild");
        deepEqual(index._lookup, {foo: 0, hello: 1}, "Lookup after rebuild");
        deepEqual(index._weights, [5, 2], "Weights after rebuild");
        deepEqual(index._totals, [0, 5], "Totals after rebuild");
        equal(index.nextTotal, 7, "Next total after rebuild");
        deepEqual(index._slots, {}, "Slots emptied after rebuild");
        equal(index.getSlotCount(), 0, "Slot count after rebuild");
    });

    test("Querying", function () {
        var index = prime.Index.create()
            .addEntry('foo', 5)
            .addEntry('bar', 1)
            .addEntry('hello', 2);

        equal(index.getEntryByTotal(4), 'foo', "Load at 4 (inexact)");
        equal(index.getEntryByTotal(6), 'hello', "Load at 6 (exact)");
        equal(index.getEntryByTotal(8), 'hello', "Load at 8 (upper extreme, exact)");
    });

    test("Random query", function () {
        var index = prime.Index.create()
            .addEntry('foo', 5)
            .addEntry('bar', 1)
            .addEntry('hello', 2)
            .removeEntry('bar');

        ok(index.getRandomEntry() in {'foo': true, 'hello': true}, "Random query yields one of remaining entries");
    });
}());
