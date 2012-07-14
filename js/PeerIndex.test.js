/*global prime, mocks, module, test, ok, equal, notEqual, deepEqual, raises */
(function ($PeerIndex) {
    module("PeerIndex");

    test("Bsearch", function () {
        var peerIndex = $PeerIndex.create();
        peerIndex._totals = [1, 3, 5, 6, 9];

        equal(peerIndex._bsearch(4), 1, "Position of 4 (nearest hit)");
        equal(peerIndex._bsearch(6), 3, "Position of 6 (exact hit)");
        equal(peerIndex._bsearch(1), 0, "Position of 1 (low extreme)");
        equal(peerIndex._bsearch(9), 4, "Position of 9 (high extreme)");
    });

    test("Addition", function () {
        var peerIndex = $PeerIndex.create(),
            tmp;

        tmp = peerIndex.add(5);
        equal(tmp, 0, "Index position");
        deepEqual(peerIndex._weights, [5], "Weights after adding 5");
        deepEqual(peerIndex._totals, [5], "Totals after adding 5");

        tmp = peerIndex.add(1);
        equal(tmp, 1, "Index position");
        deepEqual(peerIndex._weights, [5, 1], "Weights after adding 1");
        deepEqual(peerIndex._totals, [5, 6], "Totals after adding 1");
    });

    test("Removal", function () {
        var peerIndex = $PeerIndex.create(),
            lookup = {};

        lookup.foo = peerIndex.add(5);
        lookup.bar = peerIndex.add(1);
        lookup.hello = peerIndex.add(2);

        deepEqual(peerIndex._empties, {}, "Registry of empties before removal");

        peerIndex.remove(lookup.foo);

        deepEqual(peerIndex._weights, [5, 1, 2], "Weights index unchanged after removal");
        deepEqual(peerIndex._totals, [5, 6, 8], "Totals index unchanged after removal");
        deepEqual(
            peerIndex._empties,
            {
                5: {0: true}
            },
            "Registry of empties after removal"
        );

        peerIndex.remove(lookup.hello);
        deepEqual(
            peerIndex._empties,
            {
                5: {0: true},
                2: {2: true}
            },
            "Registry of empties after removal"
        );
    });
}(
    prime.PeerIndex,
    prime.Peer
));
